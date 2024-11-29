export default {
    setDoctorList(state, payload) {
      state.doctorList = payload;
    },
    setNurseList(state, payload) {
      state.nurseList = payload;
    },
    setReceptionistList(state, payload) {
      state.receptionistList = payload;
    },
    setAdminList(state, payload) {
      state.adminList = payload;
    },
    setStaffSearchList(state,payload){
      state.staffSearchList=payload
    }
    ,
    setStaffDetails(state,payload){
      state.staffDetails=payload;
    },
    setHospital(state, payload) {
      state.hospital = payload;
    },setChiefDoctor(state,payload){
      state.chiefDoctor=payload
    },
    setSelectedDoctor(state, payload) {
      state.selectedDoctor = payload;
    },
    setSelectedDoctorTodaySchedule(state, payload) {
      state.selectedDoctorTodaySchedule = payload;
    },
    setSelectedDoctorTodayAppointments(state, payload) {
      state.selectedDoctorTodayAppointments = payload;
    },
    setSelectedDoctorCurrentPatientRecentAppointments(state, payload) {
      state.selectedDoctorCurrentPatientRecentAppointments = payload;
    },
    setPatientList(state, payload) {
      state.patientsList = payload;
    },
    setSearchedSchedule(state, payload) {
      state.searchedSchedule = payload;
    },
    setSearchedScheduleAppointments(state, payload) {
      state.searchedScheduleAppointments = payload;
    },
    setNotifications(state, payload) {
      state.notifications = payload;
    },
    setSeenNotifications(state, payload) {
      state.seenNotifications = payload;
    },
    setSelectedDoctorFeesList(state, payload) {
      state.selectedDoctorFeesList = payload;
    },
    setSeletedDoctorFeesDetails(state,payload){
      state.selectedDoctorFeesDetails=payload
    },
    setSelectedDoctorFeesCurrentPage(state,payload){
      state.selectedDoctorFeesCurrentPage=payload
    },
    setSelectedDoctorFeesAppointments(state,payload){
      state.selectedDoctorFeesAppointments=payload
    },
    setAppointmentDetails(state,payload){
      state.appointmentDetails=payload;
    },
    setSearchedPatientDetails(state,payload){
      state.searchedPatientDetails=payload
    },
    setSearchedPatientAppointments(state,payload){
      state.searchedPatientAppointments=payload
    },
    setReports(state,payload){
      state.reports=payload;
    },setDoctorReportDetails(state,payload){
      state.doctorReportDetails=payload
    }
  };
  