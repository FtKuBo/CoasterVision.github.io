// Connect to Bluetooth (make sure you have a Bluetooth-enabled computer)
const connectButton = document.getElementById('connectButton');
const upButton = document.getElementById('upB');
const downButton = document.getElementById('downB');
const stopButton = document.getElementById('stopB');

const stateConnected = document.getElementById('stateConnected');
const stateDisconnected = document.getElementById('stateDisconnected');

// Bluetooth device variable
let btDevice;
let btSerialPort;

connectButton.onclick = async function connectToBluetoothDevice() {
  try {
    // Request Bluetooth device
    btDevice = await navigator.bluetooth.requestDevice({
      filters: [{ name: 'HC-05' }],  // Match the name of the HC-05 Bluetooth device
      acceptAllDevices: true,
      optionalServices: ['00001101-0000-1000-8000-00805f9b34fb']  // Serial Port Profile UUID
    });

    const server = await btDevice.gatt.connect();
    console.log('Connected to device:', btDevice.name);

    stateConnected.style.display = 'inline';
    stateDisconnected.style.display = 'none';

    // Open Bluetooth Serial Port (using Web Bluetooth API, or Node.js serial API)
    btSerialPort = await btDevice.gatt.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');
    const characteristic = await btSerialPort.getCharacteristic('00001101-0000-1000-8000-00805f9b34fb');

  } catch (error) {
    console.error('Error connecting to Bluetooth device:', error);
    alert('Connection failed. Please ensure you are using Google Chrome and try again.');
  }
}

// Function to send command to Arduino (e.g., U, D, or S)
async function sendCommand(command) {
  try {
    const encoder = new TextEncoder();
    await btSerialPort.writeValue(encoder.encode(command));
    console.log(`Sent command: ${command}`);
  } catch (error) {
    console.error('Error sending command:', error);
  }
}

upButton.onclick = function() {
  if (stateConnected.style.display == 'none') {
    alert('Please connect your Arduino');
    return;
  }
  sendCommand('U');  // Send 'U' to move motor up
}

downButton.onclick = function() {
  if (stateConnected.style.display == 'none') {
    alert('Please connect your Arduino');
    return;
  }
  sendCommand('D');  // Send 'D' to move motor down
}

stopButton.onclick = function() {
  if (stateConnected.style.display == 'none') {
    alert('Please connect your Arduino');
    return;
  }
  sendCommand('S');  // Send 'S' to stop motor
}
