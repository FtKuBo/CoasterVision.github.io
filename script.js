const connectButton = document.getElementById('connectButton');

const upButton = document.getElementById('upB');
const downButton = document.getElementById('downB');
const stopButton = document.getElementById('stopB');

const stateConnected = document.getElementById('stateConnected');
const stateDisconnected = document.getElementById('stateDisconnected');

// Bluetooth Service UUID (Replace with your Arduino's Bluetooth service UUID)
const serviceUUID = '00001234-0000-1000-8000-00805f9b34fb'; // Example UUID

//GATT server on arduino device
var server;

// Function to connect to the Bluetooth device
async function connectToBluetoothDevice() {
    try {
        // Request Bluetooth device with the specified service
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true
            //services: [serviceUUID]
        });

        // Connect to the GATT server on the device
        server = await device.gatt.connect();

        device.addEventListener('gattserverdisconnected', handleDisconnection);


        // Update UI to show connected status
        stateConnected.style.display = 'inline';
        stateDisconnected.style.display = 'none';

        console.log('Connected to device:', device.name);
    } catch (error) {
        console.error('Error connecting to Bluetooth device:', error);
        alert('Connection failed. Please ensure you are using Google Chrome, check that your Arduino is discoverable, and try again.');
    }
}

function handleDisconnection(event) {
    const disconnectedDevice = event.target;
    stateConnected.style.display = 'none';
    stateDisconnected.style.display = 'inline';
    console.log(`Device ${disconnectedDevice.name} disconnected.`);
}

// Function to up Motor
function upMotor(){
    if (stateConnected.style.display == 'none'){
        alert('Please connect your arduino');
        return;
    }
    // do stuff
}

// Function to down Motor
function downMotor(){
    if (stateConnected.style.display == 'none'){
        alert('Please connect your arduino');
        return;
    }
    // do stuff
}

// Function to stop motor
function stopMotor(){
    if (stateConnected.style.display == 'none'){
        alert('Please connect your arduino');
        return;
    }
    // do stuff
}

connectButton.addEventListener('click', connectToBluetoothDevice);
upButton.addEventListener('click', upMotor);
downButton.addEventListener('click', downMotor);
stopButton.addEventListener('click', stopMotor);


//TODO : even when page refreshed if still connected stay connected


