import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';
export default {
  namespaced: true,
  state() {
    return {
      doctorList:[],
      nurseList:[],
      receptionistList:[],
      adminList:[],
      staffDetails:{},
      staffSearchList:[],
      hospital:{},
      chiefDoctor:{},
      selectedDoctor:{},
      selectedDoctorTodaySchedule:{},
      selectedDoctorTodayAppointments:[],
      selectedDoctorCurrentPatientRecentAppointments:[],
    appointmentDetails:{},
      patientsList:[],
      searchedPatientDetails:{},
      searchedPatientAppointments:[],
      searchedSchedule:{},
      searchedScheduleAppointments:[],
      notifications:[],
      seenNotifications:[],
      selectedDoctorFeesList:[],
      selectedDoctorFeesCurrentPage:null,
      selectedDoctorFeesDetails:{},
      selectedDoctorFeesAppointments:[],
      reports:{},
      doctorReportDetails:{},
    };
  },
  mutations:mutations,
  actions:actions,
  getters:getters
};