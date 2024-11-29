import { createRouter, createWebHistory } from "vue-router";
import baseRoutes from "./routes/baseRoutes";
import patientRoutes from "./routes/patientRoutes";
import store from './store/index.js';
import doctorRoutes from "./routes/doctorRoutes";
import adminRoutes from "./routes/adminRoutes";
import superAdminRoutes from './routes/superAdminRoutes';
// import labRoutes from "./routes/labRoutes";

const router = createRouter({
  history: createWebHistory(),

  routes: [
  ...baseRoutes,
...patientRoutes,
  ...doctorRoutes,
  ...adminRoutes,
  ...superAdminRoutes
  // ...labRoutes
  ],
});
router.beforeEach(function(to, _, next) {
  if (to.meta.requiresAuth && !store.getters['auth/isAuthenticated']) {
  
    next('/login');
  } else if (to.meta.requiresUnauth && store.getters['auth/isAuthenticated'] && store.getters['auth/isPatient']) {
    next('/patient');
  } else if(to.meta.requiresUnauth && store.getters['auth/isAuthenticated'] && store.getters['auth/isDoctor']){
    next('/doctor')
  }
  else if(to.meta.requiresUnauth && store.getters['auth/isAuthenticated'] && store.getters['auth/isAdmin']){
    next('/admin')
  } else if(to.meta.requiresUnauth && store.getters['auth/isAuthenticated'] && store.getters['auth/isSuperAdmin']){
    next('/superAdmin')
  }
   else  {
    next();
  }
});

export default router;