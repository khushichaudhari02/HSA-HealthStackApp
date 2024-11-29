<template>
    <header>
      <div id="logo">HSA</div>
      <nav>
      <ul class="nav-items">
        
        <li v-if="isNotLoggedIn"><router-link to="/">Home</router-link></li>
        <li v-if="isNotLoggedIn"><router-link to="/contact">Contact Us</router-link></li>
        <li v-if="isNotLoggedIn"><router-link to="/signup">Signup</router-link></li>
        <li v-if="isNotLoggedIn"><router-link to="/login">Login</router-link></li>
        <li v-if="isLoggedIn" ><router-link :to="homeLink">Home</router-link></li>
        <!-- <li v-if="isLoggedIn && isAdmin" ><router-link to="/admin/hospital">Hospital</router-link></li> -->
        <li v-if="isLoggedIn && isAdmin" ><router-link to="/admin/doctors">Manage Doctors</router-link></li>      
        <li v-if="isLoggedIn && isSuperAdmin" ><router-link to="/superAdmin/hospitals">Manage Hospitals</router-link></li>    
        <li v-if="isLoggedIn && isSuperAdmin" ><router-link to="/superAdmin/create-hospital">Create Hospital</router-link></li>      
  
        <li v-if="isLoggedIn && isSuperAdmin" ><router-link to="/superAdmin/requests">Manage Join Requests</router-link></li>      

        <li v-if="isLoggedIn && isAdmin" ><router-link to="/admin/staff">Staff</router-link></li>
        <li v-if="isLoggedIn && isAdmin" ><router-link to="/admin/report">Report</router-link></li>
        <li v-if="isLoggedIn && isAdmin" ><router-link to="/admin/hospital">Hospital</router-link></li>

        <li v-if="isLoggedIn && isAdmin" ><router-link to="/admin/patients">Patients</router-link></li>
        <li v-if="isLoggedIn && isAdmin" ><router-link to="/admin/notification">Notification</router-link>
          <base-badge mode="elegant">{{ notificationsCount}}</base-badge></li>
        <li v-if="isLoggedIn && isDoctor" ><router-link to="/doctor/profile">Profile</router-link></li>
        <li v-if="isLoggedIn && isDoctor" ><router-link to="/doctor/consult">Consult</router-link></li>
        <li v-if="isLoggedIn && isDoctor" ><router-link to="/doctor/schedule">Schedule</router-link></li>
        <li v-if="isLoggedIn && isDoctor" ><router-link to="/doctor/patients">Patients</router-link></li>
        <li v-if="isLoggedIn && isDoctor" ><router-link to="/doctor/fees">Fees Management</router-link></li>
        <li v-if="isLoggedIn && isDoctor" ><router-link to="/doctor/report">Report</router-link></li>
        <li v-if="isLoggedIn && isPatient" ><router-link to="/patient/profile">Profile</router-link></li>
        <li v-if="isLoggedIn && isPatient" ><router-link to="/patient/appointments">Appointments</router-link></li>
        <li v-if="isLoggedIn && isPatient" ><router-link to="/patient/lab-reports">Lab Reports</router-link></li>
        <li v-if="isLoggedIn && isPatient" ><router-link to="/patient/book">Book Apppointment</router-link></li>
        <li v-if="isLoggedIn && isPatient" ><router-link to="/patient/notification">Notification</router-link>
          <base-badge mode="elegant">{{ notificationsCount }}</base-badge></li>
        <li v-if="isLoggedIn"><button mode="flat" type="button" @click="logout">Logout</button></li>
      </ul></nav>
    </header>
  </template>
  
  <script>
  export default {
    props: ['title'],

    computed: {
      cartQuantity() {
        if(this.isPatient){
          return this.$store.getters['patient/notifications'];
        }
        return null;
     
    },
      // isAdmin(){
      //   return 
      // }
      // isDoctor(){

      // }
      homeLink(){
        if(this.$store.getters['auth/isDoctor']){
            return '/doctor'
        }else if( this.$store.getters['auth/isAdmin']
        ){
          return '/admin'
        }else if(this.$store.getters['auth/isSuperAdmin'])
        {
          return '/superAdmin'
        }
            return '/patient'
      },
    isLoggedIn () {
      return this.$store.getters['auth/isAuthenticated'];
    },
    isNotLoggedIn(){
      return !this.$store.getters['auth/isAuthenticated'];
    },
    isAdmin(){
      return this.$store.getters['auth/isAdmin']
    },
    isSuperAdmin(){
      return this.$store.getters['auth/isSuperAdmin']
    }
    ,
    isDoctor(){
      return this.$store.getters['auth/isDoctor']
    },
    isPatient(){
      return this.$store.getters['auth/isPatient']
    },
    notificationsCount(){
      if(this.isPatient
      ){
        return this.$store.getters['patient/notifications'].length;
      }
      if(this.isAdmin){
        return this.$store.getters['admin/notifications'].length
      }
      return 0;
    }

  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.replace('/');
    },
    
  },

  }
  </script>
  
  <style scoped>
    @media (max-width:600px) {
    header{
      flex-direction: column;

    }
}
@media (max-width:1200px) {
   li{
    font-size: 1rem;
   }
   header{
    padding: 2rem 1rem;
   }

}
nav{
  padding:0;
  margin:0;
  max-width: 100%;
}
  header {
    max-width: 100vw;
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
   padding:2rem 2rem;
   background-color: var(--black-5);
  }
  
  header #logo {
    font-family: 'Open Sans',sans-serif;
    font-weight: bold;
    font-size: var(--h5-laptop);
    background: var(--brand-gradient-color);
    background-clip:text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
    margin: 0;
    padding:0;
  }
  ul{
    display: flex;
    list-style: none;
    justify-content: space-between;
    padding:0;
    max-width: 100%;
    margin:0;
    align-items: center;
    
  }
  li{
   margin-right: 1rem;
   max-width: 100%;
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    font-weight: bold;
  }
  li button {
      margin:0;
      padding: 0;
      font-size: inherit;
    border:none;
    font-weight: bold;
    font-family: inherit;
    cursor: pointer;
  }
  li button:hover, li button:active {
      color:var(--primary-color);
  }

  /* button{
      background: transparent;
      border:1px solid transparent;
      cursor: pointer;
  display: inline-block;
  color:black;
    font-weight: bold;
    font-size: 1.1rem;
  font-family: 'Inter';
  } */
 a {
  text-decoration: none;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-block;
  color:black;
 }

  
  </style>