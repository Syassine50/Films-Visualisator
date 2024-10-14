const mongoose =require("mongoose");


const UserSchema=new mongoose.Schema({
    username:{
        type: String ,
        required: true ,
    },
    email:{
        type:String,
        require:true,
        unique:true,

    },
    password:{
        required:true,
        type:String,

    },
    role:{
        type:String,

    },
});

const User = mongoose.model('User' , UserSchema);

module.exports =User ;
