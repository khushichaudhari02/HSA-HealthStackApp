<template>
   
<base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Signin up..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <section>
    <h2>Hospital List</h2>
    <p v-if="hospitalList.length===0">
  No Create Hospital Requests has been submitted
</p>
    <base-card v-if="hospitalList.length>0">
    <base-staff-list>
    <HospitalItem v-for="hospital,index of hospitalList" :key="hospital._id"
    :id="hospital._id" :name="hospital.name" :openHours="hospital.openHours" :specialty="hospital.specialty" :index="index" :service="hospital.service" :chiefDoctor="hospital.chiefDoctor" :hospitalAddress="hospital.address"
    :link="this.link"></HospitalItem>
    </base-staff-list>
</base-card>
<!-- <RouterView ></RouterView> -->
</section>
  
</template>
<script>
import HospitalItem from '@/components/appointments/HospitalItem.vue'
// import { DateTime } from 'luxon';
export default  {
    data(){
        return{
      formIsValid: true,
      isLoading: false,
      error: null,
        }
    },
    components:{HospitalItem},

    computed:{
      link(){
            return '/superAdmin/requests/'
          },
            hospitalList(){
                return this.$store.getters['superAdmin/CHRList'];
            },
            
    },
    methods:{
      handleError(){
        this.error=false
      },
   
     

    },
 async   created(){
        this.isLoading=true;
        try{

            await this.$store.dispatch('superAdmin/fetchCHRList');
            this.isLoading=false;
        }catch(err){
            this.error = err.message || 'Something went wrong!';
            
        }finally{
          this.isLoading=false;
        }
    }

}
</script>
<style scoped>

h2{
font-size: var(--h4-laptop);
text-align:center;
color:black;
 }
.card{
margin:1rem 0;
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

  .hospitalList{
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
