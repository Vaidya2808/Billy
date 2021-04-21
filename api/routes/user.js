const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");
const Product = require("../models/product");
const path = require("path");

const multer = require("multer");
// const upload = multer({dest : 'uploads/'})
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
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

// getting a list of all the users
router.get("/", (req, res, next) => {
  User.find()
    .select("name phone userType")
    .exec()
    .then((docs) => {
      console.log(docs);

      const response = {
        count: docs.length,
        user: docs.map((doc) => {
          return {
            name: doc.name,
            phone: doc.phone,
            userType: doc.userType,
            userImage: doc.userImage,
            _id: doc._id,
          };
        }),
      };
      if (docs.length == 0) {
        res.status(200).json({
          message: "Empty DataBase",
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

// Storing the user info in the Database
router.post("/", upload.single("userImage"), (req, res, next) => {
  console.log(req.file);
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    phone: req.body.phone,
    userType: req.body.userType,
    userImage : req.file.path
  });

  user
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "User details saved successfully",
        userDetails: {
          name: result.name,
          userType: result.userType,
          phone: result.phone,
          userImage : result.userImage,
          _id: result._id,
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

// To get list of all retailers
router.get("/retailer", (req, res, next) => {
  User.find({
    userType: "retailer",
  })
    .select("name phone _id")
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length == 0) {
        res.status(200).json({
          message: "No user of this type found",
        });
      } else {
        const response = {
          count: docs.length,
          user: docs.map((doc) => {
            return {
              name: doc.name,
              phone: doc.phone,
              userImage: doc.userImage,
              _id: doc._id,
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

router.get("/wholesaler", (req, res, next) => {
  User.find({
    userType: "wholesaler",
  })
    .select("name phone _id")
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length == 0) {
        res.status(200).json({
          message: "No user of this type found",
        });
      } else {
        const response = {
          count: docs.length,
          user: docs.map((doc) => {
            return {
              name: doc.name,
              phone: doc.phone,
              userImage: doc.userImage,
              _id: doc._id,
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

router.get("/:Id", (req, res, next) => {
  const id = req.params.Id;
  Product.find({
    userId: id,
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
              _id: doc._id,
              productImage: doc.productImage,
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

// Get list of Retailers within a distance
router.get("/retailer/getWithin/:distance/:x/:y", (req, res, next) => {
  const dis = req.params.distance;
  const userList = User.where("location").nearSphere({
    center: [req.params.x, req.params.y],
    maxDistance: dis,
  });

  const users = userList.map((user) => {
    return user.userType === "retailer";
  });

  console.log(users);
  res.status(200).json(users);
});

// Get list of all Wholesalers within a distance
router.get("/wholesaler/getWithin/:distance/:x/:y", (req, res, next) => {
  const dis = req.params.distance;
  const userList = User.where("location").nearSphere({
    center: [req.params.x, req.params.y],
    maxDistance: dis,
  });

  const users = userList.map((user) => {
    return user.userType === "wholesaler";
  });

  console.log(users);
  res.status(200).json(users);
});

// Updating User Information
router.patch("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User Info updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Deleting a User
router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
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
