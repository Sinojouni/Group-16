import os
import sys
import json
from pathlib import Path
import torch
import torch.nn as nn
import numpy as np
import pandas as pd

# Define Model Architecture (Two-Tower Retrieval)
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
        self.user_tower = MLP(user_input_dim, hidden=[256, 128], output_dim=emb_dim)
        self.item_tower = MLP(item_input_dim, hidden=[256, 128], output_dim=emb_dim)

    def l2_normalize(self, x, eps=1e-8):
        return x / (x.norm(p=2, dim=1, keepdim=True) + eps)

# Fix Windows console encoding
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def load_and_run_model(sample_ratings=None):
    base_dir = Path(__file__).resolve().parent / "model_service" / "artifacts"
    model_path = base_dir / "best_model.pt"
    item_features_path = base_dir / "item_features.npy"
    movies_df_path = base_dir / "movies_df.csv"

    print("=" * 60)
    print("[Movie Recommendation Model Runner - PyTorch Two-Tower]")
    print("=" * 60)
    print(f"Loading model weights from: {model_path}")

    if not model_path.exists():
        print(f"Error: Model file {model_path} not found!")
        return

    # Load Model
    item_dim = 409
    emb_dim = 64
    model = TwoTowerRetrieval(item_dim, item_dim, emb_dim=emb_dim)
    model.load_state_dict(torch.load(str(model_path), map_location=torch.device('cpu')))
    model.eval()
    print("[+] PyTorch model loaded successfully.")

    # Load Movie Metadata & Features
    print("Loading movie dataset and item features...")
    item_features = np.load(str(item_features_path))
    item_features_tensor = torch.from_numpy(item_features).float()
    movies_df = pd.read_csv(str(movies_df_path))
    movies_df['movie_id'] = movies_df['movie_id'].astype(str)
    movie_id_to_idx = {row['movie_id']: idx for idx, row in movies_df.iterrows()}
    idx_to_movie = {idx: row for idx, row in movies_df.iterrows()}

    print(f"[+] Total movies loaded into model: {len(movies_df)}")
    print(f"[+] Feature dimension per movie: {item_features.shape[1]}")

    # Pre-compute all item embeddings
    with torch.no_grad():
        all_item_embeddings = model.l2_normalize(model.item_tower(item_features_tensor))
    print("[+] All item embeddings computed.")

    # Sample user ratings if not provided
    if not sample_ratings:
        sample_ratings = [
            {"movie_id": 211672, "title": "Minions", "score": 5.0},
            {"movie_id": 281338, "title": "War for the Planet of the Apes", "score": 4.5},
            {"movie_id": 271110, "title": "Captain America: Civil War", "score": 4.0},
            {"movie_id": 680, "title": "Pulp Fiction", "score": 5.0},
            {"movie_id": 166426, "title": "Pirates of the Caribbean", "score": 3.5}
        ]

    print("\n--- User Input Ratings ---")
    rated_indices = []
    for r in sample_ratings:
        m_id = str(r["movie_id"])
        idx = movie_id_to_idx.get(m_id)
        title = r.get("title") or (idx_to_movie[idx]["title"] if idx is not None else "Unknown")
        print(f" * [TMDB: {m_id}] {title} => Rating: {r['score']}/5.0")
        if idx is not None:
            rated_indices.append(idx)

    if not rated_indices:
        print("Error: None of the rated movies found in model index!")
        return

    # Compute User Feature Vector (Weighted Average by Score)
    user_feature_vector = torch.mean(item_features_tensor[rated_indices], dim=0, keepdim=True)

    # Generate User Embedding
    with torch.no_grad():
        user_embedding = model.l2_normalize(model.user_tower(user_feature_vector))

    # Dot-product similarity against all movies
    scores = torch.matmul(user_embedding, all_item_embeddings.t()).squeeze(0)

    # Exclude already rated movies
    scores[rated_indices] = -np.inf

    # Retrieve Top 10 Recommendations
    top_k = 10
    top_scores, top_indices = torch.topk(scores, k=top_k)

    print("\n" + "=" * 60)
    print("--> Top 10 Model Recommendations:")
    print("=" * 60)
    for rank, (score, idx) in enumerate(zip(top_scores.tolist(), top_indices.tolist()), 1):
        movie_row = movies_df.iloc[idx]
        movie_id = movie_row['movie_id']
        title = movie_row.get('title', 'Unknown')
        print(f" #{rank:2d} | Score: {score:.4f} | TMDB ID: {movie_id:6s} | {title}")

    print("=" * 60)
    print("[+] Model inference completed successfully!\n")

if __name__ == "__main__":
    load_and_run_model()
