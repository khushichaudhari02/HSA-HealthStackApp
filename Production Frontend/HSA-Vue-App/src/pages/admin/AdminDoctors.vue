<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
    <section>
        <h2>Doctor List</h2>
        <base-card v-if="doctors.length>0">
        <base-staff-list>
        <StaffItem v-for="doctor,index of doctors" :key="doctor.id"
        :id="doctor.id" :name="doctor.name" :shifts="doctor.shifts" :specialty="doctor.specialty" :index="index" :role="'doctor'"></StaffItem>
        </base-staff-list>
    </base-card>
    <!-- <RouterView ></RouterView> -->
    </section>
</template>
<script>
import StaffItem from '@/components/admin/StaffItem.vue';
export default{
    components:{StaffItem},
    data(){
        return{
            error:null,
            isLoading:false,
            success:false,
        }
    },
    computed:{
        
        doctors(){
                const result=[];
            
                const doctorList = this.$store.getters['admin/doctorList']??[];
                console.log(doctorList)
                if(doctorList){
                    for(const doctor of doctorList){
                        const docObj={
                        name:doctor?.name??"",
                        shifts:doctor?.shifts??[],
                        specialty:doctor?.specialty??[],
                        id:doctor?.sId??'',
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

                await this.$store.dispatch('admin/fetchDoctorList');
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
h2{
    font-size: var(--h3-laptop);
}
</style>