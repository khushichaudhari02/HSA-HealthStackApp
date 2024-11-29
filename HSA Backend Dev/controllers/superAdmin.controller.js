const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
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
  // 2/3/2024
  //first create a address and chief doctor and then pass their _id in the staffSchema object and
  // then create a hospital object and then add the staff, and address and open hours.
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    // for(let shift of req.body.openHours){
    //     console.log(typeof shift.start);
    //     console.log(shift.start);
    //     console.log( shift.start.split(":"));
    //  }
    const hospitalAlreadyExists = await Hospital.findOne({
      name: req.body.hospitalName,
    });

    if (hospitalAlreadyExists) {
      console.log(req.body.hospitalName);
      const error = new Error("A hospital with this name alrady exists.");
      error.statusCode = 403;
      throw error;
    }
    const chiefDoctorAlreadyExists = await User.findOne({
      email: req.body.chiefDoctor.email,
    });
    if (chiefDoctorAlreadyExists) {
      const error = new Error(
        "A user with the chief doctor's email alrady exists."
      );
      error.statusCode = 403;
      throw error;
    }
    const user = new User({
      name: req.body.chiefDoctor.name,
      email: req.body.chiefDoctor.email,
      role: "doctor",
    });
    const resultDoctorUserDoc = await user.save();
    if (!resultDoctorUserDoc) {
      //server error
      const error = new Error("doctor user document could not be created");
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
    const savedDoctor = await chiefDoctor.save();
    if (!savedDoctor) {
      //server error
      const error = new Error("Doctor document could not be created");
      error.statusCode = 500;
      throw error;
    }
    const staff = {
      totalStaff:1,
      totalAdmins:0,
      totalNurse:0,
      totalReceptionist:0,
      totalDoctors: 1,
      chiefDoctor: savedDoctor._id,
      doctors: [savedDoctor._id],
    };
    // const savedStaff = await staff.save();
    // if (!savedStaff) {
    //   const error = new Error("Staff document could not be created");
    //   error.statusCode = 500;
    //   throw error;
    // }
    const openHours = req.body.openHours;

    // let oHours = convertOpenHours(openHours);

    const address = {
      state: req.body.address.state,
      district: req.body.address.district,
      city: req.body.address.city,
      landmark: req.body.address.landmark,
      postalCode: req.body.address.postalCode,
      streetAddress: [
        req.body.address.streetAddress1,
        req.body.address.streetAddress2,
      ],
    };
    // const savedAddress = await address.save();
    // if (!savedAddress) {
    //   const error = new Error("Address document could not be created");
    //   error.statusCode = 500;
    //   throw error;
    // }
    const hospital = new Hospital({
      name: req.body.hospitalName,
      staff: staff,
      specialty: req.body.hospitalSpecialty,
      service: req.body.hospitalServiceType,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      openHours: openHours,
      address: address,
    });
    const savedHospital = await hospital.save();
    if (!savedHospital) {
      const error = new Error("Hospital document could not be created");
      error.statusCode = 500;
      throw error;
    }
    resultDoctorUserDoc.hospital = savedHospital._id;
    const finalDoctorUser = await resultDoctorUserDoc.save();
    if (!finalDoctorUser) {
      const error = new Error(
        "Doctor document could not be updated with hospital id"
      );
      error.statusCode = 500;
      throw error;
    }
    res.json({
      message: "Hospital Created Successfully",
      savedHospital: savedHospital,
      chiefDoctor: savedDoctor,
    });
  } catch (err) {
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
async function updateHospitalDetails(req,res,next){
      const errors = validationResult(req);
      try{
      if(!errors.isEmpty()){
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
    
      const hospital = await Hospital.findById(req.params.hId);
      if(!hospital){
        const error = new Error("Could not find the hospital");
    error.statusCode = 403;
    throw error;
      }
      // const address = await Address.findById(hospital.address);
      // if(!address){
      //   const error = new Error("Could not find the address document");
      //   error.statusCode = 403;
      //   throw error;
      // }
      const chiefDoctor= await Doctor.findById(hospital.staff.chiefDoctor).populate({path:'owner',select:'-password'}).exec();
      if(!chiefDoctor){
        const error = new Error("Could not find the chiefDoctor document");
        error.statusCode = 403;
        throw error;
      }
      // console.log(address);
      const chiefDoctorUser= await User.findById(chiefDoctor.owner,{password:0});
      if(!chiefDoctorUser){
        const error = new Error("Could not find the chiefDoctor User document");
        error.statusCode = 403;
        throw error;
      }

      // const addressUpdateResponse = await address.save();
      // if(!addressUpdateResponse){
      //   const error = new Error("Hospital Address document could not be updated");
      //   error.statusCode = 500;
      //   throw error;
      // }
     
      chiefDoctorUser.name=req.body.chiefDoctor.name;
      chiefDoctorUser.email = req.body.chiefDoctor.email;
      const chiefDoctorUserUpdateResponse = await chiefDoctorUser.save();
      if(!chiefDoctorUserUpdateResponse){
        const error = new Error("Chief Doctor User document could not be updated");
        error.statusCode = 500;
        throw error;
      }
      chiefDoctor.phoneNumber = req.body.chiefDoctor.phoneNumber;
      chiefDoctor.educationQualification= req.body.chiefDoctor.educationQualification;
      chiefDoctor.yearOfRegistration= req.body.chiefDoctor.yearOfRegistration;
      chiefDoctor.stateMedicalCouncil= req.body.chiefDoctor.stateMedicalCouncil;
      chiefDoctor.registrationNumber= req.body.chiefDoctor.registrationNumber;
      chiefDoctor.name= req.body.chiefDoctor.name;
      const chiefDoctorUpdateResponse = await chiefDoctor.save();
      if(!chiefDoctorUpdateResponse){
        const error = new Error("Chief Doctor document could not be updated");
        error.statusCode = 500;
        throw error;
      }
      hospital.name = req.body.hospitalName;
      hospital.specialty= req.body.hospitalSpecialty;
      hospital.service= req.body.hospitalServiceType;
      hospital.email= req.body.email;
      hospital.phoneNumber= req.body.phoneNumber;
      hospital.openHours= req.body.openHours;
      hospital.address =
        {  state :req.body.address.state,
          city :req.body.address.city,
         district :req.body.address.district,
          postalCode:req.body.address.postalCode,
        landmark:req.body.address.landmark,
          streetAddress :[
            req.body.address.streetAddress1.trim() !=='' ? req.body.address.streetAddress1 : address.streetAddress[0],
            req.body.address.streetAddress2.trim() !=='' ? req.body.address.streetAddress2 : address.streetAddress[0],
          ],
        };
    const hospitalUpdateResponse = await hospital.save();
    if(!hospitalUpdateResponse){
      const error = new Error("Hospital document could not be updated");
      error.statusCode = 500;
      throw error;
    }

    res.json({message:"Hospital details updated successfull!",hospital:hospitalUpdateResponse,chiefDoctorUser:chiefDoctorUserUpdateResponse ,chiefDoctor:chiefDoctorUpdateResponse,hId:hospital._id});
  }catch(err){
    next(err);
  }
}
async function createNewAdmin(req,res,next){
    // and on the website this will not be visible.
  const hId = req.params.hId;
    const errors = validationResult(req);
    try{
   if(!errors.isEmpty()){
     const error = new Error('Validation failed.');
   error.statusCode = 422;
   error.data = errors.array();
   throw error;
   
   }
  
   // input validation needs to be studied and handled.
 const userAlreadyExists = await User.findOne({email:req.body.email});
   if(userAlreadyExists){
     const error = new Error('A user with this email alrady exists.');
     error.statusCode = 403;
     throw error;
   }
   console.log(req.body.password);
const hashedPw =await bcrypt.hash(req.body.password,12);

  const newUser = new User({
           name:req.body.name,
           email: req.body.email,
           password: hashedPw,
           role: 'admin',
       });

    const savedUser = await newUser.save();

       if(!savedUser){
        const error = new Error("User document could not be created");
        error.statusCode = 500;
        throw error;
       }   
       const hospital = await Hospital.findById(hId);
       hospital.staff.admins.push(savedUser._id);
       hospital.staff.totalAdmins=hospital.staff.admins.length;
       const savedHospital = await hospital.save();
       
    // let savedDoc;
    //  switch(result.role){
    //   case 'admin':
    //     break;
    //   case 'doctor':
    //     const newDoctor = new Doctor({
    //       owner: result._id,
    //       educationQualification: req.body.educationQualification,
    //       // yearOfRegistration: req.body.yearOfRegistration,
    //       // stateMedicalCouncil: req.body.stateMedicalCouncil,
    //       // registationNumber: req.body.registationNumber,
    //     });
    //      savedDoc = await newDoctor.save();
    //     if (!savedDoc) {
    //       //server error
    //       const error = new Error("Doctor document could not be created");
    //       error.statusCode = 500;
    //       throw error;
    //     }
    //     break;
    //     case 'nurse':
    //       const newNurse = new Nurse({
    //         owner: result._id,
    //         educationQualification: req.body.educationQualification,
    //         // yearOfRegistration: req.body.yearOfRegistration,
    //         // stateMedicalCouncil: req.body.stateMedicalCouncil,
    //         // registationNumber: req.body.registationNumber,
    //       });
    //        savedDoc = await newNurse.save();
    //       if (!savedDoc) {
    //         //server error
    //         const error = new Error("Nurse document could not be created");
    //         error.statusCode = 500;
    //         throw error;
    //       }
    //       break;
    //       case 'receptionist':
    //         const newReceptionist = new Receptionist({
    //           owner: result._id,
    //           educationQualification: req.body.educationQualification,
    //           // yearOfRegistration: req.body.yearOfRegistration,
    //           // stateMedicalCouncil: req.body.stateMedicalCouncil,
    //           // registationNumber: req.body.registationNumber,
    //         });
    //         savedDoc = await newReceptionist.save();
    //         if (!savedDoc) {
    //           //server error
    //           const error = new Error("Receptionist document could not be created");
    //           error.statusCode = 500;
    //           throw error;
    //         }
    //         break;
    //  }

       res.status(201).json({ message: 'User created!', userId: savedUser._id, user:savedUser,savedHospital:savedHospital});
    }catch(err){
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
};
