<template>
     <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
<section  >
    <h2>Fees Details</h2>
    <div class="heading">
    <li>Date :{{ this.date }}</li>
    <li>totalFees: {{ this.feesDetails.totalFees??"N/A" }}</li>
    <li>Daily Appointment Count: {{ this.feesDetails.dailyCount??"N/A" }}</li>
</div>
    <p v-if="!this.error && !this.appointments ">
        No Appointments for this date
      </p>
      <TheAppointmentsRow v-if="this.appointments && this.appointments?.length!==0"
        :appointments="appointments"
      ></TheAppointmentsRow>
      <base-button link @click="back" mode="flat">Back</base-button>
</section></template>

<script>
   import TheAppointmentsRow from "@/components/appointments/TheAppointmentsRow.vue"

export default{
    props:['date'],
    components:{TheAppointmentsRow},
    data(){
        return{
            isLoading:false,
            error:null,


        }
    },
    computed:{
        feesDetails(){
            const fee =this.$store.getters['doctor/feesDetails']??{};
            if(fee){
                return fee;
            }
            return {}
        },
        appointments(){
    //         const appointments= this.$store.getters['doctor/feesList'].find((fee)=>fee.date===this.date)?.appointments;
    //    const result=[];
    //    console.log(appointments);
    //    for (const appointment of appointments) {
    //      const appointmentObj = {
    //        id: appointment._id,
    //        patientName: appointment.patientName,
    //        doctorName: appointment.doctorName,
    //        date: appointment.ISTDateString,
    //        // city: !appointment.hospitalAddress.city ?appointment.hospitalAddress.city :'',
    //        startTime: appointment.startTime,
    //        hospitalAddress: appointment.hospitalAddress || null,
    //        duration: appointment.duration || null,
    //        hospitalName: appointment.hospitalName || "",
    //        status: appointment.status || "pending",
    //        fees:appointment.fees
    //      }
    //    result.push(appointmentObj);
       
    // }
    // return result
    const feesList = this.$store.getters['doctor/feesList'];
      const fee = feesList.find(fee => fee.date === this.date);
      if (fee) {
        return fee.appointments.map(appointment => ({
          id: appointment?._id??"",
          patientName: appointment?.patientName ?? 'N/A',
          doctorName: appointment?.doctorName ?? 'N/A',
          date: appointment?.ISTDateString ?? '',
          startTime: appointment?.startTime ?? '',
          hospitalAddress: appointment?.hospitalAddress ?? null,
          duration: appointment?.duration ?? null,
          hospitalName: appointment?.hospitalName ?? '',
          status: appointment?.status ?? 'pending',
          fees: appointment?.fees ?? 0,
        }));
      }
      return [];
  }
        },methods:{
            back(){
                this.$router.back()
            },
            handleError(){
                this.error=null
            }
        },
 async   created(){  
     this.isLoading=true;
            try{
                await this.$store.dispatch('doctor/fetchFeesDetails',{date:this.date});
                this.isLoading=false;
            }catch(err){
                this.error = err.message || 'Something went wrong!';
                
            }finally{
                this.isLoading=false;
            }

    }
}

</script>
<style scoped>

section {
  margin: 1rem 2rem;
  padding:0;
  display: flex;
  flex-direction: column;
  /* gap:1rem; */
  align-items: center;
  max-width: 100%;
  flex: 1;
  /* max-width:60rem ; */
}
.heading{
    max-width: 100%;
    display: flex;
    justify-content: space-around;

    align-items: center;
    list-style: none;
    margin:1rem 0;
}
h2{
    font-size: var(--h4-laptop);
}
.heading li{
    margin-right: 1rem;
    max-width: 100%;
    font-size: var(--h5-laptop);

}
</style>