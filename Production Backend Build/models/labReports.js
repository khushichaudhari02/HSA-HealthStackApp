const mongoose = require("mongoose");
const addressSchema = require("./address");
const Schema = mongoose.Schema;

const testUnitSchema = new Schema({
  unit: {
    type: String,
    enum:['Femtoliters','Grams','Grams Per Deciliter','Grams Per Liter']
  },
  code: { type: String, enum: ["fL",'g','g/dL','g/L'] },
});

const testContentsSchema=new Schema(
  {
    name :{ type: String },
    code: {
      type: String,
    },
    range:{type:String},
    result:{type:String}
  }
)

const testSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  testCode:{
    type:String,
  },
  testingUnit: testUnitSchema,
  testContents: [
    testContentsSchema
  ],
  finalResult:{
    type:String
  },
  cost: {
    type: Double,
    required: true,
  },
});

const labReportSchema = new Schema({
  test: [testSchema],
  patient: { type: Schema.Types.ObjectId, ref: "Patient" },
  patientName:{type:String},
  labName:{type:String},
  labAddress:addressSchema,
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appoitment",
  },
  requestedDate:{
    type:Schema.Types.Date
  },
  yearlyReportCount: {
    type: Number,
    required: true,
  },
  dailyReportCount: {
    type: Number,
    required: true,
  },
  reportDate: { type: Schema.Types.Date, required: true },
  result: { type: String, },
  comments: { type: String },
});
// const labSlotSchema = new Schema({
//   startTime: {
//     type: String, //convert the
//     required: true
//   },
//   endTime: {
//     type: String,
//     required: true
//   },
//   isBooked: {
//     type: Boolean,
//     default: false
//   },
//   labReport:{
//     type:Schema.Types.ObjectId,
//     ref:'LabReport',
//     required:true
//   }
// },{timestamps:true});
const labScheduleSchema = new Schema({
  labTechnicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LabTechnician",
    required: true,
  },
  day: {
    type:'String',
    required: true,
  },
  shift: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  slots: [
    {
      type: Schema.Types.ObjectId,
      ref: "LabReport",
      required: true,
    },
  ],
});
const TestUnit = mongoose.model('TestUnit',testUnitSchema);
const TestContent = mongoose.model('TestContent',testContentsSchema)
const Test = mongoose.model("LabTest", testSchema);
const LabReport = mongoose.model("LabReport", labReportSchema);
const LabSchedule = mongoose.model("LabSchedule", labScheduleSchema);

module.exports = { Test, LabReport, LabSchedule,TestUnit,TestContent };
