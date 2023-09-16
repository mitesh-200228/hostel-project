const mongoose = require("mongoose");

var mongoDBURL = 'mongodb+srv://ravi:ravi123@cluster0.np0vzu3.mongodb.net/'

mongoose.connect(mongoDBURL , {useUnifiedTopology:true , useNewUrlParser:true, useFindAndModify: true});

var dbconnect = mongoose.connection

dbconnect.on('error' , ()=>{
    console.log(`Mongo DB Connection Failed`);
})

dbconnect.on('connected' , ()=>{
    console.log(`Mongo DB Connection Successfull`);
})

module.exports = mongoose