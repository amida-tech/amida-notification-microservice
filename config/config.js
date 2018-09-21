import Joi from 'joi';
// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('production'),
    PORT: Joi.number()
        .default(4001),
    JWT_SECRET: Joi.string().required()
        .description('JWT Secret required to sign'),
    PG_DB: Joi.string().required()
        .description('Postgres database name'),
    PG_PORT: Joi.number()
        .default(5432),
    PG_HOST: Joi.string()
        .default('localhost'),
    PG_USER: Joi.string().required()
        .description('Postgres username'),
    PG_PASSWD: Joi.string().allow('')
        .description('Postgres password'),
    PG_SSL: Joi.bool()
        .default(false)
        .description('Enable SSL connection to PostgreSQL'),
    PG_CERT_CA: Joi.string()
        .description('SSL certificate CA'), // Certificate itself, not a filename
    TEST_TOKEN: Joi.string().allow('')
        .description('Test auth token'),
    MICROSERVICE_ACCESS_KEY: Joi.string().allow('')
        .description('Microservice role access key'),
    IOS_KEY_ID: Joi.string().allow('')
        .description('ID for IOS Key'),
    TEAM_ID: Joi.string().allow('')
        .description('IOS Team ID'),
    APN_ENV: Joi.string().allow('')
        .description('IOS Push Notification Environment'),
    PUSH_TOPIC: Joi.string().allow('')
        .description('IOS Push Topic'),
    FIRE_BASE_API_URL: Joi.string().allow('')
        .description('Firebase API URL'),
    FIRE_BASE_SERVER_KEY: Joi.string().allow('')
        .description('Firebase Server Key'),
    SEND_APN: Joi.bool()
            .default(false),
}).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwtSecret: envVars.JWT_SECRET,
    testToken: envVars.TEST_TOKEN,
    microserviceAccessKey: envVars.MICROSERVICE_ACCESS_KEY,
    iosKeyId: envVars.IOS_KEY_ID,
    teamId: envVars.TEAM_ID,
    apnENV: envVars.APN_ENV,
    pushTopic: envVars.PUSH_TOPIC,
    firebaseAPIUrl: envVars.FIRE_BASE_API_URL,
    firebaseServerKey: envVars.FIRE_BASE_SERVER_KEY,
    sendAPN: envVars.SEND_APN,
    postgres: {
        db: envVars.PG_DB,
        port: envVars.PG_PORT,
        host: envVars.PG_HOST,
        user: envVars.PG_USER,
        passwd: envVars.PG_PASSWD,
        ssl: envVars.PG_SSL,
        ssl_ca_cert: envVars.PG_CERT_CA,
    },
};

export default config;
