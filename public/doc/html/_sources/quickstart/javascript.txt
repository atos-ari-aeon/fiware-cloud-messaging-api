.. include:: ../links.rst

.. _documentation-quickstart-javascript:

Playing with AEON using Javascript
******************


In this section we will use AEON SDK in order to implement two simple applications with the following behaviour:

- SendNumbers: publish numbers from 0 to 100.
- ReceiveNumber: the application is subscribed to receive and printout numbers. After three seconds the subscription will be paused and then continued.
 
This simple demonstration shows:

- How to publish data over a channel.
- How to be subscribed to a channel to receive data.
- How to pause the subscription.
- How to continue the subscription without missing data, that could have been created during the break.
 

First steps
===================

First of all you need to get AEON SDK from `GitLab <http://gitlab.atosresearch.eu/ari/aeon-sdk/blob/master/SDK/javascript/releases/AeonSDK-Javascript_0.2.0.tgz>`_.

.. note::

    AEON SDK is licensed as GPLv3
     * If you need to release your software with other (privative) different license, or, please contact us from our web page in section about_ us.
     * As an exception, you can release your software with other opensource/freesoftware license different than GPLv3.


Once you have the javascript library create a new html project using your favourite editor or IDE, and add the SDK and the socket.io library to the javascript libraries:

.. code-block:: javascript

    <script type="text/javascript" src="aeonSDK.js"></script>        
    <script type="text/javascript" src="socket.io.js"></script>
		
You are almost done. AEON publication/subscription is based on channels with an url for publication and other for subscription. Follow this :ref:`documentation-tutorial-getchannel` and bring a couple of urls from your first channel (Pub_url and Sub_url).

Hello World (publish)
----------------------------------------
Now that you have your node.js project ready, you can begging coding.

Lets start with the simple code to publish some numbers. First of all you need to be connected to an AEON channel using your publish url.

.. code-block:: javascript

    var sdk = new AeonSDK(PUB_URL);
    
And now, lets generate some numbers. To publish information you need to use a JSON object:

.. code-block:: javascript

    var sdk = new AeonSDK(PUB_URL);
    for (var i=1; i <=100; i++){     
        msg = { "number": i };       
        console.log("Message "+i);
        sdk.publish(msg);               
    }     

Let's see how a complete html page would be:

.. code-block:: html

    <!DOCTYPE html>
    <html>
    <head>        
        <script type="text/javascript" src="aeonSDK.js"></script>        
        <script type="text/javascript" src="socket.io.js"></script> 
        <script type="text/javascript" src="config.js"></script>
    </head>
    <body>
        <script type="text/javascript">
            
            var sdk = new AeonSDK(PUB_URL);
            for (var i=1; i <=100; i++){     
                msg = { "number": i};       
                console.log("Message "+i);
                sdk.publish(msg);               
            }

        </script>
    </body>
    </html> 
 
Done it!. As you can see, once you are connected to your channel, you can directly invoke publish method passing a JSON as a parameter.



Hello World (subscribe)
-------------------------------------------

Now lets create the page to receive the numbers. Againg we need to create a connection with our previously created channel (this time, using the subscription url). In this page it is also necessary to include the the SDK and the socket.io library to the javascript libraries:

.. code-block:: javascript

    <script type="text/javascript" src="aeonSDK.js"></script>        
    <script type="text/javascript" src="socket.io.js"></script>

The code below subscribes to the channel and wait for published messages. After three seconds, the subscription will be paused and after three seconds, it will be continued again.

.. code-block:: javascript
    
    var subscriptionData = { "id": config.YOUR_ID, "desc": config.YOUR_DESC};
    sdk = new AeonSDK(config.SUB_URL, subscriptionData);

    
The combination of YOUR_ID and YOUR_DESC (strings) makes your subscriber unique in the iCargo network. Once the SDK is ready you can ask for a subscription. As simple as:

.. code-block:: javascript
    
    sdk.subscribe(received);


received parameter is callback function. This is the way that we will manage asynchronous messages produced during the subscription. Any time a message is published in the channel; AEON will notify you through your callback. 


Now lets do it a little bit more interesting. With AEON you can pause the communication, messages produced during your break will be received when you decide to continue. 

.. code-block:: javascript

    var received = function received(msg) {
        console.log("Received: ", msg)
    }
    
    sdk.subscribe(received);
    console.log("Ok, we are subscribed, waiting for messages");
    setTimeout(function(){
        sdk.pauseSubscription();
        console.log("lets pause 3 secs");

        setTimeout(function(){
            sdk.continueSubscription();
            console.log("lets continue");
            setTimeout(function(){
                sdk.deleteSubscription();
                console.log("Closing. Bye bye");
            }, 3000);
        }, 3000);
    }, 3000);

When everything is finished you can delete the subscription. After that, if you invoke again sdk.subscribe() with your ID and DESC you will receive a new one, instead of having the possibility of continuing with your previous subscription. Dont delete the subscription if you want to use it later (tomorrow, the next month, in the year 2024). 

Let's see how the complete html page would be:

.. code-block:: html

    <!DOCTYPE html>
    <html>
    <head>  
        <script type="text/javascript" src="aeonSDK.js"></script>
        <script type="text/javascript" src="config.js"></script>        
        <script type="text/javascript" src="socket.io.js"></script>
    </head>
    <body>

        <label id="subLabel"></label>

        <script type="text/javascript">
            
            var sdk = new AeonSDK(SUB_URL, YOUR_ID , YOUR_DESC);
            
            sdk.subscribe(function(received){
                console.log(received);
                $('#subLabel').append(" "+received.number);
            });
                
            setTimeout(function(){
                sdk.pauseSubscription();
                console.log("lets pause 3 secs");

                setTimeout(function(){
                    sdk.continueSubscription();
                    console.log("lets continue");
                    setTimeout(function(){
                        sdk.deleteSubscription();
                        console.log("Closing. Bye bye");
                    }, 3000);
                }, 3000);
            }, 3000);
        </script>
    </body>
    </html>

Now, you should be able to play with this create, pause, continue, delete depending on the logic of your application. Happy coding.


