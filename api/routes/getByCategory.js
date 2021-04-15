const express= require('express');
const router = express.Router();

const Product = require('../models/product');

router.get('/:cat', (req, res, next) => {
    const cat = req.params.cat;
    Product.find({
        category : cat
    })
    .exec()
    .then(docs => {
        console.log(docs);
        if(docs.length == 0)
        {
            res.status(200).json({
                message : "Category Unavailable"
            });
        }
        else
        {
            const response = {
                count : docs.length,
                product : docs.map(doc => { 
                    return {
                        name : doc.name,
                        price : doc.price,
                        _id : doc._id,
                        userId : doc._id,
                        quantity : doc._id,
                        date : doc.date
                    }
                })
            }

            res.status(200).json(response);
        }
    })
});

module.exports = router;