<template>
  <base-dialog :show="!!error" mode="error" title="An error occurred" @close="handleError">
    <p class="error-message">{{ error }}</p>
  </base-dialog>
  <div v-if="isLoading && !error">
    <base-spinner></base-spinner>
  </div>
  <section class="main-section">
    <div class="CTA-container">
      <p>Easily Book your next appointment or view your past records</p>
      <base-button-container>
        <base-button link mode="primary big" to="patient/book">Book Appointment</base-button>
        <base-button link class="outline big" to="patient/appointments">View Past Data</base-button>
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
  <section class="appointment-row-container">
    <h2>Your Upcoming Appointments</h2>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <p v-if="upcomingAppointments?.length === 0">
      No Appointments. Book one by clicking on book appointment button.
    </p>
    <TheAppointmentsRow v-else :appointments="upcomingAppointments"></TheAppointmentsRow>
  </section>
  <section class="appointment-row-container">
    <h2>Your Past Appointments</h2>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <p v-if="pastAppointments?.length === 0">
      No Appointments. Book one by clicking on book appointment button.
    </p>
    <TheAppointmentsRow v-else :appointments="pastAppointments"></TheAppointmentsRow>
  </section>
  <section class="appointment-row-container">
    <h2>Your Upcoming Lab Reports</h2>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <p v-if="pastAppointments?.length === 0">
      No Appointments. Book one by clicking on book appointment button.
    </p>
    <TheAppointmentsRow v-else :appointments="pastAppointments"></TheAppointmentsRow>
  </section>
</template>

<script>
import AppointmentItem from '@/components/appointments/AppointmentItem.vue'
import TheAppointmentsRow from "@/components/appointments/TheAppointmentsRow.vue"
import { DateTime } from "luxon";

export default {
  components: { TheAppointmentsRow, AppointmentItem },
  data() {
    return {
      patientName: "",
      isLoading: false,
      error: null,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    pastAppointments() {
      const appointments = this.$store.getters['patient/appointments'];
      const today = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" }).toISO();
      const result = [];
      for (const appointment of appointments) {
        const appointmentObj = {
          id: appointment?._id,
          patientName: appointment?.patientName,
          doctorName: appointment?.doctorName,
          date: appointment?.ISTDateString,
          startTime: appointment?.startTime,
          hospitalAddress: appointment?.hospitalAddress ?? null,
          duration: appointment?.duration ?? null,
          hospitalName: appointment?.hospitalName ?? '',
          status: appointment?.status ?? 'pending',
          fees: appointment?.fees
        };
        if (today > appointment?.bookingDateTime) {
          result.push(appointmentObj);
        }
      }
      return result;
    },
    upcomingAppointments() {
      const appointments = this.$store.getters['patient/appointments'];
      const today = DateTime.fromJSDate(new Date(), { zone: "Asia/Kolkata" }).toISO();
      const result = [];
      for (const appointment of appointments) {
        const appointmentObj = {
          id: appointment?._id,
          patientName: appointment?.patientName,
          doctorName: appointment?.doctorName,
          date: appointment?.ISTDateString,
          startTime: appointment?.startTime,
          hospitalAddress: appointment?.hospitalAddress ?? null,
          duration: appointment?.duration ?? null,
          hospitalName: appointment?.hospitalName ?? '',
          status: appointment?.status ?? 'pending',
          fees: appointment?.fees ?? null,
        };
        if (today <= appointment?.bookingDateTime) {
          result.push(appointmentObj);
        }
      }
      return result;
    },
    nextAppointment() {
      return this.upcomingAppointments[0];
    }
  },
  methods: {
    async loadAppointments() {
      this.isLoading = true;
      this.error = null;
      try {
        await this.$store.dispatch('patient/fetchAppointments');
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }
      finally{
        this.isLoading = false;
      }
    }
  },
  created() {
    this.loadAppointments();
  }
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
