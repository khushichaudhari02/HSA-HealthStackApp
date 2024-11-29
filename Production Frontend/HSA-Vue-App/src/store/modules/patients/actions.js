export default {
    async fetchPatientDetails(context){
        const token = context.rootGetters['auth/token']
        const response =  await fetch(process.env.VUE_APP_BACKEND_URL+"/api/patients/profile", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Authorization":"Bearer"+" "+token
            },
          });
          const responseData = await response.json();

        if(!response.ok){
            const error = new Error(responseData.message|| 'Failed to fetch patient personal details');
            throw error;
        }


        const patient = {
            name: responseData.patient.name,
            email:responseData.patient.owner.email,
            phoneNumber:responseData.patient.phoneNumber,
            age: responseData.patient.age,
            sex: responseData.patient.sex,
            appointments:responseData.patient.Appointments,
            address: responseData.patient.address,
            LabReports: responseData.patient.LabReports,
            patientId: responseData.patient._id,
            weight:responseData.patient.weight,
            height:responseData.patient.height||null
        }

        context.commit('setPatient',patient);
    },
    async fetchAppointments(context){
        // if(payload.page){

        // }
        const token = context.rootGetters['auth/token'];
        const response =  await fetch(process.env.VUE_APP_BACKEND_URL+"/api/patients", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Authorization":"Bearer"+" "+token
            },
          });
          const responseData = await response.json();
          //console.log(responseData);
        if(!response.ok){
            const error = new Error(responseData.message|| 'Failed to fetch patient appointments');
            throw error;
        }
        const appointments = responseData.appointments;
        context.commit('setAppointments',appointments);
        
    },
    async fetchHospitalSearch(context,payload){
      let url =process.env.VUE_APP_BACKEND_URL+"/api/patients/book-appointment/search";
      if(payload.hospitalSpecialty && payload.city){
        url += "?hospitalSpecialty="+payload.hospitalSpecialty+"&city="+payload.city;
      }
      else if(payload.hospitalSpecialty){
        url+="?hospitalSpecialty="+payload.hospitalSpecialty
      }
      else if(payload.city){
        url+="?city="+payload.city;
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
      const hospitalSearch= responseData.responseHospitalData;
      context.commit('setHospitalSearch',hospitalSearch);
    },
    async bookAppointment(context,payload){
      
         await  context.dispatch('checkAvailability',payload);
      

     },
    async checkAvailability(context,payload){
      const token = context.rootGetters['auth/token'];
      const response =  await fetch(process.env.VUE_APP_BACKEND_URL+"/api/patients/book-appointment/check" ,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization":"Bearer"+" "+token
          },
          body:JSON.stringify({
            hospitalId: payload.hospitalId,
            dId:payload.dId,
            bookingStart:payload.bookingStart,
            duration:payload.bookingDuration,
            date:payload.bookingDate
          })
        });
        const responseData = await response.json();

      if(!response.ok){
          const error = new Error(responseData.message || 'Failed to fetch availability data');
          throw error;
      }
      //console.log(responseData)
      
      const obj ={
        hospitalId:payload.hospitalId,
        dId:payload.dId,
        scheduleId:responseData.doctorScheduleId,
        bookingStart:payload.bookingStart,
        duration:payload.duration,
        date:payload.bookingDate
      }
      if(obj.scheduleId){
        await context.dispatch('bookAppointmentCreate',obj)
      } else{
        const error = new Error(responseData.message || 'Failed to fetch availability data');
        throw error;
      }
    },
    async bookAppointmentCreate(context,payload){
      const token = context.rootGetters['auth/token'];
      const response=  await fetch(process.env.VUE_APP_BACKEND_URL+"/api/patients/book-appointment/create" ,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization":"Bearer"+" "+token
        },
        body:JSON.stringify({
          hospitalId: payload.hospitalId,
          dId:payload.dId,
          scheduleId:payload.scheduleId,
          bookingStart:payload.bookingStart,
          duration:payload.duration,
          date:payload.date
        })
      });
      const responseData= await response.json();
      //console.log(responseData);
    if(!response.ok || !responseData.bookedAppointment){
        const error = new Error(responseData.message|| 'Failed to book apointment');
        throw error;
    }

     context.commit('addAppointment',responseData.bookedAppointment);

    },
    async updatePatientDetails(context,payload){
      const token = context.rootGetters['auth/token'];
      const response=  await fetch(process.env.VUE_APP_BACKEND_URL+"/api/patients/profile" ,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization":"Bearer"+" "+token
        },
        body:JSON.stringify({
          name:payload.name,
          email:payload.email,
          phoneNumber:payload.phoneNumber,
          age:payload.age,
          sex:payload.sex,
          height:payload.height,
          weight:payload.weight,
          address:payload.address
        })
      });
      const responseData= await response.json();
      //console.log(responseData);
    if(!response.ok){
        const error = new Error(responseData.message|| 'Failed to book apointment');
        throw error;
    }
     context.commit('setPatient',responseData.patient);

    },
    async fetchNotifications(context){
      const token = context.rootGetters['auth/token']
      const response =  await fetch(process.env.VUE_APP_BACKEND_URL+"/api/patients/notification", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization":"Bearer"+" "+token
          },
        });
        const responseData = await response.json();

      if(!response.ok){
          const error = new Error(responseData.message|| 'Failed to fetch patient personal details');
          throw error;
      }
      //console.log(responseData.seenNotifications)
      context.commit('setNotifications',responseData.notifications);
      context.commit('setSeenNotifications',responseData.seenNotifications)

    },
    async fetchAppointmentDetails(context,payload){
      const token = context.rootGetters["auth/token"];
      //console.log(token);
      let url =process.env.VUE_APP_BACKEND_URL+ "/api/patients/appointments/" + payload.aId;
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
    async fetchAllAppointments(context,payload){
      const token = context.rootGetters["auth/token"];
      let url =process.env.VUE_APP_BACKEND_URL+'/api/patients/appointments'
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
      context.commit('setAppointmentList',responseData.appointments);
      context.commit('setAppointmentsCurrentPage',responseData.currentPage)
    }
}