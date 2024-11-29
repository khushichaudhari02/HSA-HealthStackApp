const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose')
const { Hospital } = require("../models/hospital");
const User = require("../models/user");
const Doctor = require("../models/doctor");
const ObjectId = require("mongoose").Types.ObjectId;
const {CreateHospitalRequest}= require('../models/createHospitalRequests');
const HOSPITAL_PER_PAGE = 6;
function getSuperAdminDashboard(req, res, next) {
  res.json({ message: "In Super Admin Routes" });
}
async function createNewHospital(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const hospitalAlreadyExists = await Hospital.findOne({
      name: req.body.hospitalName,
    }).session(session);
    if (hospitalAlreadyExists) {
      const error = new Error("A hospital with this name already exists.");
      error.statusCode = 403;
      throw error;
    }

    const chiefDoctorAlreadyExists = await User.findOne({
      email: req.body.chiefDoctor.email,
    }).session(session);
    if (chiefDoctorAlreadyExists) {
      const error = new Error(
        "A user with the chief doctor's email already exists."
      );
      error.statusCode = 403;
      throw error;
    }

    const user = new User({
      name: req.body.chiefDoctor.name,
      email: req.body.chiefDoctor.email,
      role: "doctor",
    });
    const resultDoctorUserDoc = await user.save({ session });
    if (!resultDoctorUserDoc) {
      const error = new Error("Doctor user document could not be created");
      error.statusCode = 500;
      throw error;
    }

    const chiefDoctor = new Doctor({
      name: req.body.chiefDoctor.name,
      owner: resultDoctorUserDoc._id,
      educationQualification: req.body.chiefDoctor.educationQualification,
      yearOfRegistration: req.body.chiefDoctor.yearOfRegistration,
      stateMedicalCouncil: req.body.chiefDoctor.stateMedicalCouncil,
      registationNumber: req.body.chiefDoctor.registationNumber,
    });
    const savedDoctor = await chiefDoctor.save({ session });
    if (!savedDoctor) {
      const error = new Error("Doctor document could not be created");
      error.statusCode = 500;
      throw error;
    }

    const staff = {
      totalStaff: 1,
      totalAdmins: 0,
      totalNurse: 0,
      totalReceptionist: 0,
      totalDoctors: 1,
      chiefDoctor: savedDoctor._id,
      doctors: [savedDoctor._id],
    };

    const address = new mongoose.mongo.ObjectId(req.body.address._id);

    const hospital = new Hospital({
      name: req.body.hospitalName,
      staff: staff,
      specialty: req.body.hospitalSpecialty,
      service: req.body.hospitalServiceType,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      openHours: req.body.openHours,
      address,
    });
    const savedHospital = await hospital.save({ session });
    if (!savedHospital) {
      const error = new Error("Hospital document could not be created");
      error.statusCode = 500;
      throw error;
    }

    resultDoctorUserDoc.hospital = savedHospital._id;
    const finalDoctorUser = await resultDoctorUserDoc.save({ session });
    if (!finalDoctorUser) {
      const error = new Error(
        "Doctor document could not be updated with hospital id"
      );
      error.statusCode = 500;
      throw error;
    }

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Hospital Created Successfully",
      savedHospital: savedHospital,
      chiefDoctor: savedDoctor,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
}
async function getAllHospitals(req, res, next) {
  // const page = +req.query.page || 1;
  try {
    const hospitalList = await Hospital.find()
      .populate("staff.chiefDoctor")
      .exec();
    const response = [];
    if (!hospitalList) {
      const error = new Error("Could not find the hospital List");
      error.statusCode = 403;
      throw error;
    }
    i = 0;
    for (const hospital of hospitalList) {
      const chiefDoctor = await hospital.staff.chiefDoctor.populate("owner");
      if (!chiefDoctor) {
        const error = new Error("Could not find populate chief doctor");
        error.statusCode = 403;
        throw error;
      }
      response[i] = {
        address: hospital.address,
        specialty: hospital.specialty,
        chiefDoctor: chiefDoctor,
        name: hospital.name,
        openHours: hospital.openHours,
        service: hospital.service,
        hospitalId: hospital._id,
      };
      i++;
    }

    res.json({
      hospitals: response,
    });
  } catch (err) {
    next(err);
  }
}
async function getHospitalById(req, res, next) {
  try{
  const hospitalId = req.params.hId;
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    const error = new Error("Could not find the hospital");
    error.statusCode = 403;
    throw error;
  }

  const chiefDoctor = await Doctor.findById(hospital.staff.chiefDoctor)
    .populate({
      path: "owner",
      select: "-password" // Exclude the password field
  })
    .exec();
  if (!chiefDoctor) {
    const error = new Error("Could not find the chiefDoctor Document");
    error.statusCode = 403;
    throw error;
  }
 
  res.json({
    chiefDoctor: chiefDoctor,
    hospital: hospital,
  });
}catch(err){
  next(err);
}
}
async function updateHospitalDetails(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const hospitalId = req.params.hId;
    const hospital = await Hospital.findById(hospitalId).session(session);
    if (!hospital) {
      const error = new Error("Could not find the hospital");
      error.statusCode = 403;
      throw error;
    }

    const chiefDoctor = await Doctor.findById(hospital.staff.chiefDoctor)
      .populate({
        path: "owner",
        select: "-password", // Exclude the password field
      })
      .session(session)
      .exec();
    if (!chiefDoctor) {
      const error = new Error("Could not find the chiefDoctor Document");
      error.statusCode = 403;
      throw error;
    }

    const chiefDoctorUser = await User.findById(chiefDoctor.owner, {
      password: 0,
    }).session(session);
    if (!chiefDoctorUser) {
      const error = new Error("Could not find the chiefDoctor User document");
      error.statusCode = 403;
      throw error;
    }

    chiefDoctorUser.name = req.body.chiefDoctor.name;
    chiefDoctorUser.email = req.body.chiefDoctor.email;
    await chiefDoctorUser.save({ session });

    chiefDoctor.phoneNumber = req.body.chiefDoctor.phoneNumber;
    chiefDoctor.educationQualification = req.body.chiefDoctor.educationQualification;
    chiefDoctor.yearOfRegistration = req.body.chiefDoctor.yearOfRegistration;
    chiefDoctor.stateMedicalCouncil = req.body.chiefDoctor.stateMedicalCouncil;
    chiefDoctor.registrationNumber = req.body.chiefDoctor.registrationNumber;
    chiefDoctor.name = req.body.chiefDoctor.name;
    await chiefDoctor.save({ session });

    hospital.name = req.body.hospitalName;
    hospital.specialty = req.body.hospitalSpecialty;
    hospital.service = req.body.hospitalServiceType;
    hospital.email = req.body.email;
    hospital.phoneNumber = req.body.phoneNumber;
    hospital.openHours = req.body.openHours;
    hospital.address = {
      state: req.body.address.state,
      city: req.body.address.city,
      district: req.body.address.district,
      postalCode: req.body.address.postalCode,
      landmark: req.body.address.landmark,
      streetAddress: [
        req.body.address.streetAddress1.trim() !== "" ? req.body.address.streetAddress1 : hospital.address.streetAddress[0],
        req.body.address.streetAddress2.trim() !== "" ? req.body.address.streetAddress2 : hospital.address.streetAddress[1],
      ],
    };
    await hospital.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Hospital details updated successfully!",
      hospital,
      chiefDoctorUser,
      chiefDoctor,
      hId: hospital._id,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
}

