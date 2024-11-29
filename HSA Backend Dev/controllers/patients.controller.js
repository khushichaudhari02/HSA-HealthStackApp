const Patient = require("../models/patient");
const User = require("../models/user");
const { Appointment } = require("../models/appointments");
const { validationResult } = require("express-validator");
const { Slot, Schedule } = require("../models/doctorSchedule");
const { Hospital } = require("../models/hospital");
const Doctor = require("../models/doctor");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");

async function getPatientDashboard(req, res, next) {
  try {
    const patient = await Patient.findOne({ owner: req.userId })
      .populate({
        path: "owner",
        select: "-password",
        // Exclude the password field
      })
      .exec();
    if (!patient) {
    }
    const appointments = await Appointment.find({ _id: patient.Appointments }).sort({bookingDateTime:-1});
    if (!appointments) {
      const error = new Error("Could not find past appointments document");
      error.statusCode = 400;
      throw error;
    }
    // const futureAppointments = await Appointment.find({_id:patient.futureAppointments});
    //     if(!futureAppointments){
    //       const error = new Error("Could mpt find future appointments document");
    //     error.statusCode = 400;
    //     throw error;
    //     }

    // const last3Appoinments = await patient.populate({path:'pastAppointments',perDocumentLimit:3});
    res.status(200).json({
      appointments:appointments
    });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  // gets the personal detail of doctor
  try {
    const patient = await Patient.findOne({ owner: req.userId })
      .populate({
        path: "owner",
        select: "-password", // Exclude the password field
      })
      .exec();
    if (!patient) {
      const error = new Error("Patient document not found");
      error.statusCode = 404;
      throw error;
    }
   

    res.status(200).json({
      patient
    });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  // uploads the changes in profile using req.body and doctor model.
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const patient = await Patient.findOne(
      { owner: req.userId },
      { password: 0 }
    )
      .populate({
        path: "owner",
        select: "-password", // Exclude the password field
      })
      .exec();
    // const patient = await Patient.findOne({owner.req.userId}).populate({path: "owner",select: "-password" // Exclude the password field}).exec()
    if (!patient) {
      const error = new Error("Patient not found");
      error.statusCode = 404;
      throw error;
    }

   

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Patient User document not found");
      error.statusCode = 404;
      throw error;
    }

    const sameEmailUser = await User.findOne({ email: req.body.email }).exec();

    const isEmailUpdated = user.email !== req.body.email;
    const isSameUser = sameEmailUser._id ===user._id;
    if (isEmailUpdated && !isSameUser) {
      //checks if the entered email is diffrent from already existing email, then if that email used by another user this will return true.
      const error = new Error(
        "A user already exists with same email.Please Enter a diffrent email"
      );
      error.statusCode = 403;
      throw error;
    }

    user.name = req.body.name;
    user.email = req.body.email;

    const savedUser = await user.save();

    if (!savedUser) {
      const error = new Error("User document could not be created");
      error.statusCode = 500;
      throw error;
    }
    patient.name = req.body.name;
    patient.sex = req.body.sex;
    patient.age = req.body.age;
    patient.phoneNumber = req.body.phoneNumber;
    patient.address = {
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
    
      patient.height.foot = req.body.height.heightFoot||patient.height.heightFoot;
      patient.height.inches = req.body.height.heightInch||patient.height.heightInch;
    

      patient.weight = req.body.weight||patient.weight;

    const updatedDoc = await patient.save();
    if (!updatedDoc) {
      const error = new Error("Patient document could not be updated");
      error.statusCode = 500;
      throw error;
    }
    res.json({ message: "updated succesfully", patient: updatedDoc });
  } catch (err) {
    next(err);
  }
}
async function bookAppointmentController(req, res, next) {
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
    const patient = await Patient.findOne({ owner: req.userId });
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
    // const doctorList = await Doctor.find()
    //   .where("_id")
    //   .in(hospital.staff.doctors)
    //   .populate("owner")
    //   .exec();
    const foundDoctor = await Doctor.findById(req.body.dId)
      .populate("owner")
      .exec();

    if (!foundDoctor) {
      const error = new Error("There is no doctor with this doctor Id");
      error.statusCode = 404;
      throw error;
    }
    const bookingDuration = foundDoctor.appointmentDuration || 10;
    // console.log(foundDoctor);
    const bookingDate = DateTime.fromFormat(req.body.date, "yyyy-MM-dd", {
      zone: "Asia/Kolkata",
    });
    const bookingDateTime = DateTime.fromFormat(req.body.date+' '+req.body.bookingStart,'yyyy-MM-dd HH:mm',{zone:'Asia/Kolkata'})

    const bookingDateISO = bookingDate.toISODate();

    const doctorSchedule = await Schedule.findById(req.body.scheduleId);

    if (!doctorSchedule) {
      const error = new Error("Could not find the doctor schedule document");
      error.statusCode = 400;
      throw error;
    }
    if (doctorSchedule.date !== bookingDateISO) {
      const error = new Error(
        "Appointment Not Available at this point, please enter a diffrent date"
      );
      error.statusCode = 400;
      throw error;
    }
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
      const error = new Error(
        "Appointment Not Available at this point, please enter a diffrent time"
      );
      error.statusCode = 400;
      throw error;
    }
    let bookedAppointment;
    const patientNameString =
      patient.name.firstName +
      " " +
      patient.name.middleName +
      " " +
      patient.name.lastName;
    const doctorNameString =
      foundDoctor.name.firstName +
      " " +
      foundDoctor.name.middleName +
      " " +
      foundDoctor.name.lastName;

    const newAppointment = new Appointment({
      patientName: patientNameString,
      doctorName: doctorNameString,
      status: "pending",
      startTime: req.body.bookingStart,
      duration: 10, //bookingDuration
      patient: patient._id,
      patientName:patientNameString,
      doctorName:doctorNameString,
      doctor: foundDoctor._id,
      date: bookingDateISO,
      bookingDateTime: bookingDateTime.toJSDate(),
      ISTDateString: bookingDate.toLocaleString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      isConsultationCompleted: false,
      hospitalAddress: hospital.address,
      hospitalName: hospital.name,
      hospitaId: hospital._id,
    });
    bookedAppointment = await newAppointment.save();
    if (!bookedAppointment) {
      const error = new Error("Could not book the slot");
      error.statusCode = 400;
      throw error;
    }
    // await session.commitTransaction();
    // session.endSession();
    doctorSchedule.appointments.push(bookedAppointment);
    await doctorSchedule.save();
    // if (!doctorSchedule) {
    //   const error = new Error("Could not update doctor schedule");
    //   error.statusCode = 400;
    //   throw error;
    // }
    patient.Appointments.push(bookedAppointment);
    await patient.save();
    // if (!patientDocUpdateResponse) {
    //   const error = new Error("Could not update patient appointments");
    //   error.statusCode = 400;
    //   throw error;
    // }
    res.json({
      bookedAppointment: bookedAppointment,
    });
  } catch (err) {
    // await session.abortTransaction();
    // session.endSession();
    next(err);
  }
}

