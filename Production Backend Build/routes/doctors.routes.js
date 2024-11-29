const express = require("express");
const doctorController = require('../controllers/doctor.controller');
const doctorValidation = require("../util/doctorValidation");
const validation = require('../util/validation');
const router = express.Router();
router.get("/", doctorController.getDoctorDashboard); 
router.get('/profile',doctorController.getProfile);
router.patch('/profile',doctorValidation.updateDoctorProfileValidator,doctorController.updateProfile);

router.get('/reports',validation.getReportsValidator,doctorController.getReports)
router.post('/schedule',doctorValidation.getScheduleValidator,doctorController.getSchedule);
router.patch('/schedule',doctorValidation.updateOffDaysValidatator,doctorController.updateOffDays);
router.get('/consult/', doctorController.getConsult)
router.patch('/consult/:aId',doctorValidation.consultAppointmentValidator, doctorController.completedConsultation);
router.get('/fees',doctorValidation.getFeesValidator,doctorController.getFees)
router.get('/fees/:date',validation.getFeesDetailsValidator,doctorController.getFeesDetails)

router.get("/patients", validation.getAllPatientsValidator,doctorController.getAllPatients);
router.get('/patients/:pId',validation.getPatientDetailsValidator,doctorController.getPatientDetails);
// router.get('/patients/search/:name',doctorController.getPatientByName);
router.get('/patients/:pId/appointments',validation.getAllAppointmentsOfPatientValidator,doctorController.getAllAppointmentOfPatient) // check if date or month is given in req.query
// router.get('/patients/:pId/lab-reports',doctorController.getAllLabReports)
router.get('/appointments/:aId',validation.getAppointmentDetailsValidator, doctorController.getAppointmentDetails);
//router.get('/lab-reports/:lId',doctorController.getLabReportDetails)

// /patient/:Id/appointments  , /patient/:Id/appointments/:aId (get)   , /patient/:Id/appointments/:date (get)  , /patient/:Id/appointents/:month (get)
//   /appointments  /appointments/:aId   (get,patch), /appoinments/:date, /appointments/:month (get)
// /shedule/:date/appointments/  (get), /shedule/:date/:shift/appointments (get)


module.exports = router;