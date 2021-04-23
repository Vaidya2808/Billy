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
    productImage : {type : String},
    
    userName : {
        type : String,
        required :true
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
    }
    

});

module.exports = mongoose.model('Product' , productSchema);