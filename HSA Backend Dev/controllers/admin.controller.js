const { Hospital, Nurse, Receptionist } = require("../models/hospital");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const { Schedule } = require("../models/doctorSchedule");
const { Appointment } = require("../models/appointments");
const PDFDocument = require("pdfkit");
async function getAdminDashboard(req, res, next) {
  try {
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the Admin document.");
      error.statusCode = 403;
      throw error;
    }
    const hospital = await Hospital.findOne({
      "staff.admins": req.userId,
    });

    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }

    res.json({ hospital: hospital });
  } catch (err) {
    next(err);
  }
}

async function getStaff(req, res, next) {
  try {
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the Admin document.");
      error.statusCode = 403;
      throw error;
    }
    const hospital = await Hospital.findOne({
      "staff.admins": req.userId,
    });

    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const response = {
      totalStaff:
        hospital.staff.totalAdmins +
        hospital.staff.totalNurse +
        hospital.staff.totalDoctors +
        hospital.staff.totalReceptionists,
      totalDoctors: hospital.staff.totalDoctors,
      totalNurse: hospital.staff.totalNurse,
      totalAdmins: hospital.staff.totalAdmins,
      totalReceptionist: hospital.staff.totalReceptionists,
    };
    res.json({ response });
  } catch (err) {
    next(err);
  }
}
async function getStaffByName(req, res, next) {
  const staffName = req.params.sName;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }

    const staffList = [];

    const [nurseList, receptionistList, adminList, doctorList] =
      await Promise.all([
        Nurse.find().where("_id").in(hospital.staff.nurses).exec(),
        Receptionist.find()
          .where("_id")
          .in(hospital.staff.receptionists)
          .exec(),
        User.find().where("_id").in(hospital.staff.admins).exec(),
        Doctor.find().where("_id").in(hospital.staff.doctors).exec(),
      ]);

    await Promise.all(
      nurseList.map(async (nurse) => {
        const nurseDoc = await User.findById(nurse.owner);
        staffList.push({
          name: nurseDoc.name,
          role: nurseDoc.role,
          sId: nurse._id,
        });
      })
    );

    await Promise.all(
      receptionistList.map(async (receptionist) => {
        const receptionistDoc = await User.findById(receptionist.owner);
        staffList.push({
          name: receptionistDoc.name,
          role: receptionistDoc.role,
          sId: receptionist._id,
        });
      })
    );

    await Promise.all(
      adminList.map(async (admin) => {
        staffList.push({ name: admin.name, role: admin.role, sId: admin._id });
      })
    );

    await Promise.all(
      doctorList.map(async (doctor) => {
        const doctorDoc = await User.findById(doctor.owner);
        staffList.push({
          name: doctorDoc.name,
          role: doctorDoc.role,
          sId: doctor._id,
          specialty: doctor.specialty,
          shifts: doctor.shifts,
        });
        // console.log(staffList);
      })
    );
   
    const foundUsers = staffList.filter((user) => {
  
      const { firstName, middleName, lastName } = user.name;
    
      return (
        firstName.toLowerCase().includes(staffName.toLowerCase()) ||
        middleName.toLowerCase().includes(staffName.toLowerCase()) ||
        lastName.toLowerCase().includes(staffName.toLowerCase())
      );
    });

    const staffDocs = [];
    for (const foundUser of foundUsers) {
      let staffDoc;
      switch (foundUser.role) {
        case "admin":
          staffDoc = await User.findById(foundUser.sId);
          break;
        case "doctor":
          staffDoc = await Doctor.findById(foundUser.sId)
            .populate({ path: "owner", select: "-password" })
            .exec();

          break;
        case "nurse":
          staffDoc = await Nurse.findById(foundUser.sId)
            .populate({ path: "owner", select: "-password" })
            .exec();

          break;
        case "receptionist":
          staffDoc = await Receptionist.findById(foundUser.sId)
            .populate({ path: "owner", select: "-password" })
            .exec();
          break;
      }
      staffDocs.push({ staffDoc: staffDoc, sId: staffDoc._id });
    }
    if (staffDocs.length <= 0) {
      const error = new Error("No staff with this  name could not be found");
      error.statusCode = 403;
      throw error;
    }

    res.json({ staffDocs });
  } catch (err) {
    next(err);
  }
}

async function getStaffById(req, res, next) {
  const sId = req.params.sId;
  try {
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the Admin document.");
      error.statusCode = 403;
      throw error;
    }
    const hospital = await Hospital.findOne({
      "staff.admins": req.userId,
    });

    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    let foundUser;

    const adminUser = await User.findById(sId);
    if (adminUser) {
      foundUser = adminUser;
    }
    const doctor = await Doctor.findById(sId)
      .populate({ path: "owner", select: "-password" })
      .exec();
    if (doctor) {
      foundUser = doctor;
    }
    const receptionist = await Receptionist.findById(sId)
      .populate({ path: "owner", select: "-password" })
      .exec();
    if (receptionist) {
      foundUser = receptionist;
    }

    const nurse = await Nurse.findById(sId)
      .populate({ path: "owner", select: "-password" })
      .exec();
    if (nurse) {
      foundUser = nurse;
    }

    if (!foundUser) {
      const error = new Error("Document with this sId doesn't exists.");
      error.statusCode = 403;
      throw error;
    }

    res.json({ staffDoc: foundUser, sId: foundUser._id });
  } catch (err) {
    next(err);
  }
}
async function getNurses(req, res, next) {
  try {
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const nursePopulatedList = [];

    const nurseList = await Nurse.find()
      .where("_id")
      .in(hospital.staff.nurses)
      .exec();

    if (!nurseList) {
      const error = new Error("Could not find any nurse in for this hospital.");
      error.statusCode = 403;
      throw error;
    }

    for (const nurse of nurseList) {
      const nurseDoc = await User.findById(nurse.owner);
      nursePopulatedList.push({
        name: nurseDoc.name,
        role: nurseDoc.role,
        sId: nurse._id,
      });
    }
    res.json({ nurseList: nursePopulatedList });
  } catch (err) {
    next(err);
  }
}
async function getAdmins(req, res, next) {
  try {
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const adminPopulatedList = [];

    const adminList = await User.find()
      .where("_id")
      .in(hospital.staff.admins)
      .exec();

    if (!adminList || adminList.length <= 0) {
      const error = new Error("Could not find any admin in for this hospital.");
      error.statusCode = 403;
      throw error;
    }

    for (const admin of adminList) {
      adminPopulatedList.push({
        name: admin.name,
        role: admin.role,
        sId: admin._id,
      });
    }
    res.json({ adminList: adminPopulatedList });
  } catch (err) {
    next(err);
  }
}
async function getDoctors(req, res, next) {
  try {
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const doctorPopulatedList = [];

    const doctorList = await Doctor.find()
      .where("_id")
      .in(hospital.staff.doctors)
      .exec();

    if (!doctorList || doctorList.length <= 0) {
      const error = new Error("Could not find any nurse in for this hospital.");
      error.statusCode = 403;
      throw error;
    }

    for (const doctor of doctorList) {
      const doctorDoc = await User.findById(doctor.owner);
      doctorPopulatedList.push({
        name: doctorDoc.name,
        role: doctorDoc.role,
        shifts: doctor.shifts,
        specialty: doctor.specialty,
        sId: doctor._id,
      });
    }
    res.json({ doctorList: doctorPopulatedList });
  } catch (err) {
    next(err);
  }
}
async function getReceptionists(req, res, next) {
  try {
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const receptionistPopulatedList = [];

    const receptionistList = await Receptionist.find()
      .where("_id")
      .in(hospital.staff.receptionists)
      .exec();

    if (!receptionistList || receptionistList.length <= 0) {
      const error = new Error(
        "Could not find any receptionist in for this hospital."
      );
      error.statusCode = 403;
      throw error;
    }

    for (const receptionist of receptionistList) {
      const receptionistDoc = await User.findById(receptionist.owner);
      receptionistPopulatedList.push({
        name: receptionistDoc.name,
        role: receptionistDoc.role,
        sId: receptionist._id,
      });
    }
    res.json({ receptionistList: receptionistPopulatedList });
  } catch (err) {
    next(err);
  }
}

