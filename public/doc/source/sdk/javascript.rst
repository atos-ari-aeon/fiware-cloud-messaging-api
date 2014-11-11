.. _documentation-sdk-javascript:

SDK for Javascript
*********************


.. _sdk-create-javascript:


Instance the SDK
-----------------

To start publishing/subscribing with the SDK, it si necessary to instanciate a new SDK object.
	
.. js:function:: AeonSDK(url, [subscriptionData])

    :param string url: publish/subscribe url. The constructor will determine if the url is for publish or subcribe and will set its operation mode to "publish" or "subscribe".
    :param JSON subscriptionData: Mandatory if you will use the object for subscriptions. It is a JSON containing information about your subscription, this information will be used to retrieve your existing subscription data or to create a new one (if it does not exist or it was deleted).
    :returns: and SDK object


.. code-block:: json

    {
        "id": "demo-test",
        "desc": "create a new subscription for testing"
    }
    
The combination of "id" and "desc" (strings) makes your subscription unique in the AEON network. Details about persistant subscriptions: :ref:`documentation-sdk-javascript-persistentsub`

.. _sdk-publishing-javascript:

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


.. _sdk-subscribing-javascript:

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


.. _sdk-pause-javascript:

PauseSubscription
-------------------

This operation will allow to stop receiving data from a subscription.

.. js:function:: function pauseSubscription()	
	

Specific control messages received through callback control:

- :ref:`documentation-sdk-messages_twohundredtwo`

- :ref:`documentation-sdk-messages_twohundredfiftytwo`

.. _sdk-continue-javascript:

ContinueSubscription
---------------------

This operation will allow to re-start receiving data from a subscription that was paused.

.. js:function:: function continueSubscription()	
	
Specific control messages received through callback control:

- :ref:`documentation-sdk-messages_twohundredfifty`

.. _sdk-delete-javascript:

DeleteSubscription
--------------------

This operation will delete the existing subscription and could not be recovered or continued.

.. js:function:: deleteSubscription()	
	
Specific control messages received through callback control:

- :ref:`documentation-sdk-messages_twohundredtwo`

- :ref:`documentation-sdk-messages_twohundredfiftyone`


