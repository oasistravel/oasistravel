
const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

router.get('/', async (req, res) => {
  const settings = await Settings.findOne() || await new Settings().save();
  res.json(settings);
});

router.post('/', async (req, res) => {
  const { type, value } = req.body;
  const settings = await Settings.findOne() || await new Settings().save();
  if (!settings[type]) settings[type] = [];
  settings[type].push(value);
  await settings.save();
  res.json(settings);
});

router.delete('/', async (req, res) => {
  const { type, index } = req.body;
  const settings = await Settings.findOne();
  if (settings && settings[type] && settings[type][index]) {
    settings[type].splice(index, 1);
    await settings.save();
  }
  res.json(settings);
});

module.exports = router;
