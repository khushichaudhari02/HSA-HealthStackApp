export default {
  setAppointments(state, payload) {
    state.appointments = payload;
  },
  setAppointmentList(state,payload) {
    state.appointmentList=payload
  }
  ,
  setAppointmentsCurrentPage(state,payload){
    state.apppoitmentsCurrentPage=payload
  }
  ,
  setPatient(state, payload) {
    state.patient = payload;
  },
  setHospitalSearch(state, payload) {
    state.hospitalSearch = payload;
  },
  addAppointment(state, payload) {
    const st = state.appointments;

    st.push(payload);
    state.appointments = st;
  },
  removeAppointment(state, appointmentId) {
    state.appointments = state.appointments.filter(
      (appointment) => appointment._id !== appointmentId
    );
  },
  setAppointmentDetails(state,payload){
    state.appointmentDetails=payload
  },
  addHospitalToSearch(state, hospital) {
    state.hospitalSearch.push(hospital);
  },
  removeHospitalFromSearch(state, hospitalId) {
    state.hospitalSearch = state.hospitalSearch.filter(
      (hospital) => hospital._id !== hospitalId
    );
  },
  removePatient(state) {
    state.patient = null;
    state.appointments = [];
    state.hospitalSearch = [];
    state.notifications = [];
    state.seenNotifications = [];
  },
  setNotifications(state, payload) {
    state.notifications = payload;
  },
  setSeenNotifications(state, payload) {
    state.seenNotifications = payload;
  },
  seenNotifications(state, payload) {
    state.notifications = state.notifications.filter((notification) => notification._id !== payload.id);
    state.seenNotifications.push(payload);
  },
  deleteNotificatoions(state) {
    state.notification = [];
    state.seenNotifications = [];
  },
};
