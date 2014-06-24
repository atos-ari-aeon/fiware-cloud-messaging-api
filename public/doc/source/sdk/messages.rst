.. _documentation-sdk-messages:

SDK messages
***************

During a publication or subcription process AEON will emit different control's messages. These messages can captured using an (optional) "control" callback. See :ref:`documentation-technical-sdk` regarding your specific language for more details.

The control callback receives a JSON in the next format:

.. code-block:: json

    {
        "error": true|false,
        "msg": <msg>,
        "code": <code>
    }
    
The "error" key determinates if the message is considered as an error, or if it is just useful informatino for the developer. The "msg" is a text that will add readable information to the message. Finally, the numerical code helps developer to detect the message in order to act accordingly. The next sections explains in details the different messages supported by AEON.


.. _documentation-sdk-messages_cero:

Code 0: Unknwon error
-----------------------

This should not happen. Please, contact us.

.. code-block:: json

    {
        "error": true,
        "msg": "Unknwon error",
        "code": 0
    }


.. _documentation-sdk-messages_one:

Code 1: Bad URL
-----------------------

The channel url (publication or subscription) is incorrect. It could be malformed or the resource no longer exists.

.. code-block:: json

    {
        "error": true,
        "msg": "Bad URL",
        "code": 1
    }



.. _documentation-sdk-messages_three:

Code 3: Communication infrastructure down
---------------------------------------------

AEON infrastructure is down. After this event you are not able to publish or to receive messages from a subscription. The SDK is able to detect when the infrastructure is UP again, and everything will continue working (automatic recovering).

.. code-block:: json

    {
        "error": true,
        "msg": "Communication infrastructure down",
        "code": 3
    }


.. _documentation-sdk-messages_fifty:

Code 50: Communication infrastructure up
------------------------------------------

AEON infrastructure is UP. This is the first message you will receive after invoking publish or subscribe method, in order to make you know that AEON is working correctly. This message is also received after an :ref:`documentation-sdk-messages_three` message, the SDK is reconfigured automatically and continues sending/receiving information.

.. code-block:: json

    {
        "error": false,
        "msg": "Communication infrastructure up'",
        "code": 50
    }


.. _documentation-sdk-messages_onehundred:

Code 100: SDK operating in Publication Mode
--------------------------------------------

You are invoking subscribe method but using a publication url. 

.. code-block:: json

    {
        "error": true,
        "msg": "Operation Denied. SDK operating in Publication Mode'",
        "code": 100
    }




.. _documentation-sdk-messages_onehundredone:

Code 101: SDK operating in Subscription Mod
--------------------------------------------

You are invoking publish method but using a subscription url. 

.. code-block:: json

    {
        "error": true,
        "msg": "Operation Denied. SDK operating in Subscription Mode'",
        "code": 100
    }



.. _documentation-sdk-messages_twohundredone:

Code 201: Subscription in use
--------------------------------------------

You can be subscribed to a channel using a subscription or url, or directly using a subscription (retrieved previously using a subscription url). More details for javascript/nodejs :ref:`documentation-sdk-javascript-persistentsub` or Java :ref:`documentation-sdk-java-persistentsub`.

These obtained subscription can be used by only on process at the same time. Check if you have more process running using the same subscription, or just wait the other release his subscription.

Not to confuse a subscription url with a subscription. A "subscription" second is a json object obtained after invoking sdk.subscribe with a "subscription url". 


.. code-block:: json

    {
        "error": true,
        "msg": "This subscription is been used by other process (locked)",
        "code": 201
    }


.. _documentation-sdk-messages_twohundredtwo:

Code 202: You are not subscribed
--------------------------------------------

You receive this message whenever you try to pause, continue or delete but you have not obtained a subscription.

.. code-block:: json

    {
        "error": false,
        "msg": "You are not subscribed",
        "code": 253
    }


.. _documentation-sdk-messages_twohundrethree:

Code 203: Subscription incorrect
--------------------------------------------

The subscription you are using is incorrect or does not longer exits.

Not to confuse a subscription url with a subscription. A "subscription" second is a json object obtained after invoking sdk.subscribe with a "subscription url". 

.. code-block:: json

    {
        "error": true,
        "msg": "Subscription incorrect, bad request",
        "code": 203
    }


.. _documentation-sdk-messages_twohundredfifty:

Code 250: You have been subscribed
--------------------------------------------

After invoking sdk.subscribe you receive this message if everything was ok. After this message you will start receiving published messages through this channel. 

.. code-block:: json

    {
        "error": false,
        "msg": "You have been subscribed",
        "code": 250
    }
    
    
.. _documentation-sdk-messages_twohundredfiftyone:

Code 251: Your subscription has been deleted
---------------------------------------------

While you are subscribed, you receive this message if other process has deleted the channel you are using with this subscription.

.. code-block:: json

    {
        "error": false,
        "msg": "Your subscription has been deleted",
        "code": 251
    }



.. _documentation-sdk-messages_twohundredfiftytwo:

Code 252: You have been unsubscribed
--------------------------------------------

You receive this message after pausing a subscription. You dont receive more published messages, until you invoke continue method.

.. code-block:: json

    {
        "error": false,
        "msg": "Your subscription has been deleted",
        "code": 252
    }

