const res = require("express/lib/response");
const mongoose = require("mongoose");
const candidateSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    name : String,
    email: String,
    DOB:Date,
    state:Number,
    age:Number,
    pincode : Number,
});

const Candidate = mongoose.model("candidate",candidateSchema);

const setNewCandidate = async(req)=>{
    var newCandidate = new Candidate({
        userId:req.id,
        name:req.name,
        DOB:req.DOB,
        email: req.email,
        state:req.state,
        age:req.age,
        pincode:req.pincode
    })
    return newCandidate.save()
        .then(validCandidate => {
            return { status: 200, data: validCandidate};
        })
        .catch(err =>{
            return { status: 400, data: err}
        });
}

const getAllCandidatesById = async(id)=>{
    return await Candidate.find({userId: id},{name:1, DOB: 1, email:1})
}

const getCandidateById = async(id)=>{
    return await Candidate.findById(id);
}

const updateCandidate = async(req)=>{
    var validCandidate = await Candidate.findById(req._id);
    if(validCandidate){
        validCandidate.name = req.name;
        validCandidate.DOB = req.DOB;
        validCandidate.email = req.email;
        validCandidate.state = req.state;
        validCandidate.age = req.age;
        validCandidate.pincode = req.pincode;
        return validCandidate.save()
            .then(data =>{
                return {isSuccess:true, data:data};
            })
            .catch(err =>{
                return {isSuccess:false, data:err};
            })
    }
}
const RemoveCandidateById = async(id)=>{
    return await Candidate.deleteOne({_id : id});
}
module.exports = {
    setNewCandidate: setNewCandidate,
    getAllCandidatesById: getAllCandidatesById,
    RemoveCandidateById: RemoveCandidateById,
    getCandidateById: getCandidateById,
    updateCandidate: updateCandidate
}