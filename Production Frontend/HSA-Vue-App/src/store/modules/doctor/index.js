import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';
export default {
  namespaced: true,
  state() {
    return {
      doctor:{},
      todaySchedule:{},
      todayAppointments:[],
      currentPatientRecentAppointments:[],
      patientsList:[],
      searchedPatientDetails:{},
      searchedPatientAppointments:[],
      searchedSchedule:{},
      searchedScheduleAppointments:[],
      notifications:[],
      seenNotifications:[],
      appointmentDetails:{},
      feesList:[],
      feesCurrentPage:null,
      feesDetails:{},
      reportDetails:{},
    };
  },
  mutations:mutations,
  actions:actions,
  getters:getters
};