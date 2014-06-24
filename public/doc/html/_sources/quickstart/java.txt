.. include:: ../links.rst

.. _documentation-quickstart-java:

Playing with AEON using Java
*****************************

In this section we will use AEON SDK in order to implement two simple applications (connected through a common channel) with the following behaviour:

- SendNumbers: publish numbers from 0 to 20 with a delay of 1 second between each publication.
- ReceiveNumber: the application is subscribed to receive and printout numbers. Each five seconds the subscription will be paused and then it will continue.
  
This simple demonstration shows:

- How to publish data over a channel.
- How to be subscribed to a channel to receive data.
- How to pause the subscription.
- How to continue the subscription without missing data, that could have been created during the break.
 

First steps
===================

First of all you need to get AEON SDK from the download_ section. Java package is distributed containing the sdk.jar and Socket-io.jar (dependency). 

.. note::

    AEON SDK is licensed as GPLv3
     * If you need to release your software with other (privative) different license, or, please contact us from our web page in section about_ us.
     * As an exception, you can release your software with other opensource/freesoftware license different than GPLv3. 

Create a new Java project including the jars inside the SDK package (aeonSDK.jar and Socket-io.jar). Also, you will have other external dependencies for jersery-client and json. If you use maven in your project include these dependencies:

.. code-block:: xml
		
		<dependency>
			<groupId>com.sun.jersey</groupId>
			<artifactId>jersey-client</artifactId>
			<version>1.18</version>
		</dependency>
		<dependency>
			<groupId>org.json</groupId>
			<artifactId>json</artifactId>
			<version>20090211</version>
		</dependency>
		
		
You are almost done. AEON publication/subscription is based on channels with an url for publication and other for subscription. Follow this :ref:`documentation-tutorial-getchannel` and bring a couple of urls from your first channel (Pub_url and Sub_url).

Hello World (publish)
---------------------

Now that you have your Java project ready with the few dependencies solved, you can begging coding.

Lets start with the simple code to publish some numbers. First of all you need to be connected to an AEON channel using your publish url.

.. code-block:: java

        AEONSDK sdk = new AEONSDK(Config.PUB_URL);

    
And now, lets generate some numbers with a delay of one second. To publish information you need to use a JSON object:

.. code-block:: java

 AEONSDK sdk = new AEONSDK(Config.PUB_URL);
 for (int i = 0; i <= 20; i++) {
    JSONObject data = new JSONObject();
    data.put("number", i);
    sdk.publish(data);
    TimeUnit.SECONDS.sleep(1);
 }
       
Done it!. As you can see, once you are connected to your channel, you can directly invoke publish method passing a JSON as a parameter.



Hello World (subscribe)
---------------------

Now lets create the application to receive the numbers. Again we need to create a connection with our previously created channel (this time, using the subscription url).

.. code-block:: java


        AEONSDK sdk = new AEONSDK(Config.PUB_URL, YOUR_ID = "Tutorial", YOUR_DESC="hello world example");

    
The combination of YOUR_ID and YOUR_DESC (strings) makes your subscriber unique in the iCargo network. Once the SDK is ready you can ask for a subscription. As simple as:

.. code-block:: java

    import net.atos.aeon.AEONInterface;
    import net.atos.aeon.AEONSDK;


    public static void main(String[] args)  {
        AEONSDK sdk = new AEONSDK(Config.PUB_URL, YOUR_ID = "Tutorial", YOUR_DESC="hello world example");
        JSONObject subscription = sdk.subscribe(myCallBack);        
    }


myCallBack parameter is an object of a class implementing the AEONInterface. This is the way that we will manage asynchronous messages produced during the subscription. 

.. code-block:: java

	public static class MyAEONCallbacks implements AEONInterface {
		@Override
		public void deliveredMessage(JSONObject data) {
			System.out.println("Message received" + data.toString());
		}

		@Override
		public void control(JSONObject data) {
			System.out.println("Control Message" + data.toString());
			
		}

	}

Any time a message is published, AEON will notify you through your deliveredMessage method. Control method will be invoked with information such as: "network up/down", "subscription in use", etc. You will find more details about control messages in the :ref:`documentation-sdk-messages`, but for a "hello world" example you dont need to care about it.


Now lets do it a little bit more interesting. With AEON you can pause the communication, messages produced during your break will be received when you decide to continue. 

.. code-block:: java

    import net.atos.aeon.AEONInterface;
    import net.atos.aeon.AEONSDK;


    public static void main(String[] args)  {
        AEONSDK sdk = new AEONSDK(Config.PUB_URL, YOUR_ID = "Tutorial", YOUR_DESC="hello world example");
        JSONObject subscription = sdk.subscribe(myCallBack);      
        TimeUnit.SECONDS.sleep(3);
        sdk.pauseSusbscription();
       	TimeUnit.SECONDS.sleep(3);
       	sdk.continueSubscription();
       	TimeUnit.SECONDS.sleep(3);
       	sdk.deleteSubscription();
    }

When everything is finished you can delete the subscription. After that, if you invoke again sdk.subscribe() with your ID and DESC you will receive a new one, instead of having the possibility of continuing with your previous subscription. Dont delete the subscription if you want to use it later (tomorrow, the next month, in the year 2024). 

Now, you should be able to play with this create, pause, continue, delete depending on the logic of your application. Happy coding.
