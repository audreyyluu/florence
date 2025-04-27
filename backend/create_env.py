#!/usr/bin/env python3
"""
Helper script to create the .env file for the backend.
"""
import os

def main():
    print("Creating .env file for the backend")
    
    # Check if .env already exists
    if os.path.exists(".env"):
        overwrite = input(".env file already exists. Overwrite? (y/n): ")
        if overwrite.lower() != 'y':
            print("Exiting without changes.")
            return
    
    # Get OpenAI API key
    api_key = input("Enter your OpenAI API key: ")
    
    # Write to .env file
    with open(".env", "w") as f:
        f.write(f"OPENAI_API_KEY={api_key}\n")
    
    print(".env file created successfully.")
    print("Make sure you have the patientinfo/ and timelineinfo/ directories with JSON files.")

if __name__ == "__main__":
    main() 