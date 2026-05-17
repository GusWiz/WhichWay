# WhichWay

## Description

### Team:

- Aaron Siemsen
- Vinny Rose
- Aldo Guerrero
- Gustavo Hernandez
- Alan De La Torre

### What we are creating?

We are creating an application that will allow users to plan different kinds of trips using AI. We envision the app to be able to suggest the user many activity possibilities and combinations.
Ranging from camping, hiking, or any outdoor style trips. To in-city activities like places to eat, events, entertainment, and more. The idea is to give the app information like the destination,
time-frame of the trip, preferences, and the AI will be able to put together an itinerary once the user selects the desired activities. Additionally, we are trying to implement avg. driving time
between activities.

### Who were doing it for?

This application can be used by people who want to discover outdoor places away from the city, to people who live in the middle of downtown, but just don't know what there is to do.

### Why we are doing this?

The main reason is to help users save time when it comes to actually doing research on what there is available to them. It would be very useful to have AI find places you might like, as well as
provide you with extra information about the different activities found. This not only helps to save time, but also to make an informed decision on what to do.

## General Information

![Image](docs/READMEimg/whichwayart.png)

## Technologies Used

- HTML - HTML5
- CSS - CSS3
- JavaScript - ES15
- React - version 18.2.0
- Python - version 3.11.2
- Flask - version 2.2.5
- SQL - SQL:2023
- Google Authenticator App - version 2.36.0
- DeekSeek - version 2.5

## Features

- "Create a Trip" Feature: Allows the user to customize and put together a trip with activities and an itinerary planned for an an entire day.
  > User Story: I want to use AI to suggest me with activities to do, and help me plan a detailed full-day schedule.

Data Gathering Features:

- "Location" Feature: Give the app the destination so that the AI can start gathering a list of activities within that location.

  > User Story: As a user, I want to only get a list of activities within a 20-50 mile radius.

- "Budgeting" Feature: Give the application your budget estimate so that you can make better financial decisions.

  > User Story: As a budget-conscious traveler, I want to set a total budget for my trip in the trip planning app, so that every activity, accommodation, or expense I add to my itinerary automatically deducts from my budget, helping me stay on track financially.

- "Select Activities" Feature: The AI will categorize different variations of activities (places to eat, entertainment).
  > User Story: As a user, I want the AI to give me a list of things to do. I want them to be categorized in a way that makes sense so that I can pick 1, 2 or even 3 from the same category.

Additional Features:

- "Create Itinerary" Feature: This feature will put together the selected activities, and come up with different versions of itineraries (Times spent at activities will vary). The AI will also find driving times between activities.

  > User Story: As a user, I want the AI to put together different options of itineraries, with the previous activities I selected. I want the AI create different times to spend at these activites and mix these around for each itinerary, and I also want it to give me driving times between activites.

- "Add People to my Trip" Feature: This feature allows users to invite others to join their trip and collaborate on planning.

  > User Story: As a user, I want to add people to my trip so they can view and edit the itinerary. The feature should allow me to invite others via email or a shared link, and they should be able to suggest changes or add activities given the proper permissions.

- "View Trips" Features: This feature allows users to see a their planned and previous trips, and access details for each one.
  > User Story: As a trip member, I want to view all my trips in one place so I can quickly access and manage them. The feature should display trip details, including dates, activities, and participants, with an option to edit or delete trips.

# Developer Information

#### Pre-commit Hooks

Pre-commit hooks are ordinary scripts that Git executes when certain events occur in the repository. The pre-commit hook is run first, before you even type in a commit message. It’s used to inspect the snapshot that’s about to be committed, to see if you’ve forgotten something, to make sure tests run, or to examine whatever you need to inspect in the code.

You can format your python files before committing by running `make fmt` as this will save you some time by not having to type `git add .` and `git commit -m "commit message"` twice:

In VSCode using Git:

### FOR MAC

- Check if Make is installed:

```
make --version
```

- Install Make if not installed:

```
brew install make
```

- If you dont have a '/venv/' directory run the following:

```
python -m venv venv
```

- Activate your environment:

```
source ./venv/bin/activate
```

- Install pre-commit:

```Python
pip install pre-commit
```

### FOR WINDOWS

- Check if Make is installed:

```
make --version
```

- Install Make if not installed:

```
choco install make
```

- If you dont have a '/venv/' directory run the following:

```
python -m venv venv
```

- Activate your environment:

```
source ./venv/Scripts/activate
```

- Install pre-commit:

```Python
pip install pre-commit
```

### BEFORE `git add .`

- Run the make script:

```Python
make fmt
```
