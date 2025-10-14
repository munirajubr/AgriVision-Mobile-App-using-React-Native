import Device from '../models/Device.js'; // Use the latest Device model from the canvas

/**
 * @desc Get all devices belonging to the authenticated user
 * @route GET /api/devices
 * @access Private
 */
const getDevices = async (req, res) => {
    try {
        const devices = await Device.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving devices', error: error.message });
    }
};

/**
 * @desc Register a new device
 * @route POST /api/devices
 * @access Private
 */
const createDevice = async (req, res) => {
    const { deviceId, name, type, bluetoothAddress, location } = req.body;

    if (!deviceId || !name || !type) {
        return res.status(400).json({ message: 'Please include deviceId, name, and type' });
    }

    try {
        const newDevice = new Device({
            deviceId,
            name,
            type,
            bluetoothAddress,
            location,
            owner: req.user.id,
        });

        const savedDevice = await newDevice.save();
        res.status(201).json(savedDevice);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: `Device with ID: ${deviceId} or Bluetooth Address already exists.` });
        }
        res.status(500).json({ message: 'Error creating device', error: error.message });
    }
};

/**
 * @desc Get a single device by its ID
 * @route GET /api/devices/:id
 * @access Private (Owner only)
 */
const getDevice = async (req, res) => {
    try {
        const device = await Device.findOne({ _id: req.params.id, owner: req.user.id });

        if (!device) {
            return res.status(404).json({ message: 'Device not found or not owned by user.' });
        }

        res.status(200).json(device);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving device', error: error.message });
    }
};

/**
 * @desc Update device details
 * @route PUT /api/devices/:id
 * @access Private (Owner only)
 */
const updateDevice = async (req, res) => {
    try {
        const device = await Device.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!device) {
            return res.status(404).json({ message: 'Device not found or not owned by user.' });
        }

        res.status(200).json(device);
    } catch (error) {
        res.status(500).json({ message: 'Error updating device', error: error.message });
    }
};

/**
 * @desc Delete a device
 * @route DELETE /api/devices/:id
 * @access Private (Owner only)
 */
const deleteDevice = async (req, res) => {
    try {
        const device = await Device.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

        if (!device) {
            return res.status(404).json({ message: 'Device not found or not owned by user.' });
        }

        res.status(200).json({ message: 'Device removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting device', error: error.message });
    }
};

// --- NEW IoT-SPECIFIC CONTROLLERS ---

/**
 * @desc Save Wi-Fi configuration (SSID/Password) to the database for the device to fetch.
 * This is called by the mobile app during the provisioning process.
 * @route POST /api/devices/:id/wifi
 * @access Private (Owner only)
 */
const setWifiConfig = async (req, res) => {
    const { ssid, password } = req.body;

    if (!ssid || !password) {
        return res.status(400).json({ message: 'Wi-Fi SSID and password are required.' });
    }

    try {
        const device = await Device.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            { 
                $set: { 
                    'wifiConfig.ssid': ssid,
                    'wifiConfig.password': password,
                    'wifiConfig.configuredAt': new Date()
                }
            },
            { new: true, runValidators: true }
        );

        if (!device) {
            return res.status(404).json({ message: 'Device not found or not owned by user.' });
        }

        res.status(200).json({ 
            message: 'Wi-Fi configuration saved successfully. Device can now connect.', 
            wifiConfig: { ssid: device.wifiConfig.ssid } // Avoid sending the password back
        });

    } catch (error) {
        res.status(500).json({ message: 'Error setting Wi-Fi configuration', error: error.message });
    }
};

/**
 * @desc Endpoint for the physical IoT device to send its sensor data and update status.
 * This route bypasses standard user authentication and uses a secret key or device-specific token.
 * NOTE: For production, this MUST use a secure device token (e.g., API Key).
 * @route POST /api/devices/data
 * @access Public (Device API Key required in header/body)
 */
const receiveSensorData = async (req, res) => {
    // Ideally, check for a secret device-specific API key in the header or body
    const deviceApiKey = req.header('X-Device-API-Key') || req.body.deviceApiKey;
    const { deviceId, temperature, humidity, status } = req.body;

    if (!deviceId || typeof temperature === 'undefined' || typeof humidity === 'undefined') {
        return res.status(400).json({ message: 'Missing deviceId, temperature, or humidity data.' });
    }

    // You would validate the deviceApiKey here before proceeding...

    try {
        const device = await Device.findOne({ deviceId });

        if (!device) {
            return res.status(404).json({ message: 'Device not registered.' });
        }

        // Update readings and status
        device.lastReadings.temperature = temperature;
        device.lastReadings.humidity = humidity;
        device.status = status || 'Active'; // Assume active if data is received
        device.lastUpdated = new Date();

        await device.save();

        res.status(200).json({ message: 'Sensor data received and device updated.', deviceId: device.deviceId });
    } catch (error) {
        res.status(500).json({ message: 'Error processing sensor data', error: error.message });
    }
};


export {
    getDevices,
    createDevice,
    getDevice,
    updateDevice,
    deleteDevice,
    setWifiConfig,
    receiveSensorData // Export the new function
};
