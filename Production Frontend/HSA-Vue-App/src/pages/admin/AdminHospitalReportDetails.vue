<template>
    <section> 
        <div class="heading">    
          <li><span>Doctor:</span> {{getDoctorName}}</li>
              <li v-if="this.$route.query?.date"><span>Date:</span> {{this.$route.query?.date ??""}}</li> 
              <li v-if="this.$route.query?.month"><span>Month:</span> {{this.$route.query?.month ??""}}</li> 
              <li><span>Total Appointments </span> {{getTotalAppointments}}</li>
              <li><span>Total Patients </span> {{getTotalPatients}}</li>
              <li><span>Total Fees:  </span> {{ getTotalFees}} Rs</li>
              <li><base-button  @click="back" mode="flat">Back</base-button></li>
        </div>
    
    </section>
    <section v-if="this.appointments.length!==0" class="appointment-row-container">
   
     
      <p v-if="this.appointments.length === 0">
        No Appointments has been approved for this schedule.
      </p>
      <TheAppointmentsRow
        :appointments="this.appointments"
      ></TheAppointmentsRow>
     

    </section>
    <section>
        <h2>Patient List</h2>
        <base-card v-if="patients?.length>0">
        <base-staff-list>
        <PatientItem v-for="patient,index of patients" :key="patient.id"
        :id="patient.id" :age="patient.age" :sex="patient.sex" :name="patient.name" :email="patient.email" :phoneNumber="patient.phoneNumber" :index="index" ></PatientItem>
        </base-staff-list>
    </base-card>
    <!-- <RouterView ></RouterView> -->
    </section>
</template>
<script>
import TheAppointmentsRow from '@/components/appointments/TheAppointmentsRow.vue';
import PatientItem from '@/components/patient/PatientItem.vue';
export default{
    props:['dId'],
    components:{
        TheAppointmentsRow,
        PatientItem
    },
    data(){
       return { report:{}

       }

    },
    methods:{
      back(){
        this.$router.replace('/admin/report')
      }
    },
    computed:{
        
        getDoctorName(){
          if (this.report?.doctor?.name) {
      return `${this.report?.doctor?.name?.firstName ?? ''} ${this.report?.doctor?.name?.middleName ?? ''} ${this.report?.doctor?.name?.lastName ?? ''}`;
    }
    return '';
      
      },
      getTotalAppointments(){
        return this.report?.totalAppointments ?? 0;
      },
      getTotalPatients(){
        return this.report?.totalPatients ?? 0;
      },
      getTotalFees(){
        return this.report?.totalFees ?? 0;
      },
        patients(){
                const result=[];
                const patientList = this.report?.patientList??[];
              
                if(patientList){
                    for(const patient of patientList){
                        const docObj={
                          name: patient?.name ?? '',
        email: patient?.owner?.email ?? '',
        phoneNumber: patient?.phoneNumber ?? '',
        age: patient?.age ?? null,
        sex: patient?.sex ?? '',
        id: patient?._id ?? '',
                    }
                    result.push(docObj)
                    }
                  
                }
                return result;
        },
        appointments(){
        const appointments= this.report?.appointments??[];
       const result=[];
       if(appointments){
       for (const appointment of appointments) {
         const appointmentObj = {
          id: appointment._id??"",
              patientName: appointment.patientName ?? "",
              doctorName: appointment.doctorName ??"",
              date: appointment.ISTDateString??"",
              // city: !appointment.hospitalAddress.city ?appointment.hospitalAddress.city :'',
              startTime: appointment.startTime??"",
              hospitalAddress: appointment.hospitalAddress ?? null,
              duration: appointment.duration ?? null,
              hospitalName: appointment.hospitalName ?? "",
              status: appointment.status ?? "pending",
         };
         

       result.push(appointmentObj);
       
    }}
    return result
  },
    },
    async created(){
        const payload = {
        dId:this.dId,
    date: this.$route.query?.date ?? '',
    month: this.$route.query?.month ?? '',
      };
      this.isLoading=true;
      
      try {
        await this.$store.dispatch("admin/fetchReportsDetails", payload);
        this.report= this.$store.getters['admin/doctorReportDetails']??{};
       
      } catch (err) {
        this.error = err;
      }finally{
        this.isLoading = false;
      }
    
    }

}</script>
<style scoped>
section{
    margin: 1rem 2rem;
  padding:0;
  display: flex;
  flex-direction: column;
  /* gap:1rem; */
  align-items: center;
  max-width: 100%;
  flex: 1;
}
.heading{
    max-width: 100%;
    display: flex;
    justify-content: space-around;

    align-items: center;
    list-style: none;
    margin:1rem 0;
}
.heading li{
    margin-right: 1rem;
    max-width: 100%;
    font-size: var(--h5-laptop);

}
</style>