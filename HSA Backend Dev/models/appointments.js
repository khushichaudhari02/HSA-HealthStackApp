const mongoose = require("mongoose");
const addressSchema = require("./address");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    bookingDateTime:{
      type:Date,
    },
    startTime: {
      type: String, //convert the
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled","rescheduled"],
      default: "pending",
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientName:{
      type:'String'
    },
    doctorName:{
      type:'String'
    },
    doctor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Doctor",
    },
    date: {
      type: String,
      required: true,
    },
    ISTDateString: {
      type: String,
    },
    symptoms:[
      {
        symptom:{type:String},
        duration:{type:String}
      }
    ],
    isConsultationCompleted: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    prescriptions: [
      {
        drug:{
        type: String,
      },
      dosage:{
        type:String
      },
      },
    ],
    testPrescribed: [
      {
        type: String,
        // enum :['blood','urine','x-ray','mri']
      },
    ],
    notes: {
      type: String,
    },
    diagnosis:{
      type:String,
    },
    yearlyAppoitmentCount: {
      type: Number,
    },
    dailyAppoitmentCount: {
      type: Number,
    },
    fees: {
      totalAmount: {
        type: Number,
      },
      // payment:{
      //  method:{
      //   type:String,
      //   enum:['Cash','UPI',"Card"],
      //  } ,
      //  refAccountNumber:{
      //   type:String
      //  }
      // }
      // ,

      
      feesStructure: [
        {
          amount: {
            type: Number,
          },
          feesType: {
            type: String,
            
          },
        },
      ],
    },
    hospitalId:{
      type:Schema.Types.ObjectId,
      ref:'Hospital'
    },
    hospitalAddress:addressSchema,
    hospitalName: {
      type:String
    },
    followUp:{
      type:Schema.Types.ObjectId,
      ref:"Appointment" 
    }
  },
  {
    timestamps: true,
  }
);
const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = {
  Appointment,
  appointmentSchema,
};