async function bookAvailabilityController(req, res, next) {
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
    const patient = await Patient.findOne({ owner: req.userId });
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

    const bookingDate = DateTime.fromFormat(req.body.date, "yyyy-MM-dd", {
      zone: "Asia/Kolkata",
    });
    const bookingDateTime = DateTime.fromFormat(req.body.date+' '+req.body.bookingStart,'yyyy-MM-dd HH:mm',{zone:'Asia/Kolkata'})
    // console.log(bookingDate)
    const bookingDateISO = bookingDate.toISODate();
    console.log(bookingDateTime)
    const bookingstartTimeISOTime = DateTime.fromFormat(
      req.body.bookingStart,
      "HH:mm",
      { zone: "Asia/Kolkata" }
    ).toISOTime();

    const nowDate = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" });
    const futureDeadline = nowDate.plus({ days: 7 });
    const futureDeadlineISODate = futureDeadline.toISODate();

    if (
      bookingDateISO > futureDeadlineISODate &&
      bookingstartTimeISOTime >
        futureDeadline.toISOTime({ suppressSeconds: true })
    ) {
      const error = new Error(
        "Booking more than a week in advance is not allowed"
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      bookingDateTime < nowDate) {
      const error = new Error("Booking in the past is not possible");
      error.statusCode = 400;
      throw error;
    }

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
          const bookingStartTime = DateTime.fromFormat(
            req.body.bookingStart,
            "HH:mm",
            { zone: "Asia/Kolkata" }
          );
          const bookingstartTimeISOTime = bookingStartTime.toISOTime({
            suppressSeconds: true,
          });
          const bookingEndISOTime = bookingStartTime
            .plus({ minutes: 15 })
            .toISOTime({ suppressSeconds: true });

          return (
            endTimeISO >= bookingEndISOTime &&
            startTimeISO <= bookingstartTimeISOTime
          );
        });
        isOffDay = offDay.date === bookingDate && isOffShifts.length > 0;
        if (isOffDay) {
          const error = new Error(
            "Doctor is on a off Day doctor. Reason: ${offDay.reason}"
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
      const bookingStartTime = DateTime.fromFormat(
        req.body.bookingStart,
        "HH:mm",
        { zone: "Asia/Kolkata" }
      );
      const bookingstartTimeISOTime = bookingStartTime.toISOTime({
        suppressSeconds: true,
      });
      const bookingEndISOTime = bookingStartTime
        .plus({ minutes: 15 })
        .toISOTime({ suppressSeconds: true });
      return (
        endTimeISO >= bookingEndISOTime &&
        startTimeISO <= bookingstartTimeISOTime
      );
    });
    if (!foundShiftOpen) {
      const error = new Error("No shift available for the selected time");
      error.statusCode = 400;
      throw error;
    }

    let doctorSchedule = await Schedule.findOne({
      doctorId: foundDoctor._id,
      date: bookingDateISO,
      // "shift._id": foundShiftOpen._id,
      "shift.startTime":foundShiftOpen.startTime,
      "shift.endTime":foundShiftOpen.endTime
    });

    if (!doctorSchedule) {
      // will use worker thread to create newDoctorSchedule for next 7 days and create empty slots with 15min time in between
      const newSchedule = new Schedule({
        doctorId: foundDoctor._id,
        date: bookingDateISO,
        shift: foundShiftOpen,
      });

      doctorSchedule = await newSchedule.save();
      if (!doctorSchedule) {
        const error = new Error(
          "Could not create the doctor schedule document"
        );
        error.statusCode = 400;
        throw error;
      }
    }

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
    // console.log(existingAppointments[0].startTime)
    // const existingAppointments = await Appointment.find({
    //   doctor:foundDoctor._id,
    //   date:bookingDateISO,
    //   startTime: {
    //     $gte: fromTimeISO,
    //     $lte: toTimeISO,
    //   },
    // })

    console.log(existingAppointments.length);
    if (existingAppointments.length > 0) {
      const error = new Error(
        "Appointment not available at this time"
      );
      error.statusCode = 404;
      throw error;
    } 
      return res.status(200).send({
        success: true,
        message: "Appointments available",
        doctorScheduleId: doctorSchedule._id,
        doctorId: foundDoctor._id,
        patientId: patient._id,
      });
    // await session.commitTransaction();
    // session.endSession();
  } catch (err) {
    // await session.abortTransaction();
    // session.endSession();
    next(err);
  }
}

