<template>
  <base-card>
  <base-list>
    <AppointmentItem
      v-for="(appointment, index) in this.appointments"
      :key="appointment.id"
      @approve="approve"
      @cancel="cancel"
      :id="appointment.id"
      :doctorName="appointment.doctorName"
      :patientName="appointment.patientName"
      :index="index"
      :duration="appointment.duration"
      :startTime="appointment.startTime"
      :date="appointment.date"
      :status="appointment.status"
      :hospitalAddress="appointment.hospitalAddress"
      :fees="appointment.fees"
    ></AppointmentItem>
  </base-list>
</base-card>
</template>
<script>
import AppointmentItem from "./AppointmentItem.vue";
export default {
  props: ["appointments"],
  components: {AppointmentItem},
  data() {
    return {};
  },
  methods: {
      
  
    approve(id){
      this.$emit('approveTop',id)
    },
    cancel(id){
      this.$emit('cancelTop',id)
    },
  
  },
  

  
};
</script>

<style scoped>


  

</style>
