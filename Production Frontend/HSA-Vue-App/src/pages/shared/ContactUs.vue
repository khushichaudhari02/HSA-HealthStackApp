<template>
    <base-dialog :show="!!error" mode="error" title="An error occurred" @close="handleError">
      <p class="error-message">{{ error }}</p>
    </base-dialog>
    <div v-if="isLoading && !error">
      <base-spinner></base-spinner>
    </div>
    <base-dialog :show="success" title="Message Send Successfullly" @close="handleSuccess">
          <p class="success" >Message Send Successfullly</p>
        </base-dialog>
   <section id="parent-container">
     <h1>Contact Us</h1>
     <div id='CTA-container'>
         <div><p>Send us a message for any query</p></div>
         <base-button-container>
             <base-button link mode="primary big" to="healthstackapp@gmail.com">
            hsa@hsa.com
         </base-button>
 
                 <base-button link mode="big outline">Contact No: 1234567</base-button>
         </base-button-container>
     </div>
</section>
<section>
    <h1>Want To Take Your Hospital Online? </h1>
    <p> Use the form to give me as much detail as possible and I’ll get back to you as soon as I can.</p>
    <div class="form-container">
          <form >
            <base-card>
            <h4>Hospital Details</h4>
            <div class="main-top-container">

<div class="top-container">
<div class="form-control">
  <label for="hospitalName">Hospital Name</label>
  <input type="text" id="hospitalName" v-model.trim="hospitalName" required/>
</div>
<div class="form-control">
  <label for="hospitalPhoneNumber">Phone Number</label>
  <input type="text" id="hospitalPhoneNumber" v-model.trim="hospitalPhoneNumber" required/>
</div>
<div class="form-control">
    
  <label for="hospitalEmail">Hospital Email</label>
  <input type="hospitalEmail" id="hospitalEmail" v-model.trim="hospitalEmail" required/>
</div>

</div>

<div class="top-container" >
                <h5>Specialty</h5>
                <div class="row"  v-for="sp,index of this.hospitalSpecialty" :key="sp">
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
                <h5>Service</h5>
                <div class="row"  v-for="service,index of this.hospitalService" :key="service">
                  <h6> {{ index+1 }}</h6>
            <div class="form-control">
              <input type="text"  v-model.trim="service.name"  />
            </div>
            <base-button-container>
              <base-button  mode="primary small" @click.prevent="addServiceRow"
            >+</base-button
          >  <base-button @click.prevent="removeServiceRow(index)" mode="red small" 
            >-</base-button
          >
            </base-button-container>
        </div>
</div>



      <div class="top-container" >
                <h5>Open Hours</h5>
                <div class="row"  v-for="openHour,index of this.openHours" :key="openHour">
                  <h6> {{ index+1 }}</h6>
            <div class="form-control">
              <label for="">Start</label>
              <input type="time"  v-model.trim="openHour.start"  />
            </div>
            <div class="form-control">
              <label >End</label>
              <input type="time" v-model.trim="openHour.end" />
            </div>
            <base-button-container>
              <base-button  mode="primary small" @click.prevent="addOpenHourRow"
            >+</base-button
          >  <base-button @click.prevent="removeOpenHourRow(index)" mode="red small" 
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
      


<div class="top-container chief-doctor">
    <h5>Chief Doctor</h5>
<div class="grid">
<div class="form-control">
  <label for="chiefDoctorFirstName">First Name</label>
  <input type="text" id="chiefDoctorFirstName" v-model.trim="chiefDoctorFirstName" required/>
</div>
<div class="form-control">
  <label for="middleName">Middle Name</label>
  <input type="text" id="chiefDoctorMiddleName" v-model.trim="chiefDoctorMiddleName" />
</div>
<div class="form-control">
  <label for="chiefDoctorLastName">Last Name</label>
  <input type="text" id="chiefDoctorLastName" v-model.trim="chiefDoctorLastName" required />

</div> 

<div class="form-control">
  <label for="chiefDoctorEmail">Email</label>
  <input type="email" id="chiefDoctorEmail" v-model.trim="chiefDoctorEmail" required/>
</div>

<div class="form-control">
  <label for="chiefDoctorYearOfRegistration">Chief Doctor  Year of Registration</label>
  <input type="text" id="chiefDoctorYearOfRegistration" v-model.trim="chiefDoctorYearOfRegistration" required/>
</div>


<div class="form-control">
  <label for="chiefDoctorRegistrationNumber">Chief Doctor Registration Number</label>
  <input type="text" id="chiefDoctorRegistrationNumber" v-model.trim="chiefDoctorRegistrationNumber" required/>
</div>
<div class="form-control">
  <label for="chiefDoctorStateMedicalCouncil"> Chief Doctor State Medical Council</label>
  <input type="text" id="chiefDoctorStateMedicalCouncil" v-model.trim="chiefDoctorStateMedicalCouncil" required/>
