<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
    <section>
        <h2>Receptionist List</h2>
        <p v-if="receptionists.length === 0">
No Receptionist is added to this hospital    </p>
        <base-card v-if="receptionists.length>0">
        <base-staff-list>
        <StaffItem v-for="receptionist,index of receptionists" :key="receptionist.id"
        :id="receptionist.id" :name="receptionist.name" :shifts="receptionist.shifts" :specialty="receptionist.specialty" :index="index" :role="'receptionist'"></StaffItem>
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
    methods:{
        handleError(){
            this.error=false;
        }
    },
    computed:{
        
        receptionists(){
                const result=[];
            
                const receptionistList = this.$store.getters['admin/receptionistList']??[];
                console.log(receptionistList)
                if(receptionistList){
                    for(const receptionist of receptionistList){
                        const docObj={
                        name:receptionist?.name??"",
                        shifts:receptionist?.shifts??[],
                        specialty:receptionist?.specialty??[],
                        id:receptionist?.sId??'',
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

                await this.$store.dispatch('admin/fetchReceptionistList');
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