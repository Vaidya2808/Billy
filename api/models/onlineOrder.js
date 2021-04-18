const mongoose = require('mongoose');

const onlineOrderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    },
    soldBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    boughtBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    quantity : {
        type : Number,
        default : 1
    },
    deliveryPerson : {
        type : String,
        required : true
    },
    phone : {
        type : String
    },
    status : {
        type : String,
    },
    date : {
        type : String,
        default : ""
    }
});

module.exports = mongoose.model('onlineOrder', onlineOrderSchema);