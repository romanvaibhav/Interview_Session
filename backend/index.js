const express=require("express");
const mongoose=require("mongoose")
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userLoginCred=require("./routes/user")
const assignmentCred=require("./routes/assignment");
const sessionCrud=require("./routes/session");
const challengeSession=require("./routes/challenge");

const app=express();
const PORT=8001;
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 

// Middleware
// console.log(process.env.mongooseString);
mongoose.connect(process.env.mongooseString).then(()=>{
       console.log("MongoDb is Connected Succesfully");
    })
    .catch(error => {
       console.log("MongoDb connection error:", error);
    });

app.use(cors({
      origin: "http://localhost:4200",
      credentials: true 
  }));      

app.use("/",userLoginCred);
app.use("/user",assignmentCred);
app.use("/session",sessionCrud);
app.use("/challenge",challengeSession);

app.listen(PORT,()=>console.log(`Server started at PORT: ${PORT}`));