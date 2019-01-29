import AWS from 'aws-sdk';
import config from '../../config/config.js';


AWS.config.update({
    region: config.awsRegion,
});
const sns = new AWS.SNS();
const ses = new AWS.SES();

export default {
    sns,
    ses,
};
