<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
         <p class="error-message" >{{ error }}</p>
       </base-dialog>
       <div v-if="isLoading && !error">
        <base-spinner></base-spinner>
      </div>
<section  >
   <h2>Fees Details</h2>
   <h4>Doctor: {{ getDoctorName }}</h4>
   <div class="heading">
   <li>Date :{{ this.date }}</li>
   <li>totalFees: {{ this.feesDetails.totalFees??"N/A" }}</li>
   <li>Daily Appointment Count: {{ this.feesDetails.dailyCount ??"N/A"}}</li>
</div>
   <p v-if="!this.error && this.appointments.length===0 ">
       No Appointments for this date
     </p>
     <TheAppointmentsRow v-if="!this.error && this.appointments?.length>0"
       :appointments="appointments"
     ></TheAppointmentsRow>
     <base-button link @click="back" mode="flat">Back</base-button>
</section></template>

<script>
import TheAppointmentsRow from '@/components/appointments/TheAppointmentsRow.vue';


export default{
    props:['dId','date'],
    components:{TheAppointmentsRow},
    data(){
        return{
            isLoading:false,
            error:null,


        }
    },
    computed:{
        feesDetails(){
            const fee =this.$store.getters['admin/selectedDoctorFeesDetails']??{};
            if(fee){
                return fee;
            }
            return {}
        }, doctor(){
            const doctor=this.$store.getters['admin/selectedDoctor']??{};
            let result={}
            if(doctor){
                    result={
                        name:doctor?.name??"",
                  id:doctor?._id??"",
                  shifts:doctor?.shifts??[],
                  specialty:doctor?.specialty??[]
                    }
            }
            return result;
        },
        getDoctorName(){
        if(this.doctor.name){
          return this.doctor.name.firstName+" "+this.doctor.name.middleName +" "+this.doctor.name.lastName
        }
        return ''
      },
        appointments(){
            const result=[];
            if(this.fee && this.fee.appointments){
                const appointments= this.fee?.appointments??[];

       for (const appointment of appointments) {
         const appointmentObj = {
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
         }
       result.push(appointmentObj);
       
            }
          
      
      
}
    return result
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
                await this.$store.dispatch('admin/fetchSelectedDoctorFeesDetails',{dId:this.dId,date:this.date});
            }catch(err){
                this.error = err.message || 'Something went wrong!';
                
            }finally{
                this.isLoading=false;
            }

    }
    }</script>

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
    font-size: var(--h3-laptop);
    margin:1rem;
}
h4{
    font-size:var(--h4-laptop);
    margin:1rem;
}
.heading li{
    margin-right: 1rem;
    max-width: 100%;
    font-size: var(--h5-laptop);

}
</style>