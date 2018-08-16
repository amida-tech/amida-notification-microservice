# Amida Messaging Microservice

# Table of Contents

  - [Design](#design)
  - [Development](#development)
  - [Deployment](#deployment)
  - [Environment Variables](#Environment-Variables)

# Design

## API Spec
The spec can be viewed at https://amida-tech.github.io/amida-messaging-microservice/.

To update the spec, first edit the files in the `docs` directory. Then run `aglio -i docs/src/docs.md --theme flatly -o index.html`.

Merge the resulting changes to the `gh-pages` branch of the repository.

## Logging

Universal logging library [winston](https://www.npmjs.com/package/winston) is used for logging. It has support for multiple transports. A transport is essentially a storage device for your logs. Each instance of a winston logger can have multiple transports configured at different levels. For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file. We just log to the console for simplicity, but you can configure more transports as per your requirement.

# Development

## Setup

Install yarn:
```sh
npm install -g yarn
```

Install dependencies:
```sh
yarn
```

Set environment vars:
```sh
cp .env.example .env
```

### Push Notifications

Create the service user on the the Auth Service which will perform notification actions:

Note: The `AUTH_MICROSERVICE_URL` below is relative to the machine running this command, not to any docker container.

```sh
npm run create-push-notificiations-service-user -- {AUTH_MICROSERVICE_URL} {PUSH_NOTIFICATIONS_SERVICE_USER_USERNAME} {PUSH_NOTIFICATIONS_SERVICE_USER_PASSWORD}
```

Obtain an Apple Developer Key and corresponding KeyId. You can download this file by logging into the team's apple developer console on `developer.apple.com`. Navigate to `Keys` on the left pane and create or download a key. Add this file to the root of the project and rename it to `iosKey.p8`. Set the corresponding keyId to the value of `PUSH_NOTIFICATIONS_APN_KEY_ID` in your `.env` file.

## Run

Start server:
```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=amida-messaging-microservice:* yarn start
```

## Tests

Create a JWT with the username value 'user0' and set `NOTIFICATION_SERVICE_AUTOMATED_TEST_JWT={token}` in your .env file or an evironment variable. You can easily create a token using the `amida-auth-microservice`.

```sh
# Run tests written in ES6
yarn test

# Run test along with code coverage
yarn test:coverage

# Run tests on file change
yarn test:watch

# Run tests enforcing code coverage (configured via .istanbul.yml)
yarn test:check-coverage
```

## Lint

```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch
```

## Other gulp tasks

```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

# Deployment

## Deployment Via Docker

Docker deployment requires two docker containers:
- An instance of the official Postgres docker image (see: https://hub.docker.com/_/postgres/).
- An instance of this service's docker image (see: https://hub.docker.com/r/amidatech/notification-service/).

The Postgres container must be running _before_ the notification-service container is started because, upon initial run, the notification-service container defines the schema within the Postgres database.

Also, the containers communicate via a docker network. Therefore,

1. First, create the Docker network:

```sh
docker network create {DOCKER_NETWORK_NAME}
```

2. Start the postgres container:

```sh
docker run -d --name {NOTIFICATION_SERVICE_PG_HOST} --network {DOCKER_NETWORK_NAME} \
-e POSTGRES_DB={NOTIFICATION_SERVICE_PG_DB} \
-e POSTGRES_USER={NOTIFICATION_SERVICE_PG_USER} \
-e POSTGRES_PASSWORD={NOTIFICATION_SERVICE_PG_PASSWORD} \
postgres:9.6
```

3. Create a `.env` file for use by this service's docker container. A good starting point is `.env.production`.

4. Perform the steps under the [Development > Setup > PushNotifications](#Push-Notifications) section.

5. Start the notification-service container:

```sh
docker run -d \
--name amida-notification-microservice --network {DOCKER_NETWORK_NAME} \
-v {ABSOLUTE_PATH_TO_YOUR_ENV_FILE}:/app/.env:ro \
amidatech/notification-service
```

## Deployment to AWS with Packer and Terraform
You will need to install [pakcer](https://www.packer.io/) and [terraform](https://www.terraform.io/) installed on your local machine.
Be sure to have your postgres host running and replace the `pg_host` value in the command below with the postgres host address.
1. First validate the AMI with a command similar to ```packer validate -var 'aws_access_key=myAWSAcessKey'
-var 'aws_secret_key=myAWSSecretKey'
-var 'build_env=development'
-var 'logstash_host=logstash.amida.com'
-var 'service_name=amida_messaging_microservice'
-var 'ami_name=api-messaging-service-boilerplate'
-var 'node_env=development'
-var 'jwt_secret=My-JWT-Token'
-var 'pg_host=amid-messages-packer-test.some_rand_string.us-west-2.rds.amazonaws.com'
-var 'pg_db=amida_messages'
-var 'pg_user=amida_messages'
-var 'pg_passwd=amida-messages' template.json```
2. If the validation from `1.` above succeeds, build the image by running the same command but replacing `validate` with `build`
3. In the AWS console you can test the build before deployment. To do this, launch an EC2 instance with the built image and visit the health-check endpoint at <host_address>:4000/api/health-check. Be sure to launch the instance with security groups that allow http access on the app port (currently 4000) and access from Postgres port of the data base. You should see an "OK" response.
4. Enter `aws_access_key` and `aws_secret_key` values in the vars.tf file
5. run `terraform plan` to validate config
6. run `terraform apply` to deploy
7. To get SNS Alarm notifications be sure that you are subscribed to SNS topic arn:aws:sns:us-west-2:844297601570:ops_team_alerts and you have confirmed subscription

Further details can be found in the `deploy` directory.

## Kubernetes Deployment
See the [paper](https://paper.dropbox.com/doc/Amida-Microservices-Kubernetes-Deployment-Xsz32zX8nwT9qctitGNVc) write-up for instructions on how to deploy with Kubernetes. The `kubernetes.yml` file contains the deployment definition for the project.
-var 'aws_secret_key=myAWSSecretKey'
-var 'build_env=development'
-var 'logstash_host=logstash.amida.com'
-var 'service_name=amida_messaging_microservice'
-var 'ami_name=api-messaging-service-boilerplate'
-var 'node_env=development'
-var 'jwt_secret=My-JWT-Token'
-var 'pg_host=amid-messages-packer-test.some_rand_string.us-west-2.rds.amazonaws.com'
-var 'pg_db=amida_messages'
-var 'pg_user=amida_messages'
-var 'pg_passwd=amida-messages' template.json```
2. If the validation from `1.` above succeeds, build the image by running the same command but replacing `validate` with `build`
3. In the AWS console you can test the build before deployment. To do this, launch an EC2 instance with the built image and visit the health-check endpoint at <host_address>:4000/api/health-check. Be sure to launch the instance with security groups that allow http access on the app port (currently 4000) and access from Postgres port of the data base. You should see an "OK" response.
4. Enter `aws_access_key` and `aws_secret_key` values in the vars.tf file
5. run `terraform plan` to validate config
6. run `terraform apply` to deploy
7. To get SNS Alarm notifications be sure that you are subscribed to SNS topic arn:aws:sns:us-west-2:844297601570:ops_team_alerts and you have confirmed subscription

Further details can be found in the `deploy` directory.

# Environment Variables

Note: Default values are in parenthesis.

## Notification Microservice

`NODE_ENV` (Required) [`development`]
- When in development, set to `development`

`NOTIFICATION_SERVICE_PORT` (Required) [`4003`] The port this server will run on.
- When in development, by default set to `4003`, because other Amida microservices run, by default, on other `400x` ports.

`NOTIFICATION_SERVICE_AUTOMATED_TEST_JWT` (Required by test scripts) This is the `amida-auth-microservice` JWT that is used by this repo's automated test suite when it makes requests.

`NOTIFICATION_SERVICE_PG_HOST` (Required) [`localhost`] Hostname of machine the postgres instance is running on.
- When using docker, set to the name of the docker container running postgres. Setting to `amida-notification-microservice-db` is recommended.

`NOTIFICATION_SERVICE_PG_PORT` [`5432`] Port on the machine the postgres instance is running on.

`NOTIFICATION_SERVICE_PG_DB` Postgres database name.
- Setting to `amida_notification_microservice` is recommended because 3rd parties could be running Amida services using their Postgres instances--which is why the name begins with `amida_`.

`NOTIFICATION_SERVICE_PG_USER` Postgres user that will perform operations on behalf of this microservice. Therefore, this user must have permissions to modify the database specified by `NOTIFICATION_SERVICE_PG_DB`.
- Setting to `amida_notification_microservice` is recommended because 3rd parties could be running Amida services using their Postgres instances--which is why the name begins with `amida_`.

`NOTIFICATION_SERVICE_PG_PASSWORD` Password of postgres user `NOTIFICATION_SERVICE_PG_USER`.

`NOTIFICATION_SERVICE_PG_SSL_ENABLED` [`false`] Whether an SSL connection shall be used to connect to postgres.

`NOTIFICATION_SERVICE_PG_CA_CERT` If SSL is enabled with `NOTIFICATION_SERVICE_PG_SSL_ENABLED` this can be set to a certificate to override the CAs that are trusted while initiating the SSL connection to postgres. Without this set, Mozilla's list of trusted CAs is used. Note that this variable should contain the certificate itself, not a filename.

## Integration With Amida Auth Microservice

`JWT_SECRET` Must match value of the JWT secret being used by your `amida-auth-microservice` instance.
- See that repo for details.

`PUSH_NOTIFICATIONS_SERVICE_USER_USERNAME` The username of the service user that authenticates against `amida-auth-microservice` and performs requests against the `amida-notification-microservice` API.
- `.env.example` sets this to `oucuYaiN6pha3ahphiiT`, which is for development only. In production, set this to a different value.

## Enabling Push Notifications ##

### Integration With Apple Push Notifications for iOS

Note: iOS push notifications do not and cannot work in development.

`PUSH_NOTIFICATIONS_APN_ENABLED` (Required) [`false`] Enable Apple Push Notifications.

**WARNING**: You can only send Apple push notifications if your host is configured with SSL termination. Without this Apple may permanently invalidate the key you use to send the push notification.

`PUSH_NOTIFICATIONS_APN_ENV` [`development`] Apple Push Notification environment.
- Valid values are `development` and `production`.
- When using Test Flight, set to `production.`

`PUSH_NOTIFICATIONS_APN_TEAM_ID` The ID of the Amida "team" in Apple Developer Console.
- The value is the prefix of iOS app ID.
- Production value stored in Amida's password vault.

`PUSH_NOTIFICATIONS_APN_KEY_ID` Tells apple to use this key to encrypt the payload of push notifications that Apple sends to end-user devices.
- Value stored in Amida's password vault.

`PUSH_NOTIFICATIONS_APN_TOPIC` [`com.amida.orangeIgnite`] The Apple Developer Console name of this app.

### Integration With Firebase Cloud Messaging for Android

Note: Unlike iOS push notifications, Android push notifications do work in development.

`PUSH_NOTIFICATIONS_FCM_API_URL` Url of Google Android Firebase service.

`PUSH_NOTIFICATIONS_FCM_SERVER_KEY` Identifies to Google that a server belonging to Amida is making this push notification request.
- Value stored in Amida's password vault.
- Alternatively, this can be obtained from the Team's Firebase console. Note that the `Server key` is different from `API key`. The later is configured on a device for receiving notifications.
