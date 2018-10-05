const Joi = require('joi'); // require and configure dotenv, will load vars in .env in PROCESS.ENV
// require and configure dotenv, will load vars in .env in PROCESS.ENV
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config();
}

// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('production'),
    NOTIFICATION_SERVICE_PORT: Joi.number()
        .default(4003),
    JWT_SECRET: Joi.string().required()
        .description('JWT Secret required to sign'),
    AUTH_MICROSERVICE_URL: Joi.string().allow('')
    .description('Auth microservice endpoint'),
    META_DATA_MICROSERVICE_URL: Joi.string().allow('')
    .description('Metadata microservice endpoint'),
    NOTIFICATION_SERVICE_PG_DB: Joi.string().required()
        .description('Postgres database name'),
    NOTIFICATION_SERVICE_PG_PORT: Joi.number()
        .default(5432),
    NOTIFICATION_SERVICE_PG_HOST: Joi.string(),
    NOTIFICATION_SERVICE_PG_USER: Joi.string().required()
        .description('Postgres username'),
    NOTIFICATION_SERVICE_PG_PASSWORD: Joi.string().allow('')
        .description('Postgres password'),
    NOTIFICATION_SERVICE_PG_SSL_ENABLED: Joi.bool()
        .default(false)
        .description('Enable SSL connection to PostgreSQL'),
    NOTIFICATION_SERVICE_PG_CA_CERT: Joi.string()
        .description('SSL certificate CA. This string must be the certificate itself, not a filename.'),
    NOTIFICATION_SERVICE_AUTOMATED_TEST_JWT: Joi.string().allow('')
        .description('Test auth token'),
    NOTIFICATION_SERVICE_METADATA_SERVICE_ENABLED: Joi.bool()
        .default(false),
    PUSH_NOTIFICATIONS_SERVICE_USER_USERNAME: Joi.string().allow('')
        .description('Microservice role access key'),
    PUSH_NOTIFICATIONS_SERVICE_USER_PASSWORD: Joi.string(),
    PUSH_NOTIFICATIONS_APN_KEY_ID: Joi.string().allow('')
        .description('ID for IOS Key'),
    PUSH_NOTIFICATIONS_APN_TEAM_ID: Joi.string().allow('')
        .description('IOS Team ID'),
    PUSH_NOTIFICATIONS_APN_ENV: Joi.string().allow('')
        .description('IOS Push Notification Environment'),
    PUSH_NOTIFICATIONS_APN_TOPIC: Joi.string().allow('')
        .description('IOS Push Topic'),
    PUSH_NOTIFICATIONS_FCM_API_URL: Joi.string().allow('')
        .description('Firebase API URL'),
    PUSH_NOTIFICATIONS_FCM_SERVER_KEY: Joi.string().allow('')
        .description('Firebase Server Key'),
    PUSH_NOTIFICATIONS_APN_ENABLED: Joi.bool()
        .default(false),
}).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.NOTIFICATION_SERVICE_PORT,
    jwtSecret: envVars.JWT_SECRET,
    authServiceAPI: envVars.AUTH_MICROSERVICE_URL,
    metaDataServiceAPI: envVars.META_DATA_MICROSERVICE_URL,
    automatedTestJwt: envVars.NOTIFICATION_SERVICE_AUTOMATED_TEST_JWT,
    metaDataServiceEnabled: envVars.NOTIFICATION_SERVICE_METADATA_SERVICE_ENABLED,
    pushNotificationsServiceUserUsername: envVars.PUSH_NOTIFICATIONS_SERVICE_USER_USERNAME,
    pushNotificationsServiceUserPassword: envVars.PUSH_NOTIFICATIONS_SERVICE_USER_PASSWORD,
    apnKeyId: envVars.PUSH_NOTIFICATIONS_APN_KEY_ID,
    apnTeamId: envVars.PUSH_NOTIFICATIONS_APN_TEAM_ID,
    apnEnv: envVars.PUSH_NOTIFICATIONS_APN_ENV,
    apnTopic: envVars.PUSH_NOTIFICATIONS_APN_TOPIC,
    fcmApiUrl: envVars.PUSH_NOTIFICATIONS_FCM_API_URL,
    fcmServerKey: envVars.PUSH_NOTIFICATIONS_FCM_SERVER_KEY,
    apnEnabled: envVars.PUSH_NOTIFICATIONS_APN_ENABLED,
    postgres: {
        db: envVars.NOTIFICATION_SERVICE_PG_DB,
        port: envVars.NOTIFICATION_SERVICE_PG_PORT,
        host: envVars.NOTIFICATION_SERVICE_PG_HOST,
        user: envVars.NOTIFICATION_SERVICE_PG_USER,
        password: envVars.NOTIFICATION_SERVICE_PG_PASSWORD,
        sslEnabled: envVars.NOTIFICATION_SERVICE_PG_SSL_ENABLED,
        sslCaCert: envVars.NOTIFICATION_SERVICE_PG_CA_CERT,
    },
};
