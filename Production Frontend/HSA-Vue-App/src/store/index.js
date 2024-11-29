import { createStore } from 'vuex';

// import coachesModule from './modules/coaches/index.js';
// import requestsModule from './modules/requests/index.js';
import patientModule from './modules/patients/index.js';
import authModule from './modules/auth/index.js';
import doctorModule from './modules/doctor/index.js'
import adminModule from './modules/admin/index.js'
import superAdminModule from './modules/superAdmin/index.js'
const store = createStore({
  modules: {
    auth: authModule,
    patient:patientModule,
    doctor:doctorModule,
    admin:adminModule,
    superAdmin:superAdminModule
  }
});

export default store;