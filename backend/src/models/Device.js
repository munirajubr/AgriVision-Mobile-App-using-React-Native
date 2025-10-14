import mongoose from 'mongoose';

// Define a sub-schema for storing Wi-Fi connection credentials
const WifiConfigSchema = new mongoose.Schema({
    ssid: {
        type: String,
        trim: true,
        required: [true, 'Wi-Fi SSID is required for connectivity.'],
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Wi-Fi password is required for connectivity.'],
    },
    // Timestamp for when the configuration was last updated/set
    configuredAt: {
        type: Date,
        default: Date.now,
    }
}, { _id: false }); // We don't need a separate ID for this sub-document

const DeviceSchema = new mongoose.Schema({
    // --- Core Device Identification and Ownership ---
    deviceId: {
        type: String,
        required: [true, 'A unique device ID is required.'],
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Device name is required.'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    type: {
        type: String,
        required: [true, 'Device type is required.'],
        enum: ['Sensor', 'Actuator', 'Gateway', 'Other'],
        default: 'Sensor'
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: true,
    },

    // --- Connectivity Details (Static Config) ---
    bluetoothAddress: {
        type: String,
        trim: true,
        unique: true,
        sparse: true, // Allows null values, only enforces uniqueness for non-null values
        default: null,
        // Example validation for standard MAC address format: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
    },
    // Store Wi-Fi credentials used by the device for internet connection
    wifiConfig: {
        type: WifiConfigSchema,
        default: {} // Default to an empty object
    },

    // --- Dynamic Status and Sensor Readings (Needs to be updated frequently) ---
    status: {
        type: String,
        enum: ['Active', 'Offline', 'Error', 'Maintenance'],
        default: 'Offline'
    },
    location: {
        type: String,
        trim: true,
        default: 'Unknown Location'
    },
    // Sensor readings - stored as a single object for easy real-time update
    lastReadings: {
        temperature: { type: Number, default: null },
        humidity: { type: Number, default: null },
        // You can add more sensor data here (e.g., pressure, light, battery)
    },
    // A URL/reference to an image of the device or its location (e.g., from Cloudinary)
    imageUrl: {
        type: String,
        trim: true,
        default: null
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create an index for fast lookups by owner and deviceId
DeviceSchema.index({ owner: 1, deviceId: 1 });

const Device = mongoose.model('Device', DeviceSchema);

export default Device;
