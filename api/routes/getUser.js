const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
// To get for example all retailers or all Wholesalers

router.get("/:userType", (req, res, next) => {
    const type  = req.params.userType;
    User.find({
        userType : type
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
                        _id : doc._id,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3000/user/" + doc._id
                        }
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

module.exports = router;