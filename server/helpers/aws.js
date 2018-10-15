const config = require('../../config/config.js');
import AWS from 'aws-sdk';
AWS.config.update({
    region: 'us-west-2',
});
const sns = new AWS.SNS();
const ses = new AWS.SES();


export default {
    sns,
    ses
};
