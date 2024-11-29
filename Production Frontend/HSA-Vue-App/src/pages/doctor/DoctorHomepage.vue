<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <section v-if="!shift" class="no-appointment">
         <h2>No current appointment for you to consult at this time</h2>
        </section>
    <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
     <section v-if="shift" class="main-section">
       <div class="CTA-container">
         <p>View Current Patient Data</p>
         <base-button-container>
           <base-button link mode="primary big" to=""
             >View Current Patient Past Data</base-button
           >
           <base-button link class="outline big" to=""
             >View Patient Details</base-button
           >
         </base-button-container>
       </div>
      
       <ul v-if="nextAppointment" class="appointment-container">
         <AppointmentItem
           :id="nextAppointment?.id"
           :doctorName="nextAppointment?.doctorName"
           :patientName="nextAppointment?.patientName"
           :duration="nextAppointment?.duration"
           :startTime="nextAppointment?.startTime"
           :date="nextAppointment?.date"
           :status="nextAppointment?.status"
         ></AppointmentItem>
       </ul>
     </section>
 
     <section v-if="shift" class="appointment-row-container">
       <h2>Most Recent Appointments of Patient</h2>
       <div v-if="isLoading">
         <base-spinner></base-spinner>
       </div>
       <p v-if="pastAppointments.length === 0">
         No Appointments. Book one by clicking on book appointment button.
       </p>
   
       <TheAppointmentsRow
         v-else
         :appointments="pastAppointments"
       ></TheAppointmentsRow>
     </section>
   </template>
   
   <script>
   import AppointmentItem from '@/components/appointments/AppointmentItem.vue'
   import TheAppointmentsRow from "@/components/appointments/TheAppointmentsRow.vue"
   import { DateTime } from "luxon";
   export default {
     components: { TheAppointmentsRow ,AppointmentItem},
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
          return this.$store.getters['doctor/todayAppointments']?.length ?? 0;
       },
       // isCoach() {
       //   return this.$store.getters
       // },
       pastAppointments(){
         const appointments= this.$store.getters['doctor/currentPatientRecentAppointments'] ?? [];
         const today = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" }).toJSDate().toISOString();
         const result=[];
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
         if ( today > appointment?.bookingDateTime??'') {
             result.push(appointmentObj);
   }}
   
     return result;
       },
       nextAppointment(){
        const appointment=this.$store.getters['doctor/currentPatientRecentAppointments'][0]??{};
        if(appointment){
          const nextAppointment={
            id: appointment?._id??"",
           patientName: appointment.patientName,
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
        }
        return null;
       }
     },
     methods:{
       async loadScheduleAppointments(){
         this.isLoading = true;
         this.error = null;
             try{
             await this.$store.dispatch('doctor/fetchHome');
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
   .main-section .appointment-container {
     max-width: 100%;
     list-style: none;
     margin: 0;
     padding: 0;
   }
   section {
     border-bottom: 1px solid var(--black-10);
     flex:1;
     margin-top:1rem;
   }
   .CTA-container {
     padding: 2rem 0;
     max-width: 100%;
     display: flex;
     flex-direction: column;
   }
   
   .CTA-container p {
     display: inline-block;
     text-align: justify;
     font-family: "Open Sans", sans-serif;
     font-size: var(--h4-laptop);
     color: var(--black);
     font-weight: 300;
     line-height: 145%;
   }
   
   h2 {
     font-size: var(--h4-laptop);
     margin-bottom: 3rem;
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
     .main-section {
       flex-direction: column-reverse;
     }
     .appointment-row-container {
       max-width: 100%;
     }
   }
   
   @media (max-width: 600px) {
     .main-section {
       padding: 1rem 0;
       margin: 4rem 1rem 0;
     }
     .main-section .CTA-container {
       padding: 1rem 0;
     }
   }
   </style>
   