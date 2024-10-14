const express = require("express");
const mongoose= require("mongoose");
const config = require("config");
const cors = require("cors")
const app = express();
const UserRouter =require('./routes/api/users')

app.use(express.json());
app.use(cors());

const mongo_url=config.get("mongo_url");
mongoose.set('strictQuery',true);
mongoose
    .connect(mongo_url)
    .then(()=> console.log("MongoDB connected ..."))
    .catch((err) => console.log(err));

app.use('/api/users', UserRouter)

const port =process.env.PORT || 3001 ;






const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter)



app.listen(port ,  () => console.log(`Server running on port ${port}`));