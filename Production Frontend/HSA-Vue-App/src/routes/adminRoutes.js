// const { default: AdminDoctorSearchFees } = require("@/pages/admin/AdminDoctorSearchFees.vue");
// const { default: AdminEditHospitalDetails } = require("@/pages/admin/AdminEditHospitalDetails.vue");
// const { default: AdminHospital } = require("@/pages/admin/AdminHospital.vue");
// const { default: AdminPatientLabReports } = require("@/pages/admin/AdminPatientLabReports.vue");
// const { default: AdminSearchPatient } = require("@/pages/admin/AdminSearchPatient.vue");
import { defineAsyncComponent } from 'vue';
const AdminAllAdmins = defineAsyncComponent(() => import('@/pages/admin/AdminAllAdmins.vue'));
const AdminAllNurses = defineAsyncComponent(() => import('@/pages/admin/AdminAllNurses.vue'));
const AdminAllReceptionnists = defineAsyncComponent(() => import('@/pages/admin/AdminAllReceptionnists.vue'));
const AdminDoctorFeesDashboard = defineAsyncComponent(() => import('@/pages/admin/AdminDoctorFeesDashboard.vue'));
const AdminDoctorScheduleDashboard = defineAsyncComponent(() => import('@/pages/admin/AdminDoctorScheduleDashboard.vue'));
const AdminAppointmentDetails = defineAsyncComponent(() => import('@/pages/admin/AdminAppointmentDetails.vue'));
const AdminDoctorUpdateSchedule = defineAsyncComponent(() => import('@/pages/admin/AdminDoctorUpdateSchedule.vue'));
const AdminNotification = defineAsyncComponent(() => import('@/pages/admin/AdminNotification.vue'));
const AdminDoctors = defineAsyncComponent(() => import('@/pages/admin/AdminDoctors.vue'));
const AdminDoctorConsultDashboard = defineAsyncComponent(() => import('@/pages/admin/AdminDoctorConsultDashboard.vue'));
const AdminAllPatients = defineAsyncComponent(() => import('@/pages/admin/AdminAllPatients.vue'));
const AdminHome = defineAsyncComponent(() => import('@/pages/admin/AdminHome.vue'));
const AdminPatientDetails = defineAsyncComponent(() => import('@/pages/admin/AdminPatientDetails.vue'));
const AdminStaff = defineAsyncComponent(() => import('@/pages/admin/AdminStaff.vue'));
const AdminStaffDetails = defineAsyncComponent(() => import('@/pages/admin/AdminStaffDetails.vue'));
const AdminDoctorFeesDetails = defineAsyncComponent(() => import('@/pages/admin/AdminDoctorFeesDetails.vue'));
const AdminAddNewStaff = defineAsyncComponent(() => import('@/pages/admin/AdminAddNewStaff.vue'));
const AdminStaffSearch = defineAsyncComponent(() => import('@/pages/admin/AdminStaffSearch.vue'));
const AdminHospitalReport = defineAsyncComponent(() => import('@/pages/admin/AdminHospitalReport.vue'));
const AdminHospitalReportDetails = defineAsyncComponent(() => import('@/pages/admin/AdminHospitalReportDetails.vue'));
const AdminHospital = defineAsyncComponent(() => import('@/pages/admin/AdminHospital.vue'));
const adminRoutes = [{
  name: "admin-homepage",
  component: AdminHome,
  path: "/admin",
  meta:{requiresAuth:true}
  // children: [
  // 
  //   {
  //     path: "/hospital",
  //     component: AdminHospital,
  //     children: [
  //       {
  //         path: "/edit",
  //         component: AdminEditHospitalDetails
  //       },
  //     ],
  //   },
  //{
  //     path: "/patients",
  //     component: AdminAllPatients,
  //     children: [
  //       {
  //         path: "search",
  //         component: AdminSearchPatient,
  //         query: {
  //           name: "person_name",
  //         },
  //       },
  //      
  // ],

},{
  path:'/admin/hospital',
  component:AdminHospital,
  meta:{requiresAuth:true} //yet to be added done,
},
{
  path:'/admin/report',
  component:AdminHospitalReport,
  meta:{requiresAuth:true} //yet to be added - done
},
{
  path:'/admin/report/:dId',
  component:AdminHospitalReportDetails,
  query: {
    date: "date",
    month:'month'
  },
props:true,
  meta:{requiresAuth:true} 
},
{
  path:'/admin/doctors',
  component:AdminDoctors,
  meta:{requiresAuth:true}
  
},
{path:'/admin/schedule/:dId',
  component:AdminDoctorScheduleDashboard ,
  props:true,
  meta:{requiresAuth:true},
},
{
  path:'/admin/schedule/:dId/edit',
  component:AdminDoctorUpdateSchedule,
  props:true,
  meta:{requiresAuth:true}
},
{path:'/admin/fees/:dId',
  component:AdminDoctorFeesDashboard ,
  props:true,
  meta:{requiresAuth:true}

},
{path:'/admin/fees/:dId/:date',
 
  component:AdminDoctorFeesDetails ,
  props:true,
  meta:{requiresAuth:true}

},
{path:'/admin/consult/:dId',
  component:AdminDoctorConsultDashboard ,
  props:true,
  meta:{requiresAuth:true}

},{path:'/admin/appointments/:aId',
  component:AdminAppointmentDetails,
  props:true,
  meta:{requiresAuth:true}
},
{path:'/admin/notification',
  component:AdminNotification,
  meta:{requiresAuth:true}
},
{path:"/admin/patients",
component:AdminAllPatients,
meta:{requiresAuth:true}
},
{
path:"/admin/patients/:pId",
component:AdminPatientDetails,
props:true,
meta:{requiresAuth:true}

},{
  path:'/admin/staff',
  component:AdminStaff,
  meta:{requiresAuth:true}
},
{
  path:'/admin/staff/search',
  component:AdminStaffSearch, //yet to be added - done
  query: {
              staffName: "person_name",
            },
  props:true,
  meta:{requiresAuth:true}
},
{
  path:'/admin/staff/create',
  component:AdminAddNewStaff,
  meta:{requiresAuth:true} //yet to be added -done
},

{
  path:'/admin/staff/:sId',
  component:AdminStaffDetails,
  props:true,
  meta:{requiresAuth:true}
},
{
  path:'/admin/admins',
  component:AdminAllAdmins,
  meta:{requiresAuth:true}
  
},{
  path:'/admin/nurses',
  component:AdminAllNurses,
  meta:{requiresAuth:true}
},{
  path:'/admin/receptionists',
  component:AdminAllReceptionnists,
  meta:{requiresAuth:true}
}
]

export default adminRoutes;
