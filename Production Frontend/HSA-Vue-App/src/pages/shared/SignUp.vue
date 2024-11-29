<template>
    <section>
      <base-card>
        <h1>Signup</h1>
        <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p>{{ error }}</p>
        </base-dialog>
        <base-dialog :show="isLoading" title="Signin up..." fixed>
          <base-spinner></base-spinner>
        </base-dialog>
    <div class="form-container">
          <form >
            <div class="form-control">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" v-model.trim="firstName" />
            </div>
            <div class="form-control">
              <label for="middleName">Middle Name</label>
              <input type="text" id="middleName" v-model.trim="middleName" />
            </div>
            <div class="form-control">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" v-model.trim="lastName"  />
            </div>
            <div class="form-control">
              <label for="phoneNumber">Phone Number</label>
              <input type="text" id="phoneNumber" v-model.trim="phoneNumber" />
            </div>
            <div class="form-control">
              <label for="email">Email</label>
              <input type="email" id="email" v-model.trim="email" />
            </div>
            <div class="form-control">
              <label for="password">Password</label>
              <input type="password" id="password" v-model.trim="password" />
            </div>
               
       
</form> 
<p id="validation-message"
          v-if="!formIsValid"
        >
        Please enter firstName and lastName ,valid email, phoneNumber and password (must be at least 6 characters long).</p>
    
<base-button-container>
        <base-button mode="primary" @click.prevent='signup'>Signup</base-button>
       <base-button link mode="flat" to="/login">Click here to Login instead</base-button>
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
          firstName:'',
          middleName:'',
          lastName:'',
          phoneNumber:'',
          formIsValid: true,
          isLoading: false,
          error: null,
        };
      },
      methods: {
        async signup(){
           
            // console.log(this.firstName) ;
            // console.log(this.middleName);
            // console.log(this.lastName);
            // console.log(this.phoneNumber)
            this.formIsValid = true;

          if (
            this.email=== '' ||
            !this.email.includes('@') ||
            this.password.length < 6 ||
            this.firstName===''||
            this.lastName===''||
            this.phoneNumber===''||
            this.phoneNumber.length!==10
          ) {
            this.formIsValid = false;
            // this.error=Error('input is invalid');
            return;
          }
    
          this.isLoading = true;
    
        
    
    
    const actionPayload = {
    firstName:this.firstName,
    middleName:this.middleName,
    lastName:this.lastName,
    phoneNumber:this.phoneNumber,
      email: this.email,
      password: this.password,
    };
    // console.log(actionPayload)
    try {
        await this.$store.dispatch('auth/signup', actionPayload);
      const redirectUrl = '/login';
      this.$router.replace(redirectUrl);
    } catch (err) {
      this.error = err.message || 'Failed to create an account, try later.';
    }
    
      this.isLoading = false;
        
        //   this.email = '';
        //   this.password = null;
        //   this.phoneNumber='';
        //   this.firstName='';
        //   this.middleName='';
        //   this.lastName='';
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
        display: grid;
        grid-template-columns:1fr 1fr 1fr;
        justify-items: center;
       
        gap:1rem;
      }
     section{
        margin:1rem auto;
        display: flex;
        flex-direction: column;
      justify-content: center;
      align-items: center;
  max-width: 100%;        /* max-width:60rem ; */
  flex:1
    
     }
    .form-container{
        padding:1rem;
        background-color:transparent
        
    }
    
      input {
        display: block;
        width:100%;
        margin-top: 0.5rem;
        height:2.5rem;
        border:1px solid var(--primary-color);
        padding:1rem;
        border-radius:8px;
        font-size:var(--h6-laptop);
      }
      input:focus{
        background-color:var(--black-5);
      
      }
      #validation-message{
        color:red;
        font-size: var(--h6-laptop);
      }
     </style>
     