<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>

        <base-dialog  :show="isLoading && !error" title="Loading..." fixed>
          <base-spinner></base-spinner>
        </base-dialog>

<section v-if="!isLoading">
    
    <h1>Patient Details</h1>
    <base-card>
    <ol >
        <li><span> Name: </span>{{ getName }}</li>
        <li> <span>Email: </span>{{ getEmail }}</li>
        <li><span>Phone Number: </span>{{ getPhoneNumber}}</li>
        <li> <span>Age: </span>{{ getAge }}</li>
        <li> <span>Sex: </span>{{ getSex }}</li>
        <li><span>Height: </span>{{ getHeight}}</li>
        <li><span>Weight: </span>{{ getWeight }}</li>
        <li><span>Address: </span>{{ getAddress}}</li>
    </ol>
   
</base-card>
<base-button-container>
      
        <base-button  link @click.prevent="back" mode="outline" 
          >Go Back</base-button
        >
  </base-button-container>
</section>
<section v-if="appointments" class="appointment-row-container">
       <h2>Most Recent Appointments of Patient</h2>
       <div v-if="isLoading">
         <base-spinner></base-spinner>
       </div>
       <p v-if="appointments?.length === 0">
         No Appointments for this patient
       </p>
   
       <TheAppointmentsRow
         v-else
         :appointments="appointments"
       ></TheAppointmentsRow>
     </section>
</template>
<script>

import TheAppointmentsRow from '@/components/appointments/TheAppointmentsRow.vue';
export default{
    props:['pId'],
    components:{
TheAppointmentsRow
    },
  data(){
    return {
        isLoading:false,
      error:null,
      patient:{},
         
    }
  }  ,
  computed:{
   
    getName(){
      let s=this.patient?.name?.firstName+" "+this.patient?.name?.middleName+" "+this.patient?.name?.lastName;
        return this.patient.name ? s:'';
    },
    getEmail(){
      return this.patient.email ?? '';
    },
    getAge(){
      return this.patient.age ?? '';
    },
    getSex(){
      return this.patient.sex ?? '';
    },
    getHeight(){
       
        if(!this.patient.height){
            return ''
        }
        
        return this.patient.height?.foot+" foot "+this.patient.height?.inches+" inch"
    },
    getWeight(){
        
        if(!this.patient.weight){
            return ''
        }
       
        return this.patient.weight +" kg"
    },
    getAddress(){

        if(!this.patient.address.state && !this.patient.address.city && !this.patient.district && !this.patient.address.streetAddress[0] && 
            !this.patient.address.streetAddress[1] && !this.patient.address.postalCode
        ){
            return ''
        }

        
     return this.patient.address.streetAddress[0] +", "+ this.patient.address.city+", "+
     this.patient.address.state+", "+this.patient.address.postalCode
     
    },
    getPhoneNumber(){
      return this.patient.phoneNumber ?? '';
    },
    appointments(){
        const appointments= this.$store.getters['doctor/searchedPatientAppointments']??[];
       const result=[];
       console.log(appointments)
       for (const appointment of appointments) {
         const appointmentObj = {
           id: appointment?._id ??"",
           patientName: appointment?.patientName ??'',
           doctorName:appointment.doctorName??'',
           date:appointment?.ISTDateString??'',
           // city: !appointment.hospitalAddress.city ?appointment.hospitalAddress.city :'',
           startTime:appointment?.startTime??'',
           hospitalAddress: appointment?.hospitalAddress??null,
           duration: appointment?.duration??null,
           hospitalName:appointment?.hospitalName??'',
           status:appointment?.status??'pending'
         };
       result.push(appointmentObj);
       
    }
    return result
  }
  },
  methods:{

    back(){
        this.$router.back()
    },
  
            handleError(){
          this.error=null;
        },
        
        
  },
async created(){
    this.isLoading=true
    try{
        await this.$store.dispatch('doctor/fetchPatientDetails',{pId:this.pId});
        const patient = this.$store.getters['doctor/searchedPatientDetails'];

       
        this.patient={
            name: patient.name,
            email: patient.email,
            phoneNumber:patient.phoneNumber,
            address:patient.address,
            height:patient.height||null,
            weight:patient.weight||null,
            sex:patient.sex,
            age:patient.age,
        }
        
    }catch(err){

              this.error = err.message || 'Failed to fetch, try later.';
            }   
            finally{
              this.isLoading = false;
            }

  }

}
</script>
<style scoped >
section{
    margin:2rem auto;
   max-width: 100%;

    padding: 0;
    display: flex ;
    flex-direction: column;
    /* justify-content: center; */
    align-items:center;
    flex:1;
}

ol{
    padding:1rem 0;
    /* border:1px solid black; */
    max-width: 100%;
    list-style: none;
    margin:0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    grid-auto-flow: row;
}
h1{
  margin:0;
  font-size: var(--h4-laptop);
}


li{
list-style: none;
font-size: var(--h5-laptop);
font-family: 'Open Sans';
font-weight: normal;
margin:0.5rem;
text-align: left;
max-width: 100%;
word-wrap: break-word;
}
span{
    font-weight: bold;
    font-size: inherit;
}
.form-control {
        margin: 0.5rem 0;
        /* display:flex;
        flex-direction:column;
        justify-content:center;
        width: inherit;
        align-items:center; */
        text-align:left;
    
      }
      .form-control label{
        font-family: "Open Sans";
        font-size:var(--h6-laptop);
        font-weight:bold;
      }
h5{
    font-size: var(--h5-laptop);
}
h4{
    font-size: var(--h4-laptop);
}
     .container{
        display: grid;
        grid-template-columns:1fr 1fr 1fr;
        
        gap:1rem;
     }
    .form-container{
      padding:0.5rem;
      width: 100%;
      max-width: 100%;
        
    }
    
      input,select {
        display: block;
        width:100%;
        margin-top: 0.5rem;
        height:2.5rem;
        border:1px solid var(--primary-color);
        padding:0.5rem;
        border-radius:8px;
        font-size:var(--h6-laptop);
      }
      input:focus,select:focus{
        background-color:var(--black-5);
      
      }
      #validation-message{
        color:red;
        font-size: var(--h6-laptop);
      }
      .error-message{
        color:red;
        font-size: var(--h6-laptop);
      }
</style>