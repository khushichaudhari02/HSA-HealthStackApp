// to store doctor info.
// this will ref a schedule object which will ref the doctorSchedule
const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('../models/address');
const {shiftSchema} = require('../models/hospital')
const doctorSchema = new Schema({
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
      hospital:{
        type:Schema.Types.ObjectId,
        ref:"Hospital",
      },
      age: {
        type: Number,
       
      },
      sex: {
        type: String,
      },
      specialty:[
        {
            type:String, //eg speciality:['heart','diabetic',]
        }
      ],
      educationQualification:[{
        type:String
      }]
      ,
      phoneNumber: { type: String},

      address:addressSchema,
      yearOfRegistration:{type:String},
      stateMedicalCouncil:{type:String},
      registrationNumber:{type:String},
      shifts: [
        {
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        }
      ],
      offDays: [{
        date:{
            type:String,
        },
       shifts:[{
        startTime:{type:String},
        endTime:{type:String}
       }],
       reason:{
        type:String
      }
      }
    ],
    appointmentDuration:{
      type:Number
    },
    yearlyAppointmentCount:{
      type:Number,
      default:0
    }
});

module.exports= mongoose.model('Doctor',doctorSchema);