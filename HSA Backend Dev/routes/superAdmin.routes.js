const express = require("express");
const superAdminController = require('../controllers/superAdmin.controller');
const validation = require('../util/validation');
const router = express.Router();
router.get("/", superAdminController.getSuperAdminDashboard);
// router.get("/users",superAdminController.getAllUsers);
// router.get('/users/:uId',superAdminController.getUserById);
// router.post('/users/create',superAdminController.createNewUser);
// router.patch('/users/:uId',superAdminController.updateUserDetails);
// router.delete('/users/:uId',superAdminController.deleteUser);

router.get('/hospitals',superAdminController.getAllHospitals);
router.post('/hospitals',validation.createNewHospitalValidator,superAdminController.createNewHospital);
router.get('/hospitals/:hId',superAdminController.getHospitalById);
// router.get('/hosptals/search/:name/',superAdmin,getHospitalByName);
router.patch('/hospitals/:hId',validation.updateHospitalValidator,superAdminController.updateHospitalDetails);
// router.delete('/hospital/:hId',superAdmin.deleteHospital);
router.get('/requests',superAdminController.getCreateHospitalRequests);
router.get('/requests/:CHRId',validation.getCHRDetailsValidator,superAdminController.getCHRById)
// router.get('/hospital/:hId/staff',superAdmin.getStaffByHospitalId);
// router.get('/hospital/:hId/staff/:sId',superAdmin.getStaffById);
router.post('/hospitals/:hId/admin',validation.createAdminValidator,superAdminController.createNewAdmin);

// router.patch('/hospital/:hId/staff/:sId',superAdminController.updateStaffDetails);
// router.delete('/hospital/:hId/staff/:sId',superAdmin.deleteStaff);

// router.get('/hospital/:hId/doctor/:dId',superAdminController.getDoctorDetails);
// router.get('/hospital/:hId/doctor',superAdminController.getAllDoctors);
// router.put('/hospital/:hId/doctor/create',superAdminController.createNewDoctor);
// router.patch('/hospital/:hId/doctor/:dId',superAdmin.updateDoctorDetails);
// router.delete('/hospital/:hId/doctor/:dId',superAdmin.deleteDoctor);

// router.get('/hospital/:hId/doctor/:dI/schedule'.superAdminController.getDoctorSchedule);
// router.get('/hospital/:hId/doctor/:dId/schedule/:date',superAdminController.getScheduleByDate);
// router.get('/hospital/:hId/doctor/:dId/schedule/:date/:shift',superAdminController.getScheduleOfDateByShift);
// router.post('/hospital/:hId/doctor/:dId/schedule/create',superAdminController.createSchedule);
// router.patch('/hospital/:hId/doctor/:dId/schedule/edit',superAdminController.updateSchedule);

// router.get('/hospital/:hId/patients/',superAdminController.getAllPatients);
// router.get('/hospital/:hId/patients/:pId',superAdminController.getPatientDetails);
// router.patch('/patients/:pId',superAdminController.updatePatientDetails);
// router.post('/patients/create',superAdminController.createNewPatient);
// router.delete('/patients/:pId',superAdminController.deletePatient);



module.exports = router; 
