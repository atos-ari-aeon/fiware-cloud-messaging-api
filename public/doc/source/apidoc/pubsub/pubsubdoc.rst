.. include:: ../../links.rst

.. _pubsubdoc:

API Publication/Subscription Documentation  
******************************************

You are here, because you want to code applications to send and receive data. Therefore, previous to come here:
 * You have an user registered in the AEON platform :ref:`userdoc-create`
 * You have at least one entity created  :ref:`entitydoc-create`
 * You have al least one channel for this entity. :ref:`channeldoc-create`
 
The channels will retrieve you two different identifiers: **Pub_Url** and **Sub_Url** that will be mandatory to proceed with the operations explained in that section. Remenber: every message send it through the **Pub_Url** willl be received by the allowed (through the **Pub_Url**) subscribers.

You can try all the operation using AEON's API_

.. _pubsubdoc-post:

POST message (publish)
----------------------

Post a message over an specific channel. Be aware about how you share this *Pub_Url*, every body having this url only need:
 * The URL needs to be correct (exists). 
 * The message format has to be a correct JSON message in the request body.

Mainly, if you have the url, you can publish!!

.. http:post:: /publish/(pubID)

   Post a message over the channel (`channel_id`). 

   **Example request**:

   .. sourcecode:: http

      POST /publish/bddcab1d-b92e-4501-8c84-f00010e231a0 HTTP/1.1
      Host: example.com
      Content: application/json
      Accept: application/json
     
      {
        "GPS": "30.0, 31.45"
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
   :statuscode 400: no message to publish
   :statuscode 408: Can not publish
   :statuscode 417: Incorrect model received, check mandatory params and syntax

.. _pubsubdoc-sub:
GET message (subscribe)
------------------------

.. note::

    This operations guarantees the requester his own place inside the channels. It means, this is the previous phase before receiving data through the channel.
     
This operation tries to register the requester into the subscribers list. If everything is ok, the requester is subscribed and the platform generates a **Sub_Key** for him. Currently, the requester will have to implement an ampq client to connect the broker using the **Sub_Key**.
    

.. http:get:: /subscribe/(subID)?id=idApp&desc=descApp

   Get a subscription and receive an identifier. Later, this identifier will be used to connect the channel 
   to receive data. 

   **Example request**:

   .. sourcecode:: http

      GET /subscribe/ae4a23a7-003c-490c-8344-6a7c143a640f?id=webapp&desc=webapp HTTP/1.1
      Host: example.com
      Content: application/json
      Accept: application/json

   :query id: just an identifier of the requester
   :query desc: just a description of the requester

     
   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "code": 200,
        "desc": "ok",
        "result": [
            {
                "id": "webapp",
                "desc": "webapp",
                "ip": "localhost:3000",
                "subkey": "Position-54543172-queu",
                "_id": "53143f94aaa7e6bc1a000001"
            }
        ]
    }

   :statuscode 200: no error
   :statuscode 400: error
   :statuscode 408: Can not create new subscription


.. _pubsubdoc-unsub:
DELETE subscription (Unsubscribe)
---------------------------------

.. note::
     
    This operation unsubcribes the user from a channel subscribed before.    

.. http:delete:: /subscribe/(subID)

   The user is unsubcribed from the channel to which the user is subscribed.

   **Example request**:

   .. sourcecode:: http

      DELETE /subscribe/ae4a23a7-003c-490c-8344-6a7c143a640f HTTP/1.1
      Host: example.com
      Content: application/json
      Accept: application/json

      {
        "id": "appId",
        "desc": "appDesc"        
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
   :statuscode 404: subscription not exist

