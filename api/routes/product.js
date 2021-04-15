const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

// Get all products
router.get('/', (req, res, next) => {
    Product.find()
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
                        userId : doc.userId,
                        userType : doc.userType,
                        category : doc.category,
                        quantity : doc.quantity,
                        date : doc.date,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3000/products/" + doc._id
                        }
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

// get data of a particular product
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
    .select("name price quantity category date")
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc)
        {
            res.status(200).json({
                product : doc
            })
        }
        else
        {
            res.status(404).json({
                message : "Product not found"
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});

// Adding a product
router.post('/', (req,res, next)=>{
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        price : req.body.price,
        userId : req.body.userId,
        userType : req.body.userType,
        category : req.body.category,
        quantity : req.body.quantity,
        date : req.body.date
    });

    product.save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message : "User details saved successfully",
            userDetails : {
                name : result.name,
                price : result.price,
                _id: result._id,
                userId : result.userId,
                category : result.category
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

module.exports = router;