

let timer;

export default {
  async login(context, payload) {
    let url =process.env.VUE_APP_BACKEND_URL+'/api/auth/login'
    //console.log(url)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check your login data.'
      );
      throw error;
    }
    //console.log(responseData.token);
    const expiresIn = +responseData.expiresIn * 60000;
    //console.log(responseData.expiresIn)
    // const expiresIn = 5000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem('token', responseData.token);
    localStorage.setItem('userId', responseData.userId);
    localStorage.setItem('role',responseData.role);
    localStorage.setItem('tokenExpiration', expirationDate);

    timer = setTimeout(function() {
      context.dispatch('autoLogout');
    }, expiresIn);

    context.commit('setUser', {
      token: responseData.token,
      userId: responseData.userId,
      role: responseData.role,
    });

  },
  async signup(context, payload) {
    let url =process.env.VUE_APP_BACKEND_URL+'/api/auth/signup'
   
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          firstName:payload.firstName,
          middleName:payload.middleName,
          lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
        email: payload.email,
        password: payload.password,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to create an account. Check your login data.'
      );
      throw error;
    }
    //console.log(responseData);
    
    
  },
  
 
  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const role = localStorage.getItem('role');
    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(function() {
      context.dispatch('autoLogout');
    }, expiresIn);

    if (token && userId && role) {
      context.commit('setUser', {
        token: token,
        userId: userId,
        role:role
      });
      
    }
  },
  logout(context) {
    //console.log('Login out')
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role')
    localStorage.removeItem('tokenExpiration');

    clearTimeout(timer);

    context.commit('setUser', {
      token: null,
      userId: null,
      role:null,
    });//console.log(context)
   context.commit('patient/removePatient',null,{root:true})
  },
  autoLogout(context) {
    context.dispatch('logout');
    context.commit('setAutoLogout');
  },
  async forgotPassword(context,payload){
    let url =process.env.VUE_APP_BACKEND_URL+'/api/auth/forget-password'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to send reset password request'
      );
      throw error;
    }
    //console.log(responseData);
  },
  async resetPassword(context,payload){
    let url =process.env.VUE_APP_BACKEND_URL+'/api/auth/reset-password/'+payload.token;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      newPassword: payload.password,
      }),
    });
    //console.log(this.resetPassword)

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check your login data.'
      );
      throw error;
    }
    //console.log(responseData);
  }
};
