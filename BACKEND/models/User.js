const mongoose =require("mongoose");


const UserSchema=new mongoose.Schema({

    email:{
        type:String,
        require:true,
        unique:true,

    },
    password:{
        required:true,
        type:String,

    },
    phone:{
        required:true,
        type:String ,
    },
    firstname : {
        required:true,
        type:String ,

    },
    lastname:{
        required:true ,
        type : String ,
    },
    role:{
        type:String,
        default  : "User"
    },
});

const User = mongoose.model('User' , UserSchema);

module.exports =User ;
