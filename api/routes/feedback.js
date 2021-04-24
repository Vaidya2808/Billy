const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Feedback = require('../models/feedback');

router.post('/', (req, res, next) =>{
    const feed = new Feedback({
      _id: new mongoose.Types.ObjectId(),
      text: req.body.text,
      customerName: req.body.customerName,
      shopName: req.body.shopName,
    });
    feed
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          feedback: feed,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
});

module.exports = router;