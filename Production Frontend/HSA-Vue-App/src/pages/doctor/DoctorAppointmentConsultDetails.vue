<template>
  <base-dialog :show="!!error" title="An error occurred" @close="handleError">
    <p class="error-message">{{ error }}</p>
  </base-dialog>
  <base-dialog
    :show="success"
    title="Appointment Consultation Saved Successfullly"
    @close="handleSuccess"
  >
    <p class="success">Appointment Consultation Saved Successfullly</p>
  </base-dialog>
  <div v-if="!selectedAppointment">
    <base-spinner></base-spinner>
  </div>
  <h1>Consult</h1>
  <section>
    <base-card>
      <ol>
        <li><span>Patient: </span>{{ getPatientName }}</li>
        <li><span>Doctor: </span>{{ getDoctorName }}</li>
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
        <li><span>Date: </span>{{ getDate }}</li>
        <li><span>Start Time: </span>{{ getStartTime }}</li>
        <li><span>Duration: </span>{{ getDuration }}</li>
        <!-- <li>
          <span>Status: </span>{{ getStatus}}
        </li> -->
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
        <!-- <li >
          <span>Hospital: </span>{{getHospitalName }}
        </li> -->
        <!-- <li >
          <span>Address: </span>{{ getHospitalAddress}}
        </li> -->
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
          <span class="heading"> Fees: Total {{ selectedAppointment.fees?.totalAmount??0 }}</span>
       <span class="body">   
          <span
            class="parent"
            v-for="fee,index of selectedAppointment?.fees?.feesStructure ?? []"
            :key="index"
          >
          {{ index+1 }}
            
              <span class="heading"> {{fee.feesType}}:</span> 

              <span>{{ fee.Amount }}Rs.</span>

          </span>
        </span>
        </li>
      </ol>
      <PastAppointmentDetails v-for="appointment of this.pastAppointments??[]"
      :appointment="appointment"
      :key="appointment._id"
      ></PastAppointmentDetails>
    
      <div class="load-past">
        <base-button mode="primary" @click="loadPastData">Load Past Data</base-button>
      </div>
      <ol></ol>
    </base-card>

    <base-card>
      <form>
        <div class="top-container">
          <h5>Prescription</h5>
          <div
            class="row"
            v-for="(prescription, index) of prescriptions"
            :key="prescription"
          >
            <h6>{{ index + 1 }}</h6>
            <div class="form-control">
              <label for="">Drug</label>
              <input type="text" v-model.trim="prescription.drug" />
            </div>
            <div class="form-control">
              <label>Dosage</label>
              <input type="text" v-model.trim="prescription.dosage" />
            </div>

            <base-button-container>
              <base-button
                mode="primary small"
                @click.prevent="addPrescriptionRow"
                >+</base-button
              >
              <base-button
                @click.prevent="removePrescriptionRow(index)"
                mode="red small"
                >-</base-button
              >
            </base-button-container>
          </div>
        </div>
        <div class="top-container">
          <h5>Lab Test</h5>
          <div class="row" v-for="(labTest, index) of labTests" :key="labTest">
            <h6>{{ index + 1 }}</h6>
            <div class="form-control">
              <label>Lab Test Name</label>
              <input type="text" v-model="labTest.name" />
            </div>
            <base-button-container>
              <base-button mode="primary small" @click.prevent="addLabTestRow"
                >+</base-button
              >
              <base-button
                @click.prevent="removeLabTestRow(index)"
                mode="red small"
                >-</base-button
              >
            </base-button-container>
          </div>
        </div>
        <div class="form-control">
          <label for="notes">Notes</label>
          <input type="text" id="notes" v-model.trim="notes" />
        </div>
        <div class="top-container">
          <h5>Total Fees: {{ totalAmount }}</h5>
          <div
            class="row"
            v-for="(feeStructure, index) of feesStructure"
            :key="feeStructure"
          >
            <h6>{{ index + 1 }}</h6>
            <div class="form-control">
              <label for="">Fee Type</label>
              <input type="text" v-model.trim="feeStructure.feesType" />
            </div>
            <div class="form-control">
              <label>Amount</label>
              <input type="number" v-model.trim="feeStructure.amount" />
            </div>

            <base-button-container>
              <base-button
                mode="primary small"
                @click.prevent="addFeeStructureRow"
                >+</base-button
              >
              <base-button
                @click.prevent="removeFeeStructureRow(index)"
                mode="red small"
                >-</base-button
              >
            </base-button-container>
          </div>
        </div>
        <base-button-container>
          <base-button mode="primary" @click.prevent="submit"
            >Complete Consultation</base-button
          >
          <base-button @click="cancel" mode="red">Cancel</base-button>
        </base-button-container>
      </form>
    </base-card>
  </section>
