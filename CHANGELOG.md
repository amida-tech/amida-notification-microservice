# Changelog

## [Unreleased]


## [1.2.0] -- 2018-12-11
### Fixed
- Winston express middleware stack error, such that api calls
  * No longer crash the server
  * Returned the HTTP response body to the client

### Added
- [ORANGE-481] UUIDs.
- `*.p8` to `.dockerignore` in order to remove Apple push notification key files from docker image.
- `package.json: create_missing_users`, which asks the auth service for all users, and creates any ones that are missing in the notification service Users table.


## [1.1.0] -- 2018-09-19
### CHANGED
- Includes major env var changes.


## [1.0.0] -- 2018-07-27
First release of Amida Notification Microservice. The service currently provides support for push notification only.
