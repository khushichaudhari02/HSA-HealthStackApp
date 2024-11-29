<template>
    <li >
        <article>
          <h4  > <span >Report</span> <span v-show="index+1">{{index+1}}</span></h4> 
          <base-grid>    
          <li><span>Doctor:</span> {{getDoctorName}}</li>
              <li v-if="this.date"><span>Date:</span> {{this.date }}</li> 
              <li v-if="this.month"><span>Month:</span> {{this.month }}</li> 
              <li><span>Total Appointments </span> {{getTotalAppointments}}</li>
              <li><span>Total Patients </span> {{getTotalPatients}}</li>
              <li><span>Total Fees:  </span> {{ getTotalFees}} Rs</li>
          </base-grid>
          <base-button-container>
            <base-button link @click="viewDetail" mode="primary small">View Detail</base-button>
          </base-button-container>
        </article>
    </li>
    
    </template>
    <script>

        export default{
            props:['doctor','totalAppointments','totalFees','date','month','totalPatients','index'],
            computed:{
             
                getDoctorName(){
                  if (this.doctor?.owner && this.doctor?.owner?.name) {
        return (
          this.doctor.owner?.name?.firstName +
          ' ' +
          this.doctor.owner?.name?.middleName +
          ' ' +
          this.doctor.owner?.name?.lastName
        );
                  }
        else if(this.doctor?.name){
          return this.doctor.name?.firstName + ' ' + this.doctor.name?.middleName + ' ' + this.doctor.name?.lastName
        }
      else {
        return 'N/A';
      }
      
      },
      getTotalAppointments(){
        return this.totalAppointments
      },
      getTotalPatients(){
        return this.totalPatients
      },
      getTotalFees(){
        return this.totalFees;
      }
        },
        methods:{
          viewDetail(){
            // this.$router.replace({ path: `/admin/report/${this.doctor._id}`, query: { date:this.date,month:this.month} })
            this.$router.replace({
        path: `/admin/report/${this.doctor?._id ?? ''}`,
        query: { date: this.date, month: this.month }
      });
          }
        }
      }
     
    </script>
    
    <style scoped>
    
    li{
    list-style: none;
    max-width: 100%;
    

    }
   article h4{
        font-size:var(--h5-laptop);
    }
    article li{
        font-size:var(--h6-laptop);
        margin:0.5rem;
    }
    span{
        font-weight: bold;
    }
    article {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border:1px solid black;
    border-radius: 8px;
    max-width:100%;
    padding:1rem;
    }
    @media (max-width:1200px) {
    li{
        max-width: 100%;
    }
    article{
        padding:0.5rem;
        max-width: 100%;
    
    }
    }
    @media (max-width:600px) {
    article{
        display: grid;
        justify-items: center;
       width:100%;
    
    }
    .appointmentDetail{
        width:100%;
        padding:0;
    }
    }
    
    
    h4 {
    font-size: var(--h5-laptop);
    margin:1rem;
    }
    
    </style>
    
    