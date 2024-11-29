<template>
   <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <base-dialog :show="isLoading && !error" title="Loading..." fixed>
          <base-spinner></base-spinner>
        </base-dialog>
        <base-dialog :show="success" title="Appointment Booked Successfullly" @close="handleSuccess">
          <p class="success" >Appointment Booked Successfullly</p>
        </base-dialog>
  <div class="doctor-details-container">
   
<h4>{{ this.selectedHospital?.hospitalName  ??"NA" }}</h4>

<div class="top-container" v-for="doctor of this.selectedHospital?.doctorList ?? []" :key="doctor._id" >
   <ul>
    <li>Dr. {{ getDoctorName(doctor?.name)}}</li>
    <li>Shifts: <span v-for="shift of doctor?.shifts ?? []" :key="shift._id">{{ getshifts(shift)}}</span></li>
    <li>Specialty: <span v-for="specialty of doctor?.specialty ?? []" :key="specialty">{{ specialty }}, </span></li>
   </ul>
  
</div>
<div class="form-container">
<form >

  <div class="form-control">
         <label for="doctor">Doctor</label>
         <select id="doctor" v-model.trim="doc" >
          <option v-for="doctor in this.selectedHospital?.doctorList ?? []" :key="doctor._id" :value="doctor._id">{{ getDoctorName(doctor?.name) }}</option>
          </select>
       </div>
<div class="form-control">
  <label for="bookingDate">Date</label>
  <input type="date" id="bookingDate" v-model.trim="bookingDate" />
</div>
       <div class="form-control">
         <label for="bookingTime">Time</label>
         <input type="time" id="bookingTime" v-model.trim="bookingTime" />
       </div>
       <div class="form-control">
         <label for="bookingDuration">Duration</label>
         <input type="number" id="bookingDuration" v-model.trim="bookingDuration" />
       </div>
   </form>
   <p id="validation-message"
     v-if="!formIsValid"
   >
   Please enter proper date, time and duration should be 10 or above.</p>
   <base-button-container>
<base-button mode="outline small" @click="book(this.selectedHospital?.hospitalId)">Book</base-button>
</base-button-container>
</div>
</div>

</template>

<script>
import { DateTime } from 'luxon';
export default{
    props:['hId'],
    data(){
      return{  selectedHospital:{},
            bookingDate:'',
            bookingTime:'',
            bookingDuration:0,
            formIsValid:true,
            error:null,
            success:false,
            isLoading:false,
            doc:''
        }
    },
    computed:{
       
    },
    methods:{
        getDoctorName(name){
          return (
      (name?.firstName ?? '') +
      " " +
      (name?.middleName ?? '') +
      " " +
      (name?.lastName ?? '')
    ).trim();

          },
          getshifts(shift) {
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

      return  start + " - " + end;
            }
            return '';
     
    },getSpecialty(sp) {
      let categories = "";
      for (const s of sp) {
        categories += s+" ,";
      }
      return categories;
    },
     async   book(hospitalId){
           this.formIsValid=true;
       if(this.bookingDate===''|| !/^\d{4}-\d{2}-\d{2}$/.test(this.bookingDate)||
          this.bookingStart==='' || 
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(this.bookingTime)||
       this.bookingDuration<10 || this.doc==='')
            { 
              this.formIsValid=false
            
           
              return;
           }
            const payload={
                bookingDate:this.bookingDate,
                bookingDuration:this.bookingDuration,
                bookingStart:this.bookingTime,
                hospitalId:hospitalId,
                dId:this.doc
            }
            // console.log(payload);
            this.isLoading=true;
            try{
 
         await this.$store.dispatch('patient/bookAppointment',payload);
         
            this.success=true
            }catch(err){
              this.error = err.message || 'Failed to book, try later.';
            }    
            finally{this.isLoading=false;}
          
          
            
        },
        handleError(){
          this.error=null
        },
        handleSuccess(){
            this.success=false;
           const redirectUrl = '/patient';
            this.$router.replace(redirectUrl);
        }
    },
    created(){
        this.selectedHospital = this.$store.getters['patient/hospitalSearch'].find((hospital)=>hospital.hospitalId===this.hId)??{}
    }

}</script>
<style scoped>
.doctor-details-container{
  
      margin:1rem 0;
     max-width: 100%;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      align-items:center;
      gap:2rem;
  }
  .card{
    margin: 0;
    max-width: 100%;
    max-height: 100%;
  }
  
ul{
    padding:0;
    display: grid;
    grid-template-columns: 1fr 1fr;
  row-gap: 1rem;
  justify-content: center;
  align-items: start;
  grid-auto-flow: row;

}

h4{
    font-size: var(--h5-laptop);
    text-align:center;
    color:black;
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
        font-family: "Open Sans" sans-serif;
        font-size:var(--h6-laptop);
        font-weight:bold;
      }
      form{
        display: grid;
        grid-template-columns:1fr 1fr 1fr;
        
        gap:1rem;
      }
     
    .form-container{
        background-color:transparent;
        border: 1px solid black;
      border-radius: 8px;
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
      input:focus{
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
      li {
  list-style: none;
  font-size: var(--h6-laptop);
  font-family: "Open Sans";
  font-weight: bold;
  margin: 0.5rem;
  text-align: left;
  max-width: 100%;
}
span{
    display: inline-block;
    max-width: 100%;
    line-height: 145%;
}
.top-container{
  border: 1px solid black;
      border-radius: 8px;
      padding:0.5rem;
      max-width: 100%;
      width:100%;
    }
</style>