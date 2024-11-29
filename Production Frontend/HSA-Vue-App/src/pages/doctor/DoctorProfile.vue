<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <base-dialog :show="success && !error" title="Profile Updated Successfullly" @close="handleSuccess">
          <p class="success" >Profile Updated Successfullly</p>
        </base-dialog>
        <base-dialog v-if="isLoading && !error" :show="isLoading" title="Loading..." fixed>
          <base-spinner></base-spinner>
        </base-dialog>

<section v-if="!isEditing && !isLoading">
    
    <h1>Profile</h1>
    <base-card>
    <ol >
        <li><span> Name: </span>{{ getName }}</li>
        <li> <span>Email: </span>{{ getEmail }}</li>
        <li><span>Phone Number: </span>{{ getPhoneNumber}}</li>
        <li> <span>Age: </span>{{ getAge }}</li>
        <li> <span>Sex: </span>{{ getSex }}</li>
        <li><span>Address: </span>{{ getAddress}}</li>
        <li><span>Education: </span>{{ getEducation}}</li>
        <li><span>Year Of Registration: </span>{{ getYearOfRegistration}}</li>

        <li><span>State Medical Council: </span>{{ getStateMedicalCouncil}}</li>
        <li><span>Appointment Duration: </span>{{ getAppointmentDuration}}</li>
        <li><span>Registration Number: </span>{{ getRegistrationNumber}}</li>
        <li><span>Shifts: </span>{{ getShifts}}</li>
        <li><span>Specialty: </span>{{ getSpecialty}}</li>

    </ol>
   
</base-card>
<base-button-container>
        <base-button @click="edit" mode="primary " 
          >Edit</base-button
        >
        <base-button  link :to="back" mode="outline" 
          >Go Back</base-button
        >
  </base-button-container>
</section>
<section v-else-if="isEditing">
    <h1>Edit Profile</h1>
    <base-card>
    
    <div class="form-container">
          <form >
            <div class="main-top-container">
            <div class="form-control">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" v-model.trim="firstName" required/>
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
              <label for="phoneNumber">Phone Number</label>
              <input type="text" id="phoneNumber" v-model.trim="phoneNumber" required/>
            </div>
            
            <div class="form-control">
              <label for="email">Email</label>
              <input type="email" id="email" v-model.trim="email" required/>
            </div>
            <div class="form-control">
              <label for="sex">Sex</label>

            <select id="sex" v-model.trim="sex" required>
          <option v-for="sex in this.sexes" :key="sex" :value="sex">{{sex}}</option>
          </select>
            </div>
            <div class="form-control">
              <label for="age">Age</label>
              <input type="text" id="age" v-model.trim="age" required/>
            </div>
            <div class="form-control">
              <label for="yearOfRegistration">Year of Registration</label>
              <input type="text" id="yearOfRegistration" v-model.trim="yearOfRegistration" required/>
            </div>
            <div class="form-control">
              <label for="registrationNumber">Registration Number</label>
              <input type="text" id="registrationNumber" v-model.trim="registrationNumber" required/>
            </div>
            <div class="form-control">
              <label for="stateMedicalCouncil">State Medical Council</label>
              <input type="text" id="stateMedicalCouncil" v-model.trim="stateMedicalCouncil" required/>
            </div>
            <div class="form-control">
              <label for="appointmentDuration">Appointment Duration:</label>
              <input type="number" id="appointmentDuration" v-model.trim="appointmentDuration" required/>
            </div>
            
        </div>

        <div class="top-top-container">
        <div class="top-container" >
                <h5>Specialty</h5>
                <div class="row"  v-for="sp,index of specialty" :key="sp">
                  <h6> {{ index+1 }}</h6>
            <div class="form-control">
              <input type="text"  v-model.trim="sp.name"  />
            </div>
            <base-button-container>
              <base-button  mode="primary small" @click.prevent="addSpecialtyRow"
            >+</base-button
          >  <base-button @click.prevent="removeSpecialtyRow(index)" mode="red small" 
            >-</base-button
          >
            </base-button-container>
        </div>
        </div>
      

       
        <div class="top-container" >
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
      </div>    
      <div class="top-top-container">
      <div class="top-container" >
                <h5>Shifts</h5>
                <div class="row"  v-for="shift,index of shifts" :key="shift">
                  <h6> {{ index+1 }}</h6>
            <div class="form-control">
              <label for="">Start</label>
              <input type="time"  v-model.trim="shift.startTime"  />
            </div>
            <div class="form-control">
              <label >End</label>
              <input type="time" v-model.trim="shift.endTime" />
            </div>
            <base-button-container>
              <base-button  mode="primary small" @click.prevent="addShiftRow"
            >+</base-button
          >  <base-button @click.prevent="removeShiftRow(index)" mode="red small" 
            >-</base-button
          >
            </base-button-container>
        </div>
        </div>
        <div class="top-container ">
            <h5>Address</h5>
          <div class="row">
                <div class="form-control">
              <label for="streetAddress1">StreetAddress 1:</label>
              <input type="text" id="streetAddress1" v-model.trim="streetAddress1" />
            </div>
            <div class="form-control">
              <label for="streetAddress2">StreetAddress 2:</label>
              <input type="text" id="streetAddress2" v-model.trim="streetAddress2" />
            </div>
          </div>

          <div class="row">
            <div class="form-control">
              <label for="landmark">Landmark</label>
              <input type="text" id="landmark" v-model.trim="landmark" />
            </div>
            <div class="form-control">
              <label for="city">City</label>
              <input type="text" id="city" v-model.trim="city" />
            </div>
          </div>
            
            <div class="row">
              <div class="form-control">
              <label for="district">District</label>
              <input type="text" id="district" v-model.trim="district" />
            </div>
            <div class="form-control">
              <label for="state">State</label>
              <input type="text" id="state" v-model.trim="state" />
            </div>
          </div>
          <div class="row">
            <div class="form-control">
              <label for="postalCode">Pincode</label>
              <input type="text" id="postalCode" v-model.trim="postalCode" />
            </div>
          </div>

        </div>
      </div>
      
       
