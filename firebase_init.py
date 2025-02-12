import firebase_admin
from firebase_admin import credentials, firestore

# Make sure when using anything from firebase elsewhere that you do initialize_firebase first.

# Initialize Firebase Admin SDK
def initialize_firebase():
    # "credentials" will be added here when we get the .json file from "Generate a new Private Key"
    # from firebase. Paste the entire contents of the json file where credentials is.
    firebase_admin.initialize_app(credentials)

# Get Firestore client
def get_firestore_client():
    return firestore.client()