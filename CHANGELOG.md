# Changelog

## [Unreleased]


## [1.4.0] -- 2018-02-11
### Added
- Notifications are no longer sent to a signed out device
  * ENV VAR `PUSH_NOTIFICATIONS_APN_KEY_PATH` (for iOS)
- Prepush githook for `yarn lint` and `yarn test` with `npm:husky`

### Changed
- Use sequelize up/down migrations instead of `db.sync()`
- `yarn test` command changed to _only_ run tests
  * `yarn jenkins` includes DB creation, migrations, etc.
- Linting updated to `ecmaVersion = 2017`
- Update `package.json:engines`
- Update `docker-compose.yml` including postgres 9.4.11 --> 9.6

### Fixed
- ENV VAR `NOTIFICATION_SERVICE_PG_PORT` now used by `config/database.js`


## [1.3.0] -- 2018-12-12
### Added
- Consolidated logging with `npm:winston-json-formatter`.

### Changed
- DEVOPS-365 related Dockerfile improvements.

### Security
- Fixed some dependency vulnerabilities.


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
