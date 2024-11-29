const { body, check } = require("express-validator");
const validator = require("validator");
const mongoose = require("mongoose");
const createStaffValidator = [
  body("name.firstName", "The first name should not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("name.middleName").trim().escape(),
  body("name.lastName", "The last name should not by empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
    body("password", "password should not be Empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("password", "The minimum password length is 6 characters")
    .trim()
    .escape()
    .isLength({ min: 6 }),
  body("role", "Role cannot be empty.").trim().escape().not().isEmpty(),
  body("email", "Invalid should not be Empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),

  body().custom((value, { req }) => {
    if (req.body.role === "admin") {
        return true;
      }
      else if(req.body.phoneNumber && req.body.phoneNumber.length === 10){
        return true;
      } else {
        throw new Error(
          "The phone Number field should be atleast 10 digit long"
        );
      }
    }
  ),
  body().custom((value, { req }) => {
    if (req.body.role === "doctor" && req.body.registrationNumber) {
      const trimmed = validator.trim(req.body.registrationNumber);
      if(trimmed.length>0)
      {
        return true;
      }
    }
        throw new Error("The registrationNumber should not be empty");
      
    }
  ),
  body().custom((value, { req }) => {
    if (req.body.role === "doctor" && req.body.yearOfRegistration) {
      const trimmed = validator.trim(req.body.yearOfRegistration);
      if(trimmed.length>0)
      {
        return true;
      }
    }
       
        throw new Error("The Year of Registration should not be empty");

    }
  ),
  body().custom((value, { req }) => {
    if (req.body.role === "doctor" && req.body.stateMedicalCouncil) {
      const trimmed = validator.trim(req.body.stateMedicalCouncil);
      if(trimmed.length>0)
      {
        return true;
      }
    }
       
        throw new Error("The stateMedicalCouncil should not be empty");

    }
  ),


  body().custom((value, { req }) => {
    if (req.body.role === "admin") {
    return true
  } else if(req.body.educationQualification && Array.isArray(req.body.educationQualification) && req.body.educationQualification.length>0){
        return true;
      } else {
        throw new Error(
          "The education qualification should atleast have one element"
        );
      }

  }),
  body().custom((value,{req})=>{
      for (let e of req.body.educationQualification){
        const trimmed = validator.trim(e);
        if(trimmed<=0){
          throw new Error("The education qualification elements must not be empty")
        }
      }
      return true;
  }),
  body().custom((value, { req }) => {
    if(req.body.role==='admin'){
      return true;
    }
   else if (req.body.age) {
      const trimmed = validator.trim(req.body.age);
      if(trimmed.length>0)
      {
        return true;
      }
    }
       
        throw new Error("The age should not be empty");

    }
  ),
  body().custom((value, { req }) => {
    if(req.body.role==='admin'){
      return true;
    }
   else if (req.body.sex) {
      const trimmed = validator.trim(req.body.sex);
      if(trimmed.length>0)
      {
        return true;
      }
    }
        throw new Error("The sex field should not be empty");
    }
  ),
  body("educationQualification.*").trim().escape(),
  body('phoneNumber').trim().escape(),
  body('registrationNumber').trim().escape(),
  body('yearOfRegistration').trim().escape(),
  body('stateMedicalCouncil').trim().escape(),
  body("sex").trim().escape(),
  body("age").trim().escape(),
]

const updateStaffValidator=[
  check("sId", "Invalid object Id sId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body("name.firstName", "The first name should not be empty")
  .trim()
  .escape()
  .not()
  .isEmpty(),
body("name.middleName").trim().escape(),
body("name.lastName", "The last name should not by empty")
  .trim()
  .escape()
  .not()
  .isEmpty(),
  body("email", "Invalid should not be Empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),
  body().custom((value, { req }) => {
    if (req.body.role === "admin") {
    return true
  } else if(req.body.educationQualification && Array.isArray(req.body.educationQualification) && req.body.educationQualification.length>0){
        return true;
      } else {
        throw new Error(
          "The education qualification should atleast have one element"
        );
      }

  }),
  body().custom((value,{req})=>{
      for (let e of req.body.educationQualification){
        const trimmed = validator.trim(e);
        if(trimmed<=0){
          throw new Error("The education qualification elements must not be empty")
        }
      }
      return true;
  }),
  body().custom((value, { req }) => {
    if (req.body.role === "admin") {
        return true;
      }
      else if(req.body.phoneNumber && req.body.phoneNumber.length === 10){
        return true;
      } else {
        throw new Error(
          "The phone Number field should be atleast 10 digit long"
        );
      }
    }
  ),
  body('phoneNumber').trim().escape(),
  body("educationQualification.*").trim().escape(),
  ]
const deleteStaffValidator=[
  check("sId", "Invalid object Id hId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
]
const updateStatusManyValidator=[
check('dId', "Invalid object Id dId").custom((value) => {
  return mongoose.isValidObjectId(value);
}),
body('appointments.*.aId','invalid object Id aId').custom((value)=>{
  return mongoose.isValidObjectId(value);
}),
body('appointments.*.status',"Cannot be empty").trim().escape().not().isEmpty()
]
const updateStatusOneValidator=[
  check('aId','invalid object Id aId').custom((value)=>{
    return mongoose.isValidObjectId(value);
  }),
  check('dId', "Invalid object Id dId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body('status',"Cannot be empty").trim().escape().not().isEmpty()
]
 const getDoctorScheduleValidator=[
  check('dId', "Invalid object Id dId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body("date")
  .trim()
  .matches(/^\d{4}-\d{2}-\d{2}$/)
  .withMessage("Date must be in the format yyyy-MM-dd"),
  body("shift.startTime").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("Start time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("shift.endTime").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("End time Value must be time with HH:MM format");
    }
    return true;
  }),
 ]
 const updateDoctorOffDaysValidatator=[
  check('dId', "Invalid object Id dId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body("offDays.*.date")
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in the format yyyy-MM-dd"),
  body("offDays.*.shift.startTime").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("Start time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("offDays.*.shift.endTime").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("End time Value must be time with HH:MM format");
    }
    return true;
  }),

]
const getDoctorFeesValidator=[
  check('dId', "Invalid object Id dId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  check('page').trim().escape()
]
const getDoctorConsultValidatator=[
  check('dId', "Invalid object Id dId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
]
const getDoctorFeesDetailsValidator=[
  check('dId', "Invalid object Id dId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  check('date').trim().isDate()
  .withMessage("Date must be in the format yyyy/MM/dd"),
]
// const rescheduleAppointmentValidator =[
//   check('dId', "Invalid object Id dId").custom((value) => {
//     return mongoose.isValidObjectId(value);
//   }),
//   check('aId', "Invalid object Id dId").custom((value) => {
//     return mongoose.isValidObjectId(value);
//   }),
//   body("bookingStart").custom((value) => {
//     if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
//       throw new Error("Start time Value must be time with HH:MM format");
//     }
//     return true;
//   }),
//   body("date")
//     .trim().isDate()
//     .withMessage("Date must be in the format yyyy/MM/dd"),
// ]
const getReportsValidator=[
 
  check().custom((value, { req }) => {
    if (req.query.date && !/^\d{4}-\d{2}-\d{2}$/.test(req.query.date.trim())) {
      throw new Error("date value must be time with dd-mm-yyyy format");
    } else if (req.query.month && !/^\d{4}-\d{2}$/.test(req.query.month.trim())) {
      throw new Error("month value must be time with mm-yyyy format");
    }
    return true;
  }),
]
const getReportDetailsValidator=[
  check('dId', "Invalid object Id dId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  check().custom((value, { req }) => {
    if (req.query.date && !/^\d{4}-\d{2}-\d{2}$/.test(req.query.date.trim())) {
      throw new Error("date value must be time with dd-mm-yyyy format");
    } else if (req.query.month && !/^\d{4}-\d{2}$/.test(req.query.month.trim())) {
      throw new Error("month value must be time with mm-yyyy format");
    }
    return true;
  }),
]

module.exports = {
createStaffValidator,
updateStaffValidator,
deleteStaffValidator,
updateStatusManyValidator,
updateStatusOneValidator,
getDoctorScheduleValidator,
updateDoctorOffDaysValidatator,
getDoctorFeesValidator,
getDoctorConsultValidatator,
getDoctorFeesDetailsValidator,
getReportsValidator,
getReportDetailsValidator
// rescheduleAppointmentValidator
};
