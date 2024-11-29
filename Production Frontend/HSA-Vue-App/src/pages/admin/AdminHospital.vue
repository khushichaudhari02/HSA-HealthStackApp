<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
    <section v-if="this.hospital">
      <h1>Hospital Details</h1>
      <HospitalDetails v-if="this.hospital" :hospital="this.hospital" 
   :chief-doctor="this.chiefDoctor"
   ></HospitalDetails>
      <base-button-container>
    <base-button @click="back" mode="flat">Back</base-button></base-button-container>
    </section>
  </template>
  
  <script>
  import HospitalDetails from '@/components/hospital/HospitalDetails.vue';
  export default {
    components:{HospitalDetails},
    data() {
      return {
       hospital:null,
       chiefDoctor:null,
       isLoading:false,
       error:null,
      };
    },
 
    methods:{
      back(){
        this.$router.back();
      },
   
    },
  async  created(){ this.isLoading=true
    try{
        await this.$store.dispatch('admin/fetchHospital');
        
        const hospital = this.$store.getters['admin/hospital'];
        this.hospital={
         
          name: hospital?.name ?? 'N/A',
        email: hospital?.email ?? 'N/A',
        staff: hospital?.staff ?? [],
        phoneNumber: hospital?.phoneNumber ?? 'N/A',
        address: hospital?.address ?? 'N/A',
        service: hospital?.service ?? 'N/A',
        specialty: hospital?.specialty ?? 'N/A',
        openHours: hospital?.openHours ?? 'N/A'
        }
        this.chiefDoctor = this.$store.getters['admin/chiefDoctor']??{};
        

    }catch(err){

              this.error = err.message ?? 'Failed to fetch, try later.';
            }    finally{
              this.isLoading=false;
            }

    }
  };
  </script>
  
  <style scoped>
  section{
    margin:2rem  4rem;
   max-width: 100%;

    padding: 0;
    display: flex ;
    flex-direction: column;
    /* justify-content: center; */
    align-items:center;
    flex:1;
}
h1{
    margin:0;
    font-size: var(--h4-laptop);
  }
  </style>
  