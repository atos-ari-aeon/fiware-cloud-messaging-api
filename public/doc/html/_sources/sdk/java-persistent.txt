.. _documentation-sdk-java-persistentsub:

Persistent subscription:
------------------------

What if you want to leave everything and continue who knows when? You can invoke sdk.subscribe method with a previously created subscription (instead of ID and DESC), that you have stored. Deleting subscription, of course, avoid you from using your subscription in the future. 

.. code-block:: java

    import net.atos.aeon.AEONInterface;
    import net.atos.aeon.AEONSDK;


    public static void main(String[] args)  {
        AEONSDK sdk = new AEONSDK(Config.PUB_URL, YOUR_ID = "Tutorial", YOUR_DESC="hello world example");
        JSONObject persistantSubscription = sdk.subscribe(myCallBack);      
        ...
        // you do some stuff and you exit from your application

    }
    ....
    // time pass and one year later...
    ....
    public static void main(String[] args)  {
        // get stored persistantSubscription
        AEONSDK sdk = new AEONSDK(Config.PUB_URL, persistantSubscription); //or just use you previous ID and desc as the first time
        sdk.subscribe(myCallBack);      
        ....
        // you can continue where you leave it...
        // you will receive published messages during that period
    }

