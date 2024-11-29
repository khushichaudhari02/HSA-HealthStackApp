export default {
  async fetchHospital(context) {
    const token = context.rootGetters["auth/token"];
    const response = await fetch(`${process.env.VUE_APP_BACKEND_URL}/api/admin/hospital`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
    });
    const responseData = await response.json();
    // console.log(responseData);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch");
      throw error;
    }
    context.commit("setHospital", responseData.hospital);
    context.commit('setChiefDoctor',responseData.chiefDoctor)
  },
  async fetchDoctorList(context) {
    const token = context.rootGetters["auth/token"];
    const response = await fetch(
      `${process.env.VUE_APP_BACKEND_URL }/api/admin/staff/doctors`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        },
      }
    );
    const responseData = await response.json();
    // console.log(responseData);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch");
      throw error;
    }
    context.commit("setDoctorList", responseData.doctorList);
  },
  async fetchSearchedSchedule(context, payload) {
    const token = context.rootGetters["auth/token"];
    //console.log(token);
    let url = `${process.env.VUE_APP_BACKEND_URL}/api/admin/schedule/` + payload.dId;
    //console.log(url);
    const response = await fetch(url, {
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
    if (!responseData.appointments || !responseData.doctorSchedule) {
      const error = new Error(
        "Failed to fetch this shift consultation details"
      );
      throw error;
    }
    //console.log(responseData);
    context.commit("setSearchedSchedule", responseData.doctorSchedule);
    context.commit(
      "setSearchedScheduleAppointments",
      responseData.appointments
    );
  },
  async updateAppointmentStatusMany(context, payload) {
    const token = context.rootGetters["auth/token"];
    let url =
      `${process.env.VUE_APP_BACKEND_URL}/api/admin/schedule/` + payload.dId + "/status";
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
      body: JSON.stringify({
        appointments: payload.status,
      }),
    });
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok ) {
      const error = new Error(responseData.message ||"Failed to update appointments");
      throw error;
    }
    if(responseData.failedToUpdate.length > 0){

      const error = new Error("Failed to update some appointments");
      throw error;
    }
   
  },
