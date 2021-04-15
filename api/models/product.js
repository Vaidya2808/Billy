const mongoose= require('mongoose');

const productSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    userType : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    quantity : {
        type : Number ,
        required : true,
        default : 1,
    },
    date : {
        type : String,
        default : ""
    }

});

module.exports = mongoose.model('Product' , productSchema);