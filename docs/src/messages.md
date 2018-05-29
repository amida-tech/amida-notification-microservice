# Group Messages
## Send a message [/message/send]
### Create new Message [POST]
Send a message to any number of recipients.

+ Parameters
    + to ([string], required) - an array of strings with each string corresponding to a recipient username
    + from (string, optional) - sender's username
    + subject (string, optional) - subject of the sent message
    + message (string, required)

+ Request
    + Headers

            Authorization: Bearer ACCESS_TOKEN
            Content-Type: application/x-www-form-urlencoded

    + Body

            {
                to: ["johnDoe", "janeDoe"]
                subject: "This API Rocks!",
                message: "This message is longer than it appears...",
            }

+ Response 201
    Errors
    + `Unauthorized` (401) - no access token specified or invalid access token
    `Authorization` header

    + Body

    {
        "isDeleted": false,
        "isArchived": false,
        "id": 3,
        "to": ["johnDoe", "janeDoe"],
        "from": "test@test.com",
        "subject": "First Message Subject",
        "message": "First Message Message",
        "owner": "test@test.com",
        "createdAt": "2017-11-22T20:30:06.451Z",
        "readAt": "2017-11-22T20:30:06.451Z",
        "updatedAt": "2017-11-22T20:30:07.108Z",
        "originalMessageId": 3,
        "parentMessageId": null
    }

## Retrieve a message [/message/get/{messageId}]
### Retrieve a message [GET]
Retrieve a message using it's unique ID.

+ Parameters
    + messageId (integer, required) - unique ID of the message to be retrieved(url)

+ Request
    + Headers

            Authorization: Bearer ACCESS_TOKEN
            Content-Type: application/x-www-form-urlencoded

+ Response 200
    Errors
    + `Unauthorized` (401) - no access token specified or invalid access token
    `Authorization` header

    + Body

    {
        "id": 3,
        "owner": "test@test.com",
        "originalMessageId": 3,
        "parentMessageId": null,
        "to": [
            "user1"
        ],
        "from": "test@test.com",
        "subject": "First Message Subject",
        "message": "First Message Message",
        "createdAt": "2017-11-22T20:30:06.451Z",
        "readAt": "2017-11-22T20:30:06.451Z",
        "isDeleted": false,
        "isArchived": false,
        "updatedAt": "2017-11-22T20:30:07.108Z"
    }


## Reply to a message [/message/reply/messageId]
### Reply to an existing message [POST]
Reply to an existing message.

+ Parameters
    + messageId (integer, required) - unique ID of the message being replied to(url)
    + to ([string], required) - an array of strings with each string corresponding to a recipient username
    + from (string, required) - sender's username
    + subject (string, required) - Subject of the sent message
    + message (string, required)

+ Request
    + Headers

            Authorization: Bearer ACCESS_TOKEN
            Content-Type: application/x-www-form-urlencoded

    + Body

            {
                to: ["johnDoe", "janeDoe"]
                subject: "This API Rocks!",
                message: "This message is longer than it appears...",
            }

+ Response 200
    Errors
    + `Unauthorized` (401) - no access token specified or invalid access token
    `Authorization` header

    + Body

    {
        "isArchived": false,
        "id": 10,
        "to": [
            "user1",
            "test@test.com"
        ],
        "from": "test@test.com",
        "subject": "First Message Subject",
        "message": "First Message Message",
        "owner": "test@test.com",
        "createdAt": "2017-11-22T21:05:23.225Z",
        "readAt": "2017-11-22T21:05:23.225Z",
        "isDeleted": false,
        "parentMessageId": 5,
        "originalMessageId": 5,
        "updatedAt": "2017-11-22T21:05:23.228Z"
    }


## Retrieve a collection of messages [/message/list]
### Retrieve a collection of messages [GET]
Retrieve the current user's messages with the option of including additional query parameters.

+ Parameters
    + from (string, optional) - only return messages from a given sender using the sender's `username`(url)
    + limit (integer, optional) - corresponds to the specific number of messages to be returned from the result of the query (url)
    + summary (boolean, optional) - indicating `summary=true` as a url request parameter will force the request to return only `subject`, `from` and `createdAt` fields(url, optional)
    + archived (boolean, optional) - indicating `archived=true` as a url request parameter will force the request to return only archived messages(url)

