
<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p class="error-message">{{ error }}</p>
    </base-dialog>
  
    <section v-if="!isLoading">
      <h1>Create Staff</h1>
      <base-card>
        <div class="form-container">
          <form>
            <div class="top-container">
            <div class="form-control">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" v-model.trim="firstName" required />
            </div>
            <div class="form-control">
              <label for="middleName">Middle Name</label>
              <input type="text" id="middleName" v-model.trim="middleName" />
            </div>
            <div class="form-control">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" v-model.trim="lastName" required />
            </div>
            <div class="form-control">
              <label for="email">Email</label>
              <input type="email" id="email" v-model.trim="email" required />
            </div>
            <div class="form-control">
              <label for="password">Password</label>
              <input type="password" id="password" v-model.trim="password" required />
            </div>
            <div class="form-control">
              <label for="role">Role</label>
              <select  id="role" v-model.trim="role" required >
                <option v-for="role of this.roles" :key="role" :value="role" >{{ role }}</option>
                </select>
            </div>
        </div>
            <div v-if="this.role!=='admin'" class="top-container">
            <div class="form-control">
              <label for="age">Age</label>
              <input type="text" id="age" v-model.trim="age" required />
            </div>
            <div class="form-control">
              <label for="phoneNumber">Phone Number</label>
              <input type="text" id="phoneNumber" v-model.trim="phoneNumber" required />
            </div>
            <div class="form-control">
              <label for="sex">Sex</label>

              <select type="text" id="sex" v-model.trim="sex" required >
                <option v-for="sex of this.sexes" :key="sex" value="sex">{{ sex }}</option>
                </select>
            </div>

        </div><div v-if="this.role==='doctor'"  class="top-container">
          <div class="form-control">
              <label for="yearOfRegistration">Year of Registration</label>
              <input type="text" id="yearOfRegistration" v-model.trim="yearOfRegistration" required/>
            </div>
            <div  class="form-control">
              <label for="registrationNumber">Registration Number</label>
              <input type="text" id="registrationNumber" v-model.trim="registrationNumber" required/>
            </div>
            <div class="form-control">
              <label for="stateMedicalCouncil">State Medical Council</label>
              <input type="text" id="stateMedicalCouncil" v-model.trim="stateMedicalCouncil" required/>
            </div>
        </div>
             
        <div v-if="this.role!=='admin'" class="top-container" >
                <h5>Education Qualification</h5>
                <div class="row"  v-for="eq,index of educationQualification" :key="eq">
                  <h6> {{ index+1 }}</h6>
            <div class="form-control">
              <input type="text"  v-model.trim="eq.name"  />
            </div>
            <base-button-container>
              <base-button  mode="primary small" @click.prevent="addEducationRow"
            >+</base-button
          >  <base-button @click.prevent="removeEducationRow(index)" mode="red small" 
            >-</base-button
          >
            </base-button-container>
        </div>
        </div>
            
            <!-- Add other form controls for additional fields as needed -->
  
            <!-- Validation error messages -->
          
  
          
          </form>
          <div id="validation-message" v-if="!this.formIsValid">
              <p v-for="error,index of this.errors" :key="error">{{index+1}} {{ error }}</p>
            </div>
          <base-button-container>
              <base-button mode="primary" @click="submitCreate">Create Staff</base-button>
              <base-button mode="outline" @click="back">Back</base-button>
            </base-button-container>
        </div>

      </base-card>
    </section>
  </template>
  
  <script>
