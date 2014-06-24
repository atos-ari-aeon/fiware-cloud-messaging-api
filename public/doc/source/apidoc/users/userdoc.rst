.. include:: ../../links.rst


.. _userdoc:

API Users Documentation
*****************************

Documentation for user's management. Most of the AEON's functionalities
requires registered users. This registered users will make use of the AEON's functionality
to create entities and channels.

You can try all the operation using AEON's API_

.. _userdoc-login:

Login
------

Logging process with an existing user and password (:http:post:`/users/`) . If the process results "ok"
you will receive a cookie with your session. This cookie will be
used in most of the operations.



.. http:post:: /login/

   Login process

   **Example request**:

   .. sourcecode:: http

      POST /login/ HTTP/1.1
      Host: :api-host:`API example host`
      Content: application/json
      Accept: application/json

      {
        'username': 'john',
        'password': 'john',
        'type': 'user'
      }


   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "code": 200,
        "desc": "ok"
      }

   :statuscode 200: no error
   :statuscode 40x: error
   :statuscode 400: Incorrect model received, check mandatory params and syntax
   :statuscode 500: unknown error (contact for support)


.. _userdoc-logout:

Logout
------

Logout process. The user set in the cookie will be unset from it. The cookie won't be deleted from the server.

.. http:get:: /logout

   Logout process

   **Example request**:

   .. sourcecode:: http

      GET /logout HTTP/1.1
      Host: :api-host:`API example host`
      Accept: application/json


   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "code": 200,
        "desc": "ok"
      }

   :statuscode 200: no error
   :statuscode 205: Unathorized
   :statuscode 500: unknown error (contact for support)

.. _userdoc-create:

CREATE user
------------

Create/Register a new user into the system. By the moment, it only includes
information about user and password.


.. http:post:: /users/

   Register a new user

   **Example request**:

   .. sourcecode:: http

      POST /users/ HTTP/1.1
      Host: example.com
      Content: application/json
      Accept: application/json

      {
           "username": "john",
           "password": "john",
           "type": "user",
           "_id": "john"
      }


   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "code": 200,
        "desc": "ok"
        "result":
       [
        {
           "username": "john",
           "password": "john",
           "type": "user",
           "_id": "john"
        }
       ]
      }

   :statuscode 200: no error
   :statuscode 400: Incorrect model received, check mandatory params and syntax
   :statuscode 400: user already exists
   :statuscode 40x: error


.. _userdoc-userInfo:

User Info
---------

Retrieves the information related to the user identified in the cookie.

.. http:get:: /users/user

   Get user info

   **Example request**:

   .. sourcecode:: http

      GET /users/user HTTP/1.1
      Host: :api-host:`API example host`
      Accept: application/json


   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "code": 200,
        "desc": "ok",
        "result": [
            {
                "_id": "userID",
                "type": "user",
                "username": "username"
            }
        ]
    }

   :statuscode 200: no error
   :statuscode 205: Unathorized
   :statuscode 500: unknown error (contact for support)


.. _userdoc-list:

GET Users list
--------------

Get list of registered users. Just basic information. Preconditions:
 - You need to be logged: (`Login`_)

.. http:get:: /users/

   Get user's list.

   **Example request**:

   .. sourcecode:: http

      GET /users/ HTTP/1.1
      Host: example.com
      Accept: application/json


   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "code": 200,
        "desc": "ok"
        "result":
       [
        {
           "username": "john",
           "type": "user",
           "_id": "john"
        },
        {
           "username": "jammes",
           "type": "user",
           "_id": "jammes"
        }
       ]
      }

   :statuscode 200: no error
   :statuscode 401: Not authenticated
   :statuscode 40x: error


.. _userdoc-info:

GET User
----------

Get complete information of an specific user. Preconditions:
    - In order to get extra information of an existing user you need to be logged
    - You need to be logged as (`user_id`): (`Login`_)

