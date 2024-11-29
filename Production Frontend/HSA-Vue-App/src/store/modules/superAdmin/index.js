import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';
export default {
  namespaced: true,
  state() {
    return {
        hospitalList:[],
        hospitalDetails:{},
        selectedHospitalChiefDoctor:{},
        CHRList:[],
        CHRDetails:{},
      notifications:[],
      seenNotifications:[],
    };
  },
  mutations:mutations,
  actions:actions,
  getters:getters
};