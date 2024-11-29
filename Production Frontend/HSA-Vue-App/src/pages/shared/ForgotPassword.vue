<template>
    <section>
  <base-card>
    <h1>Forgot Password</h1>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Sending..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-dialog :show="success" title="Reset request sent successfullly." @close="handleSuccess">
          <p class="success" >Reset request sent successfullly.Check your email for reset password link</p>
        </base-dialog>
<div class="form-container">
    
      <form>
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
      </form>
     
      <base-button-container>
    <base-button mode="primary" @click.prevent='forget'>Submit </base-button>
   <base-button  mode='flat' @click="back">Go Back</base-button>

</base-button-container>
</div>
</base-card>
</section>
 </template>
 
 <script>
 
 export default{
    data(){
        return{
            email: '',
    success:false,

      formIsValid: true,
      isLoading: false,
      error: null,
        }
    },
    methods:{
        back(){
            this.$router.back()
        },
      async  forget(){

        this.formIsValid = true;
      if (
        this.email=== '' ||
        !this.email.includes('@')
      ) {
        this.formIsValid = false;
        // console.log("Invalid input")
        return;
      }

      this.isLoading = true;


const actionPayload = {
  email: this.email,
};

try {
    await this.$store.dispatch('auth/forgotPassword', actionPayload);
    this.sucess=true;
   let redirectUrl='/login'
  this.$router.replace(redirectUrl);
  
} catch (err) {
  this.error = err.message || 'Failed to send reset request, try later.';
}

this.isLoading = false;

      this.email = '';
    },
    handleError() {
      this.error = null;
    },
    handleSuccess(){
        this.sucess=false;
    }
    }
 }
 
 
 </script>
 <style scoped>
 
 
 h1{
font-size: var(--h4-laptop);
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
    width:40rem;
    height: calc(100vh - 10rem);

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
 