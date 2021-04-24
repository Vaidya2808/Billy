const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    product : {
        type : String,
        ref : 'Product'
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    soldBy : {
        type : String
    },
    boughtBy : {
        type : String
    },
    quantity : {
        type: Number
    },
    deliveryPerson : {
        type : String
    },
    phone : {
        type : String
    },
    status : {
        type : String
    }

});

module.exports = mongoose.model('Order', orderSchema);