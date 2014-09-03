.. include:: ../../links.rst

.. _channeldoc:

API Channels Documentation
*****************************

AEON channels are the most valuable resource, actually, you are here because you want communication channels. A channel is a communication resource allowing  publication an subscription mechanisms.

Channels need to be organized into an existing entity and contains:
 * A little description
 * The pub/sub urls
 * A list of allowed subscribers


You can try all the operation using AEON's API_

.. _channeldoc-create:

POST channel
------------

Create a new channel into the specific entity. Channels contains
information about description and the pub/sub mechanisms. Some preconditions:
- You need to be logged: (:ref:`userdoc-login`)
- You need to be logged as the owner of the (entity_id) where your are requesting a new channel

The channel will be attached to the entity, together with Pub_Url and a (Sub_Url).

.. http:post:: /entities/(entity_id)/channels

   Create a new channel

   **Example request**:

   .. sourcecode:: http

      POST /entities/51e7be2a1fb1a1f179000001/channels HTTP/1.1
      Host: example.com
      Content: application/json
      Accept: application/json

      {
        "channelName": "channelname",
        "channeldesc": "channeldesc",
        "type": "channel"
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
   :statuscode 400: error
   :statuscode 401: Not authenticated
   :statuscode 417: Incorrect model received, check mandatory params and syntax

.. _channeldoc-list:

GET channels list
-----------------------

Get the list of channels of an specific entity. Preconditions:

 - You need to be logged: (:ref:`userdoc-login`)
 - You need to be logged as the owner of the (entity_id)

.. http:get:: /entities/(entity_id)/channels

   Get channels's list.

   **Example request**:

   .. sourcecode:: http

      GET /entities/51e7be2a1fb1a1f179000001/channels HTTP/1.1
      Host: example.com
      Accept: application/json

   :query entity_id: entity identifier

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
            "_id": "51e7be461fb1a1f179000002",
            "channelName": "channelname",
            "channeldesc": "channeldesc",
            "pubID": "4ca05d1f-ff02-481d-a1db-9d69c6bfff73",
            "subID": "d203158e-bac8-49ee-b2d3-1fd82729fa09"
          },
          ...
          
         ]
       }

   :statuscode 200: no error
   :statuscode 400: error
   :statuscode 401: Not authenticated


.. _channeldoc-info:

GET channel info
-------------------

Get complete information of an specific channel. Preconditions:
 - You need to be logged: (:ref:`userdoc-login`)
 - You need to be logged as the owner of the (entity_id)
 - (channel_id) has to be attached to the list of channels of (entity_id)

.. http:get:: /entities/(entity_id)/channels/(channel_id)

   Get channel info for (`channel_id`).

   **Example request**:

   .. sourcecode:: http

      GET /entities/51e7be2a1fb1a1f179000001/channels/51e7be461fb1a1f179000002 HTTP/1.1
      Host: example.com
      Accept: application/json

   :query entity_id: entity identifier
   :query channel_id: channel identifier

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
            "_id": "51e7be461fb1a1f179000002",
            "channelName": "channelname",
            "channeldesc": "channeldesc",
            "pubID": "4ca05d1f-ff02-481d-a1db-9d69c6bfff73",
            "subID": "d203158e-bac8-49ee-b2d3-1fd82729fa09",
            "puburl": "http://lcb.herokuapp.com/publish/4ca05d1f-ff02-481d-a1db-9d69c6bfff73",
            "subscriptionsurl": "http://lcb.herokuapp.com/subscribe/d203158e-bac8-49ee-b2d3-1fd82729fa09",
            "subscriptions": [
              {
                _id: "53bfe41faf5e6e0200000016",
                desc: "demo-sub",
                id: "demo-sub",
                ip: "lcb.herokuapp.com",
                subkey: "Delivery Item 1-10925842-queu"
              },
              ...
            ]

          }
         ]
       }

   :statuscode 200: no error
   :statuscode 400: error
   :statuscode 401: Not authenticated
   :statuscode 404: Channel not exist

.. _channeldoc-update:

UPDATE channel
--------------

Updates the information of an specific channel. Preconditions:
 - You need to be logged: (:ref:`userdoc-login`)
 - You need to be logged as the owner of the (entity_id)
 - (channel_id) has to be attached to the list of channels of (entity_id)

.. http:put:: /entities/(entity_id)/channels/(channel_id)

   Get channel info for (`channel_id`).

   **Example request**:

   .. sourcecode:: http

      PUT /entities/51e7be2a1fb1a1f179000001/channels/52b417dea3bc5b191c000001 HTTP/1.1
      Host: example.com
      Content: application/json
      Accept: application/json

      {
        "channelName": "new channelname",
        "channeldesc": "new channeldesc",
        "type": "channel"
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
   :statuscode 400: error
   :statuscode 401: Not authenticated
   :statuscode 404: Channel not found
   :statuscode 417: Incorrect model received, check mandatory params and syntax

.. _channeldoc-delete:

DELETE channel
--------------

Delete an specific channel. Preconditions:
    - In order to delete an existing channel you need to be logged (:ref:`userdoc-login`)
    - You need to be logged as the owner of the entity that is linked with the specific channel:
    - (channel_id) has to be attached to the list of channels of (entity_id)

.. http:delete:: /entities/(entity_id)/channels/(channel_id)

   Delete  (`channel_id`).

   **Example request**:

   .. sourcecode:: http

      DELETE /entities/51e7be2a1fb1a1f179000001/channels/52b417dea3bc5b191c000001 HTTP/1.1
      Host: example.com
      Accept: application/json

   :query entity_id: entity identifier
   :query channel_id: channel identifier

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "code": 200,
        "desc": "ok",
      }

   :statuscode 200: no error
   :statuscode 400: error
   :statuscode 401: Not authenticated
   :statuscode 404: Channel not found
   



