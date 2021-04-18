const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Product = require('../models/product');


// getting a list of all the users
router.get('/', (req, res, next) => {
    User.find()
    .select('name phone userType')
    .exec()
    .then(docs => {
        console.log(docs);

        const response = {
            count : docs.length,
            user : docs.map(doc => {
                return {
                    name : doc.name,
                    phone : doc.phone,
                    userType : doc.userType,
                    _id : doc._id
                }
            })
        }
        if(docs.length == 0)
        {
            res.status(200).json({
                message : "Empty DataBase"
            });
        }
        else 
        {
            res.status(200).json(response);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});

// Storing the user info in the Database
router.post('/', (req,res, next)=>{
    const user = new User({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        phone : req.body.phone,
        userType : req.body.userType
    });

    user.save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message : "User details saved successfully",
            userDetails : {
                name : result.name,
                userType : result.userType,
                phone : result.phone,
                _id: result._id,
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    });        
});



// // Get list of all Users 
// router.get('/', (req, res, next) => {
//     User.find()
//     .exec()
//     .then(docs => {
//         const response = {
//             count : docs.length,
//             users : docs.map(doc => {
//                 return {
//                     name : doc.name,
//                     phone : doc.phone,
//                     userType : doc.userType
//                 }
//             })
//         }
//         console.log(response);
//         res.status(200).json(response);
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error : err
//         })
//     })
// }) 

router.get("/retailer", (req, res, next) => {
    User.find({
        userType : "retailer"
    })
    .select('name phone _id')
    .exec()
    .then(docs => {
        console.log(docs);
        if(docs.length == 0)
        {
            res.status(200).json({
                message : "No user of this type found"
            })
        }
        else{
            const response = {
                count : docs.length,
                user : docs.map(doc => {
                    return {
                       name : doc.name,
                      phone : doc.phone,
                        _id : doc._id
                  }
                })
            }
            res.status(200).json(response);
        }       

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});

router.get("/wholesaler", (req, res, next) => {
    User.find({
        userType : "wholesaler"
    })
    .select('name phone _id')
    .exec()
    .then(docs => {
        console.log(docs);
        if(docs.length == 0)
        {
            res.status(200).json({
                message : "No user of this type found"
            })
        }
        else{
            const response = {
                count : docs.length,
                user : docs.map(doc => {
                    return {
                       name : doc.name,
                      phone : doc.phone,
                        _id : doc._id                        
                  }
                })
            }
            res.status(200).json(response);
        }       

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});

router.get('/:Id', (req, res, next) => {
    const id = req.params.Id;
    Product.find({
        userId : id
    })
    .exec()
    .then(docs => {
        console.log(docs);

        if(docs.length == 0)
        {
            res.status(200).json({
                message : 'Empty Database'
            });
        }
        else
        {
            const response = {
                count : docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        category : doc.category,
                        quantity : doc.quantity,
                        date : doc.date
                 }
             })
            }   
            res.status(200).json(response);
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});


// Get list of Retailers within a distance
router.get('/retailer/getWithin/:distance/:x/:y', (req, res, next) => {
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

module.exports = router;