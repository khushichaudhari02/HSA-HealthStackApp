export default {
  userId(state) {
    return state.userId;
  },
  token(state) {
    return state.token;
  },
  isAuthenticated(state) {
    return !!state.token;
  },
  isDoctor(state){
    return state.role==='doctor'
  },
  role(state){
      return state.role;
  },
  isAdmin(state){
    return state.role==='admin'
  },
  isPatient(state){
    return state.role ==='patient'
  },
  isSuperAdmin(state){
    return state.role==='superAdmin'
  },
  didAutoLogout(state) {
    return state.didAutoLogout;
  }
};