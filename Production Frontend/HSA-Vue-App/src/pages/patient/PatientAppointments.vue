<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p class="error-message">{{ error }}</p>
    </base-dialog>
    <div v-if="isLoading && !error">
      <base-spinner></base-spinner>
    </div>
    <section>
      <h2>Appointments</h2>
      <p v-if="!error && !appointments">
        No Appointments for this date
      </p>
      <TheAppointmentsRow v-if="appointments && appointments.length !== 0" :appointments="appointments"></TheAppointmentsRow>
      <base-button-container>
        <base-button v-if="currentPage > 1" mode="outline" @click="page(currentPage - 1)">Prev</base-button>
        <base-button v-if="currentPage > 1" mode="outline" @click="page(1)">1</base-button>
        <base-button mode="outline" @click="page(currentPage)">{{ currentPage }}</base-button>
        <base-button mode="outline" @click="page(currentPage + 1)">Next</base-button>
      </base-button-container>
      <base-button link @click="back" mode="flat">Back</base-button>
    </section>
  </template>
  
  <script>
  import TheAppointmentsRow from "@/components/appointments/TheAppointmentsRow.vue"
  
  export default {
    props: ['date'],
    components: { TheAppointmentsRow },
    data() {
      return {
        isLoading: false,
        error: null,
        currentPage: 1,
      };
    },
    computed: {
      appointments() {
        const appointments = this.$store.getters['patient/appointmentList'] ?? [];
        return appointments.map(appointment => ({
          id: appointment._id,
          patientName: appointment.patientName ?? 'N/A',
          doctorName: appointment.doctorName ?? 'N/A',
          date: appointment.ISTDateString ?? '',
          startTime: appointment.startTime ?? '',
          hospitalAddress: appointment.hospitalAddress ?? '',
          duration: appointment.duration ?? '',
          hospitalName: appointment.hospitalName ?? '',
          status: appointment.status ?? 'pending',
          fees: appointment.fees ?? 0,
        }));
      },
    },
    methods: {
      back() {
        this.$router.back();
      },
      handleError() {
        this.error = null;
      },
      async page(page) {
        const payload = { page: page };
        this.isLoading = true;
        try {
          await this.$store.dispatch('patient/fetchAllAppointments', payload);
          this.currentPage = this.$store.getters['patient/appointmentsCurrentPage'] ?? 1;
        } catch (err) {
          this.error = err.message ?? 'Something went wrong!';
        } finally {
          this.isLoading = false;
        }
      },
    },
    async created() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('patient/fetchAllAppointments', { page: this.currentPage });
      } catch (err) {
        this.error = err.message ?? 'Something went wrong!';
      } finally {
        this.isLoading = false;
      }
    },
  };
  </script>
  
  <style scoped>
  section {
    margin: 1rem 2rem;
    padding: 0;
    display: flex;
    flex-direction: column;
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
  h2 {
    font-size: var(--h4-laptop);
  }
  .heading li {
    margin-right: 1rem;
    max-width: 100%;
    font-size: var(--h5-laptop);
  }
  </style>
  