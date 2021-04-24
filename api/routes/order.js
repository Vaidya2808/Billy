const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (rea, res, next) => {
  Order.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      const response = {
        count: docs.length,
        order: docs.map((doc) => {
          return {
            product: doc.product,
            _id: doc._id,
            productId: doc.productId,
            soldBy: doc.soldBy,
            boughtBy: doc.boughtBy,
            quantity: doc.quantity,
            status: doc.status,
          };
        }),
      };
      if (docs.length == 0) {
        res.status(200).json({
          message: "Empty DB",
        });
      } else {
        res.status(200).json(response);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "No such Order",
        });
      }
      res.status(200).json({
        _id: order._id,
        product: order.product,
        soldBy: order.soldBy,
        boughtBy: order.broughtBy,
        quantity: order.quantity,
        deliveryPerson: order.deliveryPerson,
        phone: order.phone,
        status: order.status,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get list of orders of a user
router.get("/boughtBy/:user", (req, res, next) => {
  Order.find({
    boughtBy: req.params.user,
  })
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length == 0) {
        res.status(200).json({
          message: "No user found",
        });
      } else {
        const response = {
          count: docs.length,
          order: docs.map((doc) => {
            return {
              product: doc.product,
              productId: doc.productId,
              soldBy: doc.soldBy,
              quantity: doc.quantity,
              status: doc.status,
              deliveryPerson: doc.deliveryPerson,
              phone: doc.phone,
              _id: doc._id,
            };
          }),
        };
        res.status(200).json(response);
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Getting list of customers
router.get("/soldBy/:user", (req, res, next) => {
  Order.find({
    soldBy: req.params.user,
  })
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length == 0) {
        res.status(200).json({
          message: "No user found",
        });
      } else {
        const response = {
          count: docs.length,
          order: docs.map((doc) => {
            return {
              product: doc.product,
              productId: doc.productId,
              boughtBy: doc.boughtBy,
              quantity: doc.quantity,
              status: doc.status,
              deliveryPerson: doc.deliveryPerson,
              phone: doc.phone,
              _id: doc._id,
            };
          }),
        };
        res.status(200).json(response);
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Adding a product from customer side
router.post("/", (req, res, next) => {
  const stat = "Order Placed";
  const delivery = "abcd";
  const phone = "0000";
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    product: req.body.product,
    productId: req.body.productId,
    soldBy: req.body.soldBy,
    boughtBy: req.body.boughtBy,
    quantity: req.body.quantity,
  });
  order.status = stat;
  order.deliveryPerson = delivery;
  order.phone = phone;

  Product.findById(order.productId)
    .exec()
    .then((product) => {
      product.quantity = product.quantity - order.quantity;
      product.save().then().catch();
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

// Updating order from Retailer side
router.patch("/update/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(200).json({
          message: "No such order",
        });
      }
      const status = req.body.status;
      const deliveryPerson = req.body.deliveryPerson;
      const phone = req.body.phone;
      order.status = status;
      order.deliveryPerson = deliveryPerson;
      order.phone = phone;

      order.save().then().catch();

      res.status(200).json(order);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Deleting a Product
router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({
    _id: id,
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order Deleted",
      });
    })
    .catch((err) => {
      console.log(500).json({
        error: err,
      });
    });
});

module.exports = router;
