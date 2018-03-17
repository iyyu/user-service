# Spotifred-User-Service

Microservice source of truth for user profile information.

## High-Level Goals

The goal of this project was to build a service-oriented system and in particular, this microservice was to:

- Maintain 10+ million user profiles in the database
- Respond to a GET request under 100ms
- Update database upon simulated user login

## Usage

> npm install
> npm start
> pg-start
To test, run `npm run test`
To see test coverage, run `npm run test-coverage`

## Requirements

- Node 9.3.0^
- PostgreSQL 10.1^

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.