const express = require("express");
const patientsController =require('../controllers/patients.controller');
const validation = require('../util/validation');
const patientValidation = require('../util/patientValidation');
const router = express.Router();
router.get("", patientsController.getPatientDashboard);
router.get('/profile',patientsController.getProfile);
router.patch('/profile',validation.patientProfileUpdateValidator,patientsController.updateProfile);
router.get(
    "/notification",
    patientsController.getAllNotificationController
  );
  //Notifiaction  Doctor || POST
router.delete(
    "/notification",
    patientsController.deleteAllNotificationController
  );
router.get('/appointments',patientValidation.findAppointmentsValidator,patientsController.getAllAppointments); 
router.get('/appointments/:aId',patientValidation.AppointmentDetailsValidator,patientsController.getAppointmentDetails); // using query.date and query.month
// using query.date and query.month
router.get('/book-appointment/search',patientValidation.searchHospital,patientsController.searchHospital)
router.post('/book-appointment/create',patientValidation.bookAppointmentValidator,patientsController.bookAppointmentController);
router.post('/book-appointment/check', patientValidation.checkAvailabilityValidator,patientsController.bookAvailabilityController);
router.delete('/book-appointment/cancel',patientsController.cancelAppointment);

module.exports = router;
