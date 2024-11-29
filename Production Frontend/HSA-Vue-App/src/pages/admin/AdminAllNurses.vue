<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
    <section>
        <h2>Nurse List</h2>
        <p v-if="nurses.length === 0">
      No Appointments. Book one by clicking on book appointment button.
    </p>
        <base-card v-if="nurses.length>0">
        <base-staff-list>
        <StaffItem v-for="nurse,index of nurses" :key="nurse.id"
        :id="nurse.id" :name="nurse.name" :shifts="nurse.shifts" :specialty="nurse.specialty" :index="index" :role="'nurse'"></StaffItem>
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
        
        nurses(){
                const result=[];
            
                const nurseList = this.$store.getters['admin/nurseList']??[];
                // console.log(nurseList)
                if(nurseList){
                    for(const nurse of nurseList){
                        const docObj={
                        
                        shifts:nurse?.shifts??'',
                        specialty:nurse?.specialty??[],            
                        name: nurse?.name ?? '',
                    email: nurse?.email ?? '',
                    id: nurse?.sId ?? ''
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

                await this.$store.dispatch('admin/fetchNurseList');
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