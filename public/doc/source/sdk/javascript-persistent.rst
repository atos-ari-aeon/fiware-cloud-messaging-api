.. _documentation-sdk-javascript-persistentsub:

Persistent subscription:
------------------------

What if you want to leave everything and continue who knows when? You can invoke sdk.subscribe method with a previously created subscription that you have stored. Deleting subscription, of course, avoid you from using your subscription in the future. 


.. code-block:: javascript

    //consider as pseudo-code
    
    function control(msg){
        if (msg.code == 250){ //you have been subscribed
            var persistantSubscription = sdk.getSubscription();
            // store the persistantSubscription to be used in the future
        }
    }
    
    var subscriptionData = { "id": config.YOUR_ID, "desc": config.YOUR_DESC};
    sdk = new AeonSDK(config.SUB_URL, subscriptionData);

    sdk.subscribe(control, received);

    ....
    // time pass and one year later...
    ....
    
    // get stored persistantSubscription
    sdk = new AeonSDK(config.SUB_URL, persistantSubscription); //or just use you previous ID and desc as the first time
    sdk.subscribe(control, received);

    // you can continue where you leave it
    // you will receive published messages during that period

