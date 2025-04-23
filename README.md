# Zelda API

A comprehensive GraphQL API for The Legend of Zelda universe data, built with NestJS and MongoDB.

## Features

- Complete Zelda universe data including:
  - Characters
  - Items
  - Dungeons
  - Bosses
  - Monsters
  - Places
  - Staff
- GraphQL interface for flexible queries
- REST endpoints available
- Data synchronization with external Zelda API
- TypeScript support
- MongoDB database

## Technologies Used

- NestJS
- GraphQL
- MongoDB
- Prisma
- TypeScript
- Apollo Server
- BSON for ObjectID handling

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zelda-api.git
cd zelda-api
```

2. Install dependencies:
```bash
npm install
 ```

3. Set up environment variables:
```bash
cp .env.example .env
 ```

4. Start MongoDB service

5. Run the application:
```bash
npm run start:dev
 ```

## GraphQL Playground
After starting the server, access the GraphQL Playground at: http://localhost:3000/graphql

## Example Queries

### Get all characters
```graphql
query {
  characters {
    id
    name
    description
    race
    games {
      name
    }
  }
}
 ```

### Get a specific dungeon
```graphql
query {
  dungeon(id: "dungeon_id_here") {
    name
    description
    bosses {
      name
    }
  }
}
 ```

## Data Synchronization
To sync with the external Zelda API data:

```graphql
mutation {
  syncCharacters
  syncItems
  syncDungeons
  syncBosses
  syncMonsters
  syncPlaces
  syncStaff
}
 ```

## License
MIT

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Contact
For questions or support, please contact: your.eliashigueraacosta1@outlook.com
