<template>
        <li class="appointmentDetail">
        <article>
          <h4 > Appointment <span v-show="index+1">{{index+1}}</span></h4> 
          <base-grid>    
              <card-details-grid-element >Doctor: {{getDoctorName }}</card-details-grid-element> 
              <card-details-grid-element >Patient: {{getPatientName }}</card-details-grid-element>  
              <card-details-grid-element >Start: {{getStartTime}}</card-details-grid-element>  
              <card-details-grid-element >Date: {{this.date }}</card-details-grid-element>  
              <card-details-grid-element >Address: {{getHospitalAddress}}</card-details-grid-element>   
              <card-details-grid-element >Status: {{this.status }}</card-details-grid-element> 
            <card-details-grid-element v-if="this.fees" >Total Fees: {{getTotalAmount}}</card-details-grid-element>
              <card-details-grid-element >Duration: {{this.duration }} minutes</card-details-grid-element>  
          </base-grid>
          <base-button-container>
            <base-button  link :to="appointmentDetailsLink" mode="primary">View Detail</base-button>
            <base-button :class="{ 'disable': disableButton === 'approve' }" v-if="isAdmin" @click="approve(this.id)" mode="outline">Approve</base-button>
            <base-button :class="{ 'disable': disableButton === 'cancel' }" v-if="isAdmin" @click="cancel(this.id)" mode="outline">Cancel</base-button>
            <base-button v-if="isDoctor" link :to="appointmentConsultDetailsLink" mode="outline">Consult(Doctor)</base-button>
            <base-button v-if="!isDoctor && !isAdmin" button mode="flat">Notify me</base-button>
          </base-button-container>
        </article>
    </li>
    
    </template>
   
    <style scoped>

.appointmentDetail{
    list-style: none;
    max-width: 100%;

}
article {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    border: 1px solid var(--black);
    max-width:100%;
    max-height: 32rem;
    padding: 1rem;
    border-radius:8px;
}
@media (max-width:1200px) {
    .appointmentDetail{
        max-width: 100%;
    }
    article{
        padding:0.5rem;
        max-width: 100%;

    }
}
@media (max-width:600px) {
    article{
        display: grid;
        justify-items: center;
       width:100%;

    }
    .appointmentDetail{
        width:100%;
        padding:0;
    }
}


h4 {
  font-size: var(--h5-laptop);
}

</style>
    

    
    <script>
import { DateTime } from 'luxon';

export default{
    props:['id','doctorName','patientName','index','duration','startTime','date','status','hospitalAddress','fees'],
    data(){
        return {
            disableButton: null
        }
    },
    computed:{
        getTotalAmount(){
            return this.fees?.getTotalAmount ?? 0;
        },
        appointmentDetailsLink(){
            if (this.isAdmin && this.id) {
            return "/admin/appointments/" + this.id;
        }
        if (this.isDoctor && this.id) {
            return '/doctor/appointments/' + this.id;
        }
        if(this.$route.path==='/patient/appointments'){
            return this.$route.path +'/'+ this.id ;
        }
        if(this.$route.path==='/doctor/appointments'){
            return this.$route.path +'/'+ this.id ;
        }
        if(this.$route.path==='/doctor/appointments'){
            return this.$route.path +'/'+ this.id ;
        }
        return this.$route.path + '/appointments/' + this.id ;
            
        },
        appointmentConsultDetailsLink(){
            return '/doctor/consult/' + this.id ?? '';
        },
    getHospitalAddress(){
        return (this.hospitalAddress?.streetAddress?.[0] ?? '') + 
             (this.hospitalAddress?.streetAddress?.[1] ?? '') + 
             (this.hospitalAddress?.city ?? '');
    },
    getStartTime(){
       
       
        if (this.startTime) {
            const time = DateTime.fromFormat(this.startTime, 'HH:mm', { zone: 'Asia/Kolkata' });
            return time.toLocaleString({ hour: 'numeric', minute: '2-digit' }).toLowerCase();
        }
        return 'Not available'; 
        
    },
    getDuration(){
        return this.duration + " Minutes"
    },
    getDoctorName(){
        return "doctor: " + (this.doctorName ?? ''); // Default to 'Unknown' if doctorName is undefined
    },
    getPatientName(){
        return "patient: " + (this.patientName ?? 'Unknown'); // Default to 'Unknown' if patientName is undefined

    },

    isDoctor(){
        return this.$store.getters['auth/isDoctor'];
    },
    isAdmin(){
        return this.$store.getters['auth/isAdmin']
    }
},

methods:{approve(id){   
    this.setDisableButton('approve')
    this.$emit("approve",id);

   
},cancel(id){
this.setDisableButton('cancel')
    this.$emit('cancel',id)
},
setDisableButton(button) {
      if (this.disableButton === button) {
        this.disableButton = null;
      } else {
        this.disableButton = button;
      }
    },

},




}</script>
