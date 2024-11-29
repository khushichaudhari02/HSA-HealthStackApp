<template>
<section>
  <base-card>
    <h1>Login</h1>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
<div class="form-container">
    
      <form>
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        
      </form>
      <base-button link mode='flat' to="/forgot-password">Forgot Password?</base-button>

     
      <base-button-container>
    <base-button mode="primary" @click.prevent='login'>Login</base-button>
   <base-button link mode='flat' to="/signup">Click here to Signup Instead</base-button>
</base-button-container>
</div>
</base-card>
</section>
 </template>
 
 <script>
  // import fetch from 'node-fetch';
 export default{
    data() {
    return {
      email: '',
      password: '',
      formIsValid: true,
      isLoading: false,
      error: null,
    };
  },
  computed : {
      redirectUrl(){
        if(this.$store.getters['auth/isPatient']){
          return '/patient'
        }
        else if(this.$store.getters['auth/isDoctor']){
          return '/doctor'
        }
        else if(this.$store.getters['auth/isAdmin']){
          return '/admin'
        }
        return '/'
      }
  },
  methods: {
    async login(){
     
        this.formIsValid = true;
        // console.log(this.email)
        // console.log(this.password)
      if (
        this.email=== '' ||
        !this.email.includes('@') ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        // console.log("Invalid input")
        return;
      }

      this.isLoading = true;

      // const actionPayload = {
      //   email: this.email,
      //   password: this.password,
      // };

const actionPayload = {
  email: this.email,
  password: this.password,
};

try {
    await this.$store.dispatch('auth/login', actionPayload);

   let redirectUrl=this.redirectUrl;
  this.$router.replace(redirectUrl);
} catch (err) {
  this.error = err.message || 'Failed to authenticate, try later.';
}

finally{
  this.isLoading = false;
}
  
    },
    handleError() {
      this.error = null;
    },
  },
 
 }
 
 
 </script>

 <style scoped>
 a{
  text-decoration: none;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-block;
  color:black;
 }
 button{
    background-color:var(--primary-color);
    color:white;
    border:none;
 }
 button:hover,button:active{
    cursor: pointer;
    background-color:#1587DF;
 }
 h1{
font-size: var(--h2-laptop);
text-align:center;
color:black;
 }
#button-container{
    width:100%;
    display:flex;
    gap:1rem;
    justify-content:center;
    align-items:center;
}
 .form-control {
    margin: 0.5rem 0;
    /* display:flex;
    flex-direction:column;
    justify-content:center;
    width: inherit;
    align-items:center; */
    text-align:left;

  }
  .form-control label{
    font-family: "Open Sans" sans-serif;
    font-size:var(--h6-laptop);
    font-weight:bold
  }
  form{
    display: flex;
    flex-direction:column;
    justify-content: center;
    width:30rem;
    gap:1rem;
  }
 section{
    margin:1rem auto 0;
    display: flex;
    flex-direction: column;
  justify-content: center;
  align-items: center;
  
flex:1
 }
.form-container{
    padding:1rem;
    background-color:transparent
    
}

 .form-control input {
    display: block;
    width:100%;
    margin-top: 0.5rem;
    height:2.5rem;
    border:2px solid var(--primary-color);
    padding:1rem;
    border-radius:8px;
    font-size:var(--h6-laptop);
  }
  input:focus{
    background-color:var(--black-5);
  
  }
 </style>
 