<template>
    <li  class="hospitalDetail" >
        <article>
          <h5> Hospital <span v-show="index+1">{{index+1}}</span></h5> 
  <base-grid>
    <li>{{ this.hospitalName }}</li>
    <li>Specialty: {{ getSpecialty}}</li>
    <li>Chief Doctor:{{ getChiefDoctorName }}</li>
    <li>Address: {{ getHospitalAddress }}</li>
    <ul v-for="openHour of this.openHours" :key="openHour">
      <li>Open Hours: {{ getOpenHours(openHour) }}</li>
    </ul>
    <base-button-container>
    <base-button link :to="viewDetail" mode="primary">View Detail</base-button>
  </base-button-container>
  </base-grid>
  </article>  </li> 
</template>
<script>
import { DateTime } from "luxon";

export default {
  props: [
    "id",
    "hospitalName",
    "specialty",
    "chiefDoctor",
    "hospitalAddress",
    "openHours",
    'link',
    "service",
    "index"
  ],
  computed: {
    viewDetail(){  
    
       return this.link +this.id

    },
    getHospitalAddress() {
      if (!this?.hospitalAddress ) {
        return "";
      }
      return (
        this.hospitalAddress.streetAddress[0] +
        this.hospitalAddress.streetAddress[1] +
        this.hospitalAddress.city
      );
    },
    getChiefDoctorName() {
      return (
        this.chiefDoctor?.name.firstName +
        " " +
        this.chiefDoctor?.name.middleName +
        " " +
        this.chiefDoctor?.name.lastName
      );
    },
    getSpecialty() {
      let categories = "";

      for (const s of this?.specialty) {
        categories += " " + s;
      }
      return categories;
    },
  },
  methods: {
    getOpenHours(openHour
    ) {
      let s="";
      if(
        openHour?.start && openHour?.end
      ){
        const start = DateTime.fromFormat(openHour?.start, "HH:mm", {
        zone: "Asia/Kolkata",
      })
        .toLocaleString({ hour: "numeric", minute: "2-digit" })
        .toLowerCase();
      const end = DateTime.fromFormat(openHour?.end, "HH:mm", {
        zone: "Asia/Kolkata",
      })
        .toLocaleString({ hour: "numeric", minute: "2-digit" })
        .toLowerCase();

      s="From: " + start + " To: " + end;
      }
    return s;
    },
   
  },
};
</script>
<style scoped>
 
 li{
    list-style: none;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    }
    article li{
        font-size:var(--h6-laptop); 
    }
    span{
        font-weight: bold;
    }
    article {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border:1px solid black;
    border-radius: 8px;
    max-width:100%;
    max-height: 32rem;
    padding:1rem;
    }
    @media (max-width:1200px) {
    .hospitalDetail{
        max-width: 100%;
    }
    article{
        padding:0.5rem;
        max-width: 100%;
    
    }
    }
    @media (max-width:600px) {
    article{
        display: grid;
        justify-items: center;
       width:100%;
    
    }
    .appointmentDetail{
        width:100%;
        padding:0;
    }
    }
    
    
    h5{
    font-size: var(--h5-laptop);
    }
</style>
