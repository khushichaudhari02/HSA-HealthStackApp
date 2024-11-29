export default{
    setDoctor(state,payload){
            state.doctor = payload;
    },
    setTodaySchedule(state,payload){
        state.todaySchedule=payload
    },
    setTodayAppointments(state,payload){
        state.todayAppointments= payload;
    },
    setSearchedSchedule(state,payload){
        state.searchedSchedule= payload
    },
    setSearchedScheduleAppointments(state,payload){
        return state.searchedScheduleAppointments=payload
    },
    setCurrentPatientRecentAppointments(state,payload){
        state.currentPatientRecentAppointments= payload;
    },
    setPatientList(state,payload){
        state.patientList =payload;
    },
    setFeesList(state,payload){
        state.feesList=payload
    },
    setFeesCurrentPage(state,payload){
        state.feesCurrentPage= payload
    },
    setAppointmentDetails(state,payload){
        state.appointmentDetails=payload;
      },
      setFeesDetails(state,payload){
        state.feesDetails=payload
      },
      setSearchedPatientDetails(state,payload){
        state.searchedPatientDetails=payload
      },
      setSearchedPatientAppointments(state,payload){
        state.searchedPatientAppointments=payload
      },
      setReportDetails(state,payload){
        state.reportDetails=payload;
      }
}