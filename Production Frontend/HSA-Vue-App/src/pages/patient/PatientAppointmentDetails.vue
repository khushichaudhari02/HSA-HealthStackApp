<template>
    <base-dialog :show="!!error" mode="error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading &&!selectedAppointment">
      <base-spinner></base-spinner>
    </div>
 <section v-if="selectedAppointment" >
  <h4>Appointment Details</h4>
  <base-card>
    <ol>
       <li>
        <span>Patient: </span>{{getPatientName}}
      </li>
      <li>
        <span>Doctor: </span>{{getDoctorName }}
      </li> 
      <!-- <li>
        <span>Age:</span>{{ getAge}}
      </li>
      <li>
        <span>Sex:</span>{{ patientSex}}
      </li>
      <li v-if="isWeightExist">
        <span>Weight:</span>{{ patientWeight}}
      </li>
      <li v-if="isHeightExist">
        <span>Height:</span>{{ patientHeight}}
      </li> -->
      <li>
        <span>Date: </span>{{ getDate}}
      </li>
       <li >
        <span>Start Time: </span>{{getStartTime}}
      </li> 
      <li>
        <span>Duration: </span>{{ getDuration}}
      </li>
      <li>
        <span>Status: </span>{{ getStatus}}
      </li>
      <!-- <li v-if="isPrescriptionExist">
        <span>Prescription: </span>{{getPrescription}}
      </li>
      <li v-if="isLabTestExist">
        <span>Lab Test: </span>{{getLabTest }}
      </li>
      <li v-if="isNotesExist">
        <span>Notes: </span>{{ getNotes}}
      </li>
      <li v-if="isFeesExist">
        <span>Fees: </span>{{getFees }}
      </li> -->
      <li >
        <span>Hospital: </span>{{getHospitalName }}
      </li>
      <li >
        <span>Address: </span>{{ getHospitalAddress}}
      </li>
    </ol>
    <ol class="consulted">
        <li v-if="isPrescriptionExist" class="prescription">
          <span class="heading">   Prescriptions</span>
       <span class="body">  
          <span
            class="parent"
            v-for="prescription,index of selectedAppointment?.prescriptions ?? []"
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
            v-for="labTest,index of selectedAppointment?.testPrescribed ?? []"
            :key="index"
          >
            
              <span class="heading">Test {{ index+1 }}: </span>

              <span>{{ labTest }}</span>

          </span></span> </li>
        <li v-if="isNotesExist"><span>Notes: </span>{{ getNotes }}</li>
        <li v-if="isFeesExist">
          <span class="heading">
            Fees: Total {{ selectedAppointment.fees?.totalAmount ?? 0 }}</span
          >
          <span class="body">
            <span
              class="parent"
              v-for="(fee, index) of selectedAppointment?.fees?.feesStructure ??
              []"
              :key="index"
            >
              {{ index + 1 }}

              <span class="heading"> {{ fee.feesType }}:</span>

              <span>{{ fee.Amount }}Rs.</span>
            </span>
          </span>
        </li>
      </ol>
  </base-card>
  <base-button-container>
        <base-button @click="cancel" mode="red" 
          >Cancel Appointment</base-button
        >
        <base-button  link mode="flat" @click="back"
          >Go Back</base-button
        >
  </base-button-container>
</section>
</template>
<script> 
import {DateTime} from 'luxon';




