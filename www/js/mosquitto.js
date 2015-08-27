var wsbroker = "86.119.31.113";
var wsport = 9001;
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
    //client.subscribe('/World', {qos: 1});
    
    // publish to a topic on connect
    message = new Paho.MQTT.Message("Hello Roooooman!!!!");
    message.destinationName = "/Test";
    client.send(message);
    
},
onFailure: function (message) {
    console.log("Connection failed: " + message.errorMessage);
}
};
function initClient() {
    client.connect(options);
}

function sendTestMessage() {
    message = new Paho.MQTT.Message("Hello Test!!!!");
    message.destinationName = "/Test";
    client.send(message);
    console.log("message sent");
}

function sendTestJSON() {
    jsonString = JSON.stringify(testData);
    message = new Paho.MQTT.Message(jsonString);
    message.destinationName = "/Test";
    client.send(message);
    console.log(testData);

}


