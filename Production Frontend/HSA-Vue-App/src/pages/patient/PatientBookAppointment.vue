<template>
    <section>
      <base-card>
        <h4>Search Hospital to Book Appointment</h4>

        
    <div class="form-container">
          <form >
         
            <div class="form-control">
              <label for="hospitalSpecialty">Hospital Specialty</label>
              <input type="text" id="hospitalSpecialty" v-model.trim="hospitalSpecialty" />
            </div>
            <div class="form-control">
              <label for="city">City</label>
              <input type="text" id="city" v-model.trim="city" />
            </div>
               
       
</form> 
<p id="validation-message"
          v-if="!formIsValid"
        >
        Please enter city, hospitalSpecialty .</p>

        <base-button-container>
            <base-button mode="primary" @click.prevent='search'>Search</base-button>
        </base-button-container>
    </div>
    </base-card>
   
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p>{{ error }}</p>
        </base-dialog>
        <base-dialog :show="isLoading" title="Signin up..." fixed>
          <base-spinner></base-spinner>
        </base-dialog>
  <div v-if="hospitalSearch" class="hospitalSearch">

    <base-card v-for=" hospital of hospitalSearch" :id="hospital.hospitalId" :key='hospital.hospitalId'>
    <ol class="hospital-item-container" >
      <li>{{ hospital?.hospitalName ?? 'N/A' }}</li>
      <li>Specialty: {{ getSpecialty(hospital?.specialty ?? []) }}</li>
      <li>Chief Doctor: {{ getChiefDoctorName(hospital?.chiefDoctorName ?? {}) }}</li>
      <li>
        Open Hours:
        <span v-for="openHour of hospital?.openHours ?? []" :key="openHour">{{ getOpenHours(openHour) }}, </span>
      </li>
    </ol>
    <base-button-container>
      <base-button mode="primary"  link :to="choose(hospital?.hospitalId)">Choose</base-button>
    </base-button-container>
    <RouterView></RouterView>
  </base-card>
      </div>
      </section>
      
</template>
<script>
// import HospitalItem from '@/components/appointments/HospitalItem.vue'
import { DateTime } from 'luxon';
    export default  {
        data(){
            return{
                city: '',
          hospitalSpecialty: '',
          formIsValid: true,
          isLoading: false,
          error: null,
            }
        },
        // components:[HospitalItem],

        computed:{
                hospitalSearch(){
                    return this.$store.getters['patient/hospitalSearch'];
                },
                
        },
        methods:{
          handleError(){
            this.error=false
          },
          choose(id){
            return this.$route.path+'/hospital/'+id
          },
          getChiefDoctorName(name){
           return (
        name?.firstName +
        " " +
        name?.middleName +
        " " +
        name?.lastName
      );
          },
           async search(){
            this.isLoading= true;
          
            const payload={
                city: this.city,
            hospitalSpecialty:  this.hospitalSpecialty
            }
                try{
                await this.$store.dispatch('patient/fetchHospitalSearch',payload)
                }catch(err){
                this.error=err;
                }
                this.isLoading= false;
            },
            getOpenHours(openHour) {
              if(openHour?.start && openHour?.end){
                const start = DateTime.fromFormat(openHour.start, "HH:mm", {
        zone: "Asia/Kolkata",
      })
        .toLocaleString({ hour: "numeric", minute: "2-digit" })
        .toLowerCase();
      const end = DateTime.fromFormat(openHour.end, "HH:mm", {
        zone: "Asia/Kolkata",
      })
        .toLocaleString({ hour: "numeric", minute: "2-digit" })
        .toLowerCase();

      return  start + " - " + end;
              }
              return ''
     
    },
    getSpecialty(sp) {
      let categories = "";
      for (const s of sp) {
        categories += " " + s;
      }
      return categories;
    },
    getHospitalAddress(a){
      if (!a) {
        return "";
      }
      return (
        a.StreetAddress[0] +', '+
        a.StreetAddress[1] +", "+
        a.city +', '+ a.state +","+a.postalCode
      );
    }
        },

    }
</script>
<style scoped>
    
h4{
    font-size: var(--h4-laptop);
    text-align:center;
    color:black;
     }

.form-control {
        margin: 0.5rem 0;
        /* display:flex;
        flex-direction:column;
        justify-content:center;
        width: inherit;
        align-items:center; */
        text-align:left;
    
      }
      .form-control label{
        font-family: "Open Sans" sans-serif;
        font-size:var(--h6-laptop);
        font-weight:bold
      }

      .hospitalSearch{
        margin:0;
        max-width: 100%;
        padding:0;
      }
      form{
        display: grid;
        grid-template-columns:1fr 1fr 1fr;
        justify-items: center;
       
        gap:1rem;
      }
     section{
        margin:1rem 2rem;
        display: flex;
        flex-direction: column;
     /* gap:1rem; */
      align-items: center;
      max-width: 100%;
    flex:1;
        /* max-width:60rem ; */
  
     }
     .top-container{
      border: 1px solid black;
      border-radius: 8px;
      padding:0.5rem;
    }
    .form-container{
        padding:1rem;
        background-color:transparent
        
    }
    
      input {
        display: block;
        width:100%;
        margin-top: 0.5rem;
        height:2.5rem;
        border:1px solid var(--primary-color);
        padding:1rem;
        border-radius:8px;
        font-size:var(--h6-laptop);
      }
      input:focus{
        background-color:var(--black-5);
      
      }
      #validation-message{
        color:red;
        font-size: var(--h6-laptop);
      }
      .hospital-item-container {
  padding: 1rem 0;
  /* border:1px solid black; */
  max-width: 100%;
  list-style: none;
  margin: 0;
  display: grid;
  border: 1px solid black;
  border-radius: 8px;
  grid-template-columns: 1fr 1fr;
  column-gap:1rem;
  row-gap: 1rem;
  align-items: start;
  grid-auto-flow: row;
}
.hospital-item-container h5 {
  margin: 0;
  font-size: var(--h5-laptop);
}
ul {
  max-width: 100%;
  list-style: none;
  padding:0;
}
li {
  list-style: none;
  font-size: var(--h6-laptop);
  font-family: "Open Sans";
  font-weight: bold;
  margin: 0.5rem;
  text-align: left;
  max-width: 100%;
  word-wrap: break-word;
  line-height: 145%;
}
span{
  display: inline-block;
}

</style>
