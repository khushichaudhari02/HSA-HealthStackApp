import SuperAdminCreateAdmin from "@/pages/superAdmin/SuperAdminCreateAdmin.vue";
import SuperAdminCreateHospital from "@/pages/superAdmin/SuperAdminCreateHospital.vue";
import SuperAdminHome from "@/pages/superAdmin/SuperAdminHome.vue";
import SuperAdminHospitalDetails from "@/pages/superAdmin/SuperAdminHospitalDetails.vue";
import SuperAdminHospitals from "@/pages/superAdmin/SuperAdminHospitals.vue";
import SuperAdminCreateHospitalRequestList from "@/pages/superAdmin/SuperAdminCreateHospitalRequestList.vue"
import SuperAdminCHRDetails from "@/pages/superAdmin/SuperAdminCHRDetails.vue";
const superAdminRoutes = [
  {
    path: "/superAdmin",
    component: SuperAdminHome,
    meta: { requiresAuth: true },
  },  {
    path: "/superAdmin/requests",
    component: SuperAdminCreateHospitalRequestList,
    meta: { requiresAuth: true },
  },
  {
    path: "/superAdmin/requests/:CHRId",
    component: SuperAdminCHRDetails,
    props:true,
    meta: { requiresAuth: true },
  },
  {
    path: "/superAdmin/hospitals",
    component: SuperAdminHospitals,
    meta: { requiresAuth: true },
  },
  {
    path: "/superAdmin/create-hospital",
    component: SuperAdminCreateHospital,
    meta: { requiresAuth: true },
  },
  {
    path: "/superAdmin/hospitals/:hId",
    component: SuperAdminHospitalDetails,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/superAdmin/hospitals/:hId/admin",
    component: SuperAdminCreateAdmin,
    meta: { requiresAuth: true },
    props: true,
  },
];
export default superAdminRoutes;
