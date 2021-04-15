const express = require('express');
const app = express(); 
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const morgan = require('morgan');// logger middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extendeed: false}));
app.use(bodyParser.json());  


mongoose.connect('mongodb+srv://Abhimanyu:'+ process.env.MONGO_ATLAS_PW +'@cluster0.yalcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useMongoClient : true
});

mongoose.Promise = global.Promise;

const userRoute = require('./api/routes/user');
const productRoutes = require('./api/routes/product');
const getUserRoute = require('./api/routes/getUser');
const getProdByCat = require('./api/routes/getByCategory');

app.use('/user', userRoute);
app.use('/products', productRoutes); 
app.use('/getUsers', getUserRoute)
app.use('/getProductsByCategory', getProdByCat);


app.get('*' , (req, res, next) => {
    res.send({
        "message" : "Hemlo"
    });
});

// app.use((req, res, next) => {
//     const error = new Error('Not found');
//     error.status = 404;
//     next(error);
// });

// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({
//         error: {
//             message: error.message
//         }
//     });
// });

module.exports = app;