</form> 
<div id="validation-message"
          v-if="!formIsValid"
        >
<p v-for="error of this.errors" :key="error">{{ error }}</p>
</div>
    
   <base-button-container>
        <base-button   mode="primary " @click="submitEdit"
          >Submit</base-button
        >
        <base-button  mode="outline" @click="backToProfile"
          >Cancel</base-button
        >
  </base-button-container>
    </div>
    
</base-card>

</section>
</template>
<script>
import { DateTime } from 'luxon';



export default{
  data(){
    return {
        isLoading:false,
        isEditing:false,
      error:null,
      errros:[],
      profile:{},
      sexes:['Male','Female','Others'],
            firstName:"",
            middleName:'',
            lastName:"",
            email:'',
            age:'',
            phoneNumber:"",
            streetAddress1:'',
            streetAddress2:'',
            landmark:'',
            city:'',
            district:'',
            state:'',
            postalCode:'',
            stateMedicalCouncil:'',
            registrationNumber:'',
            yearOfRegistration:'',
            educationQualification:[],
            shifts:[],
            specialty:[],
            appointmentDuration:null,
            formIsValid:true,
            success:false
    }
  }  ,
  computed:{
    // editUrl(){
    //     return this.$route.path+'/edit'
    // },
    getName(){
      
        let s=this.profile?.name?.firstName+" "+this.profile?.name?.middleName+" "+this.profile?.name?.lastName;
        return this.profile?.name ? s:"";
     
    },
    getEmail(){
        return this.profile?.email??""
    },
    getAge(){
       
        return this.profile?.age??"";
    },
    getSex(){
     
        return this.profile?.sex??"";
    },
    
    getAddress(){

        if(!this.profile?.address?.state && !this.profile?.address?.city && !this.profile?.district && !this.profile?.address?.streetAddress[0] && 
            !this.profile?.address?.streetAddress[1] && !this.profile?.address?.postalCode
        ){
            return ''
        }

        
     return this.profile?.address?.streetAddress[0] +", "+ this.profile?.address?.city+", "+
     this.profile?.address?.state+", "+this.profile?.address?.postalCode
     
    },
    getPhoneNumber(){
      
        return this.profile?.phoneNumber??""
    },
    getEducation(){
        let e='';
        for(const [index,ed] of this.profile?.educationQualification.entries()??[]){
            if(index!= this.profile.educationQualification.length -1){
                e+= ed+",";
            }else{
                e+=ed;
            }
        }
      return e;
    },
    getRegistrationNumber(){
        return this.profile?.registrationNumber??"";
    },
    getStateMedicalCouncil(){
        return this.profile?.stateMedicalCouncil??""
    },
    getYearOfRegistration(){
      return  this.profile?.yearOfRegistration??"";
    },
    getAppointmentDuration(){
      if(this.profile?.appointmentDuration){
        return this.profile?.appointmentDuration+" minutes"
      }
      return 'Not set';
      
    },
    getSpecialty(){
       
        let e='';
        for(const [index,ed] of this.profile?.specialty.entries()??[]){
            if(index!= this.profile?.educationQualification?.length -1){
                e+= ed+",";
            }else{
                e+=ed;
            }
        }
      return e;
    },
    getShifts(){
        let s='';
        for(const [index,shift] of this.profile?.shifts.entries()??[]){
            const start = DateTime.fromFormat(shift?.startTime??"", "HH:mm", {
        zone: "Asia/Kolkata",
      })
        .toLocaleString({ hour: "numeric", minute: "2-digit" })
        .toLowerCase();
      const end = DateTime.fromFormat(shift?.endTime??"", "HH:mm", {
        zone: "Asia/Kolkata",
      })
        .toLocaleString({ hour: "numeric", minute: "2-digit" })
        .toLowerCase();

            if(index!== this.profile?.shifts?.length-1){
         s+= start + " - " + end+",";
        }else {
            s+=start+" - "+end;
        }
        }
        return s;

    
    },
    
 
  },
  methods:{
    addShiftRow(){
        this.shifts.push({startTime:"",endTime:""})
    },
    removeShiftRow(index){
        if(this.shifts?.length>1 && !this.shifts[index]?._id){
            this.shifts.splice(index,1);
        }
    },
    addEducationRow(){
      this.educationQualification.push({name:''})
    },
    removeEducationRow(index){
      if(this.educationQualification?.length>1){
        this.educationQualification.splice(index,1)
      }},
      addSpecialtyRow(){
      this.specialty.push({name:''})
    },
    removeSpecialtyRow(index){
      if(this.specialty.length>1){
        this.specialty.splice(index,1)
      }
    },

    backToProfile(){
         this.isEditing=false;
            },
    edit(){
        this.isEditing=true;
        this.firstName=this.profile?.name?.firstName ??"";
        this.middleName= this.profile?.name?.middleName??"";
        this.lastName= this.profile?.name?.lastName??"";
        this.email=this.profile?.email??"";
        this.phoneNumber=this.profile?.phoneNumber??"";
        this.appointmentDuration= this.profile?.appointmentDuration??null;
        this.sex=this.profile?.sex??'';
        this.age=this.profile?.age??'';
        for(const shift of this.profile?.shifts??[]){
                this.shifts.push({
                    startTime:shift?.startTime??"",
                    endTime:shift?.endTime??"",
                })
        }

        for(const s of this.profile?.specialty??[]){
          this.specialty?.push({
            name:s??""
          })
        }
        
       for(const e of this.profile?.educationQualification??[]){
        this.educationQualification.push({
          name:e??""
        });
       }
       this.yearOfRegistration=this.profile?.yearOfRegistration??"";
       this.stateMedicalCouncil=this.profile?.stateMedicalCouncil??"";
       this.registrationNumber=this.profile?.registrationNumber??"";
        this.state= this.profile?.address?.state??'';
        this.district= this.profile?.address?.district??'';
        this.city= this.profile?.address?.city??'';
        this.streetAddress1= this.profile?.address?.streetAddress[0]??"";
        this.streetAddress2=this.profile?.address?.streetAddress[1]??'';
        this.postalCode=this.profile?.address?.postalCode??'';
    },
    async submitEdit(){
      const educationResponse=[]
          for(const e  of this.educationQualification){
            educationResponse.push(e.name)
          }
          const specialtyResponse=[];
          for(const s of this.specialty){
            specialtyResponse.push(s.name)
          }
          if(!this.checkForm()){
            this.formIsValid=false;
            return;
          }

            const address={
                state:this.state,
                district:this.district,
                city:this.city,
                streetAddresss:[this.streetAddress1,this.streetAddress2],
                postalCode:this.postalCode
            }
            let shifts = JSON.stringify(this.shifts);
              shifts = JSON.parse(shifts)

            const payload={
              name:{
                firstName:this.firstName,
                middleName:this.middleName,
                lastName:this.lastName
              },
              email:this.email,
              phoneNumber:this.phoneNumber,
              age:this.age,
              sex:this.sex,
              address:address,
              educationQualification: educationResponse,
              yearOfRegistration:this.yearOfRegistration,
              registrationNumber: this.registrationNumber,
              stateMedicalCouncil: this.stateMedicalCouncil,
              specialty:specialtyResponse,
              shifts:shifts,
              appointmentDuration:this.appointmentDuration
            }
  this.isLoading=true;
            try{
              await this.$store.dispatch('doctor/updateDoctorDetails',payload)  ;
              this.isEditing=false;
              this.success = true;
            }catch(err){
              this.error = err.message || 'Failed to update, try later.';
            }   
            finally{
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
          if(this.phoneNumber===''||
            this.phoneNumber.length!==10 ){
            this.errors.push("Phone Number is required")
          }
          const addressIsFull =  this.state &&
      this.district &&
      this.city &&
      (this.streetAddress1 || this.streetAddress2) &&
      this.postalCode &&
      this.landmark;

          const addressIsEmpty =
          !this.state &&
      !this.district &&
      !this.city &&
      !this.streetAddress1 && !this.streetAddress2 &&
      !this.postalCode &&
      !this.landmark;
     
          if(!addressIsFull && !addressIsEmpty){
            this.errors.push("Address is should be empty or completely filled")
          }
          if(!this.sex || this.sex===''){
            this.errors.push('sex field is required')
          }
          if(!this.age || this.age===''){
            this.errors.push('age is required')
          }
          if(!this.yearOfRegistration || this.yearOfRegistration===''){
            this.errors.push('Year Of Registration is required')
          }
          if(!this.appointmentDuration){
            this.errros.push("Appointment Duration is required")
          }
          if(!this.registrationNumber || this.registrationNumber===''){
            this.errors.push('Registration Number is required')
          }
          if(!this.stateMedicalCouncil || this.stateMedicalCouncil===''){
            this.errors.push('State Medical Council is required')
          }
          for (const[index,sp] of this.specialty.entries()){
            if(!sp.name || sp.name===''){
              this.errors.push('Specialty should not be empty, at index '+(index+1))
            }
          }
          for (const[index,ed] of this.educationQualification.entries()){
            if(!ed.name || ed.name===''){
              this.errors.push('Education Qualification should not be empty, at index '+(index+1))
            }
          }
          for (const[index,shift] of this.shifts.entries()){
            if(!shift.startTime || shift.startTime===''){
              this.errors.push('Shift Start not be empty, at index '+(index+1))
            }
            if(!shift.endTime || shift.endTime===''){
              this.errors.push('Shift End not be empty, at index '+(index+1))
            }
          }
          
          if (!this.errors.length) {
        return true;
      }
      return false;




        }
  },
async created(){
    this.isLoading=true
    try{
        await this.$store.dispatch('doctor/fetchDoctorDetails');
        
        const doctor = this.$store.getters['doctor/doctor']??{};
        this.profile={
            name: doctor?.name??"",
            email: doctor?.email??"",
            phoneNumber:doctor?.phoneNumber??"",
            address:doctor?.address??null,
            sex:doctor?.sex??"",
            age:doctor?.age??"",
            educationQualification:doctor?.educationQualification??[],
            yearOfRegistration:doctor?.yearOfRegistration??"",
            registrationNumber:doctor?.registrationNumber??"",
            stateMedicalCouncil:doctor?.stateMedicalCouncil??"",
            specialty:doctor?.specialty??[],
            shifts:doctor?.shifts??[],
           appointmentDuration: doctor?.appointmentDuration
        }
        

    }catch(err){
              this.error = err.message || 'Failed to fetch, try later.';
            }   
            finally{
              this.isLoading=false;
            }

  }

}
</script>
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
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        gap:1rem;
        padding: 1rem 0;
        max-width: 100%;
      }
.card{
   
 max-width: 100%;
}
ol{
    padding:1rem 0;
    /* border:1px solid black; */
    max-width: 100%;
    list-style: none;
    margin:0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    grid-auto-flow: row;
}
h1{
  margin:0;
  font-size: var(--h4-laptop);
}


li{
list-style: none;
font-size: var(--h5-laptop);
font-family: 'Open Sans';
font-weight: normal;
margin:0.5rem;
text-align: left;
max-width: 100%;
word-wrap: break-word;
}
span{
    font-weight: bold;
    font-size: inherit;
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
    .top-top-container{
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: space-evenly;
      
      max-width: 100%;
      
      column-gap: 2rem;
    }
    .main-top-container{
      border: 1px solid black;
      border-radius: 8px;
      padding:0.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-content: space-evenly;
      
      max-width: 100%;



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
    

    .row h6{
      font-size: var(--h6-laptop);
      margin:0;

    }
</style>