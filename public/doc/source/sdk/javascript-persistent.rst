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
    
    sdk = new AeonSDK(config.SUB_URL, config.YOUR_ID , config.YOUR_DESC);
    sdk.subscribe(control, received);

    ....
    // time pass and one year later...
    ....
    
    // get stored persistantSubscription
    sdk = new AeonSDK(config.SUB_URL, persistantSubscription);
    sdk.subscribe(control, received);

    // you can continue where you leave it...

