<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
    <section>
        <h2>Searched Staff List</h2>
        <p v-if="staffList.length === 0">
    No staff with name {{ this.$route.query?.staffName??""  }}  found   </p>
        <base-card v-if="staffList.length>0">
        <base-staff-list>
        <StaffItem v-for="staff,index of staffList" :key="staff?.id??index"
        :id="staff?.id??''" :name="staff?.name??''" :shifts="staff?.shifts??[]" :specialty="staff?.specialty??[]" :index="index" :role="staff?.role??''"></StaffItem>
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
        
        staffList(){
                const result=[];
            
                const staffSearchList = this.$store.getters['admin/staffSearchList']??[];
                console.log(staffSearchList)
                if(staffSearchList){
                    for(const staff of staffSearchList){
                        const docObj={
                     name: staff?.staffDoc?.name ?? staff?.staffDoc?.owner?.name ?? '',
                    shifts: staff?.staffDoc?.shifts ?? [],
                    specialty: staff?.staffDoc?.specialty ?? [],
                    id: staff?.sId ?? '',
                    role: staff?.staffDoc?.owner?.role ?? ''
                    }
                    result.push(docObj)
                    }
                  
                }
                return result;
        }
    },
    methods:{
        handleError(){
            this.error=null;
        }
    }
    ,
   async created(){
            this.isLoading=true;
            try{
             const payload={
                staffName: this.$route.query.staffName ?? ''
             }  
                await this.$store.dispatch('admin/fetchStaffSearch',payload);
            }catch(err){
                this.error = err.message ?? 'Something went wrong!';
                
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