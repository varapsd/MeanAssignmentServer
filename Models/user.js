const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    email:String,
    password:String,
    Phone:Number
});

const User = mongoose.model("user",userSchema);

const setNewUser = async(req,res)=>{
    var newUser = new User({
        email : req.email,
        password : req.password,
        Phone : req.phone
    });
    return newUser.save()
        .then((usr) => {
            return {status:200, data:usr};
        })
        .catch(err => {
            return {status:400, data:err};
        });
    
}

const isEmailExist = async(req)=>{
    return await User.findOne({email:req.email},{__id:1});
}
const getUserDetails = async(req)=>{
    return await User.findOne({email:req.email},{__id:1,password:1})
}

module.exports = {
    setNewUser : setNewUser,
    getUserDetails : getUserDetails,
    isEmailExist: isEmailExist
}