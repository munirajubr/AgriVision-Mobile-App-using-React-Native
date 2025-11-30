import axios from "axios";
import User from "../models/User.js";

// GET /api/devices/get
export const getDevices = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }

    const user = await User.findOne({ username }).select("devices");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Devices fetched",
      devices: user.devices
    });

  } catch (err) {
    console.error("GET DEVICES ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



// POST /api/devices/add
export const addDevice = async (req, res) => {
  try {
    const { username, deviceId } = req.body;
    if (!username || !deviceId) {
      return res.status(400).json({ message: "username and deviceId are required" });
    }

    // Call the lightweight Flask endpoint that only checks DB collection existence
    let verifyRes;
    try {
      verifyRes = await axios.post(
        // "http://127.0.0.1:10000/api/iot_device_exists",
        "https://ml-flask-model.onrender.com/api/iot_device_exists",
        { device_id: deviceId }
        // no timeout option here => axios will wait until response
      );
    } catch (err) {
      // If Flask responded with non-2xx, axios throws with err.response populated
      if (err.response) {
        if (err.response.status === 404) {
          return res.status(404).json({ message: "Device ID not found in IoT database" });
        }
        // other HTTP error from Flask
        return res.status(502).json({
          message: "IoT server returned an error during verification",
          flask: err.response.data
        });
      }

      // Network / DNS / other error (no response)
      console.error("Flask verification network error:", err.message || err);
      return res.status(503).json({
        message: "Unable to reach IoT server for verification",
        error: err.message || String(err)
      });
    }

    // If we get here, verifyRes is a 2xx response from Flask.
    // Treat existence check: expect verifyRes.data.exists === true
    if (!verifyRes || !verifyRes.data || verifyRes.data.exists !== true) {
      // safety check: treat as not found
      return res.status(404).json({ message: "Device ID not found in IoT database" });
    }

    // Verified → add to user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.devices.includes(deviceId)) {
      user.devices.push(deviceId);
      await user.save();
    }

    return res.status(200).json({
      message: "Device added (verified)",
      devices: user.devices
    });
  } catch (err) {
    console.error("ADD DEVICE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



// DELETE /api/devices/remove
export const removeDevice = async (req, res) => {
  try {
    const { username, deviceId } = req.body;
    if (!username || !deviceId) {
      return res.status(400).json({ message: "username and deviceId are required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.devices = user.devices.filter(d => d !== deviceId);
    await user.save();

    return res.status(200).json({
      message: "Device removed",
      devices: user.devices
    });
  } catch (err) {
    console.error("REMOVE DEVICE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
