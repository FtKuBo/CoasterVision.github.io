const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');
const upButton = document.getElementById('upB');
const downButton = document.getElementById('downB');
const stopButton = document.getElementById('stopB');
const stateConnected = document.getElementById('stateConnected');
const stateDisconnected = document.getElementById('stateDisconnected');
const stateNotAvailable = document.getElementById('stateNotAvailable');

//Define BLE Device Specs
var deviceName ='ESP32';
var bleService = '19b10000-e8f2-537e-4f6c-d104768a1214';
var motorCharacteristic = '19b10002-e8f2-537e-4f6c-d104768a1214';

//Global Variables to Handle Bluetooth
var bleServer;
var bleServiceFound;

connectButton.addEventListener('click', (event) => {
    if (isWebBluetoothEnabled()){
        connectToDevice();
    }
});
disconnectButton.addEventListener('click', disconnectDevice);

upButton.addEventListener('click', () => writeOnCharacteristic(2));
downButton.addEventListener('click', () => writeOnCharacteristic(1));
stopButton.addEventListener('click', () => writeOnCharacteristic(0));

function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        console.log('Web Bluetooth API is not available in this browser!');
        window.alert('Service not available in this browser! Ensure that you are using Google Chrome.')
        stateNotAvailable.style.display = "block";
        stateConnected.style.display = "none";
        stateDisconnected.style.display = "none";
        return false
    }
    console.log('Web Bluetooth API supported in this browser.');
    return true
}

function connectToDevice(){
    console.log('Initializing Bluetooth...');
    navigator.bluetooth.requestDevice({
        filters: [{name: deviceName}],
        optionalServices: [bleService]
    })
    .then(device => {
        console.log('Device Selected:', device.name);
        device.addEventListener('gattservicedisconnected', onDisconnected);
        return device.gatt.connect();
    })
    .then(gattServer =>{
        bleServer = gattServer;
        console.log("Connected to GATT Server");
        return bleServer.getPrimaryService(bleService);
    })
    .then(service => {
        bleServiceFound = service;
        console.log("Service discovered:", service);
        stateNotAvailable.style.display = "none";
        stateConnected.style.display = "block";
        stateDisconnected.style.display = "none";
    })
    .catch(error => {
        console.log('Error: ', error);
        window.alert("Connection Error: Ensure that you are using Google Chrome as your browser and that the Arduino device is accessible.")
        stateNotAvailable.style.display = "none";
        stateConnected.style.display = "none";
        stateDisconnected.style.display = "block";
    })
}

function onDisconnected(event){
    console.log('Device Disconnected:', event.target.device.name);
    stateNotAvailable.style.display = "none";
    stateConnected.style.display = "none";
    stateDisconnected.style.display = "block";

    connectToDevice();
}

function writeOnCharacteristic(value){
    if (bleServer && bleServer.connected) {
        bleServiceFound.getCharacteristic(motorCharacteristic)
        .then(characteristic => {
            console.log("Found the Motor characteristic: ", characteristic.uuid);
            const data = new Uint8Array([value]);
            return characteristic.writeValue(data);
        })
        .then(() => {
            console.log("Value written to Motorcharacteristic:", value);
        })
        .catch(error => {
            console.error("Error writing to the Motor characteristic: ", error);
            window.alert('Connection Successful: The Arduino device has been connected successfully.')
        });
    } else {
        stateNotAvailable.style.display = "none";
        stateConnected.style.display = "none";
        stateDisconnected.style.display = "block";
        console.error ("Bluetooth is not connected. Cannot write to characteristic.")
        window.alert("Bluetooth is not connected. Cannot write to characteristic. \n Connect to BLE first!")
    }
}

function disconnectDevice() {
    console.log("Disconnect Device.");
    if (bleServer && bleServer.connected) {
        try{
            bleServer.disconnect();
            console.log("Device Disconnected");
            stateNotAvailable.style.display = "none";
            stateConnected.style.display = "none";
            stateDisconnected.style.display = "block";
        }
        catch(e){
            console.log("An error occurred:", e);
        };
    } else {
        stateNotAvailable.style.display = "none";
        stateConnected.style.display = "none";
        stateDisconnected.style.display = "block";
        console.error("Bluetooth is not connected.");
        window.alert("Bluetooth is not connected.")
    }
}