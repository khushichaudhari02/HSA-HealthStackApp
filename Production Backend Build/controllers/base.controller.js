const {CreateHospitalRequest} = require("../models/createHospitalRequests");
const {validationResult}= require('express-validator');
async function postContactForm(req,res,next){
    const errors= validationResult(req);
try{
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
    const createHospitalRequest = new CreateHospitalRequest({
        totalBeds: req.body.totalBeds, // provide the total number of beds
        specialty: req.body.hospitalSpecialty, // map the names of hospital specialties
        service: req.body.hospitalService, // map the names of hospital services
        address: req.body.address,
        name:req.body.hospitalName,
        email:req.body.email,
        phoneNumber: req.body.phoneNumber, // provide the hospital phone number
        openHours:req.body.openHours,// map the open hours

        chiefDoctor:req.body.chiefDoctor,
    })
    createHospitalRequest.save();
    if(!createHospitalRequest){
        const error= new Error("Could not create new hospital document")
        throw error;
    }
    res.status(200).json({
        message:"Send Contact Form success",
        success:true
    })
}catch(error){
next(error)
}
}
module.exports={
    postContactForm:postContactForm
}