</div>
</div>

                <h5>Education Qualification</h5>
                <div class="grid">
                <div class="row"  v-for="eq,index of chiefDoctorEducationQualification" :key="eq">
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
</div>
<div id="validation-message" v-if="!formIsValid">
          <p v-for="error of this.errors" :key="error">{{ error }}</p>
        </div>
<base-button-container>
<base-button @click.prevent="send" mode="primary big">Send Message</base-button>
</base-button-container>
</base-card>

        </form>
        </div>
</section>

 </template>
 
 <script>
 
 export default{
    data(){
        return {
            errors:[],
            error:null,
            isLoading:false,
            formIsValid:true,
            success:false,
            hospitalName:'',
            hospitalPhoneNumber:'',
            hospitalEmail:'',
            hospitalSpecialty:[{name:''}],
            hospitalService:[{name:''}],
            openHours:[{
                start:"",
                end:''
            }],
            streetAddress1:'',
            streetAddress2:'',
            landmark:'',
            city:'',
            district:'',
            state:'',
            postalCode:'',
            chiefDoctorFirstName:'',
            chiefDoctorMiddleName:'',
            chiefDoctorLastName:'',
            chiefDoctorEmail:'',
            chiefDoctorYearOfRegistration:'',
            chiefDoctorRegistrationNumber:'',
            chiefDoctorStateMedicalCouncil:'',
            chiefDoctorEducationQualification:[{
                name:""
            }],

        }
    },
    methods:{
     async   send(){
            this.formIsValid=true;
            const educationResponse=[]
          for(const e  of this.chiefDoctorEducationQualification){
            educationResponse.push(e.name)
          }
          const specialtyResponse=[];
          for(const s of this.hospitalSpecialty){
            specialtyResponse.push(s.name)
          }
          const serviceResponse=[]
          for(const s of this.hospitalService){
            serviceResponse.push(s.name)
          }
          const address={
                state:this.state,
                district:this.district,
                city:this.city,
                landmark:this.landmark,
                streetAddress:[this.streetAddress1,this.streetAddress2],
                postalCode:this.postalCode
            }
            const chiefDoctor={
                name:{
                    firstName:this.chiefDoctorFirstName,
                    middleName:this.chiefDoctorMiddleName,
                    lastName:this.chiefDoctorLastName
                },
                email:this.chiefDoctorEmail,
                registrationNumber:this.chiefDoctorRegistrationNumber,
                yearOfRegistration:this.chiefDoctorYearOfRegistration,
                stateMedicalCouncil:this.chiefDoctorStateMedicalCouncil,
                role:'doctor',
                educationQualification:educationResponse,
            }
            if(!this.checkForm()){
                this.formIsValid=false;
                return;
            }

    try{
                const response=  await fetch(process.env.VUE_APP_BACKEND_URL+"/api/contact" ,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          hospitalName:this.hospitalName,
          email:this.hospitalEmail,
         phoneNumber:this.hospitalPhoneNumber,
         hospitalService:serviceResponse,
         hospitalSpecialty:specialtyResponse,
         openHours:this.openHours,
         address:address,
         chiefDoctor:chiefDoctor
        })
      });
      const responseData= await response.json();
      
    if(!response.ok || !responseData.success){
        const error = new Error(responseData.message|| 'Failed to send');
        throw error;
    }
    this.success=true
            }catch(err){

                this.error=err.message||'failed to send'
            }
        },
   
        checkForm(){
            if(!this.hospitalName || this.hospitalName===''){
                this.errors.push("Hospital Name is required");
            }
            if(!this.hospitalEmail || this.hospitalEmail==='' || !this.hospitalEmail.includes('@')){
                this.errors.push("Hospital Email is required");
            }
            if(!this.hospitalPhoneNumber || this.hospitalPhoneNumber===''||this.hospitalPhoneNumber.length!==10){
                this.errors.push("Hospital Phone Number is required");
            }
            for (const[index,sp] of this.hospitalSpecialty.entries()){
            if(!sp.name || sp.name===''){
              this.errors.push('Hospital Specialty should not be empty, at index '+(index+1))
            }
          }
          for (const[index,sp] of this.hospitalService.entries()){
            if(!sp.name || sp.name===''){
              this.errors.push('Hospital Specialty should not be empty, at index '+(index+1))
            }
          }
          for (const[index,ed] of this.chiefDoctorEducationQualification.entries()){
            if(!ed.name || ed.name===''){
              this.errors.push('Chief Doctor Education Qualification should not be empty, at index '+(index+1))
            }
          }
          for (const[index,shift] of this.openHours.entries()){
            if(!shift.start || shift.start===''){
              this.errors.push('Open Hour Start not be empty, at index '+(index+1))
            }
            if(!shift.end || shift.end===''){
              this.errors.push('Open Hour End not be empty, at index '+(index+1))
            }
          }
          const addressIsFull =  this.state &&
      this.district &&
      this.city &&
      (this.streetAddress1 || this.streetAddress2) &&
      this.postalCode &&
      this.landmark;
      if(!addressIsFull){
        this.errors.push("Whole addresss is required")
      }
      if(!this.chiefDoctorFirstName || this.chiefDoctorFirstName===''){
            this.errors.push("Chief Doctor First Name is required")
          }
          if(!this.chiefDoctorLastName || this.chiefDoctorLastName===''){
            this.errors.push("Chief Doctor Last Name is required")
          }
          if(!this.chiefDoctorEmail.includes('@') || this.chiefDoctorEmail===''){
            this.errors.push(" Chief Doctor Email is invalid")
          }
          if(!this.chiefDoctorYearOfRegistration || this.chiefDoctorYearOfRegistration===''){
            this.errors.push('Chief Doctor Year Of Registration is required')
          }
          if(!this.chiefDoctorRegistrationNumber || this.chiefDoctorRegistrationNumber===''){
            this.errors.push('Chief Doctor Registration Number is required')
          }
          if(!this.chiefDoctorStateMedicalCouncil || this.chiefDoctorStateMedicalCouncil===''){
            this.errors.push('Chief Doctor State Medical Council is required')
          }
      

            if (!this.errors.length) {
        return true;
      }
      return false;
        },
        addEducationRow(){
          for(const e of this.chiefDoctorEducationQualification){
            if(e.name===''){
                return;
            }
          }
      this.chiefDoctorEducationQualification.push({name:''})
    },
    removeEducationRow(index){
      if(this.chiefDoctorEducationQualification.length>1){
        this.chiefDoctorEducationQualification.splice(index,1)
      }},
        addSpecialtyRow(){
            for(const s of this.hospitalSpecialty){
            if(s.name===''){
                return;
            }
          }
      this.hospitalSpecialty.push({name:''})
    },
    removeSpecialtyRow(index){
      if(this.hospitalSpecialty.length>1){
        this.hospitalSpecialty.splice(index,1)
    }},
      addServiceRow(){
        for(const s of this.hospitalService){
            if(s.name===''){
                return;
            }
          }
      this.hospitalService.push({name:''})
    },
    removeServiceRow(index){
      if(this.hospitalService.length>1){
        this.hospitalService.splice(index,1)
      }},
      addOpenHourRow(){
        for (const shift of this.openHours) {
            if (!shift.start || shift.start === "") {
              return;
            }
            if (!shift.end || shift.end === "") {
             return 
            }
          }

        this.openHours.push({start:"",end:""})
    },
    removeOpenHourRow(index){
        if(this.openHours.length>1){
            this.openHours.splice(index,1);
        }
    },
    handleError(){
      this.error=null
    },
    handleSuccess(){
      this.success=false
    }}

}
 
 
 </script>
 <style scoped>
 #CTA-container {
    width:100%;
    display:flex;
    flex-direction:column;
  
}
 section{
    margin:2rem  auto;
   max-width: 100%;

    padding: 0;
    display: flex ;
    flex-direction: column;
    /* justify-content: center; */
    align-items:center;
    flex:1;
 }
 #parent-container{
    display:flex;
    justify-content:center;
    align-items: center;
    gap: 1rem;
    
 }
 p{
    display:inline-block;
    font-family: "Open Sans", sans-serif;;
    font-size:var(--h4-laptop);
    margin: 0;
    color: var(--black);
    font-weight:300;
    line-height: 145%;
}
h1{
    font-family: "Open Sans", sans-serif;;
    font-size:var(--h1-laptop);
    text-align: center;
    line-height: 145%;
    margin:0 auto;
    padding:0 0.5rem;
    
}
 .card{
    padding:1rem;
    background-color: var(--black-5);
 }
 form{
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        gap:1rem;
        padding: 1rem 0;
     
        max-width: 100%;
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
      #validation-message p{
        color:red;
        font-size: var(--h6-laptop);
        margin:1rem;
      }
      #validation-message{
        display:flex;
        flex-wrap: wrap;
        gap:1rem;
    }
      .error-message{
        color:red;
        font-size: var(--h6-laptop);
      }
      .row{
      display: flex;
      justify-content: flex-start; 
      align-items: center;
    
      max-width: 100%;
      margin:1rem 0;
      gap:1rem;
      /* border: 1px solid black;
      border-radius: 8px;
      padding:0.5rem; */
   

    }
    .chief-doctor{
        grid-column-start: span 3;

        
    }
  
    .main-top-container{
     
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: space-between;
      flex-direction: column;
      max-width: 100%;
      gap: 1rem;



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
    .grid{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .row h6{
      font-size: var(--h6-laptop);
      margin:0;

    }
    @media (max-width: 1400px) {
        .top-container{
            max-width: 100%;
        }
       
        .main-top-container{
            display: flex;
            flex-direction: column;
        }
    }
 </style>
 