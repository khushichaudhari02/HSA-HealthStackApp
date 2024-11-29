<template>
    <li >
        <article>
          <h4  > <span v-if="role">{{ getRole }}</span> <span v-show="index+1">{{index+1}}</span></h4> 
          <base-grid>    
              <li ><span>Name:</span> {{getStaffName }}</li> 
              <li v-if="this.role==='doctor'"><span>Shifts:  </span> {{ getShifts}}</li>
              <!-- <li><span>Specialty: </span>{{ getSpecialty}}</li> -->
          </base-grid>
          <base-button-container>
            <base-button link :to="viewDetail" mode="primary">View Detail</base-button>
            <base-button link v-if="this.role==='doctor'" :to="viewSchedule" mode="outline">View Schedule</base-button>
            <base-button link v-if="this.role==='doctor'" :to="viewFees" mode="outline">View Fees</base-button>
            <base-button link v-if="this.role==='doctor'" :to="viewConsult" mode="outline">View Consult</base-button>

          </base-button-container>
        </article>
    </li>
    
    </template>
    <script>
    
    import { DateTime } from 'luxon';
        export default{
            props:['message','role','shifts','id','specialty','name','index'],
            methods:{
                
            },
            computed:{
                viewSchedule(){
                    return "/admin/schedule/"+this.id
                },
                viewFees(){
                    return "/admin/fees/"+this.id
                },
                viewConsult(){
                    return '/admin/consult/'+this.id
                },
                viewDetail(){
                    return '/admin/staff/'+this.id
                   
                    
                },
                getRole(){
                    return this.role.toUpperCase()
                },
                getStaffName(){
                     return this.name?.firstName+" "+this.name?.middleName+" "+this.name?.lastName;
    
                },
//                 getSpecialty(){
       
//        let e='';
//        for(const [index,ed] of this.specialty.entries()){
//            if(index!= this.profile.educationQualification.length -1){
//                e+= ed+",";
//            }else{
//                e+=ed;
//            }
//        }
//      return e;
//    },
   getShifts(){
       let s='';
       for(const [index,shift] of this.shifts?.entries()??[]){
           const start = DateTime.fromFormat(shift?.startTime, "HH:mm", {
       zone: "Asia/Kolkata",
     })
       .toLocaleString({ hour: "numeric", minute: "2-digit" })
       .toLowerCase();
     const end = DateTime.fromFormat(shift?.endTime, "HH:mm", {
       zone: "Asia/Kolkata",
     })
       .toLocaleString({ hour: "numeric", minute: "2-digit" })
       .toLowerCase();

           if(index!== this.shifts?.length-1){
        s+= start + " - " + end+",";
       }else {
           s+=start+" - "+end;
       }
       }
       return s;

   
   },
            }
    
    
        }
    </script>
    
    <style scoped>
    
    li{
    list-style: none;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    }
    article li{
        font-size:var(--h5-laptop);
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
    max-height: 32rem;
    padding:1rem;
    }
    @media (max-width:1200px) {
    .appointmentDetail{
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
    }
    
    </style>
    
    