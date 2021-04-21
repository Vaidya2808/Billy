const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const Product = require("../models/product");

// Get all products sold by retailers
router.get("/retailer", (req, res, next) => {
  Product.find({
    userType: "retailer",
  })
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length == 0) {
        res.status(200).json({
          message: "Empty Database",
        });
      } else {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              userId: doc.userId,
              userType: doc.userType,
              category: doc.category,
              quantity: doc.quantity,
              date: doc.date,
            };
          }),
        };
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

// Get all products sold by retailers
router.get("/wholesaler", (req, res, next) => {
  Product.find({
    userType: "wholesaler",
  })
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length == 0) {
        res.status(200).json({
          message: "Empty Database",
        });
      } else {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              userId: doc.userId,
              userType: doc.userType,
              category: doc.category,
              quantity: doc.quantity,
              date: doc.date,
            };
          }),
        };
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

// get products by category by retailers
router.get("/retailer/category/:cat", (req, res, next) => {
  const cat = req.params.cat;
  Product.find({
    category: cat,
    userType: "retailer",
  })
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length == 0) {
        res.status(200).json({
          message: "Category Unavailable",
        });
      } else {
        const response = {
          count: docs.length,
          product: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              userId: doc._id,
              quantity: doc._id,
              date: doc.date,
            };
          }),
        };

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

// get products by category by wholesaler
router.get("/wholesaler/category/:cat", (req, res, next) => {
  const cat = req.params.cat;
  Product.find({
    category: cat,
    userType: "wholesaler",
  })
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length == 0) {
        res.status(200).json({
          message: "Category Unavailable",
        });
      } else {
        const response = {
          count: docs.length,
          product: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              userId: doc.userId,
              quantity: doc.quantity,
              date: doc.date,
            };
          }),
        };

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

// Products sold by a particular shop
router.get("/ofShop/:shopId", (req, res, next) => {
  const Id = req.params.shopId;
  Product.find({
    userId: Id,
  })
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length == 0) {
        res.status(200).json({
          message: "Shop currently closed",
        });
      } else {
        const response = {
          count: docs.length,
          product: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              quantity: doc.quantity,
              date: doc.date,
            };
          }),
        };
        console.log(response);
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

// get data of a particular product
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .select("name price quantity category date")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
        });
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Adding a product
router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
    userId: req.body.userId,
    userType: req.body.userType,
    category: req.body.category,
    quantity: req.body.quantity,
    date: req.body.date,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "User details saved successfully",
        userDetails: {
          name: result.name,
          price: result.price,
          _id: result._id,
          userId: result.userId,
          category: result.category,
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

// Updating the product details
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Deleting a Product
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
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
