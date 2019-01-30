# Åcon member database

Server components & client

## Cloud Functions

In `functions`. Currently contains only a demo `helloWorld` function with HTTP trigger.

### Dev Commands

- `npm run serve`: start local dev server
- `npm run deploy`: deploy functions and security rules to Firebase

### Functions

#### helloWorld

- demo

#### addTimestampToNew\*

- `addTimestampToNewPurchase`
- `addTimestampToNewMember`
- triggered by: `onCreate` (purchases, members)
- adds a `createdAt` timestamp to new records

## Testing

- `npm test`: run module tests
- `npm run test:watch`: continuously run tests on save
