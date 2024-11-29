<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
    <section>
        <h2>Patient List</h2>
        <base-card v-if="patients.length>0">
        <base-staff-list>
        <PatientItem v-for="patient,index of patients" :key="patient.id"
        :id="patient.id" :age="patient.age" :sex="patient.sex" :name="patient.name" :email="patient.email" :phoneNumber="patient.phoneNumber" :index="index" ></PatientItem>
        </base-staff-list>
    </base-card>
    <!-- <RouterView ></RouterView> -->
    </section>
</template>
<script>
import PatientItem from '@/components/patient/PatientItem.vue'
export default{
    components:{PatientItem},
    data(){
        return{
            error:null,
            isLoading:false,
            success:false,
        }
    },
    computed:{
        
        patients(){
                const result=[];

                const patientList = this.$store.getters['admin/patientList']??[];
                // console.log(patientList)
                if(patientList){
                    for(const patient of patientList){
                        const docObj={
                        name:patient?.name??'',
                        email:patient?.owner?.email??'',
                        phoneNumber:patient?.phoneNumber??'',
                        age:patient?.age??'',
                        sex:patient?.sex??'',
                        id:patient?._id??'',
                    }
                    result.push(docObj)
                    }
                  
                }
                return result;
        }
    },
   async created(){
            this.isLoading=true;
            try{
                await this.$store.dispatch('admin/fetchPatientList');
            }catch(err){
                this.error = err.message || 'Something went wrong!';
                
            }finally{
                this.isLoading=false;
            }
    }
}
</script>
<style scoped>
section {
  margin: 1rem auto;
  padding:0;
  max-width: 100%;
  flex: 1;
  /* max-width:60rem ; */
}
h2{
    font-size: var(--h3-laptop);
}


</style>