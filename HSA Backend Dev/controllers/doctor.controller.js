const { Hospital, Nurse, Receptionist } = require("../models/hospital");
const mongoose = require("mongoose");
const Doctor = require("../models/doctor");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { Appointment } = require("../models/appointments");
const { Schedule } = require("../models/doctorSchedule");
const { DateTime } = require("luxon");
const Patient = require("../models/patient");
function getDoctorDashboard(req, res, next) {
  //gets the home data such as current appointments and and today's scheduled appointments.
  //this will use the id suuplied by req.params.id
  res.json({ message: "In Doctor Routes" });
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

    const doctor = await Doctor.findOne({ owner: req.userId });
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
      throw error;
    }
    const hospital = await Hospital.findOne({ "staff.doctors": doctor._id});
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }

    const patientName = req.query.patientName;

    let responseList = [];
    let patients = await Patient.find().populate({path:'owner',select:"-password"}).sort({ "name.firstName": 1 });

    if (patientName) {
      for (const patient of patients) {
        const totalAppointments = [
          ...patient.Appointments,
        ];
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
        const totalAppointments = [
          ...patient.Appointments,
        
        ];

  
        const thisHospitalPatient = await Appointment.find({
          _id: totalAppointments,
          hospitalId:hospital._id
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
    patientList:  responseList,
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

    const doctor = await Doctor.findOne({ owner: req.userId });
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
      throw error;
    }

    const hospital = await Hospital.findOne({ "staff.doctors": doctor._id });
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
    const appointments=await Appointment.find({_id:patient.Appointments});

    res.status(200).json({
      patient,
      appointments
    });
  } catch (err) {
    next(err);
  }
}

function reshedulePatientById(req, res, next) {
  // if doctor has to reschedule a single patient.
}
async function getProfile(req, res, next) {
  try {
    const doctor = await Doctor.findOne({ owner: req.userId })
      .populate({
        path: "owner",
        select: "-password", // Exclude the password field
      })
      .exec();
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
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

    res.json({ doctor: doctor });
  } catch (err) {
    next(err);
  }
}
async function updateProfile(req, res, next) {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const doctor = await Doctor.findOne({ owner: req.userId });
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
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

    doctor.address = {
      state: req.body.address.state || "",
      district: req.body.address.district || "",
      city: req.body.address.city || "",
      streetAddress: [
        req.body.address.streetAddress1 || "",
        req.body.address.streetAddress2 || "",
      ],
      postalCode: req.body.address.postalCode || "",
      landmark: req.body.address.landmark || "",
    };
    doctor.name = req.body.name;
    doctor.educationQualification = req.body.educationQualification;
    doctor.specialty = req.body.specialty;
    doctor.yearOfRegistration = req.body.yearOfRegistration;
    doctor.registrationNumber = req.body.registrationNumber;
    doctor.stateMedicalCouncil = req.body.stateMedicalCouncil;
    doctor.age = req.body.age;
    doctor.sex = req.body.sex;
    doctor.shifts = req.body.shifts;
    doctor.phoneNumber = req.body.phoneNumber;
    doctor.appointmentDuration = req.body.appointmentDuration;
    const savedDoctorDoc = await doctor.save();
    if (!savedDoctorDoc) {
      const error = new Error("Could not update the doctor  document.");
      error.statusCode = 403;
      throw error;
    }
    const doctorUserDoc = await User.findByIdAndUpdate(doctor.owner, {
      $set: {
        name: req.body.name,
        email: req.body.email,
      },
    });
    if (!doctorUserDoc) {
      const error = new Error("Could not update the doctor user document.");
      error.statusCode = 403;
      throw error;
    }
    // await session.commitTransaction();
    // session.endSession();
    res.json({
      message: "Doctor Profile Updated",
      doctorUser: doctorUserDoc,
      doctor: savedDoctorDoc,
    });
  } catch (err) {
    // await session.abortTransaction();
    // session.endSession();
    next(err);
  }
  // uploads the changes in profile using req.body and doctor model.
}

async function updateOffDays(req, res, next) {
  // any  change in schedule such as taking holidays, this must be done prior to the day which is holiday.
  // or a gap of 7 days need to be given to patient to bookAppointments
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const doctor = await Doctor.findOne({ owner: req.userId })
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
      message: "Off days addeds successfully",
    });
  } catch (err) {
    next(err);
  }
}
// async function getAllPatientsForDoctor(req,res,next){
//   try {
//     const doctor = await Doctor.findOne({ owner: req.userId })
//       .populate({
//         path: "owner",
//         select: "-password", // Exclude the password field
//       })
//       .exec();
//     if (!doctor) {
//       const error = new Error("Could not find the Doctor document.");
//       error.statusCode = 403;
//       throw error;
//     }
//     const hospital = await Hospital.findOne({
//       "staff.doctors": doctor._id,
//     });