async function createNewStaff(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const userAlreadyExists = await User.findOne({ email: req.body.email });
    if (userAlreadyExists) {
      const error = new Error("A user with this email alrady exists.");
      error.statusCode = 403;
      throw error;
    }

    if (req.body.role == "admin") {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        role: "admin",
      });
      const savedAdminUserDoc = await user.save();
      if (!savedAdminUserDoc) {
        const error = new Error("Admin user document could not be created");
        error.statusCode = 500;
        throw error;
      }
      hospital.staff.admins.push(savedAdminUserDoc._id);
      hospital.staff.totalAdmins = hospital.staff.totalAdmins + 1;
      const savedHospital = await hospital.save();
      if (!savedHospital) {
        const error = new Error(
          "admin user document could not be saved in hospital"
        );
        error.statusCode = 500;
        throw error;
      }
      res.json({ savedAdminUserDoc, sId: savedAdminUserDoc._id });
      return;
    } else {
      const staffUser = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
      });
      const savedStaffUserDoc = await staffUser.save();
      if (!savedStaffUserDoc) {
        const error = new Error("Staff user document could not be created");
        error.statusCode = 500;
        throw error;
      }
      let savedHospital;
      switch (req.body.role) {
        case "doctor":
          const doctor = new Doctor({
            name: req.body.name,
            owner: savedStaffUserDoc._id,
            phoneNumber: req.body.phoneNumber,
            age: req.body.age,
            sex: req.body.sex,
            educationQualification: req.body.educationQualification,
            yearOfRegistration: req.body.yearOfRegistration,
            stateMedicalCouncil: req.body.stateMedicalCouncil,
            registationNumber: req.body.registationNumber,
          });
          const savedDoctorDoc = await doctor.save();
          if (!savedDoctorDoc) {
            const error = new Error("Doctor document could not be created");
            error.statusCode = 500;
            throw error;
          }
          hospital.staff.doctors.push(savedDoctorDoc._id);
          hospital.staff.totalDoctors = hospital.staff.totalDoctors + 1;
          savedHospital = await hospital.save();
          if (!savedHospital) {
            const error = new Error(
              "doctor user document could not be saved in hospital"
            );
            error.statusCode = 500;
            throw error;
          }
          res.json({
            savedDoctorDoc: savedDoctorDoc,
            savedStaffUserDoc,
            sId: savedDoctorDoc._id,
          });
          break;
        case "nurse":
          const nurse = new Nurse({
            name: req.body.name,
            owner: savedStaffUserDoc._id,
            phoneNumber: req.body.phoneNumber,
            age: req.body.age,
            sex: req.body.sex,
            educationQualification: req.body.educationQualification,
          });
          const savedNurseDoc = await nurse.save();
          if (!savedNurseDoc) {
            const error = new Error("Nurse document could not be created");
            error.statusCode = 500;
            throw error;
          }
          hospital.staff.nurses.push(savedNurseDoc._id);
          hospital.staff.totalNurse = hospital.staff.totalNurse + 1;
          savedHospital = await hospital.save();
          if (!savedHospital) {
            const error = new Error(
              "Nurse document could not be saved in hospital"
            );
            error.statusCode = 500;
            throw error;
          }
          res.json({
            savedNurseDoc: savedNurseDoc,
            savedStaffUserDoc,
            sId: savedNurseDoc._id,
          });
          break;
        case "receptionist":
          const receptionist = new Receptionist({
            name: req.body.name,
            owner: savedStaffUserDoc._id,
            phoneNumber: req.body.phoneNumber,
            age: req.body.age,
            sex: req.body.sex,
            educationQualification: req.body.educationQualification,
          });
          const savedReceptionistDoc = await receptionist.save();
          if (!savedReceptionistDoc) {
            const error = new Error(
              "Receptionist document could not be created"
            );
            error.statusCode = 500;
            throw error;
          }
          hospital.staff.receptionists.push(savedReceptionistDoc._id);
          hospital.staff.totalReceptionists =
            hospital.staff.totalReceptionists + 1;
          savedHospital = await hospital.save();
          if (!savedHospital) {
            const error = new Error(
              "Receptionists document could not be saved in hospital"
            );
            error.statusCode = 500;
            throw error;
          }
          res.json({
            savedReceptionistDoc: savedReceptionistDoc,
            savedStaffUserDoc,
            sId: savedNurseDoc._id,
          });
          break;
      }
    }
  } catch (err) {
    next(err);
  }
}
// async function updateDoctorDetails(req, res, next) {

// // fetch that staff using its id then delete its owner and itself. uisng User and Nurse,Doctor, Receptionist .findByIdAndUpdate method.
// // I need to create a method in all collection to actually fetch the owner part using a FindByIdOwner method. this will return a populated document.
// }
// async function updateNurseDetails(req,res,next){

// }
// async function updateAdminDetails(req,res,next){

// }
// async function updateNurseDetails(req,res,next){

// }
// async function updateReceptionistDetails(req,res,next){

