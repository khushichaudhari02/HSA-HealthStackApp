<template>
      <ol >
        <li>
        Date: {{appointment.date }}
        </li>
        <li>
          Time:  {{ getStartTime }}
        </li>
        <li>
        {{ getDoctorName }}
        </li>
        <li v-if="isPrescriptionExist" class="prescription">

          <span class="heading">   Prescriptions</span>
        
       <span class="body">  
          <span
            class="parent"
            v-for="prescription,index of appointment.prescriptions ?? []"
            :key="index"
          >
          {{ index+1 }}
            <span class="drug">
              <span class="heading">Drug:</span>

              <span>{{ prescription.drug }}</span>
            </span>

            <span class="dosage">
              <span class="heading"> Dosage: </span
              ><span>{{ prescription.dosage }} </span>
            </span>
          </span>
        </span>
        </li>
        
        <li v-if="isLabTestExist" >
          <span class="heading">Lab Test: </span>
       <span class="body">   <span
            class="parent"
            v-for="labTest,index of appointment.testPrescribed ?? []"
            :key="index"
          >
            
              <span class="heading">Test {{ index+1 }}: </span>

              <span>{{ labTest }}</span>

          </span></span> </li>
        <li v-if="isNotesExist"><span>Notes: </span>{{ appointment.notes }}</li>
        <li v-if="isFeesExist">
          <span class="heading"> Fees: Total {{ appointment.fees?.totalAmount??0 }}</span>
       <span class="body">   
          <span
            class="parent"
            v-for="fee,index of appointment.fees?.feesStructure ?? []"
            :key="index"
          >
          {{ index+1 }}
            
              <span class="heading"> {{fee.feesType}}:</span> 

              <span>{{ fee.Amount }}Rs.</span>

          </span>
        </span>
        </li>
    </ol>
      
</template>
<script>
import {DateTime} from "luxon"
export default{
    props:[
        "appointment"
    ],
    computed:{
        getStartTime(){
       
       
       if (this.appointment?.startTime) {
           const time = DateTime.fromFormat(this.appointment.startTime, 'HH:mm', { zone: 'Asia/Kolkata' });
           return time.toLocaleString({ hour: 'numeric', minute: '2-digit' }).toLowerCase();
       }
       return 'Not available'; 
       
   },
   getDuration(){
       return this.appointment?.duration + " Minutes"
   },
   getDoctorName(){
       return "doctor: " + (this.appointment.doctorName ?? ''); // Default to 'Unknown' if doctorName is undefined
   },
    
    isPrescriptionExist() {
      return this.appointment?.prescriptions?.length > 0 ?? false;
    },
    isLabTestExist() {
      return this.appointment?.testPrescribed?.length > 0 ?? false;
    },
    isFeesExist() {
      return this.appointment?.fees?.totalAmount ?? 0;
    },
    isNotesExist() {
      return this.appointment?.notes ?? false;
    },
}

}

</script>
<style scoped>
ol {
  padding: 1rem 0;
  /* border:1px solid black; */
  max-width: 100%;
  list-style: none;
  margin: 0;
  display: flex;
  flex-direction: column;

  justify-content: center;
}li {
  list-style: none;
  font-size: var(--h5-laptop);
  font-family: "Open Sans";
  font-weight: normal;
  line-height: 145%;
  margin: 0.5rem;
  text-align: left;
  max-width: 100%;
  word-wrap: break-word;
}
.body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
}
.body .drug , .body .dosage{
 
  gap:0.5rem;
}
.body .parent {
  display: flex;
  gap: 0.5rem;
}
.body span {
  font-weight: normal;
}
.body .heading {
  font-weight: bold;
  margin-right: 0.5rem;
}
span {
  font-weight: bold;
  font-family: "Open Sans" sans-serif;
  font-size: inherit;
}
</style>