</template>
<script>
import { DateTime } from "luxon";
import PastAppointmentDetails from "../../components/appointments/PastAppointmentDetails.vue"
export default {
  props: ["aId"],
  components:{PastAppointmentDetails},
  data() {
    return {
      // selectedAppointment:null
      prescriptionsSetup: [{ drug: "", dosage: "" }],
      labTestsSetup: [
        {
          name: "",
        },
      ],
      fees: {
        totalAmount: 0,
        feesStructure: [{ feesType: "", amount: 0 }],
      },
      notes: "",
      error: null,
      success: false,
   
    };
  },
  watch: {
    fees(newFee, oldFee) {
      // if(newFee.amount!==oldFee.amount){
      //   this.fees.totalAmount= newFee.amount+this.fees.totalAmount;
      // }
      console.log(oldFee);
      console.log(newFee);
    },
  },
  methods: {
    addPrescriptionRow() {
      this.prescriptionsSetup.push({
        drug: "",
        dosage: "",
      });
    },
    removePrescriptionRow(index) {
      if (this.prescriptionsSetup.length > 1) {
        this.prescriptionsSetup.splice(index, 1);
      }
    },
    addLabTestRow() {
      this.labTestsSetup.push({ name: "" });
    },
    removeLabTestRow(index) {
      if (this.labTestsSetup.length > 1) {
        this.labTestsSetup.splice(index, 1);
      }
    },
    addFeeStructureRow() {
      this.fees.feesStructure.push({
        feesType: "",
        amount: 0,
      });
    },
    removeFeeStructureRow(index) {
      if (this.fees.feesStructure.length > 1) {
        this.fees.feesStructure.splice(index, 1);
      }
    },
    async submit() {
      let prescriptions = JSON.stringify(this.prescriptionsSetup);
      prescriptions = JSON.parse(prescriptions);
      let labTests = JSON.stringify(this.labTestsSetup);
      labTests = JSON.parse(labTests);
      let feesStructure = JSON.stringify(this.feesStructure);
      feesStructure = JSON.parse(feesStructure);
      for (const feeStructure of feesStructure) {
        this.fees.totalAmount += feeStructure.amount;
      }

    
      const labTestResponse = [];
      for (const labTest of labTests) {
        labTestResponse.push(labTest.name);
      }
      const responseData = {
        id: this.selectedAppointment._id,
        feesStructure: feesStructure,
        prescriptions: prescriptions,
        testPrescribed: labTestResponse,
        notes: this.notes,
      };
      console.log(responseData);
      try {
        await this.$store.dispatch("doctor/consultationComplete", responseData);
      } catch (err) {
        this.error =
          err.message || "Failed to complete consultation, try again";
      }
      // this.success=true
      // await this.$store.dispatch('doctor/consultationComplete',responseData)
    },
    cancel() {
      console.log("cancel");
      this.$router.back();
    },
    handleError() {
      this.error = null;
    },
    handleSuccess() {
      this.success = false;
      this.$router.back();
    },
    async loadPastData(){
      const pId=this.selectedAppointment?.patient?._id
      if(!pId){
        return 
      }  
        this.$store.dispatch('doctor/fetchPatientPastAppointments',pId);
      
      
      
     
      
    }
  },

  computed: {
    pastAppointments(){
      const appointments= this.$store.getters['doctor/currentPatientRecentAppointments']??[];
       const result=[];
       
       for (const appointment of appointments??[]) {
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
      return result;
    },
    getDate() {
      return this.selectedAppointment?.ISTDateString ?? "";
    },
    prescriptions() {
      return this.prescriptionsSetup;
    },
    totalAmount() {
      return this.fees.totalAmount;
    },
    labTests() {
      return this.labTestsSetup;
    },
    feesStructure() {
      return this.fees.feesStructure;
    },
    selectedAppointment() {
      return this.$store.getters["doctor/appointmentDetails"];
    },
    getHospitalAddress() {
      return this.selectedAppointment?.hospitalAddress
        ? `${this.selectedAppointment.hospitalAddress.streetAddress[0]}, ${this.selectedAppointment.hospitalAddress.streetAddress[1]}, ${this.selectedAppointment.hospitalAddress.city}`
        : "";
    },
    getStartTime() {
      if (this.selectedAppointment?.startTime) {
        const time = DateTime.fromFormat(
          this.selectedAppointment.startTime,
          "HH:mm",
          { zone: "Asia/Kolkata" }
        );
        return time
          .toLocaleString({ hour: "numeric", minute: "2-digit" })
          .toLowerCase();
      }
      return "";
    },
    getDuration() {
      return this.selectedAppointment?.duration
        ? `${this.selectedAppointment.duration} Minutes`
        : "";
    },
    getDoctorName() {
      return this.selectedAppointment?.doctorName
        ? `Dr.${this.selectedAppointment.doctorName}`
        : "";
    },
    getPatientName() {
      return this.selectedAppointment?.patientName ?? "";
    },
    getHospitalName() {
      return this.selectedAppointment?.hospitalName ?? "";
    },
    getStatus() {
      return this.selectedAppointment?.status ?? "";
    },
    getNotes() {
      return this.selectedAppointment?.notes ?? "";
    },
    getFees() {
      if (!this.selectedAppointment?.fees) return "";
      const totalAmount = `totalAmount: ${this.selectedAppointment.fees.totalAmount}\n`;
      let feeString = "";
      for (const fee of this.selectedAppointment.fees.feesStructure) {
        feeString += `${fee.feeType} Amount: ${fee.amount}\n`;
      }
      return totalAmount + feeString;
    },
    getPrescription() {
      if (
        !this.selectedAppointment?.prescriptions ||
        this.selectedAppointment?.prescriptions.length === 0
      )
        return "";
      let prescriptionString = "";
      for (const prescription of this.selectedAppointment.prescriptions) {
        prescriptionString += `drug: ${prescription.drug} dosage: ${prescription.dosage}\n`;
      }
      return prescriptionString;
    },
    getLabTest() {
      if (!this.selectedAppointment?.testPrescribed) return "";
      let labTestString = "";
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
    },
  },

  async created() {
    const payload = {
      aId: this.aId,
    };
    this.isLoading = true;
    try {
      await this.$store.dispatch("doctor/fetchAppointmentDetails", payload);
    } catch (err) {
      this.error = err.message || "failed to fetch";
    }finally{
      this.isLoading=false;
    }
  },
};
</script>

<style scoped>
h1 {
  margin: 1rem auto;
}
section {
  margin: 1rem 2rem;
  max-width: 100%;
  padding: 0;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
}
.card {
  margin: 0;
  max-width: 100%;
  width: 100%;
}
ol {
  padding: 1rem 0;
  /* border:1px solid black; */
  max-width: 100%;
  list-style: none;
  margin: 0;
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

p {
  display: inline-block;
  margin: 0;
  padding: 0;
  font-family: inherit;
}
li {
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
.form-control {
  margin: 0.5rem 0;
  /* display:flex;
        flex-direction:column;
        justify-content:center;
        width: inherit;
        align-items:center; */
  text-align: left;
  max-width: 100%;
}
.form-control label {
  font-family: "Open Sans" sans-serif;
  font-size: var(--h6-laptop);
  font-weight: bold;
}
form {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  gap: 1rem;
  padding: 1rem 0;
  max-width: 100%;
}
.row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-width: 100%;
  margin: 1rem 0;
  gap: 1rem;
  /* border: 1px solid black;
      border-radius: 8px;
      padding:0.5rem; */
}

.top-container h5 {
  font-size: var(--h5-laptop);
  margin: 0;
  text-align: start;
}
.top-container {
  border: 1px solid black;
  border-radius: 8px;
  padding: 0.5rem;
}

.row h6 {
  font-size: var(--h6-laptop);
  margin: 0;
}

input {
  display: block;
  width: 100%;
  margin-top: 0.5rem;
  height: 2.5rem;
  border: 1px solid var(--primary-color);
  padding: 1rem;
  border-radius: 8px;
  font-family: "Open Sans";
  font-size: var(--h6-laptop);
}
input:focus {
  background-color: var(--black-5);
}
#validation-message {
  color: red;
  font-size: var(--h6-laptop);
}
</style>