// }
async function updateStaffDetails(req, res, next) {
  const sId = req.params.sId;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the Admin document.");
      error.statusCode = 403;
      throw error;
    }
    const hospital = await Hospital.findOne({
      "staff.admins": req.userId,
    });

    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }

    let foundUser;
    let staffRole;
    let staffUserId;

    const adminUser = await User.findById(sId);
    if (adminUser) {
      foundUser = adminUser;
      staffRole = adminUser.role;
      staffUserId = adminUser._id;
    }
    const doctor = await Doctor.findById(sId);
    if (doctor) {
      foundUser = doctor;
      staffRole = "doctor";
      staffUserId = doctor.owner;
    }
    const receptionist = await Receptionist.findById(sId);
    if (receptionist) {
      foundUser = receptionist;
      staffRole = "receptionist";
      staffUserId = receptionist.owner;
    }

    const nurse = await Nurse.findById(sId);
    if (nurse) {
      foundUser = nurse;
      staffRole = "nurse";
      staffUserId = nurse.owner;
    }

    if (!foundUser) {
      const error = new Error("Document with this sId doesn't exists.");
      error.statusCode = 403;
      throw error;
    }
    const userAlreadyExists = await User.findOne({ email: req.body.email });

    if (userAlreadyExists._id.toString() !== staffUserId.toString()) {
      const error = new Error(
        "A user with this email alrady exists try a diffrent email"
      );
      error.statusCode = 403;
      throw error;
    }
    if (hospital.chiefDoctor == foundUser._id) {
      const error = new Error("Not authorized to update the chief doctor");
      error.statusCode = 403;
      throw error;
    }

    if (staffRole == "admin") {
      if (req.userId === staffUserId) {
        return;
      }
      const updateUser = await User.findByIdAndUpdate(staffUserId, {
        $set: {
          name: req.body.name,
          email: req.body.email,
        },
      });
      if (!updateUser) {
        const error = new Error("Could not update the staff User doc");
        error.statusCode = 403;
        throw error;
      }
      res.json({ message: "Admin document updated successfully!" });
      return;
    } else if (staffRole == "doctor") {
      const updateUser = await User.findByIdAndUpdate(staffUserId, {
        $set: {
          name: req.body.name,
          email: req.body.email,
        },
      });
      if (!updateUser) {
        const error = new Error("Could not update the staff User doc");
        error.statusCode = 403;
        throw error;
      }
      const updateDoctorResponse = await Doctor.findByIdAndUpdate(
        foundUser._id,
        {
          $set: {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            educationQualification: req.body.educationQualification,
          },
        }
      );
      if (!updateDoctorResponse) {
        const error = new Error("Could not update the Doctor document");
        error.statusCode = 403;
        throw error;
      }
      res.json({ message: "Doctor document updated successfully!" });
      return;
    } else if (staffRole == "nurse") {
      const updateUser = await User.findByIdAndUpdate(staffUserId, {
        $set: {
          name: req.body.name,
          email: req.body.email,
        },
      });
      if (!updateUser) {
        const error = new Error("Could not update the staff User doc");
        error.statusCode = 403;
        throw error;
      }
      const updateNurseResponse = await Nurse.findByIdAndUpdate(foundUser._id, {
        $set: {
          name: req.body.name,
          phoneNumber: req.body.phoneNumber,
          educationQualification: req.body.educationQualification,
        },
      });
      if (!updateNurseResponse) {
        const error = new Error("Could not nur the Nurse document");
        error.statusCode = 403;
        throw error;
      }
      res.json({ message: "Nurse document updated successfully!" });
      return;
    } else if (staffRole == "receptionist") {
      const updateUser = await User.findByIdAndUpdate(staffUserId, {
        $set: {
          name: req.body.name,
          email: req.body.email,
        },
      });
      if (!updateUser) {
        const error = new Error("Could not update the staff User doc");
        error.statusCode = 403;
        throw error;
      }
      const updateReceptionistResponse = await Receptionist.findByIdAndUpdate(
        foundUser._id,
        {
          $set: {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            educationQualification: req.body.educationQualification,
          },
        }
      );
      if (!updateReceptionistResponse) {
        const error = new Error("Could not update the Receptiionist document");
        error.statusCode = 403;
        throw error;
      }
      res.json({ message: "Receptionist document updated successfully!" });
      return;
    }
  } catch (err) {
    next(err);
  }
}
async function deleteStaff(req, res, next) {
  const sId = req.params.sId;
  try {
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the Admin document.");
      error.statusCode = 403;
      throw error;
    }
    const hospital = await Hospital.findOne({
      "staff.admins": req.userId,
    });

    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    let foundUser;
    let staffRole;
    let staffUserId;

    const adminUser = await User.findById(sId);
    if (adminUser) {
      foundUser = adminUser;
      staffRole = adminUser.role;
      staffUserId = adminUser._id;
    }
    const doctor = await Doctor.findById(sId);
    if (doctor) {
      foundUser = doctor;
      staffRole = "doctor";
      staffUserId = doctor.owner;
    }
    const receptionist = await Receptionist.findById(sId);
    if (receptionist) {
      foundUser = receptionist;
      staffRole = "receptionist";
      staffUserId = receptionist.owner;
    }

    const nurse = await Nurse.findById(sId);
    if (nurse) {
      foundUser = nurse;
      staffRole = "nurse";
      staffUserId = nurse.owner;
    }

    if (!foundUser) {
      const error = new Error("Document with this sId doesn't exists.");
      error.statusCode = 403;
      throw error;
    }
    if (hospital.chiefDoctor == foundUser._id) {
      const error = new Error("Not authorized to delete the chief doctor");
      error.statusCode = 403;
      throw error;
    }
    let saveHospitalResponse;
    if (staffRole == "admin") {
      const deleteUser = await User.findByIdAndDelete(staffUserId);
      if (!deleteUser) {
        const error = new Error("Could not delete the staff User doc");
        error.statusCode = 403;
        throw error;
      }
      hospital.staff.totalAdmins = hospital.staff.totalAdmins - 1;
      hospital.staff.admins.pop(foundUser._id);
      saveHospitalResponse = await hospital.save();
      if (!saveHospitalResponse) {
        const error = new Error(
          "Could not update the totalAdmins in hospital doc"
        );
        error.statusCode = 403;
        throw error;
      }
      res.json({ message: "Admin document deleted successfully!" });
      return;
    } else if (staffRole == "doctor") {
      const deleteUser = await User.findByIdAndDelete(staffUserId);
      if (!deleteUser) {
        const error = new Error("Could not delete the staff User doc");
        error.statusCode = 403;
        throw error;
      }
      const deleteDoctorResponse = await Doctor.findByIdAndDelete(
        foundUser._id
      );
      if (!deleteDoctorResponse) {
        const error = new Error("Could not delete the Doctor document");
        error.statusCode = 403;
        throw error;
      }
      hospital.staff.totalDoctors = hospital.staff.totalDoctors - 1;
      hospital.staff.doctors.pop(foundUser._id);
      saveHospitalResponse = await hospital.save();
      if (!saveHospitalResponse) {
        const error = new Error(
          "Could not update the totalDoctors in hospital doc"
        );
        error.statusCode = 403;
        throw error;
      }
      res.json({ message: "Doctor document deleted successfully!" });
      return;
    } else if (staffRole == "nurse") {
      const deleteUser = await User.findByIdAndDelete(staffUserId);
      if (!deleteUser) {
        const error = new Error("Could not delete the Nurse User doc");
        error.statusCode = 403;
        throw error;
      }
      const deleteNurseResponse = await Nurse.findByIdAndDelete(foundUser._id);
      if (!deleteNurseResponse) {
        const error = new Error("Could not delete the Nurse document");
        error.statusCode = 403;
        throw error;
      }
      hospital.staff.totalNurse = hospital.staff.totalNurse - 1;
      hospital.staff.nurses.pop(foundUser._id);
      saveHospitalResponse = await hospital.save();
      if (!saveHospitalResponse) {
        const error = new Error(
          "Could not update the totalNurse in hospital doc"
        );
        error.statusCode = 403;
        throw error;
      }
      res.json({ message: "Nurse document deleted successfully!" });
      return;
    } else if (staffRole == "receptionist") {
      const deleteUser = await User.findByIdAndDelete(staffUserId);
      if (!deleteUser) {
        const error = new Error("Could not delete the Receptionist User doc");
        error.statusCode = 403;
        throw error;
      }
      const deleteReceptionistResponse = await Receptionist.findByIdAndDelete(
        foundUser._id
      );
      if (!deleteReceptionistResponse) {
        const error = new Error("Could not delete the Receptionsit document");
        error.statusCode = 403;
        throw error;
      }
      hospital.staff.totalReceptionists = hospital.staff.totalReceptionists - 1;
      hospital.staff.receptionists.pop(foundUser._id);
      saveHospitalResponse = await hospital.save();
      if (!saveHospitalResponse) {
        const error = new Error(
          "Could not update the totalReceptionists in hospital doc"
        );
        error.statusCode = 403;
        throw error;
      }
      res.json({ message: "Receptionist document deleted successfully!" });
      return;
    }
  } catch (err) {
    next(err);
  }
}

