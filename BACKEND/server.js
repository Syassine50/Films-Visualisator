const express = require("express");
const mongoose= require("mongoose");
const config = require("config");
const cors = require("cors")
const app = express();
const UserRouter =require('./routes/api/users')
const filmRouter=require ('./routes/api/films')
const AbonnRouter=require ('./routes/api/abonnements')
const CategorieRouter = require('./routes/api/categories')
const PayementRouter=require('./routes/api/payaments')
const path = require("path");
const Payment = require("./models/Payement");
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());

const mongo_url=config.get("mongo_url");
mongoose.set('strictQuery',true);
mongoose
    .connect(mongo_url)
    .then(()=> console.log("MongoDB connected ..."))
    .catch((err) => console.log(err));

app.use('/api/users', UserRouter);
app.use('/api/films', filmRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.mp4')) {
            res.set('Content-Type', 'video/mp4');
        }
    }

}));
app.use('/api/categorie', CategorieRouter);
app.use('/api/abonnement', AbonnRouter);
app.use('/api/payment' , PayementRouter);

// async function findPayments() {
//     try {
//         const findResult = await Payment.find({
//             utilisateurId: "aaa"
//         });
//
//         for (const doc of findResult) {
//             console.log(doc);
//         }
//     } catch (error) {
//         console.error("Erreur lors de la recherche des paiements :", error);
//     }
// }

// async function  findPayments() {
//     try {
//         const findResult = await Payment.find({
//             utilisateurId: "aaa"
//         });
//
//         for (const doc of findResult) {
//             console.log(doc)
//             dateNow = new Date() ;
//             if( doc.dateExpirationAbon < dateNow ){
//                 continue;
//             }
//             else{
//                 bool=true ;
//
//                 break ;
//             }
//
//
//
//         }
//         console.log(bool);
//     } catch (error) {
//         console.error("Erreur lors de la recherche des paiements :", error);
//     }
// }

async function findPayments() {
    try {
        const findResult = await Payment.find({
            utilisateurId: "aaa"
        });

        for (const doc of findResult) {
            const dateNow = new Date();
            if (doc.dateExpirationAbon >= dateNow) {
                return true; // Active subscription found
            }
        }

        return false; // No active subscription found
    } catch (error) {
        console.error("Erreur lors de la recherche des paiements :", error);
        return false; // Return false in case of error
    }
}

// Appelez la fonction // true or false
async function checkSubscription() {
    const hasActiveSubscription = await findPayments();
    console.log(hasActiveSubscription);
}

checkSubscription()

app.listen(port ,  () => console.log(`Server running on port ${port}`));