<template>
    <base-dialog :show="!!error" mode="error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
 <div v-if="isLoading && !error">
      <base-spinner></base-spinner>
    </div>
    <section v-if="!shift">
      <h2>No current appointment for you to consult at this time</h2>
        </section>
     <section v-if="shift" class="appointment-row-container">
    <h1>Your Appointments</h1>
    <h4>Date:{{ getDate ??"N/A" }} Shift:{{getShift ??"N/A" }}</h4>
    
    <p v-if="appointments?.length === 0">
      No Appointments. Book one by clicking on book appointment button.
    </p>
    <TheAppointmentsRow
      v-else
      :appointments="appointments"
    ></TheAppointmentsRow>
  </section>
</template>

<script>
import TheAppointmentsRow from "@/components/appointments/TheAppointmentsRow.vue"
import { DateTime } from "luxon";
export default {
  components: { TheAppointmentsRow },
  data() {
    return {
      patientName:"",
      isLoading:false,
      error:null,
    };
  },
  computed:{ isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    shift(){
          return this.$store.getters['doctor/todayAppointments']?.length??0;
       },
    // isCoach() {
    //   return this.$store.getters
    // },
    appointments(){
      const appointments= this.$store.getters['doctor/todayAppointments'];
      const today = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" }).toJSDate().toISOString();
      const result=[];
      if(!appointments || appointments.length===0){
        return null;
      }
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
      }
      if ( today > appointment.bookingDateTime) {
          result.push(appointmentObj);
}}

  return result;
    },
    nextAppointment(){

     const appointment=this.$store.getters['doctor/currentPatientRecentAppointments'][0];
     if(!appointment){
      return null;
     }
     const nextAppointment={
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
     }
      return nextAppointment
    },
    getShift(){
  const shift = this.$store.getters['doctor/todaySchedule'].shift??{};
       
       if(!shift || shift.startTime || shift.endTime){
        return ''
       }
            const start = DateTime.fromFormat(shift.startTime, "HH:mm", {
        zone: "Asia/Kolkata",
      })
        .toLocaleString({ hour: "numeric", minute: "2-digit" })
        .toLowerCase();
      const end = DateTime.fromFormat(shift.endTime, "HH:mm", {
        zone: "Asia/Kolkata",
      })
        .toLocaleString({ hour: "numeric", minute: "2-digit" })
        .toLowerCase();

          
        return `${start} - ${end}`;
    

    
    },
    getDate(){
      const date = this.$store.getters['doctor/todaySchedule']?.date;
      if(!date) return null;
      const dateTime = DateTime.fromFormat(date,'yyyy-MM-dd',{zone:'Asia/Kolkata'}).toLocaleString();
      return dateTime
    }
    
  },
  methods:{
    async loadScheduleAppointments(){
      this.isLoading = true;
      this.error = null;
          try{
          await this.$store.dispatch('doctor/fetchConsult');
          }catch (error) {
        this.error = error.message || 'Something went wrong!';
      }finally{
        this.isLoading = false;
      }
    
    },

        //   const pastAppointments= data.pastAppointments;
        handleError(){
         this.error=null;
        }     //  const futureAppointments= data.futureAppointments;
      },
  created() {
    this.loadScheduleAppointments();
  },
  // mounted(){
  //   this.fetchPastData
  // }
}
</script>

<style scoped>
.main-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5rem 4rem 0;
  padding: 5rem 0;
}
h2 {
     font-size: var(--h4-laptop);
     margin-bottom: 3rem;
   }
.main-section .appointment-container {
  max-width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
}
section {
  border-bottom: 1px solid var(--black-10);
  flex:1;
}



h1{
  font-size: var(--h3-laptop);
}
h4{
  font-size: var(--h5-laptop);

}
.appointment-row-container {
  padding: 4rem 2rem;
  max-width: 100%;
}
.appointment-row-container p {
  display: inline-block;
  text-align: justify;
  font-family: "Domine", sans-serif;
  font-size: var(--h6-laptop);
  color: var(--black);
  font-weight: 300;
  line-height: 145%;
}
@media (max-width: 1200px) {
  
  .appointment-row-container {
    max-width: 100%;
  }
}

</style>