async function updateStatusOne(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const foundDoctor = await Doctor.findById(req.params.dId)
      .populate("owner")
      .exec();

    if (!foundDoctor) {
      const error = new Error("There is no doctor with this doctor Id");
      error.statusCode = 404;
      throw error;
    }
    const patient = await Patient.findOne({ Appointments: req.params.aId })
      .populate("owner")
      .exec();

    if (!patient && !patient.owner) {
      const error = new Error(
        "There is no patient with who has this appointment Id."
      );
      error.statusCode = 404;
      throw error;
    }

    const nowDate = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" });
    const nowDateISODate = nowDate.toISODate();
    const nowDateISOTime = nowDate.toISOTime({ suppressSeconds: true });

    const updateAppointment = await Appointment.updateOne(
      {
        _id: req.params.aId,
        date: { $gte: nowDateISODate },
        startTime: { $gt: nowDateISOTime },
      },
      { status: req.body.status }
    );

    if (!updateAppointment || updateAppointment.modifiedCount < 1) {
      const error = new Error("Could not update the appoinment status");
      error.statusCode = 400;
      throw error;
    }
    let error;
    const notifcations = patient.owner.notifications;
    notifcations.push({
      type: "status-updated",
      message: `your appointment has been updated to status ${req.body.status}`,
      onCLickPath: "/appointmnets/" + req.params.aId,
      appointmentId: req.params.aId,
    });
    const patientUpdateResult = await patient.owner.save();

    if (!patientUpdateResult) {
      error = new Error("Could not update the patient notifications");
      error.statusCode = 400;
    }
    return res.status(200).send({
      success: true,
      error,
      doctorId: foundDoctor._id,
      updateAppointment,
    });
  } catch (err) {
    next(err);
  }
}
async function updateStatusMany(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const foundDoctor = await Doctor.findById(req.params.dId)
      .populate("owner")
      .exec();
    if (!foundDoctor) {
      const error = new Error("There is no doctor with this doctor Id");
      error.statusCode = 404;
      throw error;
    }

    const nowDate = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" });
    const nowDateISODate = nowDate.toISODate();
    const nowDateISOTime = nowDate.toISOTime({ suppressSeconds: true });
    let appointmentsResponse = [];
    let failedToUpdate = [];
    let failedToUpdatePatientUserDoc = [];
    // let notExistsPatient=[];

    for (const appointment of req.body.appointments) {
      const patient = await Patient.findOne({ Appointments: appointment.aId })
        .populate({ path: "owner", select: "-password" })
        .exec();

      if (!patient.owner) {
        failedToUpdate.push({
          appointment: appointment,
          reason: "patient document does not exists",
        });
      } else {
        const updatedAppointment = await Appointment.updateOne(
          {
            _id: appointment.aId,
            date: { $gte: nowDateISODate },
            // startTime: { $gte: nowDateISOTime },
          },
          { status: appointment.status }
        );
        if (!updatedAppointment || updatedAppointment.modifiedCount < 1) {
          failedToUpdate.push({
            appointment: appointment,
            message:
              "You cannot update appointment status of past appointments",
          });
        } else {
          appointmentsResponse.push(updatedAppointment);
          const notifications = patient.owner.notifications;
          notifications.push({
            type: "status-updated",
            message: `your appointment has been updated to ${appointment.status}`,
            onCLickPath: "/appointments/" + appointment.aId,
            appointmentId: appointment.aId,
          });
          const patientUpdateResult = await patient.owner.save();

          if (!patientUpdateResult) {
            failedToUpdatePatientUserDoc.push(patientUpdateResult);
          }
        }
      }
    }

    return res.status(200).send({
      success: true,
      doctorId: foundDoctor._id,
      appointmentsResponse,
      failedToUpdate,
    });
  } catch (err) {
    next(err);
  }
}
async function getDoctorSchedule(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const foundDoctor = await Doctor.findById(req.params.dId)
      .populate("owner")
      .exec();

    if (!foundDoctor) {
      const error = new Error("There is no doctor with this doctor Id");
      error.statusCode = 404;
      throw error;
    }
    const date = DateTime.fromFormat(req.body.date, "yyyy-MM-dd", {
      zone: "Asia/Kolkata",
    });
    // console.log(bookingDate)
    const dateISO = date.toISODate();

    let isOffDay;
    const bookingDuration = foundDoctor.appointmentDuration || 10;
    if (foundDoctor.offDays.length > 0) {
      for (const offDay of foundDoctor.offDays) {
        const isOffShifts = offDay.shifts.filter((shift) => {
          const startTimeISO = DateTime.fromFormat(shift.startTime, "HH:mm", {
            zone: "Asia/Kolkata",
          }).toISOTime({ suppressSeconds: true });
          const endTimeISO = DateTime.fromFormat(shift.endTime, "HH:mm", {
            zone: "Asia/Kolkata",
          }).toISOTime({ suppressSeconds: true });
          const reqStartISOTime = DateTime.fromFormat(
            req.body.shift.startTime,
            "HH:mm",
            { zone: "Asia/Kolkata" }
          ).toISOTime({
            suppressSeconds: true,
          });
          const reqEndISOTime = DateTime.fromFormat(
            req.body.shift.endTime,
            "HH:mm",
            { zone: "Asia/Kolkata" }
          ).toISOTime({ suppressSeconds: true });

          return (
            endTimeISO === reqEndISOTime && startTimeISO === reqStartISOTime
          );
        });
        isOffDay = offDay.date === bookingDate && isOffShifts.length > 0;
        if (isOffDay) {
          const error = new Error(
            "This is offday of doctor. Reason: ${offDay.reason}"
          );
          error.statusCode = 400;
          throw error;
        }
      }
    }

    const foundShiftOpen = foundDoctor.shifts.find((shift) => {
      const startTimeISO = DateTime.fromFormat(shift.startTime, "HH:mm", {
        zone: "Asia/Kolkata",
      }).toISOTime({ suppressSeconds: true });
      const endTimeISO = DateTime.fromFormat(shift.endTime, "HH:mm", {
        zone: "Asia/Kolkata",
      }).toISOTime({ suppressSeconds: true });
      const reqStartISOTime = DateTime.fromFormat(
        req.body.shift.startTime,
        "HH:mm",
        { zone: "Asia/Kolkata" }
      ).toISOTime({
        suppressSeconds: true,
      });
      const reqEndISOTime = DateTime.fromFormat(
        req.body.shift.endTime,
        "HH:mm",
        { zone: "Asia/Kolkata" }
      ).toISOTime({ suppressSeconds: true });

      return endTimeISO === reqEndISOTime && startTimeISO === reqStartISOTime;
    });
    if (!foundShiftOpen) {
      const error = new Error("No shift available for the selected time");
      error.statusCode = 400;
      throw error;
    }

    let doctorSchedule = await Schedule.findOne({
      doctorId: foundDoctor._id,
      date: dateISO,
      // "shift._id": foundShiftOpen._id,
      "shift.startTime": foundShiftOpen.startTime,
      "shift.endTime": foundShiftOpen.endTime,
    });
    if (!doctorSchedule) {
      const error = new Error("Could not find the doctor schedule");
      error.statusCode = 400;
      throw error;
    }
    const appointments = await Appointment.find()
      .where("_id")
      .in(doctorSchedule.appointments);

    if (!appointments || appointments.length < 1) {
      return res.status(200).send({
        message: "No Appointment for this schedule",
        success: true,
      });
    } else {
      appointments.sort((a, b) => {
        const AStartTimeISO = DateTime.fromFormat(a.startTime, "HH:mm", {
          zone: "Asia/Kolkata",
        });
        const BStartTimeISO = DateTime.fromFormat(b.startTime, "HH:mm", {
          zone: "Asia/Kolkata",
        });
        return AStartTimeISO.diff(BStartTimeISO);
      });
      return res.status(200).send({
        success: true,
        doctorSchedule: doctorSchedule,
        appointments,
      });
    }
  } catch (err) {
    next(err);
  }
}
async function updateDoctorOffDays(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const doctor = await Doctor.findById(req.params.dId)
      .populate("owner")
      .exec();

    if (!doctor) {
      const error = new Error("There is no doctor with this doctor Id");
      error.statusCode = 404;
      throw error;
    }

    const hospital = await Hospital.findOne({
      "staff.doctors": doctor._id,
    });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    doctor.offDays = [...doctor.offDays, ...req.body.offDays];
    const doctorUpdateResponse = await doctor.save();
    res.status(200).json({
      doctor: doctorUpdateResponse,
      message: "Off days added successfully",
    });
  } catch (err) {
    next(err);
  }
}
async function createPastAppointment(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const patient = await Patient.findOne({ owner: req.params.pId })
      .populate({ path: "owner", select: "-password" })
      .exec();
    if (!patient) {
      const error = new Error("Patient document not found");
      error.statusCode = 404;
      throw error;
    }
    const hospital = await Hospital.findById(req.body.hospitalId);
    if (!hospital) {
      const error = new Error(
        "We are not able to find any hospital with this hospital Id"
      );
      error.statusCode = 404;
      throw error;
    }

    const foundDoctor = await Doctor.findById(req.body.dId)
      .populate("owner")
      .exec();

    if (!foundDoctor) {
      const error = new Error("There is no doctor with this doctor Id");
      error.statusCode = 404;
      throw error;
    }
    const bookingDuration = foundDoctor.appointmentDuration || 10;
    const bookingDate = DateTime.fromFormat(req.body.date, "yyyy-MM-dd", {
      zone: "Asia/Kolkata",
    });
    const bookingDateISO = bookingDate.toISODate();

    const doctorSchedule = await Schedule.findById(req.body.scheduleId);

    // if (!doctorSchedule) {
    // const newSchedule = new Schedule({
    //   doctorId: foundDoctor._id,
    //   date: bookingDateISO,
    //   shift: foundShiftOpen,
    // });

    // doctorSchedule = await newSchedule.save();
    if (!doctorSchedule) {
      const error = new Error("Could not create the doctor schedule document");
      error.statusCode = 400;
      throw error;
      // }
    }
    const bookingDateTime = DateTime.fromFormat(
      req.body.date + " " + req.body.bookingStart,
      "yyyy-MM-dd HH:mm",
      { zone: "Asia/Kolkata" }
    );
    const bookingStartTime = DateTime.fromFormat(
      req.body.bookingStart,
      "HH:mm",
      { zone: "Asia/Kolkata" }
    );
    const fromTimeISO = bookingStartTime
      .minus({ minutes: 10 })
      .toISOTime({ suppressSeconds: true });
    const toTimeISO = bookingStartTime
      .plus({ minutes: 10 })
      .toISOTime({ suppressSeconds: true });
    const existingAppointments = await Appointment.find()
      .where("_id")
      .in(doctorSchedule.appointments)
      .find({
        doctor: foundDoctor._id,
        date: bookingDateISO,
        startTime: {
          $gte: fromTimeISO,
          $lte: toTimeISO,
        },
      });
    if (existingAppointments.length > 0) {
      const error = new Error("appointment already exist at this time");
      error.statusCode = 400;
      throw error;
    }
    let bookedAppointment;
    const newAppointment = new Appointment({
      status: "approved",
      isConsultaionCompleted: true,
      prescriptions: req.body.prescriptions,
      testPrescribed: req.body.testPrescribed,
      notes: req.body.notes,
      fees: req.body.fees,
      startTime: req.body.bookingStart,
      bookingDateTime: bookingDateTime,
      duration: 10, //bookingDuration
      patient: patient._id,
      doctor: foundDoctor._id,
      date: bookingDateISO,
      ISTDateString: bookingDate.toLocaleString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      isConsultationCompleted: false,
    });
    bookedAppointment = await newAppointment.save();
    if (!bookedAppointment) {
      const error = new Error("Could not book the slot");
      error.statusCode = 400;
      throw error;
    }
    // await session.commitTransaction();
    // session.endSession();
    doctorSchedule.appointments.push(bookedAppointment._id);
    await doctorSchedule.save();

    patient.Appointments.push(bookedAppointment);
    await patient.save();
    const notifications = patient.owner.notifications;
    notifications.push({
      type: "status-updated",
      message: `your appointment has been consulted`,
      onCLickPath: "/appointments/" + req.params.aId,
      appointemntId: updatedAppointment._id,
    });
    await patient.owner.save();

    res.json({
      doctorSchedule,
      doctorId: foundDoctor._id,
      bookedAppointment: bookedAppointment,
      patient: patient,
    });
  } catch (err) {
    // await session.abortTransaction();
    // session.endSession();
    next(err);
  }
} // for inserting dummy data

