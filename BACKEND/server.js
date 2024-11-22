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

app.listen(port ,  () => console.log(`Server running on port ${port}`));