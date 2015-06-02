.. include:: ../links.rst

.. _documentation-sdk-java:

SDK for Java
***************


.. _sdk-create-java:

Pre-requisites
--------------

First of all you need to get AEON SDK from `GitLab <http://gitlab.atosresearch.eu/ari/aeon-sdk/blob/master/SDK/java/releases/AeonSDK-Java_0.2.0.tgz>`_. Java package is distributed containing the sdk.jar and Socket-io.jar (dependency).


Instance the SDK
-----------------

To start publishing/subscribing with the SDK, it si necessary to instanciate a new SDK object and retreive a new subscription for your channel.
	
.. js:function:: AeonSDK(String url, String id, String desc)

	:param string url: publish/subscribe url. The constructor will determine if the url is for publish or subcribe and will set its operation mode to "publish" or "subscribe".
	:param string id: Mandatory only for subscription mode. 
	:param string desc: Mandatory only for subscription mode. 
	:returns: and SDK object

Also, you can use a previously obtained subscription. More details :ref:`documentation-sdk-java-persistentsub`

.. js:function:: AeonSDK(String url, JSONObject subscription)

	:param string url: subscribe url. 
	:param JSONObject subscription: previously obtained subscription
	:returns: and SDK object


.. _sdk-publishing-java:

Publish
-----------------

This functionality allows to publish a message. The SDK created object has to be in publish mode.

.. js:function:: publish(JSONObject jsonData, [AEONInterface callback])
	
	:param JSONObject jsonData: JSON containing the data to be published.
	:param AEONInterface callback: callback containing the methods (invoked asynchrounsly) to receive AEON control messages.
	
See :ref:`sdk-java-callbacks` for details about callbacks.

You can publish without a callback. Control messages received through callback.control:

- :ref:`documentation-sdk-messages_cero`

- :ref:`documentation-sdk-messages_one`

- :ref:`documentation-sdk-messages_three`

- :ref:`documentation-sdk-messages_fifty`

- :ref:`documentation-sdk-messages_onehundredone`


.. _sdk-subscribing-java:

Subscribe
-----------------

This functionality allows to subscribe to an specific channel and receive all the published information. The SDK created object has to be in ssubscription mode. 
	
.. js:function:: subscribe(AEONInterface callback)
	
	:param AEONInterface callback:  callback with control and receivedEvent methods. 
	
See :ref:`sdk-java-callbacks` for details about callbacks.

Each time that a message arrives over the channel, the callback.receivedEvent function will be executed.
Control messages received through callback.control:


- :ref:`documentation-sdk-messages_cero`

- :ref:`documentation-sdk-messages_one`

- :ref:`documentation-sdk-messages_three`

- :ref:`documentation-sdk-messages_one`

- :ref:`documentation-sdk-messages_fifty`

- :ref:`documentation-sdk-messages_onehundred`

- :ref:`documentation-sdk-messages_twohundredone`

- :ref:`documentation-sdk-messages_twohundrethree`

- :ref:`documentation-sdk-messages_twohundredfifty`



.. _sdk-pause-java:

PauseSubscription
-------------------

This operation will allow to stop receiving data from a subscription.

.. js:function:: pauseSubscription()	
	

Specific control messages received through callback.control:

- :ref:`documentation-sdk-messages_twohundredtwo`

- :ref:`documentation-sdk-messages_twohundredfiftytwo`

.. _sdk-continue-java:

ContinueSubscription
--------------------

This operation will allow to re-start receiving data from a subscription that was paused.

.. js:function:: continueSubscription()	
	
Specific control messages received through callback.control:

- :ref:`documentation-sdk-messages_twohundredfifty`

.. _sdk-delete-java:

DeleteSubscription
-------------------

This operation will delete the existing subscription and could not be recovered or continued.

.. js:function:: deleteSubscription()	
	
Specific control messages received through callback.control:

- :ref:`documentation-sdk-messages_twohundredtwo`

- :ref:`documentation-sdk-messages_twohundredfiftyone`

.. _sdk-java-callbacks:

AEON callbacks
-----------------

In order to manage the events received during publishing/subscribing you have to implement a class based on AEONInterface. This class only contains the methods: receivedEvent (where the published data is received) and control (AEON control messages for errors, networ status, etc..)


.. code-block:: java

	public static class MyAEONCallbacks implements AEONInterface {
		@Override
		public void receivedEvent(JSONObject data) {
			System.out.println("Event received" + data.toString());
		}

		@Override
		public void control(JSONObject data) {
			System.out.println("Control Message" + data.toString());
			
		}

	}
