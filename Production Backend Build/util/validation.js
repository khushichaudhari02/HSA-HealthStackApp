const { body, check } = require("express-validator");
const mongoose = require("mongoose");
const loginValidator = [
  body("email", "Invalid does not Empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),
  body("password", "The minimum password length is 6 characters")
    .trim()
    .escape()
    .isLength({
      min: 6,
    })
    .escape(),
];

const createAdminValidator = [
  body("email", "Invalid should not be Empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").isEmail(),
  body("password", "password does not Empty").trim().escape().not().isEmpty(),
  body("password", "The minimum password length is 6 characters")
    .trim()
    .escape()
    .isLength({
      min: 6,
    }),
  body("name.firstName", "The first name should not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("name.lastName", "The last name should not by empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("name.middleName", "The last name should not by empty").trim().escape(),
  check("hId", "Invalid object Id hId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
];
const signupValidator = [
  body("email", "Invalid should not be Empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),
  body("password", "password should not be Empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("password", "The minimum password length is 6 characters")
    .trim()
    .escape()
    .isLength({ min: 6 }),
  body("firstName", "The first name should not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("lastName", "The last name should not by empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("phoneNumber", "Mobile number must be 10 digit long")
    .trim()
    .escape()
    .isLength({
      min: 10,
      max:10
    }),
  body("phoneNumber", "Mobile number must not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
];
const patientProfileUpdateValidator = [
  body("email", "Invalid should not be Empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),
  body("name.firstName", "The first name should not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
    body("name.middleName")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("name.lastName", "The last name should not by empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("phoneNumber", "Mobile number must be 10 digit long")
    .trim()
    .escape()
    .isLength({
      min: 10,
      max:10
    }),
  body("phoneNumber", "Mobile number must not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("sex", "This field cannot be empty").trim().escape().not().isEmpty(),
  body("weight").trim().escape(),
  body("height.heightFoot").trim().escape(),
  body("height.heightInch").trim().escape(),
  body("age", "Age cannot be empty").trim().escape().not().isEmpty(),
  body("address.state").trim().escape(),
  body("address.district").trim().escape(),
  body("address.city").trim().escape(),
  body("address.streetAddess1").trim().escape(),
  body("address.streetAddress2").trim().escape(),
  body("address.postalCode").trim().escape(),
  body("address.landmark").trim().escape(),
  body().custom((value, { req }) => {
    if (
      req.body.address.state &&
      req.body.address.district &&
      req.body.address.city &&
      (req.body.address.streetAddress1 || req.body.streetAddress2) &&
      req.body.address.postalCode &&
      req.body.address.landmark
    ) {
      return true;
    } else if (
      !req.body.address.state &&
      !req.body.address.district &&
      !req.body.address.city &&
      !req.body.address.postalCode &&
      !req.body.address.landmark &&
      !req.body.address.streetAddress1 &&
      !req.body.address.streetAddresss2
    ) {
      return true;
    } else {
      throw new Error(
        "All Address fields must be filled together or either set empty"
      );
    }
  }),
];
const createNewHospitalValidator = [
  body("hospitalName", "Hospital Name cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("hospitalService", "Hospital Service cannot be empty")
    .isArray()
    .not()
    .isEmpty(),
  body("hospitalService.*", "You must atleast give one valid service type")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("hospitalSpecialty", "Hospital Specialty cannot be empty")
    .isArray()
    .not()
    .isEmpty(),
  body(
    "hospitalSpecialty.*",
    "You must atleast give one valid hospitalSpecialty"
  )
    .trim()
    .escape()
    .not()
    .isEmpty(),

  body("email", "Invalid should not be Empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),
  body("phoneNumber", "Mobile number must be 10 digit long")
    .trim()
    .escape()
    .isLength({
      min: 10,
      max:10
    })
    .escape(),
  body("phoneNumber", "Mobile number must not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),

  body("openHours.*.start", "openHours start cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("openHours.*.end", "openHours end be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("openHours.*.start").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("Start time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("openHours.*.end").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("End time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("address.state").trim().escape().not().isEmpty(),
  body("address.district").trim().escape().not().isEmpty(),
  body("address.city").trim().escape().not().isEmpty(),
  body("address.streetAddess.*").trim().escape(),
  body("address.postalCode").trim().escape().not().isEmpty(),
  body("address.landmark").trim().escape().not().isEmpty(),
  body().custom((value, { req }) => {
    if (
      req.body.address.state &&
      req.body.address.district &&
      req.body.address.city &&
      (req.body.address.streetAddress[0] || req.body.address.streetAddress[1]) &&
      req.body.address.postalCode &&
      req.body.address.landmark
    ) {
      return true;
    } else {
      throw new Error("All Address fields must be filled together");
    }
  }),
  body("chiefDoctor.name.firstName", "first name cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.name.middleName").trim().escape(),
  body("chiefDoctor.name.lastName", "Last name cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.email", "Invalid should not be Empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.email", "Invalid email").escape().isEmail(),
  body("chiefDoctor.registrationNumber", "registration number cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.yearOfRegistration", "year of registration cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.stateMedicalCouncil", "medical council cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.educationQualification.*").trim().escape(),
  body(
    "chiefDoctor.educationQualification",
    "Education Qualification must at least have one element"
  )
    .isArray()
    .not()
    .isEmpty(),
];
const updateHospitalValidator = [
  check("hId", "Invalid object Id hId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
  body("hospitalName", "Hospital Name cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("hospitalServiceType", "Hospital Service cannot be empty")
    .isArray()
    .not()
    .isEmpty(),
  body("hospitalServiceType.*", "You must atleast give one valid service type")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("hospitalSpecialty", "Hospital Specialty cannot be empty")
    .isArray()
    .not()
    .isEmpty(),
  body(
    "hospitalSpecialty.*",
    "You must atleast give one valid hospitalSpecialty"
  )
    .trim()
    .escape()
    .not()
    .isEmpty(),

  body("email", "Invalid should not be Empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),
  body("phoneNumber", "Mobile number must be 10 digit long")
    .trim()
    .escape()
    .isLength({
      min: 10,
      max:10
    })
    .escape(),
  body("phoneNumber", "Mobile number must not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),

  body("openHours.*.start", "openHours start cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("openHours.*.end", "openHours end be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("openHours.*.start").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("Start time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("openHours.*.end").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("End time Value must be time with HH:MM format");
    }
    return true;
  }),
  body("address.state").trim().escape().not().isEmpty(),
  body("address.district").trim().escape().not().isEmpty(),
  body("address.city").trim().escape().not().isEmpty(),
  body("address.streetAddess1").trim().escape(),
  body("address.streetAddress2").trim().escape(),
  body("address.postalCode").trim().escape().not().isEmpty(),
  body("address.landmark").trim().escape().not().isEmpty(),
  body().custom((value, { req }) => {
    if (
      req.body.address.state &&
      req.body.address.district &&
      req.body.address.city &&
      (req.body.address.streetAddress1 || req.body.address.streetAddress2) &&
      req.body.address.postalCode &&
      req.body.address.landmark
    ) {
      return true;
    } else {
      throw new Error("All Address fields must be filled together");
    }
  }),
  body("chiefDoctor.name.firstName", "first name cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.name.middleName").trim().escape(),
  body("chiefDoctor.name.lastName", "Last name cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.email", "Invalid should not be Empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.email", "Invalid email").escape().isEmail(),
  body("chiefDoctor.registrationNumber", "registration number cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.yearOfRegistration", "year of registration cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.stateMedicalCouncil", "medical council cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.educationQualification.*").trim().escape(),
  body(
    "chiefDoctor.educationQualification",
    "Education Qualification must at least have one element"
  )
    .isArray()
    .not()
    .isEmpty(),
];
const CHRValidator = [
  body("hospitalName", "Hospital Name cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("hospitalService", "Hospital Service cannot be empty")
    .isArray()
    .not()
    .isEmpty(),
  body("hospitalService.*", "You must atleast give one valid service type")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("hospitalSpecialty", "Hospital Specialty cannot be empty")
    .isArray()
    .not()
    .isEmpty(),
  body(
    "hospitalSpecialty.*",
    "You must atleast give one valid hospitalSpecialty"
  )
    .trim()
    .escape()
    .not()
    .isEmpty(),

  body("email", "Invalid should not be Empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),
  body("phoneNumber", "Mobile number must be 10 digit long")
    .trim()
    .escape()
    .isLength({min:10,
      max:10
    })
    .escape(),
  body("phoneNumber", "Mobile number must not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),

  body("openHours.*.start", "openHours start cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("openHours.*.end", "openHours end be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("openHours.*.start").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("Start  Value must be time with HH:MM format");
    }
    return true;
  }),
  body("openHours.*.end").custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error("End  Value must be time with HH:MM format");
    }
    return true;
  }),
  body("address.state").trim().escape().not().isEmpty(),
  body("address.district").trim().escape().not().isEmpty(),
  body("address.city").trim().escape().not().isEmpty(),
  body("address.streetAddess.*").trim().escape(),
  body("address.postalCode").trim().escape().not().isEmpty(),
  body("address.landmark").trim().escape().not().isEmpty(),
  body().custom((value, { req }) => {
    if (
      req.body.address.state &&
      req.body.address.district &&
      req.body.address.city &&
      (req.body.address.streetAddress[0]|| req.body.address.streetAddress[1]) &&
      req.body.address.postalCode &&
      req.body.address.landmark
    ) {
      return true;
    } else {
      throw new Error("All Address fields must be filled together");
    }
  }),
  body("chiefDoctor.name.firstName", "first name cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.name.middleName").trim().escape(),
  body("chiefDoctor.name.lastName", "Last name cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.email", "Invalid should not be Empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.email", "Invalid email").escape().isEmail(),
  body("chiefDoctor.registrationNumber", "registration number cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.yearOfRegistration", "year of registration cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.stateMedicalCouncil", "medical council cannot be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("chiefDoctor.educationQualification.*").trim().escape(),
  body(
    "chiefDoctor.educationQualification",
    "Education Qualification must at least have one element"
  )
    .isArray()
    .not()
    .isEmpty(),
];
// const isObjectIdValid=[
//   check('hId','hId is invalid').custom(value=>{
//     if(ObjectId.isValidObjectId(value)){
//       return true
//     }
//     return false
//   })
// ]
const getAllAppointmentsOfPatientValidator = [
  check("pId", "Invalid object Id pId").custom((value) => {
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
  check('page').trim().escape()
];
const getAppointmentDetailsValidator = [
  check("aId", "Invalid object Id aId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
];
const getAllPatientsValidator=[
  check('patientName').trim().escape()
]
const getPatientDetailsValidator=[
  check("pId", "Invalid object Id pId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
]
const getFeesDetailsValidator=[
  check('date').trim().isDate()
  .withMessage("Date must be in the format yyyy/MM/dd"),
]
const getCHRDetailsValidator=[
  check("CHRId", "Invalid object Id pId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
]

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
module.exports = {
  loginValidator: loginValidator,
  createAdminValidator: createAdminValidator,
  signupValidator: signupValidator,
  patientProfileUpdateValidator: patientProfileUpdateValidator,
  createNewHospitalValidator: createNewHospitalValidator,
  updateHospitalValidator,
  getAllAppointmentsOfPatientValidator,
getAppointmentDetailsValidator,
getAllPatientsValidator,
getPatientDetailsValidator,
getFeesDetailsValidator,
getCHRDetailsValidator,
getReportsValidator,
CHRValidator
};
