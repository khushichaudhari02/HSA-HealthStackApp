<template>
  <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
    <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
       <base-dialog :show="success" title="Appointment Status Updated Successfullly" @close="handleSuccess">
          <p class="success" >Appointment Status Updated Successfullly</p>
        </base-dialog>
        
<section v-if="!isLoading && doctor">
    <base-card>
      <h4>Search Date and Shift </h4>
      <h5>Doctor: {{ getName }}</h5>
      <div class="form-container">
        <form>
          <div class="form-control">
            <label for="date">Date</label>
            <input type="date" id="date" v-model.trim="date" />
          </div>

          <div class="form-control">
            <label for="shift">Shift</label>
            <select id="shift" v-model="shift">
              <option v-for="shift in this.doctor.shifts" :key="shift" :value="shift">
                {{ getShift(shift) }}
              </option>
            </select>
          </div>
        </form>
        <div id="validation-message" v-if="!formIsValid && this.errors">
          <p v-for="error of this.errors" :key="error">{{ error }}</p>
        </div>

        <base-button-container>
          <base-button mode="primary" @click.prevent="search"
            >Search</base-button
          > <base-button mode="outline" link :to="editScheduleLink"
            >Update Schedule</base-button
          ><base-button mode="flat" link to="/admin/doctors"
            >Back</base-button
          >
        </base-button-container>
      </div>
    </base-card>
    
    <base-spinner     v-if="isLoading && errors.length===0"
    :show="isLoading"
    title="Loading..." ></base-spinner>
 
 
  </section>
  <section v-if="appointments?.length!==0" class="appointment-row-container">
      <h4>
        Date: <span>{{ this.date }}</span> Shift:<span>{{
          getShift(this.shift)
        }}</span>
      </h4>
     
      <p v-if="appointments?.length === 0">
        No Appointments has been approved for this schedule.
      </p>
      <TheAppointmentsRow
      @approveTop="approve"
      @cancelTop="cancel"
        :appointments="appointments"
      ></TheAppointmentsRow>
      <base-button-container>
          <base-button mode="primary" @click.prevent="completed"
            >Complete</base-button
          > <base-button mode="outline" @click.prevent="unMark"
            >Mark to zero</base-button
          >
        </base-button-container>
        <div id="validation-message" v-if="!formIsValid">
          <p v-for="error of this.statusError" :key="error">{{ error }}</p>
        </div>
    </section>
</template>

<script>
import { DateTime } from 'luxon'
import TheAppointmentsRow from "@/components/appointments/TheAppointmentsRow.vue";

export default{
  props:['dId'],
  components:{TheAppointmentsRow},
  data(){
    return{
      formIsValid: true,
      isLoading: false,
      error: null,
      success: false,
      date: "",
      doctor:{},
      shift: {},
      errors: [],
      status:[],
      statusError:[],
    }
  },
  computed:{
    editScheduleLink(){
      return "/admin/schedule/"+this.dId+"/edit"
    },
  
    appointments(){
        const appointments= this.$store.getters['admin/searchedScheduleAppointments']??[];
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
  },
      getName(){
        if (this.doctor?.name) {
      return `${this.doctor?.name?.firstName ?? ''} ${this.doctor?.name?.middleName ?? ''} ${this.doctor?.name?.lastName ?? ''}`;
    }
    return '';
      }
    },
    methods:{
unMark(){
  this.status=[];
  console.log(this.status)
  alert('UnMarked Done')
},
  async  search(){
        if (!this.checkForm()) {
        this.formIsValid = false;
        return;
      }
      this.isLoading=true;
      let shift = JSON.stringify(this.shift);
      shift = JSON.parse(shift);
      const payload = {
        dId:this.dId,
        date: this.date,
        shift: shift,
      };

      try {
        await this.$store.dispatch('admin/fetchSearchedSchedule',payload);
      } catch (err) {
        this.error = err;
      }
      this.isLoading = false;
      },
      completed(){
   
        if(this.status.length< this.appointments.length){
          this.statusError.push("please check all status")
          this.formIsValid=false;
          return
        }
        this.statusError=[]

        const payload={
          dId:this.dId,
          status:this.status
        }
        this.isLoading=true;
        try{
          
          this.$store.dispatch('admin/updateAppointmentStatusMany',payload)
          this.success=true;
          this.status=[];
        }catch(err){
  
          this.error = err.message || 'Something went wrong!';
        }finally{
            this.isLoading=false;
        }

      },
      getShift(shift){
       let s='';
       if(shift?.startTime && shift?.endTime){
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

           s+=start+" - "+end;
       }
       
       
       return s;
   
   },
   checkForm() {
      this.errors = [];
      if (!this.date || !/^\d{4}-\d{2}-\d{2}$/.test(this.date)) {
        this.errors.push("date is invalid");
      }
      if (
        !this.shift.startTime ||
        this.shift.startTime === "" ||
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(this.shift.startTime)
      ) {
        this.errors.push("Shift Start is invalid");
      }
      if (
        !this.shift.endTime ||
        this.shift.endTime === "" ||
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(this.shift.endTime)
      ) {
        this.errors.push("Shift End is invalid");
      }
      if (this.errors.length === 0) {
        return true;
      }
      return false;
    },
    handleError() {
      this.error = null;
    },
    handleSuccess() {
      this.success = false;
    },
    approve(id){
      
      const existingAppointment = this.status.find((s)=>s.aId===id)
    if(existingAppointment){
      existingAppointment.status='approved'
      return
    }
      this.status.push({
        aId:id,
        status:"approved"
      })
    },
  cancel(id){
   
    const existingAppointment = this.status.find((s)=>s.aId===id)
    if(existingAppointment){
      existingAppointment.status='cancelled'
      return
    }
    this.status.push({
      aId:id,
      status:'cancelled'
    })
    }
    },
  async created(){
    this.isLoading=true;
            try{
                await this.$store.dispatch('admin/fetchDoctorList');
                const doctor =this.$store.getters['admin/doctorList'].find((doctor)=>doctor.sId===this.dId)??{}
                this.doctor = {
                  name: doctor?.name ?? '',
      id: doctor?.sId ?? '',
      shifts: doctor?.shifts ?? [],
      specialty: doctor?.specialty ?? []
                }
               
            }catch(err){
                this.error = err.message || 'Something went wrong!';
                
            }finally{
              this.isLoading=false;
            }
  }
}</script>

<style scoped>
h4 {
  font-size: var(--h5-laptop);
  text-align: center;
  color: black;
}
h5{
  font-size:var(--h6-laptop)
}
h2 {
  font-size: var(--h4-laptop);
}

.form-control {
  margin: 0.5rem 0;
  /* display:flex;
        flex-direction:column;
        justify-content:center;
        width: inherit;
        align-items:center; */
  text-align: left;
}
.form-control label {
  font-family: "Open Sans" sans-serif;
  font-size: var(--h6-laptop);
  font-weight: bold;
}
form {
  display: flex;
    flex-direction: column;
  
  
  max-width: 100%;

  gap: 1rem;
}
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
.form-container {
  padding: 1rem;
  background-color: transparent;
}

input,
select {
  display: block;
  width: 100%;
  margin-top: 0.5rem;
  height: 2.5rem;
  border: 1px solid var(--primary-color);
  padding: 0.5rem;
  border-radius: 8px;
  font-size: var(--h6-laptop);
}
span {
  font-weight: normal;
}
input:focus {
  background-color: var(--black-5);
}
#validation-message {
  color: red;
  font-size: var(--h6-laptop);
}
</style>