//     if (!hospital) {
//       const error = new Error("Could not find the hospital document.");
//       error.statusCode = 403;
//       throw error;
//     }
//     const doctorUserDoc = await User.findById(doctor.owner, "-password");
//     if (!doctorUserDoc) {
//       const error = new Error("Could not find the doctor user document.");
//       error.statusCode = 403;
//       throw error;
//     }

//   }catch(err){
//     next(err);
//   }

// }
async function getSchedule(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const foundDoctor = await Doctor.findOne({ owner: req.userId })
      .populate("owner")
      .exec();

    if (!foundDoctor) {
      const error = new Error("There is no doctor with this doctor Id");
      error.statusCode = 404;
      throw error;
    }

    const hospital = await Hospital.findOne({
      "staff.doctors": foundDoctor._id,
    });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
      throw error;
    }

    const date = DateTime.fromFormat(req.body.date, "yyyy-MM-dd", {
      zone: "Asia/Kolkata",
    });

    const dateISO = date.toISODate();

    let isOffDay;

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
      const error = new Error("Could not find the doctor schedule document");
      error.statusCode = 400;
      throw error;
    }
    const appointments = await Appointment.find({ status: "approved" })
      .where("_id")
      .in(doctorSchedule.appointments);

    if (!appointments || appointments.length < 1) {
      const error = new Error(
        "No appointments available for the selected time"
      );
      error.statusCode = 400;
      throw error;
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
async function completedConsultation(req, res, next) {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const doctor = await Doctor.findOne({ owner: req.userId });
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
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
    let doctorSchedule = await Schedule.findOne({
      appointments: req.params.aId,
    });
    if (!doctorSchedule) {
      const error = new Error("Could not create the doctor schedule document");
      error.statusCode = 400;
      throw error;
    }

    const nowDate = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" });
    const nowDateISODate = nowDate.toISODate();
    const nowDateISOTime = nowDate.toISOTime({ suppressSeconds: true });
    const fromDateISOTime = nowDate
      .minus({ minutes: 10 })
      .toISOTime({ suppressSeconds: true })
    const toDateISOTime = nowDate
      .plus({ minutes: 10 })
      .toISOTime({ suppressSeconds: true })
    const feesObj = {
      totalAmount: req.body.feesStructure.reduce(
        (total, fee) => total +parseInt( fee.amount,10),
      0),
      feesStructure: req.body.feesStructure,
    };
    const updateAppointment = await Appointment.updateOne(
      {
        _id: req.params.aId,
        date: nowDateISODate,
        status: "approved",

        isConsultationCompleted: false,
        // startTime: { $lte: toDateISOTime, $gte: fromDateISOTime },
      },
      {
        isConsultationCompleted: true,
        prescriptions: req.body.prescriptions,
        testPrescribed: req.body.testPrescribed,
        notes: req.body.notes,
        fees: feesObj,
        yearlyAppoitmentCount: doctor.yearlyAppointmentCount + 1,
        dailyAppoitmentCount: doctorSchedule.shiftTotalCount + 1,
      }
    );
    if (!updateAppointment) {
      const error = new Error("Could not update the appoinment.");
      error.statusCode = 400;
      throw error;
    }
    if (
      updateAppointment.modifiedCount < 1 &&
      updateAppointment.upsertedCount < 1
    ) {
      const error = new Error(
        "The query was successfull but could not update the document.The appointment consultation may be complete or you are editing after time"
      );
      error.statusCode = 400;
      throw error;
    }
    const yearlyAppointmentCount = doctor.yearlyAppointmentCount + 1;
    doctor.yearlyAppointmentCount = yearlyAppointmentCount;
    const updateYearlyCount = await doctor.save();
    if (!updateYearlyCount) {
      const error = new Error(
        "Could not update the yearly shift count to doctor document"
      );
      error.statusCode = 400;
      throw error;
    }
    const totalShiftCount = doctorSchedule.shiftTotalCount + 1;

    doctorSchedule.shiftTotalCount = totalShiftCount;
    doctorSchedule.totalFees += feesObj.totalAmount;
    const updateShiftCount = await doctorSchedule.save();
    if (!updateShiftCount) {
      const error = new Error(
        "Could not update the shift count to schedule document"
      );
      error.statusCode = 400;
      throw error;
    }
    const app = await Appointment.findById(req.params.aId);

    const admin = await User.find({ id: hospital.staff.admins });
    const notifcations = admin.notifications;
    notifcations.push({
      type: "consultation completed",
      message: `the consultation is complete for this ${app.patientName}`,
      onCLickPath: "/appointmnets/" + req.params.aId,
      appointmentId: req.params.aId,
    });
    const adminUpdateResult = await admin.save();
    let isAdminNotified;
    if (!adminUpdateResult) {
      isAdminNotified = false;
    }
    isAdminNotified = true;

    return res.status(200).send({
      success: true,
      updateAppointment,
      isAdminNotified: isAdminNotified,
    });
  } catch (err) {
    next(err);
  }
}
async function getConsult(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const foundDoctor = await Doctor.findOne({ owner: req.userId })
      .populate("owner")
      .exec();

    if (!foundDoctor) {
      const error = new Error("There is no doctor with this doctor Id");
      error.statusCode = 404;
      throw error;
    }

    const hospital = await Hospital.findOne({
      "staff.doctors": foundDoctor._id,
    });
    if (!hospital) {
      const error = new Error("Could not find the hospital document.");
      error.statusCode = 403;
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
      status: "approved",
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
    const doctor = await Doctor.findOne({ owner: req.userId });
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
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
        req.query.month+"-01",
      "yyyy-MM-dd",
      { zone: "Asia/Kolkata" }
    );
    const monthStartISO = monthStart.toISODate();
    const daysInMonth = monthStart.daysInMonth;
    const monthEndISO = DateTime.fromFormat(
       req.query.month+"-"+  daysInMonth,
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
    const doctor = await Doctor.findOne({ owner: req.userId });
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
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
    const appointment = await Appointment.findById(req.params.aId)
      .populate("doctor patient")
      .exec();
    if (!appointment) {
      const error = new Error("Appointment document not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      appointment
    });
  } catch (err) {
    next(err);
  }
}

