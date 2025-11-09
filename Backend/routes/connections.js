const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Send Connection Request
router.post('/send/:id', async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.params.id;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver.requests.includes(senderId)) {
      receiver.requests.push(senderId);
      await receiver.save();
    }

    res.json({ msg: "Connection request sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Accept Connection Request
router.post('/accept/:id', async (req, res) => {
  try {
    const userId = req.body.userId; // person accepting
    const senderId = req.params.id; // person who sent

    const user = await User.findById(userId);
    const sender = await User.findById(senderId);

    user.connections.push(senderId);
    sender.connections.push(userId);

    user.requests = user.requests.filter(id => id.toString() !== senderId);

    await user.save();
    await sender.save();

    res.json({ msg: "Connection accepted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get All Users (excluding current)
router.get('/all/:id', async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select("name email connections requests");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