async function searchHospital(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const patient = await Patient.findOne({ owner: req.userId })
      .populate({
        path: "owner",
        select: "-password", // Exclude the password field
      })
      .exec();
    if (!patient) {
      const error = new Error("Patient document not found");
      error.statusCode = 404;
      throw error;
    }
    let responseHospitalData = [];
    let hospitals=[];
    if(req.query.city){
      console.log(req.query.city)
       hospitals = await Hospital.find({
        "address.city": req.query.city,
      });
    }
    else if(req.query.hospitalSpecialty){
       hospitals = await Hospital.find({
        specialty:req.query.hospitalSpecialty
      });
    }
   else if(req.query.city && req.query.hospitalSpecialty){
    hospitals = await Hospital.find({
      "address.city": req.query.city,
      specialty:req.query.hospitalSpecialty
    });
   }
   else{ hospitals = await Hospital.find();
   }

   if (!hospitals || hospitals.length <0) {
    const error = new Error(
      "There is no hospital in this city and with this specialty  found, check the spelling"
    );
    error.statusCode = 404;
    throw error;
  }
  
  for (const hospital of hospitals) {
    const chiefDoctor = await Doctor.findById(hospital.staff.chiefDoctor)
      .populate({ path: "owner", select: "-password" })
      .exec();
    const doctorList = await Doctor.find()
      .where("_id")
      .in(hospital.staff.doctors)
      .populate({ path: "owner", select: "-password" })
      .exec();

    const responseObj = {
      hospitalName: hospital.name,
      specialty: hospital.specialty,
      service:hospital.service,
      openHours: hospital.openHours,
      chiefDoctorName: chiefDoctor.name,
      hospitalId: hospital._id,
      chiefDoctorId: chiefDoctor._id,
      address: hospital.address,
      doctorList: doctorList,
    };
    responseHospitalData.push(responseObj);
  }
    res.json({
      responseHospitalData,
    });
  } catch (err) {
    next(err);
  }
}
async function getAllAppointments(req, res, next) {
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
    let appointments;
    const patient = await Patient.findOne({ owner: req.userId })
      .populate({
        path: "owner",
        select: "-password", // Exclude the password field
      })
      .exec();
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
      }).sort({ bookingDateTime: -1 })
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
      }).sort({ bookingDateTime: -1 })
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
      appointments = await Appointment.find({ patient: patient._id }).sort({ bookingDateTime: -1 })
        .countDocuments()
        .then((count) => {
          totalItems = count;
          return Appointment.find({ patient: patient._id }).sort({ bookingDateTime: -1 })
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
      appointments: appointments,
      currentPage
    });
  } catch (err) {
    next(err);
  }
}

async function getAllLabReports(req, res, next) {}

async function getAppointmentDetails(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const patient = await Patient.findOne({ owner: req.userId })
      .populate({
        path: "owner",
        select: "-password", // Exclude the password field
      })
      .exec();
    if (!patient) {
      const error = new Error("Patient document not found");
      error.statusCode = 404;
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

function cancelAppointment(req, res, next) {
  // will delete the appointment allow other user to fill during this time
  // payment has to be refunded.
}
async function getPendingAppointments(req, res, next) {}
async function getApprovedAppointments(req, res, next) {

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
      notifications:notifications,
      seenNotifications:user.seenNotifications
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
module.exports = {
  getPatientDashboard: getPatientDashboard,
  getProfile: getProfile,
  updateProfile: updateProfile,
  // getAppointmentById: getAppointmentById,
  // createAppointment: createAppointment,
  cancelAppointment: cancelAppointment,
  searchHospital,
  bookAvailabilityController,
  bookAppointmentController,
  getAllAppointments,
  getAllLabReports,
  getAppointmentDetails,
  getPendingAppointments,
  getApprovedAppointments,
  getAllNotificationController,
  deleteAllNotificationController,
};
