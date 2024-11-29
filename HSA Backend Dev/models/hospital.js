// number of staff , no. of nurse, no. of doctors and their refs will be stored here.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addressSchema = require('../models/address')
const shiftSchema = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});
const staffSchema = new mongoose.Schema({
  totalDoctors: { type: Number, required: true },
  totalNurse: { type: Number,},
  totalAdmins: { type: Number },
  totalReceptionists:{type: Number},
  doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
  chiefDoctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  nurses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Nurse",
    },
  ],
  receptionists: [
    {
      type: Schema.Types.ObjectId,
      ref: "Receptionist",
    },
  ],
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const HospitalSchema = new Schema({
  name:{type:String, required:true},
  staff: staffSchema,
  // totalBeds: {
  //   type: Number,
  // },
  specialty: [
    {
      type: String,
      required: true,
    },
  ],
  service: [{ type: String, required: true }],
  openHours: [
    {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  ],
  address: addressSchema,
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});
const nurseSchema = new Schema({
  name:{
    firstName: { type: String ,required: true},
    middleName: { type: String,} ,
    lastName: { type: String ,required: true}
},
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  age: {
    type: Number,
    
  },
  sex: {
    type: String,
    
  },
  experience: [
    {
      type: String, //eg speciality:['heart','diabetic',]
    },
  ],
  educationQualification: [
    {
      type: String,
    },
  ],
  contact: [{ type: String }],

  address: addressSchema,

});
const receptionistSchema = new Schema({
  name:{
    firstName: { type: String ,required: true},
    middleName: { type: String,} ,
    lastName: { type: String ,required: true}
},
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  age: {
    type: Number,
  },
  sex: {
    type: String,
  },
  experience: [
    {
      type: String, 
    },
  ],
  educationQualification: [
    {
      type: String,
    },
  ],
  contact: [{ type: String }],
  address:addressSchema
});

// const Shift = mongoose.model("Shift", shiftSchema);

const Staff = mongoose.model("Staff", staffSchema);
const Receptionist = mongoose.model("Receptionist", receptionistSchema);
const Nurse = mongoose.model("Nurse", nurseSchema);
const Hospital = mongoose.model("Hospital", HospitalSchema);
module.exports = { shiftSchema, Staff, Hospital, Receptionist, Nurse };
