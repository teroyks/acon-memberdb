# Åcon member database

Server components & client

## Cloud Functions

In `functions`.

### Dev Commands

- `npm run serve`: start local dev server
- `npm run deploy`: deploy functions and security rules to Firebase
- `npm run deploy:prod`: deploy functions and rules to production
- `npm start`: start cli for testing functions

## Testing

- `npm test`: run module tests
- `npm run test:watch`: continuously run tests on save

## Prerequisites

- node
- following global node packages:
  - `parcel-bundler`
  - `typescript`
  - `firebase`
  - `firebase-tools`

## Installation

- `firebase init`
  - add Firebase project that has Firestore enabled
- `firebase use --add`
  - add additional projects (e.g. production environment)

### Config files

Configuration files are in `src/config`. Copy `_sample` files to config files and set required values.

- `firebase.config.js`: Firebase web configuration
- `app.config.js`: Application configuration, ie. cloud functions API URL
