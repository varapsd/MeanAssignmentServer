const express = require("express");
var cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require('dotenv').config()

const { setNewUser, getUserDetails, isEmailExist } = require("./Models/user");
const { setNewCandidate, getAllCandidatesById, RemoveCandidateById, getCandidateById, updateCandidate} = require("./Models/candidate");
//const { PORT, MONGODB_URL} = require("./config/index")
// const bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const url = process.env.MONGODB_URL;
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function (callback) {
    console.log('Successfully connected to MongoDB.');
});

app.get("/",(req,res)=>{
    res.send("Application working !");
});

app.post("/signIn", async(req,res)=>{
    var resObj = {
        isSuccess:false,
        data:null
    }
    var responseDTO = await getUserDetails({email:req.body.email});
    if(responseDTO && bcrypt.compareSync(req.body.password, responseDTO.password)){
        resObj.isSuccess=true;
        resObj.data = responseDTO._id;
    }
    else{
        resObj.isSuccess=false;
        resObj.data = "Invalid credentials";
    }
    res.send(resObj);
})

app.post("/signUp",async (req,res)=>{
    var resObj = {
        isSuccess:false,
        message:""
    }
    var existedEmail = await isEmailExist({email: req.body.email});
    console.log(existedEmail);
    if(existedEmail){
        resObj.isSuccess=false;
        resObj.message="Email Already Exist!";
        res.send(resObj);
    }
    else{
        const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
        var responseDTO = await setNewUser({email:req.body.email,password:hashedPassword,phone:req.body.phone});
        //console.log(hash);
        if(responseDTO.status == 200){
            resObj.isSuccess=true;
            resObj.message="User Added Successfully !!";
            res.send(resObj);
        }
        else{
            resObj.isSuccess = false;
            resObj.message = responseDTO.data;
            res.send(resObj);
        }
    }
})

app.get("/users/:id",async(req,res)=>{
    var responseDTO = await getAllCandidatesById(req.params.id);
    console.log(responseDTO);
    res.send(responseDTO);
})

app.post("/addUser",async(req,res)=>{
    var reqObj = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        DOB: req.body.DOB,
        state: req.body.state,
        age: req.body.age,
        pincode : req.body.pincode
    }
    reqObj.DOB instanceof Date;
    var responseDTO = await setNewCandidate(reqObj);
    console.log(responseDTO);
    res.send(responseDTO);
});

app.get("/getCandidate/:id",async(req,res)=>{
    var result = await getCandidateById(req.params.id);
    res.send(result);
})

app.post("/updateCandidate",async(req,res)=>{
    var result = await updateCandidate(req.body);
    res.send(result);
})
app.post("/deleteCandidate",async(req,res)=>{
    var resObj={
        isSuccess :false,
        message:""
    }
    var responseDTO = await RemoveCandidateById(req.body.id);
    if(responseDTO.deletedCount){
        resObj.isSuccess = true;
        resObj.message = "Candidate Deleted !";
        res.send(resObj);
    } else {
        resObj.isSuccess = false;
        resObj.message = "Failed to delete, Try again !";
        res.send(resObj);
    }
})
const port = process.env.PORT || 8081;
app.listen(port,(err)=>{
    console.log("server lisint at "+port);
})