export default{
    data(){
        return{
            errors:[],
            sexes:['Male','Female','Others'],
            roles:['admin','doctor','nurse','receptionist'],
            firstName:"",
            middleName:'',
            lastName:"",
            email:'',
            age:'',
            phoneNumber:"",
            role:'',
            password:'',
            stateMedicalCouncil:'',
            registrationNumber:'',
            yearOfRegistration:'',
            educationQualification:[{
                name:''
            }],
            error:null,
            formIsValid:true,
            success:false
        }
    },methods:{
 
    addEducationRow(){
        for (const e of this.educationQualification) {
        if (
          !e.name ||
          e.name === "" ) {
          return;
        }}
      this.educationQualification.push({name:''})
    },
    removeEducationRow(index){
      if(this.educationQualification.length>1){
        this.educationQualification.splice(index,1)
      }},

    back(){
    this.$router.back()            },
            
    
    async submitCreate(){
      const educationResponse=[]
          for(const e  of this.educationQualification){
            educationResponse.push(e.name)
          }
      // console.log(!this.checkForm())
          if(!this.checkForm()){
            this.formIsValid=false;
            return;
          }

            const payload={
              name:{
                firstName:this.firstName,
                middleName:this.middleName,
                lastName:this.lastName
              },
              email:this.email,
              password:this.password,
              role:this.role,
              phoneNumber:this.phoneNumber||null,
              age:this.age||null,
              sex:this.sex||null,
              educationQualification: educationResponse||null,
              yearOfRegistration:this.yearOfRegistration||null,
              registrationNumber: this.registrationNumber||null,
              stateMedicalCouncil: this.stateMedicalCouncil||null,
            }
            // console.log(payload)
            this.isLoading=true;
            try{
              await this.$store.dispatch('admin/createNewStaff',payload)  ;
              this.success = true
            }catch(err){
              this.error = err.message || 'Failed to update, try later.';
            }   finally{
              this.isLoading=false;
            }
          
             
            },
            handleError(){
          this.error=null;
        },
        handleSuccess(){
          this.success=false;
       
        },
        checkForm(){
          this.errors=[];
          if(!this.firstName || this.firstName===''){
            this.errors.push("First Name is required")
          }
          if(!this.lastName || this.lastName===''){
            this.errors.push("Last Name is required")
          }
          if(!this.email.includes('@') || this.email===''){
            this.errors.push("email is invalid")
          }
          if(!this.password || this.password.length<6){
            this.errors.push("email is invalid")
          }
          if(this.role !=='admin'){
          if(this.phoneNumber===''|| this.phoneNumber.length!==10 ){
            this.errors.push("Phone Number is required")
          }
          if(!this.sex || this.sex===''){
            this.errors.push('sex field is required')
          }
          if(!this.age || this.age===''){
            this.errors.push('age is required')
          }
          for (const[index,ed] of this.educationQualification.entries()){
            if(!ed.name || ed.name===''){
              this.errors.push('Education Qualification should not be empty, at index '+(index+1))
            }
          }
        }
            if(this.role==='doctor'){

            
          if(!this.yearOfRegistration || this.yearOfRegistration===''){
            this.errors.push('Year Of Registration is required')
          }
          if(!this.registrationNumber || this.registrationNumber===''){
            this.errors.push('Registration Number is required')
          }
          if(!this.stateMedicalCouncil || this.stateMedicalCouncil===''){
            this.errors.push('State Medical Council is required')
          }}
  
      
          if (!this.errors.length) {
        return true;
      }
      return false;

        }
  },
}</script>
<style scoped >
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
form{
        display:flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap:1rem;
        padding: 1rem 0;
        max-width: 100%;
      padding:0.5rem;
      /* display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: space-evenly; */
      gap:1rem;
      max-width: 100%;
      }
.card{
   
 max-width: 100%;
 margin:1rem 0;
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
        max-width: 100%
        
    
      }
      .form-control label{
        font-family: "Open Sans";
        font-size:var(--h6-laptop);
        font-weight:bold;
      }
h5{
    font-size: var(--h5-laptop);
}
h4{
    font-size: var(--h4-laptop);
}
     .container{
        display: grid;
        grid-template-columns:1fr 1fr 1fr;
        
        gap:1rem;
     }
    .form-container{
      padding:0.5rem;
      max-width: 100%;
        
    }
    
      input,select {
        display: block;
        max-width:100%;
        margin-top: 0.5rem;
        height:2.5rem;
        border:1px solid var(--primary-color);
        padding:0.5rem;
        border-radius:8px;
        font-size:var(--h6-laptop);
      }
      input:focus,select:focus{
        background-color:var(--black-5);
      
      }
      #validation-message{
        color:red;
        font-size: var(--h6-laptop);
      }
      .error-message{
        color:red;
        font-size: var(--h6-laptop);
      }
      .row{
      display: flex;
      justify-content: flex-start; 
      align-items: center;
      width:100%;
      max-width: 100%;
      margin:1rem 0;
      gap:1rem;
      /* border: 1px solid black;
      border-radius: 8px;
      padding:0.5rem; */
      

    }
   
  
    .top-container h5{
      font-size: var(--h5-laptop);
      margin:0;
      text-align: start;
    }
    .top-container{
      border: 1px solid black;
      border-radius: 8px;
      padding:0.5rem;
      max-width: 100%;
    }
    #validation-message{
        display:flex;
        flex-wrap: wrap;
        gap:1rem;
    }

    .row h6{
      font-size: var(--h6-laptop);
      margin:0;

    }
</style>