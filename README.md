# fcp-sfd-data

Data integration layer for the Single Front Door.

This service is part of the [Single Front Door (SFD) service](https://github.com/DEFRA/fcp-sfd-core).

## Prerequisites
- Docker
- Docker Compose
- Node.js 22.13 LTS - We recommend using [NVM](https://github.com/nvm-sh/nvm) for Unix-based systems or [NVM-Windows](https://github.com/coreybutler/nvm-windows).

## Setup

### Configuration

These configuration values should be set in a `.env` file in the root of the project for local development.

If running on CDP the values should be set in the CDP Portal. Please see the CDP Documentation for more information.

| Name | Default Value | Required |
|------|--------------|----------|
| AWS_REGION | eu-west-2 | Yes |
| AWS_DEFAULT_REGION | eu-west-2 | Yes |
| AWS_ACCESS_KEY_ID | test | Yes |
| AWS_SECRET_ACCESS_KEY | test | Yes |

### Starting the service
We recommend using the [SFD Core Repo](https://github.com/DEFRA/fcp-sfd-core) to run this service with dependencies. This aims to streamline the local development process.

If you wish to run this service independently, you can do so by executing the following command:
```bash
docker compose up
```

## Tests
The tests have been structured into subfolders of `./test` as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

### Running Tests
We use containerised tests to make integration testing with depndencies easier. To run the tests, use the following command:
```bash
docker compose -f docker compose.yaml -f docker compose.test.yaml run --rm "fcp-sfd-data"
```

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
