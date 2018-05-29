# Group Message Threads
## Retrieve a message thread [/message/get/{originalMessageId}]
### Retrieve a message thread [GET]
Retrieve a message thread by the ID of the original message.

+ Parameters
    + originalMessageId (integer, required) - the originalMessageId shared by all messages in the thread(url)

+ Request
    + Headers

            Authorization: Bearer ACCESS_TOKEN

+ Response 200
    Errors
    + `Unauthorized` (401) - no access token specified or invalid access token
    `Authorization` header
    + `Not found` (404) - no messages with the originalMessageId found

    + Body

            [{
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
            },
            {
                "id": 4,
                "owner": "test@test.com",
                "originalMessageId": 3,
                "parentMessageId": 3,
                "to": [
                    "test@test.com"
                ],
                "from": "user1",
                "subject": "First Message Subject",
                "message": "Reply message content",
                "createdAt": "2017-11-22T20:35:06.451Z",
                "readAt": "2017-11-22T20:37:06.451Z",
                "isDeleted": false,
                "isArchived": false,
                "updatedAt": "2017-11-22T20:36:07.108Z"
            }]
