
console.log("index.js loaded");

$(document).ready(function() {

    $( document ).bind( "mobileinit", function() {
    // Make jQuery Mobile framework configuration changes here
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});

    // *** start of mosquitto settings ***
    /*var wsbroker = "86.119.35.36";  //mqtt websocket enabled broker
    var wsport = 1883 // port for above

    var client = new Paho.MQTT.Client(wsbroker, wsport,
                                    "myclientid_" + parseInt(Math.random() * 100, 10));
        client.onConnectionLost = function (responseObject) {
            console.log("connection lost: " + responseObject.errorMessage);
        };
        client.onMessageArrived = function (message) {
        console.log(message.destinationName, ' -- ', message.payloadString);
    };
    var options = {
        timeout: 3,
        onSuccess: function () {
            console.log("mqtt connected");
            // Connection succeeded; subscribe to our topic, you can add multile lines of these
            client.subscribe('/World', {qos: 1});

            //use the below if you want to publish to a topic on connect
            message = new Paho.MQTT.Message("Hello");
            message.destinationName = "/World";

            client.send(message);

            },
            onFailure: function (message) {
                          console.log("Connection failed: " + message.errorMessage);
        }
    };
                  
    function init() {
    client.connect(options);
    }*/
    // *** end of mosquitto settings ***
                  

                  
// *** start setup for ajax data sending ***
    var globalData = {};
                  
    function addToGlobal(name, value) {
                  globalData[name] = value;
    };
         
                  
// *** end setup for ajax data sending ***
      
                  
                  
// *** Start Sensor Javascript ***
    function onSuccess(result) {
        var resStr = "Result: " + result;
        console.log(resStr);
        //alert(resStr);
        return result;
    }


    function onFailure(err) {
        console.log("onFailure: " + JSON.stringify(err));
        alert("Failure: " + err);
    }
// *** End Sensor Javascript

                  
// *** Start AJAX Temp ***
    $('#tempform').on('click', 'input[type=submit][name=feeling]', function(e) {

        $(this.form).data('clicked', this.value);
    });

    $('#tempform').submit(function (event) {
        event.preventDefault();
        console.log("preventDefault Temp")
                          
        function initNoiseSensor(result) {
            console.log("initNoiseSensor" + result);

        };
                          
        //first value of Noisesensor is always -120.0000 and therby unusable!
        carrier.getAverageNoise(initNoiseSensor, onFailure);
                          

        var form = $(this);

        //Alert for debug
        //alert(form.data('clicked'));
                          
        // add to globalData
        addToGlobal("TemperatureU", form.data('clicked'));

        $.ajax({
            url: form.attr('action'),
            type: form.attr("method"),
            data: { Temperature : form.data('clicked') },
            //Callback function - success if ajax call worked!
            success: function() {
               window.location.href = "#page2";
               },
                    error: function() {
                        window.location.href = "#page2";
               }
        });
    });
// *** End AJAX Temp ***

                  
                  
// *** Start AJAX Light ***
    $('#lightform').submit(function ( event ) {
                           
        event.preventDefault();
        console.log("preventDefault Light")

        var formvalue = $('#rate').val();
        console.log(formvalue);
                           
       function onSuccessLight(result) {
           addToGlobal("LightS", result);
           console.log("LightS" + result);
       
       };
                           
        carrier.getLuminosity(onSuccessLight, onFailure);

        var form = $(this);
                           
       // add to globalData
       addToGlobal("LightU", formvalue);
                           
       function onSuccessNoise(result) {
            addToGlobal("NoiseS", result);
       };
       
       carrier.getAverageNoise(onSuccessNoise, onFailure);

        $.ajax({
                url: form.attr('action'),
                type: form.attr("method"),
                data: { Lighting : formvalue },
                //Callback function - success if ajax call worked!
                success: function() {
                    console.log("success")
                    window.location.href = "#page3";
               },
                error: function() {
                    window.location.href = "#page3";
               }
            });
    });
// *** End AJAX Light ***
           
                  
                  
// *** Start AJAX Noise ***
    $('#noiseform').submit(function ( event ) {
                           
         event.preventDefault();
         console.log("preventDefault Noise")
         
         var formvalue = $('#rate').val();
         console.log(formvalue);
         
         var form = $(this);
        
         // add to globalData
         addToGlobal("NoiseU", formvalue);
        // display globalData in testpage
        //$("#results").append( "<p>" + JSON.stringify(globalData) + "</p>");
        
       $("#results").click( function()
          {
            alert( JSON.stringify(globalData) );
          }
        );
        
         
         /*$.ajax({
                url: form.attr('action'),
                type: form.attr("method"),
                data: { Noise : formvalue },
                //Callback function - success if ajax call worked!
                success: function() {
                    console.log("successful last ajax request with formvalue!")
                },
                error: function() {
                console.log("ajax request not successful");
                }
                
        });*/
                    
                           
        var posting = $.post("http://localhost:3000/request", globalData);
                           
           posting.done(function( data ) {
                    console.log("posting done");
            });
                           
        
                           
        console.log(globalData);

    });
// *** End AJAX Noise ***

          
                  
// *** Start Scale enhancement ***
$(document).on("pagecreate", "#page2", function () {

    var ticks = '<div class="sliderTickmarks "><span>1</span></div>';
    ticks += '<div class="sliderTickmarks "><span>2</span></div>';
    ticks += '<div class="sliderTickmarks "><span>3</span></div>';
    ticks += '<div class="sliderTickmarks "><span>4</span></div>';
    ticks += '<div class="sliderTickmarks "><span>5</span></div>';
    ticks += '<div class="sliderTickmarks "><span>6</span></div>';
    ticks += '<div class="sliderTickmarks "><span>7</span></div>';
    $("#rate ").closest(".ui-slider").find(".ui-slider-track").prepend(ticks);

});
// *** End Scale enhancement ***
                  
                  


                  





});






















// *** Start API***

// Start Accelerometer
// The watch id references the current `watchAcceleration`
/*    var watchID = null;
    // Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);
    // Cordova is ready
    //
    function onDeviceReady() {
        startWatch();
    }
    // Start watching the acceleration
    //
    function startWatch() {
        // Update acceleration every 3 seconds
        var options = { frequency: 100 };

        watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    }
    // Stop watching the acceleration
    //
    function stopWatch() {
        if (watchID) {
            navigator.accelerometer.clearWatch(watchID);
            watchID = null;
        }
    }

    // onSuccess: Get a snapshot of the current acceleration
    //
    function onSuccess(acceleration) {
        var element = document.getElementById('accelerometer');
        element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
                            'Acceleration Y: ' + acceleration.y + '<br />' +
                            'Acceleration Z: ' + acceleration.z + '<br />' +
                            'Timestamp: '      + acceleration.timestamp + '<br />';
    }

    // onError: Failed to get the acceleration
    //
    function onError() {
        alert('onError!');
    }
*/ 
// *** End API***