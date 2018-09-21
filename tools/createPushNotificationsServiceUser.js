// Note: This command uses arguments passed in via the command line, rather than
// using environment variables, because, when running in docker, the environment
// variables will be set in your docker container and not necessarily on the
// machine running this script.

const path = require('path')
const request = require('request')

const params = {
  headers: { 'Content-Type': 'application/json' },
  uri: `${process.argv[2]}/user`,
  method: 'POST',
  body: JSON.stringify({
    email: 'push_notifications_service_user@amida.com',
    username: process.argv[3],
    password: process.argv[4],
    scopes: ['admin']
  })
}

const main = function () {
  request(params, function (err, res, body) {
    if (err) {
      console.error(`${path.basename(__filename)}: Error creating push notifications service user:`)
      console.error(err)
    }
    console.log(`${path.basename(__filename)}: Create push notifications service user response body:`)
    console.log(body)
  })
}

main();
