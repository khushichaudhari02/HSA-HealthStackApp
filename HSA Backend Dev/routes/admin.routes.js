const express = require("express");
const adminController = require('../controllers/admin.controller');
const adminValidation = require('../util/adminValidation');
const validation = require('../util/validation');
const router = express.Router();
router.get("/", adminController.getAdminDashboard);
router.get("/staff",adminController.getStaff);
router.get('/staff/search/:sName',adminController.getStaffByName);
router.get('/staff/manage/:sId',adminController.getStaffById);
router.patch('/staff/manage/:sId',adminValidation.updateStaffValidator,adminController.updateStaffDetails);
router.delete('/staff/manage/:sId',adminValidation.deleteStaffValidator,adminController.deleteStaff);
router.post('/staff',adminValidation.createStaffValidator,adminController.createNewStaff);

router.get('/staff/doctors',adminController.getDoctors);
router.get('/staff/admins',adminController.getAdmins);
router.get('/staff/nurses',adminController.getNurses);
router.get('/staff/receptionists',adminController.getReceptionists);
router.get('/hospital',adminController.getHospital);
router.get(
    "/notification",
    adminController.getAllNotificationController
  );
  //Notifiaction  Doctor || POST
router.delete(
    "/notification",
   adminController.deleteAllNotificationController
  );
  router.get('/reports/:dId',adminValidation.getReportDetailsValidator,adminController.getReportDetails)
router.get("/reports",adminValidation.getReportsValidator,adminController.getReports)
router.get('/consult/:dId',adminValidation.getDoctorConsultValidatator, adminController.getDoctorConsult);
router.get('/fees/:dId',adminValidation.getDoctorFeesValidator,adminController.getDoctorFees)
router.get('/fees/:dId/:date',adminValidation.getDoctorFeesDetailsValidator,adminController.getDoctorFeesDetails)
//router.get('/doctors/:dId/consult/', adminController.getAllConsultAppointments)
router.post('/schedule/:dId',adminValidation.getDoctorScheduleValidator,adminController.getDoctorSchedule); //check for date and shift.
router.patch('/schedule/:dId',adminValidation.updateDoctorOffDaysValidatator,adminController.updateDoctorOffDays);
router.patch('/schedule/:dId/status', adminValidation.updateStatusManyValidator,adminController.updateStatusMany);
router.patch('/schedule/:dId/status/:aId',adminValidation.updateStatusOneValidator,adminController.updateStatusOne)
// router.patch('/schedule/:dId/reschedule/:aId',adminValidation.rescheduleAppointmentValidator,adminController.resheduleAppointment)
//admin will set the time and approve the request then the approvedAppointemnts will be availble to doctor.
router.get("/patients", validation.getAllPatientsValidator,adminController.getAllPatients);
router.get('/patients/:pId',validation.getPatientDetailsValidator,adminController.getPatientDetails);

//router.get('/lab-reports/:lId',adminController.getLabReportDetails)
router.get('/patients/:pId/appointments',validation.getAllAppointmentsOfPatientValidator,adminController.getAllAppointmentOfPatient) // check if date or month is given in req.query
router.get('/appointments/:aId',validation.getAppointmentDetailsValidator, adminController.getAppointmentDetails);
router.post('/appointments/create',adminController.createPastAppointment)
module.exports = router; 
