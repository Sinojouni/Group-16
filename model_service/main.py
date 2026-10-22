import torch
import torch.nn as nn
import numpy as np
import pandas as pd
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

from pathlib import Path

# --- Constants and Configuration ---
BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = str(BASE_DIR / "artifacts")
MODEL_PATH = str(BASE_DIR / "artifacts" / "best_model.pt")
ITEM_FEATURES_PATH = str(BASE_DIR / "artifacts" / "item_features.npy")
MOVIES_DF_PATH = str(BASE_DIR / "artifacts" / "movies_df.csv")
USER_FEATURES_PATH = str(BASE_DIR / "artifacts" / "user_features.npy") # For known users
USER_2_IDX_PATH = str(BASE_DIR / "artifacts" / "user2idx.json")

EMBED_DIM = 64
ITEM_INPUT_DIM = 409 # This must match the dimension from your notebook

# --- Pydantic Models for API ---
class Rating(BaseModel):
    movie_id: int
    score: float

class RecommendationRequest(BaseModel):
    ratings: List[Rating]

# --- PyTorch Model Definition ---
# This MUST be the exact same architecture as the one you trained
class MLP(nn.Module):
    def __init__(self, input_dim, hidden=[256, 128], output_dim=64):
        super().__init__()
        layers = []
        in_dim = input_dim
        for h in hidden:
            layers.append(nn.Linear(in_dim, h))
            layers.append(nn.ReLU())
            in_dim = h
        layers.append(nn.Linear(in_dim, output_dim))
        self.net = nn.Sequential(*layers)

    def forward(self, x):
        return self.net(x)

class TwoTowerRetrieval(nn.Module):
    def __init__(self, user_input_dim, item_input_dim, emb_dim=64):
        super().__init__()
        self.user_tower = MLP(user_input_dim, hidden=[256,128], output_dim=emb_dim)
        self.item_tower = MLP(item_input_dim, hidden=[256,128], output_dim=emb_dim)

    def l2_normalize(self, x, eps=1e-8):
        return x / (x.norm(p=2, dim=1, keepdim=True) + eps)

# --- FastAPI App Initialization ---
app = FastAPI(title="Movie Recommendation Model Service")

# --- Load Artifacts on Startup ---
model = TwoTowerRetrieval(ITEM_INPUT_DIM, ITEM_INPUT_DIM, emb_dim=EMBED_DIM)
model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
model.eval()

item_features = np.load(ITEM_FEATURES_PATH)
item_features_tensor = torch.from_numpy(item_features).float()

movies_df = pd.read_csv(MOVIES_DF_PATH)
movies_df['movie_id'] = movies_df['movie_id'].astype(str)
movie_id_to_idx = {row['movie_id']: idx for idx, row in movies_df.iterrows()}

with open(USER_2_IDX_PATH, 'r') as f:
    user2idx = json.load(f)

# Pre-compute all item embeddings
print("Pre-computing all item embeddings...")
with torch.no_grad():
    all_item_embeddings = model.l2_normalize(model.item_tower(item_features_tensor))
print("Artifacts loaded and item embeddings computed.")

# --- API Endpoints ---
@app.post("/recommendations/")
@app.post("/predict")
def get_recommendations(request: RecommendationRequest):
    """
    Generates movie recommendations based on a list of user ratings.
    """
    if len(request.ratings) < 5:
        raise HTTPException(
            status_code=400,
            detail="Insufficient ratings. Please provide at least 5 movie ratings."
        )

    # Convert incoming ratings to indices
    rated_movie_indices = [movie_id_to_idx.get(str(r.movie_id)) for r in request.ratings if str(r.movie_id) in movie_id_to_idx]
    
    if not rated_movie_indices:
        raise HTTPException(
            status_code=404,
            detail="None of the rated movies were found in the model's dataset."
        )

    # Create a user feature vector by averaging the features of their rated movies
    user_feature_vector = torch.mean(item_features_tensor[rated_movie_indices], dim=0, keepdim=True)

    # Generate user embedding
    with torch.no_grad():
        user_embedding = model.l2_normalize(model.user_tower(user_feature_vector))

    # Calculate scores (dot product) against all item embeddings
    scores = torch.matmul(user_embedding, all_item_embeddings.t()).squeeze(0)
    
    # Exclude movies the user has already rated
    scores[rated_movie_indices] = -np.inf

    # Get top 10 recommendations
    top_k_scores, top_k_indices = torch.topk(scores, k=10)

    # Get the movie IDs from the indices
    recommended_movie_ids = movies_df.iloc[top_k_indices.numpy()]['movie_id'].tolist()
    
    return {"recommendations": recommended_movie_ids}

@app.get("/health")
def health_check():
    return {"status": "ok"}