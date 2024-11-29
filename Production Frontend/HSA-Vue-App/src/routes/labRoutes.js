import { default as LabAllPatients } from "@/pages/lab/LabAllPatients.vue";
import { default as LabDoctorProfile } from "@/pages/lab/LabDoctorProfile.vue";
import { default as LabEditDoctorProfile } from "@/pages/lab/LabEditDoctorProfile.vue";
import { default as LabFees } from "@/pages/lab/LabFees.vue";
import { default as LabHome } from "@/pages/lab/LabHome.vue";
import { default as LabPatientDetails } from "@/pages/lab/LabPatientDetails.vue";
import { default as LabSchedule } from "@/pages/lab/LabSchedule.vue";
import { default as LabSearchFeesByDate } from "@/pages/lab/LabSearchFeesByDate.vue";
import { default as LabSearchPatientByName } from "@/pages/lab/LabSearchPatientByName.vue";
import { default as LabUpdateSchedule } from "@/pages/lab/LabUpdateSchedule.vue";

const labRoutes = {
    name: "lab-homepage",
    component: LabHome,
    path: "/lab",
    children: [
      {
        name: "doctor-profile",
        path: "/profile",
        component: LabDoctorProfile,
        children: [
          {
            name: "doctor-profile-edit",

            path: "/edit",
            component: LabEditDoctorProfile,
          },
        ],
      },
      {
        name: "lab-schedule",
        path: "/schedule",
        component: LabSchedule,
        query: {
            date: "YYYY-MM-DD", // set the date parameter here
            month: "MM",
            page:'N' // set the month parameter here
          },
        children: [
        
          {
            name: "lab-update-schedule",
            path: "/edit",
            component: LabUpdateSchedule,
          },
        ],
      },
      {
        path:'/fees',
        component:LabFees,
        children:[
          {
            path:'/search',
            query:{
              date:"YYYY-MM-DD"
             },
             component:LabSearchFeesByDate
          }
        ]
      },
      {
        path:'/patients',
        component:LabAllPatients,
        children:[
            {
                path:'/search',
                component:LabSearchPatientByName,
                query:{
                    name:'person_name'
                }
            },
            {
                path:'/:pId',
                component:LabPatientDetails,
                children:[
                    {
                        path:'/lab-reports',
                        query:{
                            date: "YYYY-MM-DD", // set the date parameter here
                            month: "MM",
                            page:'N' // set the month parameter here
                          }
                    },
                ]
            }
        ]
      }
    ]
};

export default labRoutes;