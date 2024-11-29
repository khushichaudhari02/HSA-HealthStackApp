<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <base-dialog :show="success" title="Admin Created Successfullly" @close="handleSuccess">
          <p class="success" >Admin Created Successfullly</p>
        </base-dialog>
        <div v-if="isLoading && !error">
         <base-spinner></base-spinner>
       </div>
       <section v-if="this.hospital">
      <h1>Hospital Details</h1>
   <HospitalDetails v-if="this.hospital" :hospital="this.hospital" 
   :chief-doctor="this.chiefDoctor"
   ></HospitalDetails>
    
   <base-button-container>
   <base-button @click="openCreateAdmin" mode="primary">Create Admin</base-button>

    <base-button @click="back" mode="flat">Back</base-button></base-button-container>
  </section>
  <section v-if="toCreateAdmin">
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <base-dialog :show="success" title="Admin Created Successfullly" @close="handleSuccess">
          <p class="success" >Admin Created Successfullly</p>
        </base-dialog>
      <base-card>
        <h1>Create Admin</h1>
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
        <base-button mode="primary" @click.prevent='createAdmin'>Create</base-button>
       <base-button  mode="flat" @click="backToHospital">Back</base-button>
    </base-button-container>
    </div>
    </base-card>
    </section>
  </template>
  
  <script>
  import HospitalDetails from '@/components/hospital/HospitalDetails.vue'
  export default {
    props:['hId'],
    components:{HospitalDetails},    data() {
      return {
       hospital:null,
       chiefDoctor:null,
       isLoading:false,
       toCreateAdmin:false,
       email:'',
       password:null,
       firstName:'',
       middleName:"",
       lastName:'',
       error:null,
       success: false,
       formIsValid: true,
      };
    },
    methods:{
      back(){
        this.$router.back();
      },
      backToHospital(){
            this.toCreateAdmin=false;
      },
      handleError(){
        this.error=false;
      },
      handleSuccess(){
        this.success=false;
      },
      openCreateAdmin(){
        this.toCreateAdmin=true;
      },
 async createAdmin(){

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



const actionPayload = {
name:{firstName:this.firstName,
middleName:this.middleName,
lastName:this.lastName},
phoneNumber:this.phoneNumber,
email: this.email,
password: this.password,
hId:this.hId
};
try{
await this.$store.dispatch('superAdmin/createAdmin',actionPayload);
this.success=true
}catch(error){
  this.error = error.message || 'Failed to fetch, try later.';

}finally{
  this.isLoading=false;
}

      }
    },
  async  created(){ this.isLoading=true
    try{
        await this.$store.dispatch('superAdmin/fetchHospitalDetails',{hId:this.hId});
        
        const hospital = this.$store.getters['superAdmin/hospitalDetails'];
        this.hospital={
           name: hospital?.name ?? '',
        email: hospital?.email ?? '',
        staff: hospital?.staff ?? [],
        phoneNumber: hospital?.phoneNumber ?? '',
        address: hospital?.address ?? null,
        service: hospital?.service ?? [],
        specialty: hospital?.specialty ?? [],
        openHours: hospital?.openHours ?? [],
        }
        this.chiefDoctor = this.$store.getters['superAdmin/selectedHospitalChiefDoctor']??null
        
    }catch(err){

              this.error = err.message || 'Failed to fetch, try later.';
            }   finally{
              this.isLoading=false;
            }


    }
  };
  </script>
  

  <style scoped>
  section{
    margin:2rem  4rem;
   max-width: 100%;

    padding: 0;
    display: flex ;
    flex-direction: column;
    /* justify-content: center; */
    align-items:center;
    flex:1;
}
h1{
    margin:0;
    font-size: var(--h4-laptop);
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
  