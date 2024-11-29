const mongoose = require("mongoose");
const addressSchema = require("./address");
const Schema = mongoose.Schema;

const createHospitalRequestSchema = new Schema({
 name:{
  type:String,
  required:true
 }, 
 email:{
  type:String,
  required:true
 }
 ,totalBeds: {
    type: Number,
  },
  specialty: [
    {
      type: String,
      // enum: ["Nose Ear Throat", "Diabetes", "Cardiac", "Peadiatric", "general"],
      required: true,
    },
  ],
   service: [{ type: String,
     //enum: ["OPD", "IPD", "ICU", "Surgery","General",'Multi Specialty'] 

   }],
  address: addressSchema,
  phoneNumber: {
    type: String,
    required: true,
  },
  openHours: [
    {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  ],

  chiefDoctor: {
    name: {
      firstName: { type: String, required: true },
      middleName: { type: String },
      lastName: { type: String, required: true },
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default:'doctor'
    },
    yearOfRegistration:{type:String},
    stateMedicalCouncil:{type:String},
    registrationNumber:{type:String},
    educationQualification:[
      {
        type:String
      }
    ]
  },
});


const CreateHospitalRequest = mongoose.model('CreateHospitalRequest',createHospitalRequestSchema);

module.exports= {
    CreateHospitalRequest
}