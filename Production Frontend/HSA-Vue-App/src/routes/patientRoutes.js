import { defineAsyncComponent } from 'vue';

const PatientAppointmentDetails = defineAsyncComponent(() =>
  import('@/pages/patient/PatientAppointmentDetails.vue')
);
const PatientAppointments = defineAsyncComponent(() =>
  import('@/pages/patient/PatientAppointments.vue')
);
const PatientBookAppointment = defineAsyncComponent(() =>
  import('@/pages/patient/PatientBookAppointment.vue')
);
const PatientBookAppointmentChooseDoctor = defineAsyncComponent(() =>
  import('@/pages/patient/PatientBookAppointmentChooseDoctor.vue')
);
const PatientHome = defineAsyncComponent(() =>
  import('@/pages/patient/PatientHome.vue')
);
const PatientLabReports = defineAsyncComponent(() =>
  import('@/pages/patient/PatientLabReports.vue')
);
const PatientLabReportsDetails = defineAsyncComponent(() =>
  import('@/pages/patient/PatientLabReportsDetails.vue')
);
const PatientNotification = defineAsyncComponent(() =>
  import('@/pages/patient/PatientNotification.vue')
);
const ProfilePage = defineAsyncComponent(() =>
  import('@/pages/patient/ProfilePage.vue')
);

const patientRoutes =[ {
    name: "patient-homepage",
    component: PatientHome,
    path: "/patient",
    meta: { requiresAuth: true },
  
},
{
  name: "patient-profile",
  path: "/patient/profile",
  component: ProfilePage,
  meta: { requiresAuth: true  }
},
{
  name:'patient-notification',
  path:'/patient/notification',
  meta:{requiresAuth:true},
  component:PatientNotification
},
{
  name: "patient-appointments",
  path: "/patient/appointments",
  meta: { requiresAuth: true },
  props:true,
  query: {
    date: "YYYY-MM-DD", // set the date parameter here
    month: "MM", // set the month parameter here
  },
  component: PatientAppointments,
},
{
  name: "patient-appointments-details",
  path: "/patient/appointments/:aId",
  component: PatientAppointmentDetails,
  props:true,
  meta: { requiresAuth: true },
},
{
  name: "patient-lab-reports",
  path: "/patient/lab-reports",
  component: PatientLabReports,
  meta: { requiresAuth: true },
  query: {
    date: "YYYY-MM-DD", // set the date parameter here
    month: "MM", // set the month parameter here
  },
  children: [
    {
      name: "patient-lab-reports-details",
      path: "details/:rId",
      component: PatientLabReportsDetails,
      meta: { requiresAuth: true },
    },
  ],
},
{
    name:'patient-book-appointment',
  path: "/patient/book",
  component: PatientBookAppointment,
  meta: { requiresAuth: true },
  children: [
    {
      name:'patient-book-appointment-hospital-details',
      component:PatientBookAppointmentChooseDoctor,
      path:'hospital/:hId',
      props:true,
      meta:{requiresAuth:true}
    },
  
  ],
},
]

export default patientRoutes;