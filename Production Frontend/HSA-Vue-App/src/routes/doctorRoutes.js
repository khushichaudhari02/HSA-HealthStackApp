// import { default as DoctorAppointments } from "@/pages/doctor/DoctorAppointments.vue";
// import { default as DoctorFeesSearch } from "@/pages/doctor/DoctorFeesSearch.vue";
// import { default as DoctorPatientAppointments } from "@/pages/doctor/DoctorPatientAppointments.vue";
// import { default as DoctorPatientLabReports } from "@/pages/doctor/DoctorPatientLabReports.vue";
// // import { default as DoctorPatientSearch } from "@/pages/doctor/DoctorPatientSearch.vue";

import { defineAsyncComponent } from 'vue';

const DoctorAppointmentConsultDetails = defineAsyncComponent(() => import('@/pages/doctor/DoctorAppointmentConsultDetails.vue'));
const DoctorAppointmentDetails = defineAsyncComponent(() => import('@/pages/doctor/DoctorAppointmentDetails.vue'));
const DoctorFees = defineAsyncComponent(() => import('@/pages/doctor/DoctorFees.vue'));
const DoctorFeesDetails = defineAsyncComponent(() => import('@/pages/doctor/DoctorFeesDetails.vue'));
const DoctorHomepage = defineAsyncComponent(() => import('@/pages/doctor/DoctorHomepage.vue'));
const DoctorPatientDetails = defineAsyncComponent(() => import('@/pages/doctor/DoctorPatientDetails.vue'));
const DoctorPatients = defineAsyncComponent(() => import('@/pages/doctor/DoctorPatients.vue'));
const DoctorProfile = defineAsyncComponent(() => import('@/pages/doctor/DoctorProfile.vue'));
const DoctorSchedule = defineAsyncComponent(() => import('@/pages/doctor/DoctorSchedule.vue'));
const DoctorUpdateSchedule = defineAsyncComponent(() => import('@/pages/doctor/DoctorUpdateSchedule.vue'));
const DoctorReportDetails = defineAsyncComponent(() => import('@/pages/doctor/DoctorReportDetails.vue'));
const DoctorConsult = defineAsyncComponent(() => import('@/pages/doctor/DoctorConsult.vue'));

const doctorRoutes = [{
    name: "doctor-homepage",
    component: DoctorHomepage,
    path: "/doctor",
    meta: { requiresAuth: true },
    // children: [
    
    
   
    //   {
    //     path:'fees',
    //     component:DoctorFees,
    //     children:[
    //       {
    //         path:'search',
    //         query:{
    //           date:"YYYY-MM-DD"
    //          },
    //          component:DoctorFeesSearch
    //       }
    //     ]
    //   },
    //   {
    //     path:'patients',
    //     component:DoctorPatients,
    //     query:{
    //       name:'person_name'
    //   },
    //     
    
    // ]
},
{name:'doctor-consult-schedule',
      path:'/doctor/consult/',
      component:DoctorConsult,
      meta: { requiresAuth: true },

},
 {name:"doctor-consult-details",
  path:'/doctor/consult/:aId',
  props:true,
  component:DoctorAppointmentConsultDetails,
  meta: { requiresAuth: true },

},   {
      name: "doctor-profile",
     path: "/doctor/profile",
     meta:{requiresAuth:true},
      component:DoctorProfile,
  },
      {
        name: "doctor-schedule",
        path: "/doctor/schedule",
        component: DoctorSchedule,
        meta:{requiresAuth:true},
      },
      {
        name: "doctor-update-schedule",
        path: "/doctor/schedule/edit",
        component: DoctorUpdateSchedule,
        meta:{requiresAuth:true},
      },
      {
            path:'/doctor/fees',
            component:DoctorFees,
          meta:{requiresAuth:true}
          },
          {
            path:'/doctor/fees/:date',
             component:DoctorFeesDetails,
             props:true,
             meta:{requiresAuth:true}

          },
          {
            path:'/doctor/appointments/:aId',
            props:true,
            component:DoctorAppointmentDetails,
            meta:{requiresAuth:true}
          },
          {path:"/doctor/patients",
            component:DoctorPatients,
            meta:{requiresAuth:true}
          },
          {
            path:"/doctor/patients/:pId",
            component:DoctorPatientDetails,
            props:true,
            meta:{requiresAuth:true}

          },
          {
            path:"/doctor/report",
            component:DoctorReportDetails,
            props:true,
            meta:{requiresAuth:true}
          }
]

export default doctorRoutes;