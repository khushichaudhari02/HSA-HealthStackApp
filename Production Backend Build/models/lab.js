const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addressSchema = require('../models/address');
const labTechnicianSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  offDays: [{
    day:{
        type:Date,
    },
   shift:{
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  }
  }],
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
const labStaffSchema = new mongoose.Schema({
    totalDoctors: { type: Number, required: true},
    totalTechnicians: { type: Number,},
    totalAdmins: { type: Number },
    totalReceptionists:{type: Number},
    doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
    chiefDoctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    Technicians: [
      {
        type: Schema.Types.ObjectId,
        ref: "labTechnician",
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
  
  const labSchema = new Schema({
    name:{type:String, required:true},
    staff: labStaffSchema,
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

module.exports = mongoose.model('LabTechnician',labTechnicianSchema);

module.exports = mongoose.model('Lab',labSchema);
