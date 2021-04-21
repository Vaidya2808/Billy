const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const onlineOrder = require("../models/onlineOrder");

// get specific Order details
router.get("/:orderId", (req, res, next) => {
  onlineOrder
    .findById(req.params.orderId)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "No such order",
        });
      }
      res.status(200).json({
        _id: order._id,
        product: order.product,
        soldBy: order.soldBy,
        boughtBy: order.boughtBy,
        quantity: order.quantity,
        deliveryPerson: order.deliveryPerson,
        phone: order.phone,
        status: order.status,
        date: order.date,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// get orders made by a user
router.get("/getList/:userId", (req, res, next) => {
  onlineOrder
    .find({
      boughtBy: req.params.userId,
    })
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "No such order",
        });
      }
      res.status(200).json({
        _id: order._id,
        product: order.product,
        soldBy: order.soldBy,
        quantity: order.quantity,
        deliveryPerson: order.deliveryPerson,
        phone: order.phone,
        status: order.status,
        date: order.date,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get orders made from a shop
router.get("/getBuyers/:shopId", (req, res, next) => {
  onlineOrder
    .find({
      soldBy: req.params.shopId,
    })
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "No such order",
        });
      }
      res.status(200).json({
        _id: order._id,
        product: order.product,
        boughtBy: order.boughtBy,
        quantity: order.quantity,
        deliveryPerson: order.deliveryPerson,
        phone: order.phone,
        status: order.status,
        date: order.date,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Add an Order
router.post("/", (req, res, next) => {
  const order = new onlineOrder({
    _id: new mongoose.Types.ObjectId(),
    product: req.body.product,
    soldBy: req.body.soldBy,
    boughtBy: req.body.boughtBy,
    quantity: req.body.quantity,
    deliveryPerson: req.body.deliveryPerson,
    phone: req.body.phone,
    status: req.body.status,
    date: req.body.date,
  });
  order
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        order: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Updating an Order
router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  onlineOrder.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Deleting an Order
router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
    onlineOrder.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order removed",
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