async  fetchAppointmentDetails(context,payload){
    const token = context.rootGetters["auth/token"];
    //console.log(token);
    let url = process.env.VUE_APP_BACKEND_URL+"/api/admin/appointments/" + payload.aId;
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
    //console.log(responseData);
    context.commit('setAppointmentDetails',responseData.appointment)
  },
  async updateAppointmentStatusOne(context, payload) {
    const token = context.rootGetters["auth/token"];
    let url =
       process.env.VUE_APP_BACKEND_URL+"/api/admin/schedule/" + payload.dId + "/status/"+payload.aId;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + token,
      },
      body: JSON.stringify({
       status: payload.status,
      }),
    });
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok ) {
      const error = new Error(responseData.message ||"Failed to update appointments");
      throw error;
    }
   
  },
  async fetchNotifications(context){
    const token = context.rootGetters['auth/token']
    const response =  await fetch( process.env.VUE_APP_BACKEND_URL+"/api/admin/notification", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization":"Bearer"+" "+token
        },
      });
      const responseData = await response.json();

    if(!response.ok){
        const error = new Error(responseData.message|| 'Failed to fetch admin notification');
        throw error;
    }
    //console.log(responseData.seenNotifications)
    context.commit('setNotifications',responseData.notifications);
    context.commit('setSeenNotifications',responseData.seenNotifications)

  },
  // async rescheduleAppointment(context,payload){
  //   const token= context.rootGetters['auth/token']
  //   let url=process.env.VUE_APP_BACKEND_URL+"/api/admin/schedule/" + payload.dId+"/reschedule/"+payload.aId
  //   const response = await fetch(url, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer" + " " + token,
  //     },
  //     body: JSON.stringify({
  //       date:payload.date,
  //       bookingStart:payload.bookingStart
  //     }),
  //   });
  //   const responseData = await response.json();
  //   console.log(responseData);
  //   if (!response.ok ) {
  //     const error = new Error(responseData.message ||"Failed to update appointments");
  //     throw error;
  //   }
  // }
  async fetchDoctorConsult(context,payload) {
    const token = context.rootGetters["auth/token"];
    let url = process.env.VUE_APP_BACKEND_URL+"/api/admin/consult/"+payload.dId
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
    context.commit("setSelectedDoctorTodayAppointments", responseData.appointments);
    context.commit("setSelectedDoctorTodaySchedule", responseData.schedule);

  },
  async updateDoctorOffDays(context,payload){
    const token = context.rootGetters["auth/token"];
    //console.log(token);
    let url = process.env.VUE_APP_BACKEND_URL+"/api/admin/schedule/" + payload.dId;
    //console.log(url);
    const response = await fetch(url, {
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
    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          "Failed to update doctor off days"
      );
      throw error;
    }
    //console.log(responseData);
    context.commit('setSelectedDoctor',responseData.doctor)
  },
  async fetchPatientList(context,payload){
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+'/api/admin/patients'
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
    let url =process.env.VUE_APP_BACKEND_URL+'/api/admin/patients/'+payload.pId
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
  async fetchAdminList(context) {
    const token = context.rootGetters["auth/token"];
    const response = await fetch(process.env.VUE_APP_BACKEND_URL+
      "/api/admin/staff/admins",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        },
      }
    );
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch");
      throw error;
    }
    context.commit("setAdminList", responseData.adminList);
  },
  async fetchSelectedDoctorFeesList(context,payload){

    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+'/api/admin/fees/'+payload.dId;
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
          "Failed to fetch fees list for this doctor"
      );
      throw error;
    }
    if (!responseData.fees) {
      const error = new Error(
        "Failed to fetch fees"
      );
      throw error;
    }
    context.commit('setSelectedDoctorFeesList',responseData.fees)
    context.commit('setSelectedDoctor',responseData.doctor)
    context.commit('setSelectedDoctorFeesCurrentPage',responseData.currentPage)
  },
  async fetchSelectedDoctorFeesDetails(context,payload){
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+'/api/admin/fees/'+payload.dId+"/"+payload.date
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
    
    if (!responseData.fee ||!responseData.doctor) {
      const error = new Error(
        "Failed to fetch fees"
      );
      throw error;
    }
    context.commit('setSeletedDoctorFeesDetails',responseData.fee)
    context.commit('setSelectedDoctor',responseData.doctor)
  },
  async fetchStaffDetails(context,payload){
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+"/api/admin/staff/manage/"+payload.sId;
    const response = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        },
      }
    );
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch");
      throw error;
    }
    context.commit('setStaffDetails',responseData.staffDoc);
  },
  async updateStaffDetails(context,payload){
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+"/api/admin/staff/manage/"+payload.sId;
    const response = await fetch(
      url,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        },
        body:JSON.stringify({
          name:payload.name,
          email:payload.email,
          password:payload.password,
          phoneNumber:payload.phoneNumber,
          educationQualification:payload.educationQualification,
          role:payload.role
        })
      }
    );
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch");
      throw error;
    }
    context.commit('setStaffDetails',responseData.staffDoc);
  },
  async deleteStaff(context,payload){ 
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+"/api/admin/staff/manage/"+payload.sId;
    const response = await fetch(
      url,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        }
      }
    );
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to delete");
      throw error;
    }

  },
  async fetchNurseList(context) {
    const token = context.rootGetters["auth/token"];
    const response = await fetch(
      process.env.VUE_APP_BACKEND_URL+"/api/admin/staff/nurses",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        },
      }
    );
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch");
      throw error;
    }
    context.commit("setNurseList", responseData.nurseList);
  },
  async fetchReceptionistList(context){
  
      const token = context.rootGetters["auth/token"];
      const response = await fetch(
        process.env.VUE_APP_BACKEND_URL+  "/api/admin/staff/receptionists",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      const responseData = await response.json();
      //console.log(responseData);
      if (!response.ok) {
        const error = new Error(responseData.message || "Failed to fetch");
        throw error;
      }
      context.commit("setReceptionistList", responseData.reeceptionistList);
  },
  async fetchReports(context,payload){
    let url =process.env.VUE_APP_BACKEND_URL+"/api/admin/reports";
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
          //console.log(responseData);
        if(!response.ok){
            const error = new Error(responseData.message|| 'Failed to fetch');
            throw error;
        }
        //console.log(responseData)
        context.commit('setReports',responseData.reports)
   },
   async fetchReportsDetails(context,payload){
    let url =process.env.VUE_APP_BACKEND_URL+"/api/admin/reports/"+payload.dId;
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
          //console.log(responseData);
        if(!response.ok){
            const error = new Error(responseData.message|| 'Failed to fetch');
            throw error;
        }
        context.commit('setDoctorReportDetails',responseData.reportDetails)
   },
   async fetchStaffSearch(context,payload){
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+"/api/admin/staff/search/"+payload.staffName;
    const response = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        },
      }
    );
    const responseData = await response.json();
    // console.log(responseData);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch");
      throw error;
    }
    context.commit("setStaffSearchList",responseData.staffDocs);
   },
   async createNewStaff(context,payload){
    const token = context.rootGetters["auth/token"];
    let url =process.env.VUE_APP_BACKEND_URL+"/api/admin/staff"
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        },
        body:JSON.stringify({
          name:payload.name,
          email:payload.email,
          password:payload.password,
          role:payload.role,
          phoneNumber:payload.phoneNumber,
          age: payload.age,
          sex: payload.sex,
          educationQualification: payload.educationQualification,
          stateMedicalCouncil: payload.stateMedicalCouncil,
          yearOfRegistration: payload.yearOfRegistration,
          registrationNumber: payload.registrationNumber,
        })
      }
    );
    const responseData = await response.json();
    //console.log(responseData);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to create");
      throw error;
    }
   }

}
