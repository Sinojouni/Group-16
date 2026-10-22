import csv

# Read the CSV file and print the header
with open('sampled_df.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    print("CSV Columns:")
    for i, col in enumerate(header):
        print(f"  {i}: {col}")
    
    # Print first data row
    first_row = next(reader)
    print("\nFirst data row:")
    for i, (col, val) in enumerate(zip(header, first_row)):
        print(f"  {col}: {val}")