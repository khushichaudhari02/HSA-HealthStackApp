export default{
    async fetchHospitalList(context){
        const token = context.rootGetters['auth/token'];
        const response =  await fetch(process.env.VUE_APP_BACKEND_URL+"/api/superAdmin/hospitals",{
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
        context.commit("setHospitalList",responseData.hospitals)
    },
    async fetchHospitalDetails(context,payload){
        const token = context.rootGetters['auth/token'];
        let url = process.env.VUE_APP_BACKEND_URL+"/api/superAdmin/hospitals/"+payload.hId;
        const response =  await fetch(url,{
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
        context.commit('setHospitalDetails',responseData.hospital);
        context.commit('setSelectedHospitalChiefDoctor',responseData.chiefDoctor)
    },
    async fetchCHRList(context){
        const token = context.rootGetters['auth/token'];
        const response =  await fetch(process.env.VUE_APP_BACKEND_URL+"/api/superAdmin/requests",{
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
        context.commit('setCHRList',responseData.createHospitalRequests)
    },
    async fetchCHRDetails(context,payload){
        const token = context.rootGetters['auth/token'];
        let url = process.env.VUE_APP_BACKEND_URL+"/api/superAdmin/requests/"+payload.CHRId;
        const response =  await fetch(url,{
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
        context.commit('setCHRDetails',responseData.CHRDetails)
    },
    async createNewHospital(context,payload){
      const token = context.rootGetters['auth/token'];

      let url = process.env.VUE_APP_BACKEND_URL+"/api/superAdmin/hospitals/"
      const response =  await fetch(url,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization":"Bearer"+" "+token
          },
          body:JSON.stringify(
            {
              hospitalName:payload.hospitalName,
              email:payload.email,
              phoneNumber:payload.phoneNumber,
              hospitalService:payload.hospitalService,
              hospitalSpecialty:payload.hospitalSpecialty,
              openHours:payload.openHours,
              address:payload.address,
              chiefDoctor:payload.chiefDoctor
            }
          )
        });
        const responseData = await response.json();
      
      if(!response.ok){
          const error = new Error(responseData.message|| 'Failed to fetch');
          throw error;
      }
      
    },
    async createAdmin(context,payload){
      const token = context.rootGetters['auth/token'];
      let url =process.env.VUE_APP_BACKEND_URL + "/api/superAdmin/hospitals/"+payload.hId+'/admin'
      const response =  await fetch(url,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization":"Bearer"+" "+token
          },
          body:JSON.stringify(
            {
             
              email:payload.email,
              name:payload.name,
              password:payload.password
            }
          )
        });
        const responseData = await response.json();
      
      if(!response.ok){
          const error = new Error(responseData.message|| 'Failed to fetch');
          throw error;
      }
    }

}