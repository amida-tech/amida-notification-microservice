# Amida Messaging Microservice

## Environment Variables (Grouped by Purpose)

Note: Default values are in parenthesis.

### This Server:

`NODE_ENV` (`=development`)
- When in development, set to `development`

`PORT` (`=4003`) The port this server will run on.
- When in development, by default set to `4003`, because other Amida microservices run, by default, on other `400x` ports.

### This Microservice's Postgres Instance:

`PG_DB` (`=amida_notification_microservice`) Postgres database name.
- Setting to `amida_notification_microservice` is recommended because 3rd parties could be running Amida services using their Postgres instances--which is why the name begins with `amida_`.

`PG_PORT` (`=5432`) Port on the machine the postgres instance is running on.

`PG_HOST` (`=localhost`) Hostname of machine the postgres instance is running on.
- When doing docker, set to the name of the docker container running postgres. Setting to `amida_notification_microservice_db` is recommended.

`PG_USER` (`=amida_notification_microservice`) Postgres user that will perform operations on behalf of this microservice. Therefore, this user must have permissions to modify the database specified by `PG_DB`.
- Setting to `amida_notification_microservice` is recommended because 3rd parties could be running Amida services using their Postgres instances--which is why the name begins with `amida_`.

`PG_PASSWD` (N/A) Password of postgres user `PG_USER`.

### Running the Automated Test Suite:

`TEST_TOKEN` (`=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIwIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiYWRtaW4iOnRydWV9.X_SzIXZ-oqEL67eB-fwFqFSumuFQVAqhgsmak1JLIWo`) This is the `amida-auth-microservice` JWT that is used by this repo's automated test suite when it makes requests.

### Integration With Amida Auth Microservice:

`JWT_SECRET` (`=0a6b944d-d2fb-46fc-a85e-0295c986cd9f`) Must match value of the JWT secret being used by your `amida-auth-microservice` instance.
- See that repo for details.

`MICROSERVICE_ACCESS_KEY` (`=oucuYaiN6pha3ahphiiT`) The username of the service user that authenticates against `amida-auth-microservice` and performs requests against the `amida-notification-microservice` API.
- The default value is for development only. In production, set this to a different value.

### Integration With Apple iOS Push Notifications:

Note: iOS push notifications do not and cannot work in development.

`IOS_KEY_ID` (Stored in the password vault) This microservice tells apple to use this key to encrypt the payload of push notifications that Apple sends to end-user devices.

`TEAM_ID` (`=A6C383FQ61`) The ID of the Amida "team" in Apple Developer Console.

`APN_ENV` (`=development`)

`PUSH_TOPIC` (Stored in the password vault) The Apple Developer Console name of this app.

### Integration With Google Android Push Notifications:

Note: Unlike iOS push notifications, Android push notifications do work in development.

`FIRE_BASE_API_URL` (`=https://fcm.googleapis.com/fcm/send`) Url of Google Android Firebase service.

`FIRE_BASE_SERVER_KEY` (Stored in the password vault) Identifies to Google that a server belonging to Amida is making this push notification reqeust.

## Design

### API Spec
The spec can be viewed at https://amida-tech.github.io/amida-messaging-microservice/.

To update the spec, first edit the files in the `docs` directory. Then run `aglio -i docs/src/docs.md --theme flatly -o index.html`.

Merge the resulting changes to the `gh-pages` branch of the repository.

### Features

| Feature                                | Summary                                                                                                                                                                                                                                                     |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ES6 via Babel                  	 	 | ES6 support using [Babel](https://babeljs.io/).  |
| Code Linting               			 | Linting with [eslint](https://www.npmjs.com/package/eslint)                                                                                            |
| Auto server restart                  	 | Restart the server using [nodemon](https://github.com/remy/nodemon) in real-time anytime an edit is made, with babel compilation and eslint.                                                                                                                                                                            |
| ES6 Code Coverage via [istanbul](https://www.npmjs.com/package/istanbul)                  | Supports code coverage of ES6 code using istanbul and mocha. Code coverage reports are saved in `coverage/` directory post `yarn test` execution. Open `coverage/lcov-report/index.html` to view coverage report. `yarn test` also displays code coverage summary on console. Code coverage can also be enforced overall and per file as well, configured via .istanbul.yml                                                                                                                                                                            |
| Debugging via [debug](https://www.npmjs.com/package/debug)           | Instead of inserting and deleting console.log you can replace it with the debug function and just leave it there. You can then selectively debug portions of your code by setting DEBUG env variable. If DEBUG env variable is not set, nothing is displayed to the console.                       |
| Promisified Code via [bluebird](https://github.com/petkaantonov/bluebird)           | We love promise, don't we ? All our code is promisified and even so our tests via [supertest-as-promised](https://www.npmjs.com/package/supertest-as-promised).                       |
| API parameter validation via [express-validation](https://www.npmjs.com/package/express-validation)           | Validate body, params, query, headers and cookies of a request (via middleware) and return a response with errors; if any of the configured validation rules fail. You won't anymore need to make your route handler dirty with such validations. |
| Pre-commit hooks           | Runs lint and tests before any commit is made locally, making sure that only tested and quality code is committed
| Secure app via [helmet](https://github.com/helmetjs/helmet)           | Helmet helps secure Express apps by setting various HTTP headers. |
| Uses [yarn](https://yarnpkg.com) over npm            | Uses new released yarn package manager by facebook. You can read more about it [here](https://code.facebook.com/posts/1840075619545360) |

- CORS support via [cors](https://github.com/expressjs/cors)
- Uses [http-status](https://www.npmjs.com/package/http-status) to set http status code. It is recommended to use `httpStatus.INTERNAL_SERVER_ERROR` instead of directly using `500` when setting status code.
- Has `.editorconfig` which helps developers define and maintain consistent coding styles between different editors and IDEs.

## Developing locally

Install yarn:
```js
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

Start server:
```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=amida-messaging-microservice:* yarn start
```

Tests:

Create a JWT with the username value 'user0' and set `TEST_TOKEN={token}` in your .env file or an evironment variable. You can easily create a token using the amida-auth-microservice

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

Lint:
```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch
```

Other gulp tasks:
```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

## Deployment

### Manual deployment with `pm2`
```sh
# compile to ES5
1. yarn build

# upload dist/ to your server
2. scp -rp dist/ user@dest:/path

# install production dependencies only
3. yarn --production

# Use any process manager to start your services
4. pm2 start dist/index.js
```

### Deployment to AWS with Packer and Terraform
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

### Docker deployment
Docker Compose:
```sh
docker-compose up
```

### Kubernetes Deployment
See the [paper](https://paper.dropbox.com/doc/Amida-Microservices-Kubernetes-Deployment-Xsz32zX8nwT9qctitGNVc) write-up for instructions on how to deploy with Kubernetes. The `kubernetes.yml` file contains the deployment definition for the project.

## Logging

Universal logging library [winston](https://www.npmjs.com/package/winston) is used for logging. It has support for multiple transports. A transport is essentially a storage device for your logs. Each instance of a winston logger can have multiple transports configured at different levels. For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file. We just log to the console for simplicity, but you can configure more transports as per your requirement.