.. http:get:: /users/(user_id)

   Get information for (`user_id`).

   **Example request**:

   .. sourcecode:: http

      GET /users/jhon HTTP/1.1
      Host: example.com
      Accept: application/json

   :query user_id: user_id email identifier

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "code": 200,
        "desc": "ok",
        "result":
        [
         {
            "username": "jhon",
            "password": "jhon",
            "type": "user"
         }
        ]
      }

   :statuscode 200: no error
   :statuscode 401: You are not authorized for this operation
   :statuscode 401: Not authenticated
   :statuscode 40x: error

.. _userdoc-delete:

DELETE user
-----------

Delete an specific user. When a user is deleted, all the entities and the information assigned will be deleted too. Preconditions:
    - In order to delete an existing user you need to be logged
    - You need to be logged as (`user_id`): (`Login`_)


.. http:delete:: /users/(user_id)

   Delete  (`user_id`).

   **Example request**:

   .. sourcecode:: http

      DELETE /users/jhon HTTP/1.1
      Host: example.com
      Accept: application/json

   :query user_id: user_id email identifier

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "code": 200,
        "desc": "ok",
      }

   :statuscode 200: no error
   :statuscode 401: You are not authorized for this operation
   :statuscode 401: Not authenticated
   :statuscode 40x: error


.. _userdoc-updatePass:

UPDATE user password
----------------------

Change the user password.

.. http:put:: /users/(user_id)/updatePassword

   Changes the user password

   **Example request**:

   .. sourcecode:: http

      PUT /users/user@domain.com/updatePassword HTTP/1.1
      Host: example.com
      Content: application/json
      Accept: application/json

      {
           "password": "newPassword",
           "type": "user"
      }

   :query user_id: user_id email identifier


   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
          "code": 200,
          "desc": "ok",
          "result": [
          ]
      }

   :statuscode 200: no error
   :statuscode 400: Incorrect model received, check mandatory params and syntax
   :statuscode 40x: error


.. _userdoc-rememberPass:

Remember the user's password
-----------------------------

This function is in charge of helping to remember a forgotten or missed password. Mainly,
an existing user id will be requested (users are registered with emails). Thus, the user will
receive an email with extra information in his email address. The extra information contains
a temporal code used to reset the password with (:ref:`userdoc-resetPass`).

.. http:get:: /users/(user_id)/rememberPassword

   Generate a temporal code to change the user's password. (user_id) is the email of
   an existing user. Through this email he will receive the necessary information to (:ref:`userdoc-resetPass`).

   **Example request**:

   .. sourcecode:: http

      GET /users/user@domain.com/rememberPassword HTTP/1.1
      Host: example.com
      Accept: application/json

   :query user_id: user_id email identifier

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
       "code": 200,
       "desc": "ok",
       "result": [
         "You will receive an email with information for reset."
       ]
      }

   :statuscode 200: no error
   :statuscode 404: The user does not exist
   :statuscode 500: Error sending reset email


.. _userdoc-resetPass:

Reset the user's password
-------------------------

This function is in charge of resetting a forgotten or missed password. The user needs to provide
an existing user id (users are registered with emails), the new password and a temporal code generated by (:ref:`userdoc-rememberPass`).

.. http:put:: /users/(user_id)/rememberPassword/(code)

   Changes user's password of (user_id) using the retrieved (code) by (:ref:`userdoc-rememberPass`).

   **Example request**:

   .. sourcecode:: http

      PUT /users/user@domain.com/rememberPassword/8c5bdbf8-8c2f-46fb-8ae5-b7a579aca07b  HTTP/1.1
      Host: example.com
      Content: application/json
      Accept: application/json

      {
           "password": "newPassword",
           "type": "user"
      }

   :query user_id: user_id email identifier
   :query code: temporal code to reset the password

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
          "code": 200,
          "desc": "ok",
          "result": [
          ]
      }

   :statuscode 200: no error
   :statuscode 404: user does not exist
   :statuscode 500: error trying to reset user password