async function createNewAdmin(req,res,next){
    const hId = req.params.hId;
    // and on the website this will not be visible.
    const session = await mongoose.startSession();
  session.startTransaction();
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    try{
  
   // input validation needs to be studied and handled.
 const userAlreadyExists = await User.findOne({email:req.body.email}).session(session);
   if(userAlreadyExists){
     const error = new Error('A user with this email alrady exists.');
     error.statusCode = 403;
     throw error;
   }
const hashedPw =await bcrypt.hash(req.body.password,12);

  const newUser = new User({
           name:req.body.name,
           email: req.body.email,
           password: hashedPw,
           role: 'admin',
       });

    const savedUser = await newUser.save({session});

       if(!savedUser){
        const error = new Error("User document could not be created");
        error.statusCode = 500;
        throw error;
       }   
       const hospital = await Hospital.findById(hId).session(session);
       hospital.staff.admins.push(savedUser._id);
       hospital.staff.totalAdmins=hospital.staff.admins.length;
       const savedHospital = await hospital.save({session});
   await session.commitTransaction();
    session.endSession();

       res.status(201).json({ message: 'User created!', userId: savedUser._id, user:savedUser,savedHospital:savedHospital});
    }
    catch(err){
    await  session.abortTransaction();
      session.endSession();
      next(err);
    }

}
async function getCreateHospitalRequests(req,res,next){
     
  try{
  
  const createHospitalRequests= await CreateHospitalRequest.find();
  if(!createHospitalRequests){
    const error = new Error('Could not fetch create hospital requests from database');
  
    throw error;
  }
  res.json({
    createHospitalRequests
  })
}catch(err){
  next(err)
}
}
async function  getCHRById(req,res,next){
  const errors = validationResult(req);

  try{
    if(!errors.isEmpty()){
      const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
    
    }
    const createHospitalRequestDetails= await CreateHospitalRequest.findById(req.params.CHRId);
    if(!createHospitalRequestDetails){
      const error = new Error('Could not fetch create hospital  detail requests from database');
    
      throw error;
    }
    res.json({
    CHRDetails:  createHospitalRequestDetails
    })
  }catch(err){
    next(err)
  }
}
module.exports = {
  getSuperAdminDashboard: getSuperAdminDashboard,
  createNewHospital: createNewHospital,
  getAllHospitals: getAllHospitals,
  getHospitalById,
  updateHospitalDetails,
  createNewAdmin,
  getCreateHospitalRequests,
  getCHRById
}
