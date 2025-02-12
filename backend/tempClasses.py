from datetime import datetime
from firebase_init import get_firestore_client

# Initialize Firestore client
db = get_firestore_client()

class Activity:
    def __init__(self, name, location, start_time, price):
        self.name = name
        self.location = location
        self.start_time = start_time
        self.price = price

    def to_dict(self):
        # Convert to a dictionary to store in Firestore
        return {
            "name": self.name,
            "location": self.location,
            "start_time": self.start_time,
            "price": self.price
        }

class Trip:
    def __init__(self, name, date, budget):
        self.name = name
        self.date = date
        self.budget = budget
        self.activities = []

    def add_activity(self, activity):
        # Add an activity to the trip
        self.activities.append(activity)

    def to_dict(self):
        # Convert to a dictionary to store in Firestore 
        return {
            "name": self.name,
            "date": self.date,
            "budget": self.budget,
            "activities": [activity.to_dict() for activity in self.activities]
        }

    def save(self):
        # Save the trip to Firestore
        trip_ref = db.collection("trips").document()  # auto-generate ID
        trip_ref.set(self.to_dict())
        print(f"Trip '{self.name}' saved to Firestore!")

# Example Usage
trip = Trip("Vacation to NYC", datetime(2025, 2, 12), 1500)
activity1 = Activity("Museum Visit", "Central Park", datetime(2025, 2, 13, 10, 0, 15))
activity2 = Activity("Dinner", "Restaurant XYZ", datetime(2025, 2, 13, 19, 0, 15))

trip.add_activity(activity1)
trip.add_activity(activity2)

trip.save()  # Save trip with activities to Firestore