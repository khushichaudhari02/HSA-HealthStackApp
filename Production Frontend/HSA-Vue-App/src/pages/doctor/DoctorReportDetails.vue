<template>
  <section>
    <h2>Reports</h2>
    <base-card>
      <h4>Search Date or Month</h4>
      <div class="form-container">
        <form>
          <div class="form-control">
            <label for="date">Date</label>
            <input type="date" id="date" v-model.trim="date" />
          </div>
          <div class="form-control">
            <label for="month">Month</label>
            <input type="month" id="month" v-model.trim="month" />
          </div>
        </form>
        <div id="validation-message" v-if="!formIsValid && this.errors">
          <p v-for="error of this.errors" :key="error">{{ error }}</p>
        </div>

        <base-button-container>
          <base-button mode="primary" @click.prevent="search"
            >Search</base-button
          ><base-button mode="flat" link to="/doctor">Back</base-button>
        </base-button-container>
      </div>
    </base-card>
  </section>
  <base-dialog v-if="isLoading && errors.length===0" :show="isLoading" title="Loading..." fixed>
          <base-spinner></base-spinner>
        </base-dialog>
  <section v-if="this.report">
    
    <div class="heading">
      <!-- <li :show="this.report.date"><span>Date:</span> {{this.report.date }}</li> 
              <li :show="this.report.month"><span>Month:</span> {{this.report.month }}</li>  -->
      <li><span>Total Appointments </span> {{ getTotalAppointments }}</li>
      <li><span>Total Patients </span> {{ getTotalPatients }}</li>
      <li><span>Total Fees: </span> {{ getTotalFees }} Rs</li>
    </div>
  </section>

  <section v-if="this.report && appointments" class="appointment-row-container">
    <h2>Appointment List List</h2>

    <p v-if="appointments?.length === 0">
      No Appointments has been found for this time frame.
    </p>
    <TheAppointmentsRow
      v-if="appointments?.length > 0"
      :appointments="appointments"
    ></TheAppointmentsRow>
  </section>
  <section v-if="this.report && patientList">
    <h2>Patient List</h2>
    <p v-if="patientList?.length === 0">
      No Patient List has been found for this time frame.
    </p>
    <base-card v-if="patientList?.length > 0">
      <base-staff-list>
        <PatientItem
          v-for="(patient, index) of patientList"
          :key="patient.id"
          :id="patient.id"
          :age="patient.age"
          :sex="patient.sex"
          :name="patient.name"
          :email="patient.email"
          :phoneNumber="patient.phoneNumber"
          :index="index"
        ></PatientItem>
      </base-staff-list>
    </base-card>
    <!-- <RouterView ></RouterView> -->
  </section>
</template>
<script>
import TheAppointmentsRow from "@/components/appointments/TheAppointmentsRow.vue";
import PatientItem from "@/components/patient/PatientItem.vue";
export default {
  components: {
    TheAppointmentsRow,
    PatientItem,
  },
  data() {
    return { report: null, errors: [], formIsValid: true, date: "", month: "" };
  },
  computed: {
    getTotalAppointments() {
      return this.report?.totalAppointments ?? 0;
    },
    getTotalPatients() {
      return this.report.totalPatients ?? 0;
    },
    getTotalFees() {
      return this.report.totalFees ?? 0;
    },
    patientList() {
      const result = [];
      if (this.report) {
        const patientList = this.report.patientList ?? [];

        if (patientList) {
          for (const patient of patientList) {
            const docObj = {
              name: patient.name ?? "",
              email: patient.owner?.email ?? "",
              phoneNumber: patient.phoneNumber ?? "",
              age: patient.age ?? "",
              sex: patient.sex ?? "",
              id: patient._id ?? "",
            };
            result.push(docObj);
          }
        }
      }
      return result;
    },
    appointments() {
      const result = [];
      if (this.report) {
        const appointments = this.report.appointments??[];
        if (appointments) {
          for (const appointment of appointments) {
            const appointmentObj = {
              id: appointment._id??"",
              patientName: appointment.patientName ?? "",
              doctorName: appointment.doctorName ??"",
              date: appointment.ISTDateString??"",
              // city: !appointment.hospitalAddress.city ?appointment.hospitalAddress.city :'',
              startTime: appointment.startTime??"",
              hospitalAddress: appointment.hospitalAddress ?? null,
              duration: appointment.duration ?? null,
              hospitalName: appointment.hospitalName ?? "",
              status: appointment.status ?? "pending",
            };

            result.push(appointmentObj);
          }
        }
      }
      return result;
    },
  },
  methods: {
    async search() {
      this.isLoading = true;

      const payload = {
        month: this.month,
        date: this.date,
      };
      try {
        await this.$store.dispatch("doctor/fetchReportDetails", payload);
        this.report = this.$store.getters["doctor/reportDetails"];
      } catch (err) {
        this.error = err;
      }
      finally{
        this.isLoading=false;
      }
    },
    handleError() {
      this.error = null;
    },
    back() {
      this.$router.back();
    },
  },
};
</script>
<style scoped>
section {
  margin: 1rem 2rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  /* gap:1rem; */
  align-items: center;
  max-width: 100%;
  flex: 1;
}
.heading {
  max-width: 100%;
  display: flex;
  justify-content: space-around;

  align-items: center;
  list-style: none;
  margin: 1rem 0;
}
.heading li {
  margin-right: 1rem;
  max-width: 100%;
  font-size: var(--h5-laptop);
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