async function getFees(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const currentPage = parseInt(req.query.page,10) || 1;
    const perPage = 6;
    const doctor = await Doctor.findOne({ owner: req.userId });
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
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
    const scheduleList = await Schedule.find({ doctorId: doctor._id }).populate('appointments');
    if (!scheduleList) {
      const error = new Error("Could not find the schedule documents.");
      error.statusCode = 403;
      throw error;
    }
    const fees = [];
    const today = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" });
  const start = (currentPage-1)*perPage;
  const end=start+perPage;
    for (let i = start; i <end; i++) {
      const newDate = today.minus({ days: i }).toISODate();
      // console.log(newDate)
    fees.push({
      date:newDate,
      totalFees:0,
      appointments:[],
      dailyCount:0,
    })
      for (const schedule of scheduleList) {
        if (schedule.date === newDate ) {
          const fee=fees.find((fee)=>{
          return  fee.date===newDate
          })
          let totalFees=0;
          let dailyCount=0;
          if(fee){
            totalFees= fee.totalFees;
            dailyCount=fee.dailyCount;
          }
          totalFees += schedule.totalFees;
          dailyCount+=schedule.shiftTotalCount;
          fee.totalFees= totalFees;
          fee.dailyCount=dailyCount
          fee.appointments= [...fee.appointments,...schedule.appointments]   
        }
    }
  }


    res.json({ fees,currentPage:currentPage });
  } catch (err) {
    next(err);
  }
}
async function getFeesDetails(req,res,next){
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
   
    const doctor = await Doctor.findOne({ owner: req.userId });
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
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
    const scheduleList = await Schedule.find({ doctorId: doctor._id }).populate('appointments');
    if (!scheduleList) {
      const error = new Error("Could not find the schedule documents.");
      error.statusCode = 403;
      throw error;
    }

    const date = DateTime.fromFormat(req.params.date,"yyyy-MM-dd", { zone: "Asia/Kolkata" });
    // console.log(date.toISODate())
      // console.log(newDate)
    const fee={
      date:date.toISODate(),
      totalFees:0,
      appointments:[],
      dailyCount:0,
    };
      for (const schedule of scheduleList) {
      
        if (schedule.date ===fee.date) {
          
          let totalFees=0;
          let dailyCount=0;
            totalFees= fee.totalFees;
            dailyCount=fee.dailyCount;
          totalFees += schedule.totalFees;
          dailyCount+=schedule.shiftTotalCount;
          fee.totalFees= totalFees;
          fee.dailyCount=dailyCount
          fee.appointments= [...fee.appointments,...schedule.appointments]   
          
          break;
        }
    }
    
    res.status(200).json({ fee });
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
   

    const doctor = await Doctor.findOne({owner:req.userId});
    if (!doctor) {
      const error = new Error("Could not find the Doctor document.");
      error.statusCode = 403;
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
      date:req.query.date,
      patientList,
      totalPatients:patientList.length,
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
    totalPatients:patientList.length,
    month:req.query.month,
    patientList,
    totalFees: totalFees,
  };

  res.json({
    reportDetails:reportDetails
  })

  }
  } catch (error) {
    next(error);
  }
}
module.exports = {
  getDoctorDashboard: getDoctorDashboard,
  getAllPatients,
  getPatientDetails,
  reshedulePatientById: reshedulePatientById,
  getProfile: getProfile,
  updateProfile: updateProfile,
  updateOffDays,
  completedConsultation,
  getSchedule,
  getConsult,
  getAppointmentDetails,
  getAllAppointmentOfPatient,
  getFees,
  getFeesDetails,
  getReports,
};
