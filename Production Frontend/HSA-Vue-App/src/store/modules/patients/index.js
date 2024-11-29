import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';
export default {
  namespaced: true,
  state() {
    return {
      appointments:[],
      appointmentsCurrentPage:null,
      appointmentList:[],
      patient:{},
      hospitalSearch:[],
      appointmentDetails:{},
      notifications:[],
      seenNotifications:[],
    };
  },
  mutations:mutations,
  actions:actions,
  getters:getters
};