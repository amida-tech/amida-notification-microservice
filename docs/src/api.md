# Amida Messaging Microservice

A restful microservice allowing messaging between multiple users.

All API endpoints must be prefixed with the `api` keyword: for example,
`/api/message/list` not just `/message/list`. Request headers should indicate a  `Content-Type` of `application/x-www-form-urlencoded` and should include an `Authorization` field with value `Bearer <auth_token>`.

```
  Content-Type: application/x-www-form-urlencoded
  Authorization: Bearer <auth_token>
```

Users of the messaging service must be registered on an instance of the [Amida Auth Microservice](https://github.com/amida-tech/amida-auth-microservice). The required `auth_token` is obtained by authenticating against the Auth Microservice and receiving a [JSON Web Token](http://jwt.io).

The request body should be sent `x-www-form-urlencoded`.

### Response Status Codes
#### Success
All successful requests return responses with the following error codes:
 - `GET`, `PUT` and `DELETE` return `200` on success
 - `POST` returns `201` on success

#### Error
Error responses have [standard HTTP error codes](http://www.restapitutorial.com/httpstatuscodes.html)

For example, when attempting access messages with an invalid `auth_token`:

```http
Status: 401 Access denied
```
