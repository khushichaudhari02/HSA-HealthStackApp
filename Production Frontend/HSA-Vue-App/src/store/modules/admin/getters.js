export default{
    doctorList(state){
        return state.doctorList
    },
    nurseList(state){
        return state.nurseList
    },
    receptionistList(state){
        return state.receptionistList
    },
    adminList(state){
        return state.adminList
    },
    staffDetails(state){
            return state.staffDetails;
    },
    staffSearchList(state){
        return state.staffSearchList
    }
    ,
    hospital(state){
        return state.hospital
    },chiefDoctor(state){
        return state.chiefDoctor
    }
    ,
    selectedDoctor(state){
        return state.selectedDoctor
    },
    selectedDoctorTodaySchedule(state){
        return state.selectedDoctorTodaySchedule
    },
    selectedDoctorTodayAppointments(state){
        return state.selectedDoctorTodayAppointments
    },
    selectedDoctorCurrentPatientRecentAppointments(state){
        return state.selectedDoctorCurrentPatientRecentAppointments
    },
    patientList(state){
        return state.patientsList
    },
    searchedSchedule(state){
        return state.searchedSchedule
    },
    searchedScheduleAppointments(state){
        return state.searchedScheduleAppointments
    },
    notificationsCount(state){
        return state.notifications.length
    },
    seenNotificationsCount(state){
        return state.seenNotifications.length
    },
    notifications(state){
        return state.notifications
    },
    seenNotifications(state){
        return state.seenNotifications
    },
    appointmentDetails(state){
        return state.appointmentDetails
    },
    searchedPatientDetails(state){
        return state.searchedPatientDetails
    },
    searchedPatientAppointments(state){
        return state.searchedPatientAppointments
    },
    selectedDoctorFeesList(state){
        return state.selectedDoctorFeesList
    },
    selectedDoctorFeesCurrentPage(state){
        return state.selectedDoctorFeesCurrentPage
    },
    selectedDoctorFeesDetails(state){
        return state.selectedDoctorFeesDetails
    },
    selectedDoctorFeesAppointments(state){
        return state.selectedDoctorFeesAppointments
    },
    reports(state){
        return state.reports
    },
    doctorReportDetails(state){
        return state.doctorReportDetails
    }

}