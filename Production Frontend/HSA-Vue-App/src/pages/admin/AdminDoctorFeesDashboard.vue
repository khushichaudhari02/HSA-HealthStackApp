<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
    <section>
        <h2>Fees List </h2>
        <h4>Doctor:{{ getDoctorName }}</h4>
        <base-card v-if="fees?.length>0">
        <base-list>
        <FeeItem v-for="fee,index of fees" :key="fee.date"
        :date="fee.date" :dailyCount="fee.dailyCount" :totalFees="fee.totalFees" :index="index" :dId="this.dId" ></FeeItem>
        </base-list>
    </base-card>
    
    <base-button-container>
    <base-button v-if="currentPage>1" mode="outline" @click="page(currentPage-1)">Prev</base-button>
<base-button   v-if="currentPage>1" mode="outline" @click="page(1)">1</base-button>
    <base-button mode="outline" @click="page(currentPage)">{{ currentPage }}</base-button>
    <base-button mode="outline" @click="page(currentPage+1)">Next</base-button>
</base-button-container>
<base-button link @click="back" mode="flat">Back</base-button>

   
    </section>
    
</template>

<script>
import FeeItem from '@/components/doctor/FeeItem.vue';
export default{
    components:{FeeItem},
    props:['dId'],
    data(){
        return{
            error:null,
            isLoading:false,
            success:false,
            currentPage:1,
        }
    },
    computed:{
        
        fees(){
                const result=[];

                const feesList = this.$store.getters['admin/selectedDoctorFeesList']??[];
                console.log(feesList)
                if(feesList && feesList.length>0){
                    for(const fee of feesList){
                        const Obj={
                      date:fee.date,
                      totalFees:fee.totalFees??"",
                            dailyCount:fee.dailyCount??"",
                      appointments:fee.appointments??[]
                    }
                    result.push(Obj)
                    }
                  
                }
                return result;
        },
        doctor(){
            const doctor = this.$store.getters['admin/selectedDoctor'] ?? {};
    return {
        name: doctor?.name ?? '',
        id: doctor?._id ?? '',
        shifts: doctor?.shifts ?? [],
        specialty: doctor?.specialty ?? ''
    };
        },
        getDoctorName(){
        if(this.doctor && this.doctor.name){
          return this.doctor?.name?.firstName+" "+this.doctor?.name?.middleName +" "+this.doctor?.name?.lastName
        }
        return ''
      }
   

    },
    methods:{
        async  page(page){
           const payload={
            dId:this.dId,
            page: page??1
           } 
           this.isLoading=true;
           try{
                await this.$store.dispatch('admin/fetchSelectedDoctorFeesList',payload);
                this.currentPage= this.$store.getters['admin/selectedDoctorFeesCurrentPage']??1
            }catch(err){
                this.error = err.message ?? 'Something went wrong!';
                
            }finally{
                this.isLoading=false;
            }
        },
        handleError(){
                this.error=null
            },back(){
                this.$router.back()
            }
    },
   async created(){
            this.isLoading=true;
            try{
                
                await this.$store.dispatch('admin/fetchSelectedDoctorFeesList',{
                    page:1,
                    dId:this.dId
                });
                this.currentPage= this.$store.getters['admin/selectedDoctorFeesCurrentPage']
                this.isLoading=false;
            }catch(err){
                this.error = err.message || 'Something went wrong!';
                
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
h4{
    font-size:var(--h4-laptop)
}
</style>