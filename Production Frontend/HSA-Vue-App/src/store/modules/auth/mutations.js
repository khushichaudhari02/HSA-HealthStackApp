export default {
  setUser(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.role = payload.role;
    state.didAutoLogout = false;
  },
  setAutoLogout(state) {
    state.didAutoLogout = true;
  }
};