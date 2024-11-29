import { DateTime } from "luxon";
export default {
  async fetchConsult(context) {
    const token = context.rootGetters["auth/token"];
    const response = await fetch(process.env.VUE_APP_BACKEND_URL+"/api/doctor/consult", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
    });
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    if (!responseData.appointments || !responseData.schedule) {
      const error = new Error(
        "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    context.commit("setTodayAppointments", responseData.appointments);
    context.commit("setTodaySchedule", responseData.schedule);

  },
  async fetchHome(context) {
    const token = context.rootGetters["auth/token"];
    const response = await fetch(process.env.VUE_APP_BACKEND_URL+"/api/doctor/consult", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
    });
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    if (!responseData.appointments || !responseData.schedule) {
      const error = new Error(
        "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    context.commit("setTodayAppointments", responseData.appointments);
    context.commit("setTodaySchedule", responseData.schedule);
    if (responseData.appointments.length > 0) {
      const nowDate = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" });
      const fromDateISOTime = nowDate
        .minus({ minutes: 10 })
        .toISOTime({ suppressSeconds: true }).toFormat('HH:mm');
      const toDateISOTime = nowDate
        .plus({ minutes: 10 })
        .toISOTime({ suppressSeconds: true }).toFormat('HH:mm');
      const nowAppointment = context.getters.todayAppointments.find(
        (appointment) =>
          appointment.startTime <= toDateISOTime &&
          appointment.startTime >= fromDateISOTime
      );
      if (!nowAppointment) {
        await context.dispatch(
          "fetchPatientPastAppointments",
          nowAppointment.patient
        );
      }
    }
  },
  async fetchPatientPastAppointments(context, payload) {
    let url =
    process.env.VUE_APP_BACKEND_URL+ "/api/doctor/patients/" + payload + "/appointments";
    //console.log(url);
    const token = context.rootGetters["auth/token"];
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
    });
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Failed to fetch patient appointments"
      );
      throw error;
    }
    context.commit(
      "setCurrentPatientRecentAppointments",
      responseData.appointments
    );
  },
  async fetchDoctorDetails(context) {
    const token = context.rootGetters["auth/token"];
    const response = await fetch(process.env.VUE_APP_BACKEND_URL+"/api/doctor/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
    });
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || "Failed to fetch doctor personal details"
      );
      throw error;
    }

    const doctor = {
      name: responseData.doctor.name,
      email: responseData.doctor.owner.email,
      phoneNumber: responseData.doctor.phoneNumber,
      age: responseData.doctor.age,
      sex: responseData.doctor.sex,
      address: responseData.doctor.address,
      appointmentDuration: responseData.doctor.appointmentDuration,
      educationQualification: responseData.doctor.educationQualification,
      yearOfRegistration: responseData.doctor.yearOfRegistration,
      registrationNumber: responseData.doctor.registrationNumber,
      stateMedicalCouncil: responseData.doctor.stateMedicalCouncil,
      specialty: responseData.doctor.specialty,
      hospitalId: responseData.doctor.hospital,
      shifts: responseData.doctor.shifts,
      offDays: responseData.doctor.offDays,
      yearlyAppointmentCount: responseData.doctor.yearlyAppointmentCount,
    };
    context.commit("setDoctor", doctor);
  },
  async consultationComplete(context, payload) {
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+ "/api/doctor/consult/" + payload.id;
    //console.log(url);
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
      body: JSON.stringify({
        feesStructure: payload.feesStructure,
        notes: payload.notes,
        prescriptions: payload.prescriptions,
        testPrescribed: payload.testPrescribed,
      }),
    });
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          "You are updating appointment whose time has passed"
      );
      throw error;
    }
  },
  async updateDoctorDetails(context, payload) {
    const token = context.rootGetters["auth/token"];
    const response = await fetch(process.env.VUE_APP_BACKEND_URL+"/api/doctor/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        age: payload.age,
        sex: payload.sex,
        educationQualification: payload.educationQualification,
        stateMedicalCouncil: payload.stateMedicalCouncil,
        yearOfRegistration: payload.yearOfRegistration,
        registrationNumber: payload.registrationNumber,
        specialty: payload.specialty,
        shifts: payload.shifts,
        appointmentDuration: payload.appointmentDuration,
        address: payload.address,
      }),
    });
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Failed to update profile"
      );
      throw error;
    }
    context.commit("setDoctor", responseData.doctor);
  },
  async fetchSchedule(context, payload) {
    const token = context.rootGetters["auth/token"];
    //console.log(token);
    const response = await fetch(process.env.VUE_APP_BACKEND_URL+"/api/doctor/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
      body: JSON.stringify({
        date: payload.date,
        shift: payload.shift,
      }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    if (!responseData.appointments || !responseData.schedule) {
      const error = new Error(
        "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    context.commit("setSearchedSchedule", responseData.schedule);
    context.commit(
      "setSearchedScheduleAppointments",
      responseData.appointments
    );
  },
  async updateDoctorOffDays(context,payload){
    const token = context.rootGetters["auth/token"];
    const response = await fetch(process.env.VUE_APP_BACKEND_URL+"/api/doctor/schedule", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
      body: JSON.stringify({
        offDays:payload.offDays
      }),
    });
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Failed to update off days"
      );
      throw error;
    }
    context.commit("setDoctor", responseData.doctor);
  },
  async fetchFeesList(context,payload){
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+'/api/doctor/fees'
    if(payload && payload.page){
      url+="?page="+payload.page
    }
    //console.log(token);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      }
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    if (!responseData.fees) {
      const error = new Error(
        "Failed to fetch fees"
      );
      throw error;
    }
    context.commit('setFeesList',responseData.fees)
    context.commit('setFeesCurrentPage',responseData.currentPage)
  },
  async  fetchAppointmentDetails(context,payload){
    const token = context.rootGetters["auth/token"];
    //console.log(token);
    let url = process.env.VUE_APP_BACKEND_URL+"/api/doctor/appointments/" + payload.aId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      }
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    context.commit('setAppointmentDetails',responseData.appointment)
  },
  async fetchFeesDetails(context,payload){
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+'/api/doctor/fees/'+payload.date
    //console.log(token);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      }
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    
    if (!responseData.fee) {
      const error = new Error(
        "Failed to fetch fees"
      );
      throw error;
    }
    context.commit('setFeesDetails',responseData.fee)
  },
  async fetchPatientList(context,payload){
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+'/api/doctor/patients'
    if(payload && payload.patientName){
      url+='?patientName='+payload.patientName;
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      }
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    if (!responseData.patientList.length>0) {
      const error = new Error(
        "Failed to fetch any patients"
      );
      throw error;
    }
    
    context.commit('setPatientList',responseData.patientList)
  },
  async fetchPatientDetails(context,payload){
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+'/api/doctor/patients/'+payload.pId
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      }
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          "Failed to fetch  patient details"
      );
      throw error;
    }
    if (!responseData.appointments) {
      const error = new Error(
        "Failed to fetch appointments"
      );
      throw error;
    }
    context.commit('setSearchedPatientDetails',responseData.patient)
    context.commit('setSearchedPatientAppointments',responseData.appointments)
  },
  async fetchReportDetails(context,payload){
    let url =process.env.VUE_APP_BACKEND_URL+"/api/doctor/reports"
        if(payload&&payload.date){
          url += "?date="+payload.date
        }
        else if(payload&& payload.month){
          url+="?month="+payload.month
        }
       
    
        const token = context.rootGetters['auth/token'];
        const response =  await fetch(url ,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Authorization":"Bearer"+" "+token
            },
          });
          const responseData = await response.json();

        if(!response.ok){
            const error = new Error(responseData.message|| 'Failed to fetch');
            throw error;
        }
        context.commit('setReportDetails',responseData.reportDetails)
   },

};
