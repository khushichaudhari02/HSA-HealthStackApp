export default{
    todaySchedule(state){
        return state.todaySchedule
    },
    todayAppointments(state){
        return state.todayAppointments;
    },
    doctor(state){
        return state.doctor
    },
    searchedScheduleAppointments(state){
        return state.searchedScheduleAppointments
    },
    searchedSchedule(state){
        return state.searchedSchedule
    },
    currentPatientRecentAppointments(state){
        return state.currentPatientRecentAppointments
    },
    patientList(state){
        return state.patientList;
    },
    feesList(state){
        return state.feesList
    },
    feesCurrentPage(state){
        return state.feesCurrentPage
    },
    appointmentDetails(state){
        return state.appointmentDetails
    },
        feesDetails(state){
            return state.feesDetails;
        },
searchedPatientDetails(state){
    return state.searchedPatientDetails
},
searchedPatientAppointments(state){
    return state.searchedPatientAppointments
},
reportDetails(state){
    return state.reportDetails;
}
}