export default {
  props:['aId'],
  data() {
    return {
      // selectedAppointment:null
      error:null,
      isLoading:false
    }
  },
  methods:{
    handleError(){
      this.error=false
    },back(){
      this.$router.back();
    },
  },
  computed:{
    // getDate(){
    //   return this.selectedAppointment.ISTDateString;
    // },
    // selectedAppointment() {
    //   return this.$store.getters["patient/appointmentDetails"]
    // },
    // getHospitalAddress(){
    //     if(!this.selectedAppointment.hospitalAddress){
    //         return ''
    //     }
    //  return   this.selectedAppointment.hospitalAddress.streetAddress[0] +", "+ this.selectedAppointment.hospitalAddress.streetAddress[1]+","+ this.selectedAppointment.hospitalAddress.city;
     
    // },
    // getStartTime(){
    //   if(this.selectedAppointment){
    //     const time= DateTime.fromFormat(this.selectedAppointment.startTime,'HH:mm',{zone:'Asia/Kolkata'});
    //     return time.toLocaleString({hour:'numeric',minute:'2-digit'}).toLowerCase();
    //   }
    //   return ''
    // },
    // getDuration(){
    //     return this.selectedAppointment.duration+ " Minutes"
    // },
    // getDoctorName(){
    //   if(!this.selectedAppointment.doctorName){
    //     return ''
    //   }
    //     return "Dr."+this.selectedAppointment.doctorName
    // },
    // getPatientName(){
    //   if(!this.selectedAppointment.patientName){
    //     return ''
    //   }
    //     return this.selectedAppointment.patientName
    // },
    // getHospitalName(){
    //   return this.selectedAppointment.hospitalName
    // },
    // getStatus(){
    //   return this.selectedAppointment.status;
    // },
    // getNotes(){
    //   return this.selectedAppointment.notes;
    // },
    // getFees(){
    //   const totalAmount = "totalAmount: "+this.selectedAppointment.fees.totalAmount +"\n";
    //   let feeString=''
    //   for(const fee of this.selectedAppointment.fees.feesStructure){
    //     feeString=fee.feeType+" Amount: "+fee.amount+"\n";
    //   }
    //   totalAmount+feeString;
    //   return totalAmount+feeString;
    // },
    // getPrescription(){
    //   let prescriptionString='';
    //   for(const prescription of this.selectedAppointment.prescriptions){
    //     prescriptionString = "drug: "+prescription.drug+" dosage: "+prescription.dosage+"\n"
    //   }
    //   return prescriptionString;
    // },  getLabTest(){
    //   let labTestString='';
    //   for(const labTest of this.selectedAppointment.testPrescribed){
    //   labTestString = "Test name: "+labTest+"\n"
    //   }
    //   return labTestString;
    // },
    // isPrescriptionExist(){
    //   return this.selectedAppointment.prescriptions.length>0;
    // },
    // isLabTestExist(){
    //   return this.selectedAppointment.testPrescribed.length>0;
    // },
    // isFeesExist(){
    //   return this.selectedAppointment.fees.length>0;
    // },
    // isNotesExist(){
    //   return this.selectedAppointment.notes;
    // }
    getDate() {
    return this.selectedAppointment?.ISTDateString ?? '';
  },
  selectedAppointment() {
    return this.$store.getters["patient/appointmentDetails"];
  },
  getHospitalAddress() {
    return this.selectedAppointment?.hospitalAddress
      ? `${this.selectedAppointment.hospitalAddress.streetAddress[0]}, ${this.selectedAppointment.hospitalAddress.streetAddress[1]}, ${this.selectedAppointment.hospitalAddress.city}`
      : '';
  },
  getStartTime() {
    if (this.selectedAppointment?.startTime) {
      const time = DateTime.fromFormat(this.selectedAppointment.startTime, 'HH:mm', { zone: 'Asia/Kolkata' });
      return time.toLocaleString({ hour: 'numeric', minute: '2-digit' }).toLowerCase();
    }
    return '';
  },
  getDuration() {
    return this.selectedAppointment?.duration ? `${this.selectedAppointment.duration} Minutes` : '';
  },
  getDoctorName() {
    return this.selectedAppointment?.doctorName ? `Dr.${this.selectedAppointment.doctorName}` : '';
  },
  getPatientName() {
    return this.selectedAppointment?.patientName ?? '';
  },
  getHospitalName() {
    return this.selectedAppointment?.hospitalName ?? '';
  },
  getStatus() {
    return this.selectedAppointment?.status ?? '';
  },
  getNotes() {
    return this.selectedAppointment?.notes ?? '';
  },
  getFees() {
    if (!this.selectedAppointment?.fees) return '';
    const totalAmount = `totalAmount: ${this.selectedAppointment.fees.totalAmount}\n`;
    let feeString = '';
    for (const fee of this.selectedAppointment.fees.feesStructure) {
      feeString += `${fee.feeType} Amount: ${fee.amount}\n`;
    }
    return totalAmount + feeString;
  },
  getPrescription() {
    if (!this.selectedAppointment?.prescriptions) return '';
    let prescriptionString = '';
    for (const prescription of this.selectedAppointment.prescriptions) {
      prescriptionString += `drug: ${prescription.drug} dosage: ${prescription.dosage}\n`;
    }
    return prescriptionString;
  },
  getLabTest() {
    if (!this.selectedAppointment?.testPrescribed) return '';
    let labTestString = '';
    for (const labTest of this.selectedAppointment.testPrescribed) {
      labTestString += `Test name: ${labTest}\n`;
    }
    return labTestString;
  },
  isPrescriptionExist() {
    return this.selectedAppointment?.prescriptions?.length > 0 ?? false;
  },
  isLabTestExist() {
    return this.selectedAppointment?.testPrescribed?.length > 0 ?? false;
  },
  isFeesExist() {
    return this.selectedAppointment?.fees?.totalAmount ??0;
  },
  isNotesExist() {
    return this.selectedAppointment?.notes ?? false;
  }
  },
 async created() {
      const payload={
        aId:this.aId
      }
      this.isLoading=true;
          try{
           
          await this.$store.dispatch('patient/fetchAppointmentDetails',payload);
          }catch (error) {
        this.error = error.message || 'Something went wrong!';
      }finally{
        this.isLoading = false;
      }


  },
};
</script>

<style scoped>

section{
    margin:2rem  4rem;
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
.consulted {
  padding: 1rem 0;
  /* border:1px solid black; */
  max-width: 100%;
  list-style: none;
  margin: 0;
  display: flex;
  flex-direction: column;

  justify-content: center;
}
.body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
  padding:0.5rem;
}
.body .drug , .body .dosage{
 
  gap:0.5rem;
}
.body .parent {
  display: flex;
  gap: 0.5rem;
  padding:.5rem;
}
.body span {
  font-weight: normal;
}
.body .heading {
  font-weight: bold;
  margin-right: 0.5rem;
}
h4{
  margin:0;
  font-size: var(--h4-laptop);
}
p{
    display: inline-block;
    margin:0;
    padding:0;
    font-family: inherit;
    font-size: inherit;
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
</style>