export default  {
    appointments(state){
        return state.appointments;
//         const str = JSON.stringify(state.appointments)
// return  JSON.parse(str)
    },
    appointmentList(state){
            return state.appointmentList
    },
    appointmentsCurrentPage(state){
        return state.appointmentsCurrentPage
    }
    ,
    appointmentDetails(state){
        return state.appointmentDetails;
    }
    ,
    patient(state){
        return state.patient;
        // const str = JSON.stringify(state.patient)
        //    return  JSON.parse(str)
    },
    hospitalSearch(state){
        return state.hospitalSearch;
        // const str = JSON.stringify(state.hospitalSearch)
        // return  JSON.parse(str)
    },
    notifications(state){
        return state.notifications;
        // const str = JSON.stringify(state.notifications)
        // return  JSON.parse(str)
    },
    notificationsCount(state){
        return state.notifications.length
    },
    seenNotificationsCount(state){
        return state.seenNotifications.length
    },
    seenNotifications(state){
        return state.seenNotifications;
        // const str = JSON.stringify(state.seenNotifications)
        // return  JSON.parse(str)
    }
}