+ Request
    + Headers

            Authorization: Bearer ACCESS_TOKEN
            Content-Type: application/x-www-form-urlencoded

+ Response 200
    Errors
    + `Unauthorized` (401) - no access token specified or invalid access token
    `Authorization` header

    + Body

    [
      {
          "id": 5,
          "owner": "test@test.com",
          "originalMessageId": 5,
          "parentMessageId": null,
          "to": [
              "user1",
              "test@test.com"
          ],
          "from": "test@test.com",
          "subject": "First Message Subject",
          "message": "First Message Message",
          "createdAt": "2017-11-22T21:05:07.391Z",
          "readAt": "2017-11-22T21:05:07.391Z",
          "isDeleted": false,
          "isArchived": false,
          "updatedAt": "2017-11-22T21:05:07.508Z"
      },
      {
          "id": 7,
          "owner": "test@test.com",
          "originalMessageId": 5,
          "parentMessageId": null,
          "to": [
              "user1",
              "test@test.com"
          ],
          "from": "test@test.com",
          "subject": "First Message Subject",
          "message": "First Message Message",
          "createdAt": "2017-11-22T21:05:07.625Z",
          "readAt": null,
          "isDeleted": false,
          "isArchived": false,
          "updatedAt": "2017-11-22T21:05:07.625Z"
      }
    ]


## Archive a message [/message/archive/{messageId}]
### Archive an existing message [PUT]
Archive an existing message.

+ Parameters
    + messageId (integer, required) - unique ID of the message to be archived

+ Request
    + Headers

            Authorization: Bearer ACCESS_TOKEN
            Content-Type: application/x-www-form-urlencoded


+ Response 200
    Errors
    + `Unauthorized` (401) - no access token specified or invalid access token
    `Authorization` header

    + Body

    {
        "id": 9,
        "owner": "test@test.com",
        "originalMessageId": 5,
        "parentMessageId": 5,
        "to": [
            "user1",
            "test@test.com"
        ],
        "from": "test@test.com",
        "subject": "First Message Subject",
        "message": "First Message Message",
        "createdAt": "2017-11-22T21:05:23.225Z",
        "readAt": null,
        "isDeleted": false,
        "isArchived": true,
        "updatedAt": "2017-11-22T21:39:14.943Z"
    }


## Unarchive a message [/message/unarchive/{messageId}]
### Unarchive an existing message [PUT]
Unarchive an existing message.

+ Parameters
    + messageId (integer, required) - unique ID of the message to be unarchived

+ Request
    + Headers

            Authorization: Bearer ACCESS_TOKEN
            Content-Type: application/x-www-form-urlencoded


+ Response 200
    Errors
    + `Unauthorized` (401) - no access token specified or invalid access token
    `Authorization` header

    + Body

    {
        "id": 9,
        "owner": "test@test.com",
        "originalMessageId": 5,
        "parentMessageId": 5,
        "to": [
            "user1",
            "test@test.com"
        ],
        "from": "test@test.com",
        "subject": "First Message Subject",
        "message": "First Message Message",
        "createdAt": "2017-11-22T21:05:23.225Z",
        "readAt": null,
        "isDeleted": false,
        "isArchived": false,
        "updatedAt": "2017-11-22T21:42:12.617Z"
    }

## Soft delete a message [/message/delete/{messageId}]
### Soft delete an existing message [DELETE]
Sets the `isDeleted` field of a message to `true`.

+ Parameters
    + messageId (integer, required) - unique ID of the message being archived

+ Request
    + Headers

            Authorization: Bearer ACCESS_TOKEN
            Content-Type: application/x-www-form-urlencoded


+ Response 200
    Errors
    + `Unauthorized` (401) - no access token specified or invalid access token
    `Authorization` header

    + Body

    {
        "id": 9,
        "owner": "test@test.com",
        "originalMessageId": 5,
        "parentMessageId": 5,
        "to": [
            "user1",
            "test@test.com"
        ],
        "from": "test@test.com",
        "subject": "First Message Subject",
        "message": "First Message Message",
        "createdAt": "2017-11-22T21:05:23.225Z",
        "readAt": null,
        "isDeleted": true,
        "isArchived": false,
        "updatedAt": "2017-11-27T17:11:19.844Z"
    }
