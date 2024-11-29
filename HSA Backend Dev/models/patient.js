const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addressSchema= require("../models/address")
const patientSchema = new Schema({ name:{
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
  height:{
    foot:{
      type:Number,
    },
    inches:{
      type:Number
    },
  },
  weight:{
    type:Number,
  }
  ,
  phoneNumber: { type: String, required: true },
  Appointments: [
    {
      type: Schema.Types.ObjectId, //the doctor name will be in the appointments as reference.
      ref: "Appointment",
    }
  ],
  // futureAppointments:[
  //   {
  //     type: Schema.Types.ObjectId, //the doctor name will be in the appointments as reference.
  //     ref: "Appointment",
  //   },
  // ],
  LabReports:[
    {
      type:Schema.Types.ObjectId,
      ref:"LabReport"
    }
  ],
  address: addressSchema
});
module.exports = mongoose.model("Patient", patientSchema);
