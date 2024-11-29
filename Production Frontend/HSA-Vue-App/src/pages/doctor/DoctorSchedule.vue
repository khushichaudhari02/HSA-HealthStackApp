<template>
  <base-dialog :show="!!error" title="An error occurred" @close="handleError">
    <p class="error-message">{{ error }}</p>
  </base-dialog>
  
 
  <section>
    <base-card>
      <h4>Search Date and Shift</h4>
      <div class="form-container">
        <form>
          <div class="form-control">
            <label for="date">Date</label>
            <input type="date" id="date" v-model.trim="date" />
          </div>

          <div class="form-control">
            <label for="shift">Shift</label>
            <select id="shift" v-model="shift">
              <option v-for="shift in this.shifts" :key="shift" :value="shift">
                {{ getShifts(shift) }}
              </option>
            </select>
          </div>
        </form>
        <div id="validation-message" v-if="!formIsValid">
          <p v-for="error of this.errors" :key="error">{{ error }}</p>
        </div>

        <base-button-container>
          <base-button mode="primary" @click.prevent="search"
            >Search</base-button
          > <base-button mode="outline" link to="/doctor/schedule/edit"
            >Update Schedule</base-button
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
          getShifts(this.shift)
        }}</span>
      </h4>
     
      <p v-if="this.appointments?.length === 0">
        No Appointments has been approved for this schedule.
      </p>
      <TheAppointmentsRow
        :appointments="appointments"
      ></TheAppointmentsRow>
    </section>
</template>
<script>
import TheAppointmentsRow from "@/components/appointments/TheAppointmentsRow.vue";
import { DateTime } from "luxon";
export default {
  components: {TheAppointmentsRow},
  data() {
    return {
      formIsValid: true,
      isLoading: false,
      error: null,
    
      date: "",
      shifts: [],
      shift: {},
      errors: [],
    };
  },
  computed: {
    appointments(){
        const appointments= this.$store.getters['doctor/searchedScheduleAppointments']??[];
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
         };
       result.push(appointmentObj);
       
    }
    return result
  }
},

  methods: {
    getShifts(shift) {
      let s = "";
      if (!shift || !shift.startTime || !shift.endTime) {
        return "";
      }
      const start = DateTime.fromFormat(shift?.startTime??"", "HH:mm", {
        zone: "Asia/Kolkata",
      })
        .toLocaleString({ hour: "numeric", minute: "2-digit" })
        .toLowerCase();
      const end = DateTime.fromFormat(shift?.endTime??"", "HH:mm", {
        zone: "Asia/Kolkata",
      })
        .toLocaleString({ hour: "numeric", minute: "2-digit" })
        .toLowerCase();

      s += start + " - " + end;

      return s;
    },

    async search() {
      this.formIsValid = true;
      if (!this.checkForm()) {
        this.formIsValid = false;
        return;
      }
      this.isLoading=true;
      let shift = JSON.stringify(this.shift);
      shift = JSON.parse(shift);
      const payload = {
        date: this.date,
        shift: shift,
      };

      try {
        await this.$store.dispatch('doctor/fetchSchedule',payload);
      } catch (err) {
        this.error = err;
      }
     finally{
      this.isLoading=false;
     }
    },
    checkForm() {
      this.errors = [];
      if (!this.date || !/^\d{4}-\d{2}-\d{2}$/.test(this.date)) {
        this.errors.push("date is invalid");
      }
      if (
        !this.shift?.startTime ||
        this.shift?.startTime === "" ||
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(this.shift?.startTime)
      ) {
        this.errors.push("Shift Start is invalid");
      }
      if (
        !this.shift?.endTime ||
        this.shift?.endTime === "" ||
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(this.shift?.endTime)
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
  
  },

  async created() {
    this.isLoading = true;
    try {
      const todaySchedule = this.$store.getters["doctor/todaySchedule"];
      if (todaySchedule) {
        this.date = todaySchedule?.date??"";
        this.shift = todaySchedule?.shift;
      }
      await this.$store.dispatch("doctor/fetchDoctorDetails");
      const doctor = this.$store.getters["doctor/doctor"]??{};
      this.shifts = doctor?.shifts??[];
    } catch (err) {
      this.error = err.message || "Failed to fetch, try later.";
    }finally{
      this.isLoading=false;
    }
  },

}
</script>
<style scoped>
h4 {
  font-size: var(--h5-laptop);
  text-align: center;
  color: black;
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
