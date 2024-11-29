export default{
    setHospitalList(state,payload){
        state.hospitalList=payload
    },
    setHospitalDetails(state,payload){
        state.hospitalDetails=payload
    },
    setSelectedHospitalChiefDoctor(state,payload){
        state.selectedHospitalChiefDoctor=payload
    },
    setCHRList(state,payload){
        state.CHRList=payload
    },setCHRDetails(state,payload){
        state.CHRDetails=payload
    }
}