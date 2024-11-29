<template>
  <base-dialog :show="!!error" title="An error occurred" @close="handleError">
    <p class="error-message">{{ error }}</p>
  </base-dialog>
  <div v-if="isLoading && !error">
    <base-spinner></base-spinner>
  </div>

  <section >
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
          ><base-button mode="flat" link to="/admin">Back</base-button>
        </base-button-container>
      </div>
    </base-card>
  
  </section>  
  <section v-if="this.reports?.doctorList" class="reports-container">
    <div class="heading">
    <h4 v-if="this.reports?.date">Date:  {{ this.reports?.date }}</h4>
    <h4 v-if="this.reports?.month"> Month:  {{ this.reports?.month}}</h4>
    <h4>Total Appointments: {{ this.reports?.hospitalTotalAppointments??0 }}</h4>
    <h4>Total Fees: {{ this.reports?.totalFeesOfHospital??0 }} Rs.</h4>
    </div>
    <base-card v-if="this.reports?.doctorList" class="doctorList">
      <base-list >
        <ReportItem
          v-for="(doctor, index) of this.reports?.doctorList??[]"
          :key="doctor?._id??index"
          :doctor="doctor?.doctor??{}"
          :totalFees="doctor?.totalFees??0"
          :index="index"
          :date="this.reports?.date??''"
          :month="this.reports?.month??''"
          :totalPatients="doctor?.totalPatients??0"
          :totalAppointments="doctor?.totalAppointments??0"
          
        ></ReportItem>
      </base-list>
    </base-card>

    <base-button link @click="back" mode="flat">Back</base-button>
  </section>

</template>

<script>
import ReportItem from '@/components/admin/ReportItem.vue'
export default {
  components: {ReportItem},
  data() {
    return {
      error: null,
      isLoading: false,
      success: false,
      date: "",
      month: "",
      reports:null,
    };
  },
  computed: {
   
  },
  methods: {
    async search() {
      this.isLoading = true;

      const payload = {
        month: this.month,
        date: this.date,
      };
      try {
        await this.$store.dispatch("admin/fetchReports", payload);
        this.reports= this.$store.getters['admin/reports'];
      } catch (err) {
        this.error = err;
      }
     finally{
      this.isLoading = false;
     }
    },
    handleError() {
      this.error = null;
    },
    back() {
      this.$router.back();
    },
  },
  //  async created(){

  //   }
};
</script>
<style scoped>
section {
  margin: 1rem 2rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  /* gap:1rem; */
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  flex: 1;
  /* max-width:60rem ; */
}

.doctorList{
  width:100%;
  margin:0;
}
h2 {
  font-size: var(--h3-laptop);
}
h4 {
  font-size: var(--h4-laptop);
}
h4 {
  font-size: var(--h5-laptop);
  text-align: center;
  margin-right: 1rem;
  color: black;
}
h5 {
  font-size: var(--h6-laptop);
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
.heading{
    max-width: 100%;
    display: flex;
    justify-content: space-around;

    align-items: center;
    list-style: none;
    margin:1rem 0;
}
</style>