async function getAllAppointmentOfPatient(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const currentPage = req.query.page || 1;
    const perPage = 6;
    let appointments;
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const patient = await Patient.findById(req.params.pId);
    if (!patient) {
      const error = new Error("Patient document not found");
      error.statusCode = 404;
      throw error;
    }
    if (req.query.date) {
      const date = DateTime.fromFormat(req.query.date, "yyyy-MM-dd", {
        zone: "Asia/Kolkata",
      });
      const dateISO = date.toISODate();

      appointments = await Appointment.find({
        date: dateISO,
        patient: patient._id,
      })
        .sort({ bookingDateTime: -1 })
        .countDocuments()
        .then((count) => {
          totalItems = count;
          return Appointment.find({ patient: patient._id, date: dateISO })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        });
      if (!appointments) {
        const error = new Error("No Appointment for this date is available.");
        error.statusCode = 400;
      }
    } else if (req.query.month) {
      const monthStart = DateTime.fromFormat(
        req.query.month + "-01",
        "yyyy-MM-dd",
        { zone: "Asia/Kolkata" }
      );
      const monthStartISO = monthStart.toISODate();
      const daysInMonth = monthStart.daysInMonth;
      const monthEndISO = DateTime.fromFormat(
        req.query.month + "-" + daysInMonth,
        "yyyy-MM-dd",
        { zone: "Asia/Kolkata" }
      ).toISODate();
      appointments = await Appointment.find({
        patient: patient._id,
        date: {
          $lte: monthEndISO,
          $gte: monthStartISO,
        },
      })
        .sort({ bookingDateTime: -1 })
        .countDocuments()
        .then((count) => {
          totalItems = count;
          return Appointment.find({
            patient: patient._id,
            date: {
              $lte: monthEndISO,
              $gte: monthStartISO,
            },
          })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        });
      if (!appointments) {
        const error = new Error("No Appointment for this month is available.");
        error.statusCode = 400;
      }
    } else {
      appointments = await Appointment.find({ patient: patient._id })
        .sort({ bookingDateTime: -1 })
        .countDocuments()
        .then((count) => {
          totalItems = count;
          return Appointment.find({ patient: patient._id })
            .sort({ bookingDateTime: -1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        });
      if (!appointments) {
        const error = new Error(
          "No Appointment for this patient is available. Book an appointment to see."
        );
        error.statusCode = 400;
      }
    }
    // const pastAppoinments = await patient.populate({path:'pastAppointments',perDocumentLimit:6});
    // const futureAppoinments = await patient.populate({path:'futureAppointments',perDocumentLimit:6});

    res.status(200).json({
      patient: patient,
      appointments: appointments,
    });
  } catch (err) {
    next(err);
  }
}
async function getAppointmentDetails(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const appointment = await Appointment.findById(req.params.aId)
      .populate("doctor patient")
      .exec();
    if (!appointment) {
      const error = new Error("Appointment document not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      appointment,
    });
  } catch (err) {
    next(err);
  }
}
async function getAllPatients(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }

    const patientName = req.query.patientName;

    let responseList = [];
    let patients = await Patient.find()
      .populate({ path: "owner", select: "-password" })
      .sort({ "name.firstName": 1 });

    if (patientName) {
      for (const patient of patients) {
        const totalAppointments = [...patient.Appointments];
        const thisHospitalPatient = await Appointment.find({
          _id: totalAppointments,
          doctor: hospital.staff.doctors,
        });
        const nameString =
          patient.name.firstName +
          " " +
          patient.name.middleName +
          " " +
          patient.name.lastName;
        const isMatch = nameString.includes(patientName);

        if (isMatch && thisHospitalPatient) {
          responseList.push(patient);
        }
      }

      if (responseList && responseList.length === 0) {
        const error = new Error("Could not find any document with this name");
        error.statusCode = 403;

        throw error;
      }
    } else {
      for (const patient of patients) {
        const totalAppointments = [...patient.Appointments];

        const thisHospitalPatient = await Appointment.find({
          _id: totalAppointments,
          hospitalId: hospital._id,
        });

        if (thisHospitalPatient) {
          responseList.push(patient);
        }
      }
      if (responseList && responseList.length === 0) {
        const error = new Error(
          "Could not find any document. There is no patient exists"
        );
        error.statusCode = 403;
        throw error;
      }
    }
    res.status(200).json({
      patientList: responseList,
    });
  } catch (err) {
    next(err);
  }
}
async function getPatientDetails(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const patient = await Patient.findById(req.params.pId);
    if (!patient) {
      const error = new Error("Could not find the patient document.");
      error.statusCode = 403;
      throw error;
    }
    const appointments = await Appointment.find({ _id: patient.Appointments });
    res.status(200).json({
      patient,
      appointments,
    });
  } catch (err) {
    next(err);
  }
}
async function getDoctorFees(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }
    const hospital = await Hospital.findOne({
      "staff.admins": admin._id,
    });

    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const currentPage = parseInt(req.query.page, 10) || 1;
    const perPage = 6;
    const doctor = await Doctor.findById(req.params.dId);
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
      throw error;
    }

    const scheduleList = await Schedule.find({ doctorId: doctor._id }).populate(
      "appointments"
    );
    if (!scheduleList) {
      const error = new Error("Could not find the schedule documents.");
      error.statusCode = 403;
      throw error;
    }
    const fees = [];
    const today = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" });
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    for (let i = start; i < end; i++) {
      const newDate = today.minus({ days: i }).toISODate();
      // console.log(newDate)
      fees.push({
        date: newDate,
        totalFees: 0,
        appointments: [],
        dailyCount: 0,
      });
      for (const schedule of scheduleList) {
        if (schedule.date === newDate) {
          const fee = fees.find((fee) => {
            return fee.date === newDate;
          });
          let totalFees = 0;
          let dailyCount = 0;
          if (fee) {
            totalFees = fee.totalFees;
            dailyCount = fee.dailyCount;
          }
          totalFees += schedule.totalFees;
          dailyCount += schedule.shiftTotalCount;
          fee.totalFees = totalFees;
          fee.dailyCount = dailyCount;
          fee.appointments = [...fee.appointments, ...schedule.appointments];
        }
      }
    }

    res.json({ fees, currentPage, doctor: doctor });
  } catch (err) {
    next(err);
  }
}
async function getAllNotificationController(req, res, next) {
  try {
    const user = await User.findById(req.userId, "-password");
    if (!user) {
      const error = new Error("Could not fetch user");
      throw error;
    }
    const notifications = user.notifications; //extract notification
    user.seenNotifications.push(...notifications); //push to seenNotification
    user.notifications = []; // empty notification
    const updatedUser = await user.save();
    if (!updatedUser) {
      const error = new Error("Error in notification");
      throw error;
    }
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      notifications: notifications,
      seenNotifications: user.seenNotifications,
    });
  } catch (error) {
    next(error);
  }
}
async function deleteAllNotificationController(req, res, next) {
  try {
    const user = await User.findById(req.userId, "-password");
    if (!user) {
      const error = new Error("Could not fetch user");
      throw error;
    }
    user.notifications = [];
    user.seenNotifications = [];
    const updatedUser = await user.save();
    if (!updatedUser) {
      const error = new Error("unable to delete all notifications");
      throw error;
    }
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}
// async function resheduleAppointment(req,res,next){
//   const errors = validationResult(req);
//   try {
//     if (!errors.isEmpty()) {
//       const error = new Error("Validation failed.");
//       error.statusCode = 422;
//       error.data = errors.array();
//       throw error;
//     }
//     const admin = await User.findById(req.userId);
//     if (!admin) {
//       const error = new Error("Could not find the admin document.");
//       error.statusCode = 403;
//       throw error;
//     }

//     const hospital = await Hospital.findOne({ "staff.admins": req.userId });
//     if (!hospital) {
//       const error = new Error("Could not find the hospital document.");
//       error.statusCode = 403;
//       throw error;
//     }
//     const foundDoctor = await Doctor.findById(req.params.dId)
//       .populate("owner")
//       .exec();

//     if (!foundDoctor) {
//       const error = new Error("There is no doctor with this doctor Id");
//       error.statusCode = 404;
//       throw error;
//     }

//     const patient = await Patient.findOne({ Appointments: req.params.aId })
//       .populate("owner")
//       .exec();

//     if (!patient && !patient.owner) {
//       const error = new Error(
//         "There is no patient with who has this appointment Id."
//       );
//       error.statusCode = 404;
//       throw error;
//     }
//     const bookingDateTime = DateTime.fromFormat(req.body.date+' '+req.body.bookingStart,'yyyy-MM-dd HH:mm',{zone:'Asia/Kolkata'})

//     const bookingDateISO = bookingDateTime.toISODate();
//     const nowDate = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" });
//     const futureDeadline = nowDate.plus({ days: 7 });
//     const futureDeadlineISODate = futureDeadline.toISODate();

//     if (
//       bookingDateISO > futureDeadlineISODate &&
//       bookingDateTime.toISOTime({suppressSeconds:true}) >
//         futureDeadline.toISOTime({ suppressSeconds: true })
//     ) {
//       const error = new Error(
//         "Booking more than a week in advance is not allowed"
//       );
//       error.statusCode = 400;
//       throw error;
//     }

//     if (
//       bookingDateTime < nowDate) {
//       const error = new Error("Booking in the past is not possible");
//       error.statusCode = 400;
//       throw error;
//     }

//     let isOffDay;
//     const bookingDuration = foundDoctor.appointmentDuration || 10;
//     if (foundDoctor.offDays.length > 0) {
//       for (const offDay of foundDoctor.offDays) {
//         const isOffShifts = offDay.shifts.filter((shift) => {
//           const startTimeISO = DateTime.fromFormat(shift.startTime, "HH:mm", {
//             zone: "Asia/Kolkata",
//           }).toISOTime({ suppressSeconds: true });
//           const endTimeISO = DateTime.fromFormat(shift.endTime, "HH:mm", {
//             zone: "Asia/Kolkata",
//           }).toISOTime({ suppressSeconds: true });
//           const bookingStartTime = DateTime.fromFormat(
//             req.body.bookingStart,
//             "HH:mm",
//             { zone: "Asia/Kolkata" }
//           );
//           const bookingstartTimeISOTime = bookingStartTime.toISOTime({
//             suppressSeconds: true,
//           });
//           const bookingEndISOTime = bookingStartTime
//             .plus({ minutes: 15 })
//             .toISOTime({ suppressSeconds: true });

//           return (
//             endTimeISO >= bookingEndISOTime &&
//             startTimeISO <= bookingstartTimeISOTime
//           );
//         });
//         isOffDay = offDay.date === bookingDateISO && isOffShifts.length > 0;
//         if (isOffDay) {
//           const error = new Error(
//             "Doctor is on a off Day doctor. Reason: ${offDay.reason}"
//           );
//           error.statusCode = 400;
//           throw error;
//         }
//       }
//     }
//   const  fromTime=bookingDateTime.toISOTime({suppressSeconds:true});
//   const toTime =bookingDateTime.plus({minutes:15}).toISOTime({suppressSeconds:true});
//     let doctorSchedule = await Schedule.findOne({
//       date:bookingDateISO,
//       "shift.startTime":{
//         $lte:fromTime
//       },
//       "shift.endTime":{
//         $gte:toTime
//       }
//     });

//     if (!doctorSchedule) {
//       const error = new Error("Could not find the doctor schedule document");
//       error.statusCode = 400;
//       throw error;
//     }
//     if (doctorSchedule.date !== bookingDateISO) {
//       const error = new Error(
//         "Appointment Not Available at this point, please enter a diffrent date"
//       );
//       error.statusCode = 400;
//       throw error;
//     }
//     const bookingStartTime = DateTime.fromFormat(
//       req.body.bookingStart,
//       "HH:mm",
//       { zone: "Asia/Kolkata" }
//     );
//     const fromTimeISO = bookingStartTime
//       .minus({ minutes: 10 })
//       .toISOTime({ suppressSeconds: true });
//     const toTimeISO = bookingStartTime
//       .plus({ minutes: 10 })
//       .toISOTime({ suppressSeconds: true });

//     const existingAppointments = await Appointment.find()
//       .where("_id")
//       .in(doctorSchedule.appointments)
//       .find({
//         doctor: foundDoctor._id,
//         date: bookingDateISO,
//         startTime: {
//           $gte: fromTimeISO,
//           $lte: toTimeISO,
//         },
//       });

//     if (existingAppointments.length > 0) {
//       const error = new Error(
//         "Appointment Not Available at this point, please enter a diffrent time"
//       );
//       error.statusCode = 400;
//       throw error;
//     }
//     const ISTString =bookingDateTime.toLocaleString("en-IN", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     const updateAppointment = await Appointment.updateOne(
//       {
//         _id: req.params.aId,
//       },
//       { date:bookingDateISO,
//         startTime:req.body.bookingStart,
//         bookingDateTime:bookingDateTime,
//         ISTDateString:ISTString
//        }
//     );

//     if (!updateAppointment || updateAppointment.modifiedCount<1) {
//       const error = new Error("Could not update the appoinment status");
//       error.statusCode = 400;
//       throw error;
//     }
//     let error;
//     const time = DateTime.fromFormat(req.body.bookingStart,"HH:mm",{zone:'Asia/Kolkata'});
//     const timeString=  time.toLocaleString({hour:'numeric',minute:'2-digit'}).toLowerCase();
//     const notifcations = patient.owner.notifications;
//     notifcations.push({
//       type: "status-updated",
//       message: `your appointment has been updated to time :${timeString} and date:${ISTString}`,
//       onCLickPath: "/appointmnets/" + req.params.aId,
//       appointmentId: req.params.aId,
//     });
//     const patientUpdateResult = await patient.owner.save();

//     if (!patientUpdateResult) {
//       error = new Error("Could not update the patient notifications");
//       error.statusCode = 400;
//     }
//     return res.status(200).send({
//       success: true,
//       error,
//       doctorId: foundDoctor._id,
//       updateAppointment,
//     });
//   } catch (err) {
//     next(err);
//   }
// }
async function getDoctorConsult(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.admins": req.userId });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }

    const foundDoctor = await Doctor.findById(req.params.dId)
      .populate("owner")
      .exec();

    if (!foundDoctor) {
      const error = new Error("There is no doctor with this doctor Id");
      error.statusCode = 404;
      throw error;
    }

    const nowDate = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" });
    const nowDateISODate = nowDate.toISODate();
    // console.log(bookingDate)

    let isOffDay;
    const bookingDuration = foundDoctor.appointmentDuration || 10;
    if (foundDoctor.offDays.length > 0) {
      for (const offDay of foundDoctor.offDays) {
        const isOffShifts = offDay.shifts.filter((shift) => {
          const startTimeISO = DateTime.fromFormat(shift.startTime, "HH:mm", {
            zone: "Asia/Kolkata",
          }).toISOTime({ suppressSeconds: true });
          const endTimeISO = DateTime.fromFormat(shift.endTime, "HH:mm", {
            zone: "Asia/Kolkata",
          }).toISOTime({ suppressSeconds: true });

          return (
            endTimeISO >= nowDate.toISOTime({ suppressSeconds: true }) &&
            startTimeISO <= nowDate.toISOTime({ suppressSeconds: true })
          );
        });
        isOffDay = offDay.date === bookingDate && isOffShifts.length > 0;
        if (isOffDay) {
          const error = new Error(
            "This is offday of doctor. Reason: ${offDay.reason}"
          );
          error.statusCode = 400;
          throw error;
        }
      }
    }

    const foundShiftOpen = foundDoctor.shifts.find((shift) => {
      const startTimeISO = DateTime.fromFormat(shift.startTime, "HH:mm", {
        zone: "Asia/Kolkata",
      }).toISOTime({ suppressSeconds: true });
      const endTimeISO = DateTime.fromFormat(shift.endTime, "HH:mm", {
        zone: "Asia/Kolkata",
      }).toISOTime({ suppressSeconds: true });

      return (
        endTimeISO >= nowDate.toISOTime({ suppressSeconds: true }) &&
        startTimeISO <= nowDate.toISOTime({ suppressSeconds: true })
      );
    });
    if (!foundShiftOpen) {
      const error = new Error("No shift available for the selected time");
      error.statusCode = 400;
      throw error;
    }

    let doctorSchedule = await Schedule.findOne({
      doctorId: foundDoctor._id,
      date: nowDateISODate,
      // "shift._id": foundShiftOpen._id,
      "shift.startTime": foundShiftOpen.startTime,
      "shift.endTime": foundShiftOpen.endTime,
    });
    if (!doctorSchedule) {
      const error = new Error(
        "Could not found the doctor schedule document, no one has booked any appointment for this day and shift."
      );
      error.statusCode = 400;
      throw error;
    }
    const appointments = await Appointment.find({
      isConsultationCompleted: false,
    })
      .where("_id")
      .in(doctorSchedule.appointments);

    if (!appointments || appointments.length < 1) {
      return res.status(200).send({
        message:
          "No Appointment for this schedule. The appointment has already been consulted",
        success: true,
      });
    } else {
      appointments.sort((a, b) => {
        const AStartTimeISO = DateTime.fromFormat(a.startTime, "HH:mm", {
          zone: "Asia/Kolkata",
        });
        const BStartTimeISO = DateTime.fromFormat(b.startTime, "HH:mm", {
          zone: "Asia/Kolkata",
        });
        return AStartTimeISO.diff(BStartTimeISO);
      });

      return res.status(200).send({
        success: true,
        schedule: doctorSchedule,
        appointments,
      });
    }
  } catch (err) {
    next(err);
  }
}
async function getHospital(req, res, next) {
  try {
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({
      "staff.admins": req.userId,
    }).populate("staff.chiefDoctor");
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }

    const chiefDoctor = await Doctor.findById(hospital.staff.chiefDoctor)
      .populate({
        path: "owner",
        select: "-password", // Exclude the password field
      })
      .exec();
    if (!chiefDoctor) {
      const error = new Error("Could not find the chiefDoctor Document");
      error.statusCode = 403;
      throw error;
    }

    res.json({
      chiefDoctor: chiefDoctor,
      hospital: hospital,
    });
  } catch (err) {
    next(err);
  }
}
async function getDoctorFeesDetails(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const doctor = await Doctor.findById(req.params.dId);
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
      throw error;
    }
    const hospital = await Hospital.findOne({
      "staff.admins": admin._id,
    });

    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    const scheduleList = await Schedule.find({ doctorId: doctor._id }).populate(
      "appointments"
    );
    if (!scheduleList) {
      const error = new Error("Could not find the schedule documents.");
      error.statusCode = 403;
      throw error;
    }

    const date = DateTime.fromFormat(req.params.date, "yyyy-MM-dd", {
      zone: "Asia/Kolkata",
    });
    // console.log(date.toISODate())
    // console.log(newDate)
    const fee = {
      date: date.toISODate(),
      totalFees: 0,
      appointments: [],
      dailyCount: 0,
    };
    for (const schedule of scheduleList) {
      if (schedule.date === fee.date) {
        let totalFees = 0;
        let dailyCount = 0;
        totalFees = fee.totalFees;
        dailyCount = fee.dailyCount;
        totalFees += schedule.totalFees;
        dailyCount += schedule.shiftTotalCount;
        fee.totalFees = totalFees;
        fee.dailyCount = dailyCount;
        fee.appointments = [...fee.appointments, ...schedule.appointments];

        break;
      }
    }

    res.status(200).json({ fee, doctor: doctor });
  } catch (err) {
    next(err);
  }
}
async function getReports(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }
    const hospital = await Hospital.findOne({
      "staff.admins": admin._id,
    });

    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }

    let appointments;
    if (req.query.date) {
      appointments = await Appointment.find({
        hospitalId: hospital._id,
        date: req.query.date,
      }).sort({ bookingDateTime: -1 });
    
      if (!appointments) {
        const error = new Error(
          "Could not find the appointments for this hospital"
        );
        error.statusCode = 403;
        throw error;
      }
      let totalFeesOfHospital= 0;
      for(const appointment of appointments){
        if(appointment.fees && appointment.fees.totalAmount){
          totalFeesOfHospital+= appointment.fees.totalAmount
        }
      }
      doctorList = [];
      for (const doc of hospital.staff.doctors) {
        const doctor = await Doctor.findById(doc);
      

        const appointmentsForThisDoctor = appointments.filter((a)=>a.doctor.toString() === doc.toString())
        let totalFees=0;
        for(const appointment of appointmentsForThisDoctor){
          if(appointment.fees && appointment.fees.totalAmount){
            totalFees+= appointment.fees.totalAmount
          }
        }

      
        const patientList = await Patient.find({
          _id: { $in: appointmentsForThisDoctor.map((a) => a.patient) },
        });
        

        doctorList.push({
          doctor:doctor,
          date:req.query.date,
          appointments: appointmentsForThisDoctor,
          totalAppointments: appointmentsForThisDoctor.length,
          totalPatients:patientList.length,
          patientList:patientList,
          totalFees: totalFees,
        });
      }
      res.json({
        reports: { date:req.query.date,
          hospitalTotalAppointments: appointments.length,
          doctorList: doctorList,
          totalFeesOfHospital: totalFeesOfHospital,
        },
      });
    } else if (req.query.month) {

    
    
      const s=req.query.month + "-01"
      const monthStart = DateTime.fromFormat(
       s,
        "yyyy-MM-dd",
        { zone: "Asia/Kolkata" }
      );

      const monthStartISO = monthStart.toISODate();
      const daysInMonth = monthStart.daysInMonth;
      const monthEndISO = DateTime.fromFormat(
        req.query.month + "-" + daysInMonth,
        "yyyy-MM-dd",
        { zone: "Asia/Kolkata" }
      ).toISODate();
      
      appointments = await Appointment.find({
        hospitalId:hospital,        date: {
          $lte: monthEndISO,
          $gte: monthStartISO,
        },
      }).sort({ bookingDateTime: -1 });
     
      if (!appointments) {
        const error = new Error(
          "Could not find the appointments for this hospital"
        );
        error.statusCode = 403;
        throw error;
      }
      let totalFeesOfHospital= 0;
      for(const appointment of appointments){
        if(appointment.fees && appointment.fees.totalAmount){
          totalFeesOfHospital+= appointment.fees.totalAmount
        }
      }
      doctorList = [];
      for (const doc of hospital.staff.doctors) {
        const doctor = await Doctor.findById(doc).populate({path:'owner',select:'-password'}).exec();
      

        const appointmentsForThisDoctor = appointments.filter((a)=>a.doctor.toString() === doc.toString())
        let totalFees=0;
        for(const appointment of appointmentsForThisDoctor){
          if(appointment.fees && appointment.fees.totalAmount){
            totalFees+= appointment.fees.totalAmount
          }
        }

      
        const patientList = await Patient.find({
          _id: { $in: appointmentsForThisDoctor.map((a) => a.patient) },
        });
        

        doctorList.push({
          doctor:doctor,
          month:req.query.month,
          appointments: appointmentsForThisDoctor,
          totalAppointments: appointmentsForThisDoctor.length,
          totalPatients:patientList.length,
          patientList:patientList,
          totalFees: totalFees,
        });
      }
      res.json({
        reports: {
          month:req.query.month,
          hospitalTotalAppointments: appointments.length,
          doctorList: doctorList,
          totalFeesOfHospital: totalFeesOfHospital,
        },
      });

    }
  } catch (err) {
    next(err);
  }
}
async function getReportDetails(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const admin = await User.findById(req.userId);
    if (!admin) {
      const error = new Error("Could not find the admin document.");
      error.statusCode = 403;
      throw error;
    }

    const doctor = await Doctor.findById(req.params.dId);
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
      throw error;
    }
    const hospital = await Hospital.findOne({
      "staff.admins": admin._id,
    });

    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }
    if(req.query.date){
      const appointments = await Appointment.find({
        date:req.query.date,
        doctor:doctor._id
      }).sort({bookingDateTime:-1});
      if (!appointments) {
        const error = new Error(
          "Could not find the appointments for this hospital"
        );
        error.statusCode = 403;
        throw error;
      }
      let totalFees=0;
      for(const appointment of appointments){
        if(appointment.fees && appointment.fees.totalAmount){
          totalFees+= appointment.fees.totalAmount
        }
      }

    
      const patientList = await Patient.find({
        _id: { $in: appointments.map((a) => a.patient) },
      });
      


    const reportDetails = {
      doctor,
      appointments: appointments,
      totalAppointments: appointments.length,
      patientList,
      totalFees: totalFees,
    };
    res.json({
      reportDetails:reportDetails
    })
  } else if(req.query.month){
    const s=req.query.month + "-01"
    const monthStart = DateTime.fromFormat(
     s,
      "yyyy-MM-dd",
      { zone: "Asia/Kolkata" }
    );

    const monthStartISO = monthStart.toISODate();
    const daysInMonth = monthStart.daysInMonth;
    const monthEndISO = DateTime.fromFormat(
      req.query.month + "-" + daysInMonth,
      "yyyy-MM-dd",
      { zone: "Asia/Kolkata" }
    ).toISODate();
    
   const appointments = await Appointment.find({
     doctor:doctor._id,        date: {
        $lte: monthEndISO,
        $gte: monthStartISO,
      },
    }).sort({ bookingDateTime: -1 });
   
    if (!appointments) {
      const error = new Error(
        "Could not find the appointments for this hospital"
      );
      error.statusCode = 403;
      throw error;
    }
    let totalFees=0;
    for(const appointment of appointments){
      if(appointment.fees && appointment.fees.totalAmount){
        totalFees+= appointment.fees.totalAmount
      }
    }

  
    const patientList = await Patient.find({
      _id: { $in: appointments.map((a) => a.patient) },
    });
    


  const reportDetails = {
    doctor,
    appointments: appointments,
    totalAppointments: appointments.length,
    patientList,
    totalFees: totalFees,
  };


  res.json({
    reportDetails
  })
  }

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAdminDashboard: getAdminDashboard,
  getStaff,
  getNurses,
  getDoctors,
  getAdmins,
  getReceptionists,
  getStaffByName,
  getStaffById,
  createNewStaff,
  updateStaffDetails,
  deleteStaff,
  updateStatusMany,
  updateStatusOne,
  getDoctorSchedule,
  updateDoctorOffDays,
  createPastAppointment,
  getAppointmentDetails,
  getAllAppointmentOfPatient,
  getAllPatients,
  getPatientDetails,
  getDoctorFees,
  getAllNotificationController,
  deleteAllNotificationController,
  getDoctorConsult,
  getHospital,
  getDoctorFeesDetails,
  getReports,
  getReportDetails,
  // resheduleAppointment
};
