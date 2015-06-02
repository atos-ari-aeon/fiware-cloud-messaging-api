.. include:: ../../links.rst

.. _entitydoc:

API Entities Documentation  
*****************************

Documentation for entity's management. AEON entities are the basic resource to organize your different communication channels. An entity could mean whatever you want, a truck, a box of fish, a chat application, a chat room, your personal mobile, whatever.. By the moment, entities contains just a little description.

Only users can create new entities, and these entities will contain the different channels... actually, what we are interested in, isn’t it?. 

You can try all the operation using AEON's API_

.. _entitydoc-create:

POST entity
-----------

Create a new entity into the system. By the moment, entities only contains
information about description and a list of channels. Some preconditions:
- You need to be logged: (:ref:`userdoc-login`)
 
The entity will be created and owned by the logged user. 


.. http:post:: /entities/

   Create a new entity

   **Example request**:

   .. sourcecode:: http

      POST /entities/ HTTP/1.1
      Host: example.com
      Content: application/json
      Accept: application/json

      {
        "entityname": "entityname",
        "entitydescription": "entitydescription",
        "type": "entity",
      };
 
           
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
            "entityname": "entityname",
            "entitydescription": "entitydescription",
            "type": "entity",
            "owner": "userid",
            "channels": ["channelname"]
         };
        ]
      }

   :statuscode 200: no error
   :statuscode 400: error
   :statuscode 401: Not authenticated
   :statuscode 417: Incorrect model received, check mandatory params and syntax 

.. _entitydoc-list:

GET entities list
-----------------------

Get list of entities owned by the logged user. Preconditions:

 - You need to be logged: (:ref:`userdoc-login`)

.. http:get:: /entities/

   Get entities's list. 

   **Example request**:

   .. sourcecode:: http

      GET /entities/ HTTP/1.1
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

                "_id": "entityid",
                "channels": [ … ],
                "entitydescription": "entitydescription",
                "entityname": "entityname",
                "owner": "userid",
                "type": "entity"

            },
        ...
        ]
    }

   :statuscode 200: no error
   :statuscode 401: Not authenticated  
   :statuscode 400: error
   
   
.. _entitydoc-info:

GET entity info
-------------------

Get complete information of an specific entity. Preconditions:
    - In order to get extra information of an existing entity you need to be logged 
    - You need to be logged (:ref:`userdoc-login`) as the owner of (`entity_id`): 

.. http:get:: /entities/(entity_id)

   Get information for (`entity_id`). 

   **Example request**:

   .. sourcecode:: http

      GET /entities/51e7be2a1fb1a1f179000001 HTTP/1.1
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

                "_id": "entityid",
                "channels": [ … ],
                "entitydescription": "entitydescription",
                "entityname": "entityname",
                "owner": "userid",
                "type": "entity"

            },
        ]
    }

   :statuscode 200: no error
   :statuscode 400: error
   :statuscode 401: not authorized
   :statuscode 404: Entity not exist   

.. _entitydoc-update:

UPDATE entity
-------------

Update the name or the description of an entity. Preconditions:
    - In order to delete an existing user you need to be logged 
    - You need to be logged as the owner of the entity: (:ref:`userdoc-login`)

.. http:put:: /entities/(entity_id)

   Update information for (`entity_id`). 

   **Example request**:

   .. sourcecode:: http

      PUT /entities/51e7be2a1fb1a1f179000001 HTTP/1.1
      Host: example.com
      Accept: application/json      

      {          
        "entityname": "entityname modified",
        "entitydescription": "entity description modified",
        "type": "entity"
      }
      
      
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
   :statuscode 400: error
   :statuscode 401: not authorized
   :statuscode 417: Incorrect model received, check mandatory params and syntax

.. _entitydoc-delete:

DELETE entity
-------------

Delete an specific entity. When an entity is deleted, the channels that belongs to it will be deleted too. Preconditions:
    - In order to delete an existing entity you need to be logged 
    - You need to be logged as the owner of the entity: (:ref:`userdoc-login`)
    
.. http:delete:: /entities/(entity_id)

   Delete  (`entity_id`). 

   **Example request**:

   .. sourcecode:: http

      DELETE /entities/jhon HTTP/1.1
      Host: example.com
      Accept: application/json

   :query entity_id: entity identifier     
      
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
   :statuscode 401: not authorized
   :statuscode 404: Entity not exist   
   




