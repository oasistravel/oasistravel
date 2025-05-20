
const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');

router.get('/', async (req, res) => {
  const logs = await ActivityLog.find().sort({ date: -1 });
  res.json(logs);
});

router.post('/', async (req, res) => {
  const log = new ActivityLog(req.body);
  await log.save();
  res.json(log);
});

module.exports = router;
