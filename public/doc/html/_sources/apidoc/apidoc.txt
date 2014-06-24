.. include:: ../links.rst

.. _documentation-technical:

Technical documentation
***************************

This chapter describes, in details, different technical aspects of the AEON's platform.

AEON way of working
===================

AEON allows you to communicate your applications through a real time network. AEON's functionality could be classified in two main blocks:

- **resources management**: this functionality allows you to create, retrieve, update and delete your resources: users, entities, and channels

.. note::
     
   A new user *John* is registered into AEON, he wants to share his position with their friends. *John* creates an entity called *truck* and a new channel called *Position*. The channel is automatically composed by an url to publish messages and another one to register possible subscribers.

|
.. figure:: ../images/create_channel.png
   :width: 40%
   :align:   center
    
   Here it is: your first channel
|


- **publish/subscribe mechanisms**: this functionality allows you to send and receive messages through your managed channels
   
.. note::

    *John* keeps the publish url as a very high secret, but share the subscribers url with a couple of friends. Now, *John* can make a simple POST over the publish url (*Position's* channel). His friends will make use of the subscription url to receive messages from John.  
    
|     
.. figure::  ../images/pubsub_urls.png
   :align:   center
   
   Each channel is composed by two urls (publication and subscription)
|
   
   
To manage your resources you can use either AEON (dashboard_) or :ref:`documentation-technical-rest` (for a more flexible management). In any case, the applications that you will create, making use of AEON, will seek for publication and subscription urls of each channel. Actually, this is the most valuable resource and the connection point to the real time network. Follow the next section to see How easily your applications could start using AEON's platform. 



.. _documentation-technical-quickstart:

Quick Start
===================


This section contains several "Hello words" with AEON using the SDK in different programming languages.

- :ref:`documentation-tutorial-getchannel`

- :ref:`documentation-quickstart-java`

- :ref:`documentation-quickstart-javascript`

- :ref:`documentation-quickstart-nodejs`


.. _documentation-technical-sdk:
   
SDK
===================

AEON provides a Software Develpoment Kit to develop applications over its platform. The utilization of this SDK is very simple and eficient as show in the next subsections. 


- :ref:`documentation-sdk-java`

- :ref:`documentation-sdk-javascript`

- :ref:`documentation-sdk-nodejs`

- :ref:`documentation-sdk-messages`

   
.. _documentation-technical-rest:

AEON API 
===================

As a developer, in addition to the (dashboard_), AEON open API allows you to implement your resources management in your own way. This is a **key point** of AEON, your applications could have flexibility enough, not only to send/receive data, but also to configure your environment in a very dynamic way. For example, a chat application could manage rooms creating and deleting entities and channels regarding the needs.

If you are a developer, this should be your section. Here you will find a detailed description of the REST API for *resources managment* and *pub/sub* functionality. 

 
.. toctree::
   :maxdepth: 2
   
   users/userdoc
   entities/entitiesdoc
   channels/channelsdoc
   pubsub/pubsubdoc
   


   
   

