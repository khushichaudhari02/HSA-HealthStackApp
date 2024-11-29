<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading">
         <base-spinner></base-spinner>
       </div>
    <section>
        <h2>Admin List</h2>
        <base-card v-if="admins.length>0">
        <base-staff-list>
        <StaffItem v-for="admin,index of admins" :key="admin.id"
        :id="admin.id" :name="admin.name"   :index="index" :role="'admin'"></StaffItem>
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
        
        admins(){
                const result=[];
            
                const adminList = this.$store.getters['admin/adminList']??[];
                // console.log(adminList)
                if(adminList){
                    for(const admin of adminList){
                        const docObj={
                            name: admin?.name ?? '',
                    email: admin?.email ?? '',
                    id: admin?.sId ?? ''
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

                await this.$store.dispatch('admin/fetchAdminList');
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