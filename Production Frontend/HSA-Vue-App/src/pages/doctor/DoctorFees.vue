<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
    <section>
        <h2>Fees List</h2>
        <base-card v-if="fees?.length>0">
        <base-list>
        <FeeItem v-for="fee,index of fees" :key="fee.date"
        :date="fee.date" :dailyCount="fee.dailyCount" :totalFees="fee.totalFees" :index="index" ></FeeItem>
        </base-list>
    </base-card>
    
    <base-button-container>
    <base-button v-if="currentPage>1" mode="outline" @click="page(currentPage-1)">Prev</base-button>
<base-button   v-if="currentPage>1" mode="outline" @click="page(1)">1</base-button>
    <base-button mode="outline" @click="page(currentPage)">{{ currentPage }}</base-button>
    <base-button mode="outline" @click="page(currentPage+1)">Next</base-button>
</base-button-container>
    <RouterView ></RouterView>
    </section>
    
</template>

<script>
import FeeItem from '@/components/doctor/FeeItem.vue';
export default{
    components:{FeeItem},
    data(){
        return{
            error:null,
            isLoading:false,
            success:false,
            currentPage:null,
        }
    },
    computed:{
        
        fees(){
                const result=[];

                const feesList = this.$store.getters['doctor/feesList']??[];
                if(feesList && feesList.length>0){
                    for(const fee of feesList){
                        const Obj={
                      date:fee.date??"",
                         totalFees:fee.totalFees??"",
                            dailyCount:fee.dailyCount??"",
                      appointments:fee.appointments??[]
                    }
                    result.push(Obj)
                    }
                  
                }
                return result;
        },
   

    },
    methods:{
        async  page(page){
           const payload={
            page: page??1
           }
           this.isLoading=true;
           try{
                await this.$store.dispatch('doctor/fetchFeesList',payload);
                this.currentPage= this.$store.getters['doctor/feesCurrentPage']??1
               
            }catch(err){
                this.error = err.message ?? 'Something went wrong!';
                
            }finally{
                this.isLoading=false;

            }
        },
        handleError(){
                this.error=null
            }
    },
   async created(){
            this.isLoading=true;
            try{
                
                await this.$store.dispatch('doctor/fetchFeesList',{
                    page:1
                });
                this.currentPage= this.$store.getters['doctor/feesCurrentPage']??1
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
.card{
    width:100%;
}
h2{
    font-size: var(--h3-laptop);
}
</style>