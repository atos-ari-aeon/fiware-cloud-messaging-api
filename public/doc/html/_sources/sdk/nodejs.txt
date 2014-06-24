.. _documentation-sdk-nodejs:

SDK for node.js
*********************


.. _sdk-create-nodejs:


Instance the SDK
-----------------

To start publishing/subscribing with the SDK, it si necessary to instanciate a new SDK object.
	
.. js:function:: AeonSDK(url, subscriptionData)

	:param string url: publish/subscribe url. The constructor will determine if the url is for publish or subcribe and will set its operation mode to "publish" or "subscribe".
	:param JSON subscriptionData: it is a JSON containing information to create a new susbcription or directly a previously created subscription.
	:returns: and SDK object

If you are creating connection for a new subscription, subscriptionData (JSON) has to contain "id" and "desc" fields:

.. code-block:: json

    {
        "id": "demo-test",
        "desc": "create a new subscription for testing"
    }
    
The combination of "id" and "desc" (strings) makes your subscriber unique in the iCargo network.

If you are creating a connection with a previous generated subscription, subscriptionData will be a JSON obtained from sdk.getSubscription(). More details about persistant subscription: :ref:`documentation-sdk-javascript-persistentsub`

.. _sdk-publishing-nodejs:

Publish
-----------------

This functionality allows to publish a message. The SDK created object has to be in publish mode.

.. js:function:: publish(data,[control])
	
	:param data: JSON containing the data to be published.
	:param control: callback function to receive AEON control messages.
	

You can publish without a control callback function. If control callback is passed, controll messages will be received: 

- :ref:`documentation-sdk-messages_cero`

- :ref:`documentation-sdk-messages_one`

- :ref:`documentation-sdk-messages_three`

- :ref:`documentation-sdk-messages_fifty`

- :ref:`documentation-sdk-messages_onehundredone`


.. _sdk-subscribing-nodejs:

Subscribe
-----------------

This functionality allows to subscribe to an specific channel and receive all the published information. The SDK created object has to be in ssubscription mode. 
	
.. js:function:: subscribe(deliveredMessage, [control])

	:param deliveredMessage: callback function to receive published messages.		
	:param control: callback function to receive AEON control messages.

	

Each time that a message arrives over the channel, the callback deliveredMessage  will be executed.
You can be subscribed (not recommended) without a control callback function. If control callback is passed, controll messages will be received: 


- :ref:`documentation-sdk-messages_cero`

- :ref:`documentation-sdk-messages_one`

- :ref:`documentation-sdk-messages_three`

- :ref:`documentation-sdk-messages_one`

- :ref:`documentation-sdk-messages_fifty`

- :ref:`documentation-sdk-messages_onehundred`

- :ref:`documentation-sdk-messages_twohundredone`

- :ref:`documentation-sdk-messages_twohundrethree`

- :ref:`documentation-sdk-messages_twohundredfifty`


.. _sdk-pause-nodejs:

PauseSubscription
-------------------

This operation will allow to stop receiving data from a subscription.

.. js:function:: function pauseSubscription()	
	

Specific control messages received through callback control:

- :ref:`documentation-sdk-messages_twohundredtwo`

- :ref:`documentation-sdk-messages_twohundredfiftytwo`

.. _sdk-continue-nodejs:

ContinueSubscription
---------------------

This operation will allow to re-start receiving data from a subscription that was paused.

.. js:function:: function continueSubscription()	
	
Specific control messages received through callback control:

- :ref:`documentation-sdk-messages_twohundredfifty`

.. _sdk-delete-nodejs:

DeleteSubscription
--------------------

This operation will delete the existing subscription and could not be recovered or continued.

.. js:function:: deleteSubscription()	
	
Specific control messages received through callback control:

- :ref:`documentation-sdk-messages_twohundredtwo`

- :ref:`documentation-sdk-messages_twohundredfiftyone`


