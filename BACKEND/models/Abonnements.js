const mongoose =require("mongoose");


const AbonnementsSchema=new mongoose.Schema({

    name:{
        type:String,
        require:true,
        unique:true,

    },
    duree:{
        required:true,
        type:String,

    },
    prix:{
        required:true,
        type:String ,
    },
});

const Abonnements = mongoose.model('Abonnements' , AbonnementsSchema);

module.exports =Abonnements ;
