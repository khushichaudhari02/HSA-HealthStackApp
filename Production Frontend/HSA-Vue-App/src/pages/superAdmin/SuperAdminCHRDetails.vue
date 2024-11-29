<template>
  <base-dialog
    :show="!!error"
    mode="error"
    title="An error occurred"
    @close="handleError"
  >
    <p class="error-message">{{ error }}</p>
  </base-dialog>
  <div v-if="this.isLoading && !selectedHospital">
    <base-spinner></base-spinner>
  </div>
  <section v-if="selectedHospital">
    <h4>Hospital Details</h4>
    <base-card>
      <ol>
        <li><span>Name: </span>{{ selectedHospital.name }}</li>
        <li><span>Phone Number: </span>{{ selectedHospital.phoneNumber }}</li>
        <li><span>Email: </span>{{ selectedHospital.email }}</li>
        <!-- <li><span>Chief Doctor </span>{{chiefDoctor.name }}</li> -->
        <li v-if="selectedHospital.specialty">
          <span>Specialty: </span>{{ selectedHospital.specialty.join(", ") }}
        </li>
        <li v-if="selectedHospital.service">
          <span>Services: </span>{{ selectedHospital.service.join(", ") }}
        </li>
        <li v-if="selectedHospital.openHours">
          <span> Open Hours: </span>
          <span
            class="openHour"
            v-for="openHour of this.selectedHospital.openHours"
            :key="openHour"
            >{{ getOpenHours(openHour) }}
          </span>
        </li>
        <li><span>Address: </span>{{ getAddress }}</li>
      </ol>
      <div>
        <h2>Chief Doctor</h2>
        <ol>
          <li><span> Name: </span>{{ getChiefDoctorName }}</li>
          <li><span>Email: </span>{{ getChiefDoctorEmail }}</li>
          <li><span>Phone Number: </span>{{ getChiefDoctorPhoneNumber }}</li>

          <li><span>Education: </span>{{ getChiefDoctorEducation }}</li>
          <li>
            <span>Year Of Registration: </span
            >{{ getChiefDoctorYearOfRegistration }}
          </li>
          <li>
            <span>State Medical Council: </span
            >{{ getChiefDoctorStateMedicalCouncil }}
          </li>
          <li>
            <span>Appointment Duration: </span
            >{{ getChiefDoctorAppointmentDuration }}
          </li>
          <li>
            <span>Registration Number: </span
            >{{ getChiefDoctorRegistrationNumber }}
          </li>
        </ol>
      </div>
    </base-card>
    <base-button-container>
      <base-button mode="primary" @click="toCreate"
        >Open Create New Hospital</base-button
      >

      <base-button mode="flat" @click="back">Go Back</base-button>
    </base-button-container>
  </section>
  <section v-if="this.isCreating">
    <base-dialog :show="success" title="Hospital Created Successfullly" @close="handleSuccess">
          <p class="success" >Hospital Created Successfullly</p>
        </base-dialog>
    <div class="form-container">
      <form>
        <base-card>
          <h4>Hospital Details</h4>
          <div class="main-top-container">
            <div class="top-container">
              <div class="form-control">
                <label for="hospitalName">Hospital Name</label>
                <input
                  type="text"
                  id="hospitalName"
                  v-model.trim="hospitalName"
                  required
                />
              </div>
              <div class="form-control">
                <label for="hospitalPhoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="hospitalPhoneNumber"
                  v-model.trim="hospitalPhoneNumber"
                  required
                />
              </div>
              <div class="form-control">
                <label for="hospitalEmail">Hospital Email</label>
                <input
                  type="hospitalEmail"
                  id="hospitalEmail"
                  v-model.trim="hospitalEmail"
                  required
                />
              </div>
            </div>

            <div class="top-container">
              <h5>Specialty</h5>
              <div
                class="row"
                v-for="(sp, index) of this.hospitalSpecialty"
                :key="sp"
              >
                <h6>{{ index + 1 }}</h6>
                <div class="form-control">
                  <input type="text" v-model.trim="sp.name" />
                </div>
                <base-button-container>
                  <base-button
                    mode="primary small"
                    @click.prevent="addSpecialtyRow"
                    >+</base-button
                  >
                  <base-button
                    @click.prevent="removeSpecialtyRow(index)"
                    mode="red small"
                    >-</base-button
                  >
                </base-button-container>
              </div>
            </div>
            <div class="top-container">
              <h5>Service</h5>
              <div
                class="row"
                v-for="(service, index) of this.hospitalService"
                :key="service"
              >
                <h6>{{ index + 1 }}</h6>
                <div class="form-control">
                  <input type="text" v-model.trim="service.name" />
                </div>
                <base-button-container>
                  <base-button
                    mode="primary small"
                    @click.prevent="addServiceRow"
                    >+</base-button
                  >
                  <base-button
                    @click.prevent="removeServiceRow(index)"
                    mode="red small"
                    >-</base-button
                  >
                </base-button-container>
              </div>
            </div>

            <div class="top-container">
              <h5>Open Hours</h5>
              <div
                class="row"
                v-for="(openHour, index) of this.openHours"
                :key="openHour"
              >
                <h6>{{ index + 1 }}</h6>
                <div class="form-control">
                  <label for="">Start</label>
                  <input type="time" v-model.trim="openHour.start" />
                </div>
                <div class="form-control">
                  <label>End</label>
                  <input type="time" v-model.trim="openHour.end" />
                </div>
                <base-button-container>
                  <base-button
                    mode="primary small"
                    @click.prevent="addOpenHourRow"
                    >+</base-button
                  >
                  <base-button
                    @click.prevent="removeOpenHourRow(index)"
                    mode="red small"
                    >-</base-button
                  >
                </base-button-container>
              </div>
            </div>
            <div class="top-container">
              <h5>Address</h5>
              <div class="row">
                <div class="form-control">
                  <label for="streetAddress1">StreetAddress 1:</label>
                  <input
                    type="text"
                    id="streetAddress1"
                    v-model.trim="streetAddress1"
                  />
                </div>
                <div class="form-control">
                  <label for="streetAddress2">StreetAddress 2:</label>
                  <input
                    type="text"
                    id="streetAddress2"
                    v-model.trim="streetAddress2"
                  />
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
                  <input
                    type="text"
                    id="postalCode"
                    v-model.trim="postalCode"
                  />
                </div>
              </div>
            </div>

            <div class="top-container chief-doctor">
              <h5>Chief Doctor</h5>
              <div class="grid">
                <div class="form-control">
                  <label for="chiefDoctorFirstName">First Name</label>
                  <input
                    type="text"
                    id="chiefDoctorFirstName"
                    v-model.trim="chiefDoctorFirstName"
                    required
                  />
                </div>
                <div class="form-control">
                  <label for="middleName">Middle Name</label>
                  <input
                    type="text"
                    id="chiefDoctorMiddleName"
                    v-model.trim="chiefDoctorMiddleName"
                  />
                </div>
                <div class="form-control">
                  <label for="chiefDoctorLastName">Last Name</label>
                  <input
                    type="text"
                    id="chiefDoctorLastName"
                    v-model.trim="chiefDoctorLastName"
                    required
                  />
                </div>

                <div class="form-control">
                  <label for="chiefDoctorEmail">Email</label>
                  <input
                    type="email"
                    id="chiefDoctorEmail"
                    v-model.trim="chiefDoctorEmail"
                    required
                  />
                </div>

                <div class="form-control">
                  <label for="chiefDoctorYearOfRegistration"
                    >Chief Doctor Year of Registration</label
                  >
                  <input
                    type="text"
                    id="chiefDoctorYearOfRegistration"
                    v-model.trim="chiefDoctorYearOfRegistration"
                    required
                  />
                </div>

                <div class="form-control">
                  <label for="chiefDoctorRegistrationNumber"
                    >Chief Doctor Registration Number</label
                  >
                  <input
                    type="text"
                    id="chiefDoctorRegistrationNumber"
                    v-model.trim="chiefDoctorRegistrationNumber"
                    required
                  />
                </div>
                <div class="form-control">
                  <label for="chiefDoctorStateMedicalCouncil">
                    Chief Doctor State Medical Council</label
                  >
                  <input
                    type="text"
                    id="chiefDoctorStateMedicalCouncil"
                    v-model.trim="chiefDoctorStateMedicalCouncil"
                    required
                  />
                </div>
              </div>

              <h5>Education Qualification</h5>
              <div class="grid">
                <div
                  class="row"
                  v-for="(eq, index) of chiefDoctorEducationQualification"
                  :key="eq"
                >
                  <h6>{{ index + 1 }}</h6>
                  <div class="form-control">
                    <input type="text" v-model.trim="eq.name" />
                  </div>
                  <base-button-container>
                    <base-button
                      mode="primary small"
                      @click.prevent="addEducationRow"
                      >+</base-button
                    >
                    <base-button
                      @click.prevent="removeEducationRow(index)"
                      mode="red small"
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
            <base-button @click.prevent="create" mode="primary"
              >Create New</base-button
            >
            <base-button @click.prevent="closeCreate" mode="flat"
              >Close</base-button
            >
          </base-button-container>
        </base-card>
      </form>
    </div>
  </section>
</template>

<script>
import { DateTime } from 'luxon';
  export default {
    props: ['CHRId'],

    data() {
      return {
        error: null,
        isLoading: false,
        isCreating:false,
        errors:[],
        selectedHospital:null,
        chiefDoctor:null,
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

      };
    },
    methods: {
      handleError() {
        this.error = false;
      },
      back() {
        this.$router.back();
      },
      async toCreate() {
        this.isCreating = true;
          this.chiefDoctorFirstName = this.chiefDoctor.name.firstName;
          this.chiefDoctorMiddleName = this.chiefDoctor.name.middleName;
          this.chiefDoctorLastName = this.chiefDoctor.name.lastName;
          this.chiefDoctorEmail = this.chiefDoctor.email;
          this.chiefDoctorYearOfRegistration = this.chiefDoctor.yearOfRegistration;
          this.chiefDoctorRegistrationNumber = this.chiefDoctor.registrationNumber;
          this.chiefDoctorStateMedicalCouncil = this.chiefDoctor.stateMedicalCouncil;
         if(this.chiefDoctor.educationQualification){
          this.chiefDoctorEducationQualification=[];
         }
          this.chiefDoctor.educationQualification.forEach(e => {
            this.chiefDoctorEducationQualification.push({ name: e });
          });
          this.hospitalName = this.selectedHospital.name;
          this.hospitalPhoneNumber = this.selectedHospital.phoneNumber;
          this.hospitalEmail = this.selectedHospital.email;
          if(this.selectedHospital.openHours){
            this.openHours = [];
          }
          if(this.selectedHospital.service){
            this.hospitalService = [];
          }
          if(this.selectedHospital.specialty){
            this.hospitalSpecialty = [];
          }
          this.selectedHospital.openHours.forEach(e=>{
            this.openHours.push({start:e.start,end:e.end})
          });
          this.selectedHospital.service.forEach(e=>{
            this.hospitalService.push({name:e})
          })
          this.selectedHospital.specialty.forEach(e=>{
            this.hospitalSpecialty.push({name:e})
          })
          this.streetAddress1 = this.selectedHospital.address.streetAddress[0];
          this.streetAddress2 = this.selectedHospital.address.streetAddress[1];
          this.landmark = this.selectedHospital.address.landmark;
          this.city = this.selectedHospital.address.city;
          this.district = this.selectedHospital.address.district;
          this.state = this.selectedHospital.address.state;
          this.postalCode = this.selectedHospital.address.postalCode;
      },
      // toCreate(){
      //   this.isCreating=true;

      // },
      closeCreate() {
this.isCreating=false;
      },
     
      getOpenHours(openHour) {
        if(openHour.start && openHour.end){
          const start = DateTime.fromFormat(openHour.start, "HH:mm", {
          zone: "Asia/Kolkata",
        })
          .toLocaleString({ hour: "numeric", minute: "2-digit" })
          .toLowerCase();
        const end = DateTime.fromFormat(openHour.end, "HH:mm", {
          zone: "Asia/Kolkata",
        })
          .toLocaleString({ hour: "numeric", minute: "2-digit" })
          .toLowerCase();

        return  start + " - " + end+" ";
        }
        return ''
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
    async  create(){
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
            const payload={
          hospitalName:this.hospitalName,
          email:this.hospitalEmail,
         phoneNumber:this.hospitalPhoneNumber,
         hospitalService:serviceResponse,
         hospitalSpecialty:specialtyResponse,
         openHours:this.openHours,
         address:address,
         chiefDoctor:chiefDoctor
        };
        // console.log(payload);

    try{

      await this.$store.dispatch('superAdmin/createNewHospital',payload);

        this.success=true;
            }catch(err){

                this.error=err.message||'failed to cretea'
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
              this.errors.push('Hospital Service should not be empty, at index '+(index+1))
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
        handleSuccess(){
            this.success=false
        }
    },
    computed: {

      getAddress() {
        if(!this.selectedHospital?.address){
          return '';
        }
        return `${this.selectedHospital?.address?.streetAddress[0] ?? ""}, ${this.selectedHospital?.address?.streetAddress[1] ?? ""}, ${this.selectedHospital?.address?.city ?? ""}, ${this.selectedHospital?.address?.state ?? ""} ${this.selectedHospital?.address?.postalCode ?? ""}`;
      },
      getChiefDoctorName(){

        return this.chiefDoctor.name.firstName+" "+this.chiefDoctor.name.middleName+" "+this.chiefDoctor.name.lastName;
    },
    getChiefDoctorEmail(){
        return this.chiefDoctor?.email??""
    },


    getChiefDoctorEducation(){
      let e = '';
      for (const [index, ed] of this.chiefDoctor?.educationQualification?.entries() ?? []) {
        e += ed;
        if (index !== this.chiefDoctor.educationQualification.length - 1) {
          e += ", ";
        }
      }
      return e;
    },
    getChiefDoctorRegistrationNumber(){
      return this.chiefDoctor?.registrationNumber ?? "";
    },
    getChiefDoctorStateMedicalCouncil(){
      return this.chiefDoctor?.stateMedicalCouncil ?? "";
    },
    getChiefDoctorYearOfRegistration(){
      return this.chiefDoctor?.yearOfRegistration ?? "";
    },
    getChiefDoctorAppointmentDuration(){
      return this.chiefDoctor?.appointmentDuration ? `${this.chiefDoctor.appointmentDuration} minutes` : 'Not set';



    },

    },
    async created() {
      this.error = null;
      try {
        this.isLoading = true;

        await this.$store.dispatch('superAdmin/fetchCHRDetails',{CHRId:this.CHRId} );
       this.selectedHospital =this.$store.getters["superAdmin/CHRDetails"]??{};
this.chiefDoctor =this.selectedHospital.chiefDoctor??{}
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      } finally {
        this.isLoading = false;
      }
    },
  };
</script>

<style scoped>
section {
  margin: 2rem 4rem;
  max-width: 100%;

  padding: 0;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  flex: 1;
}

ol {
  padding: 1rem 0;
  /* border:1px solid black; */
  max-width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  grid-auto-flow: row;
}

p {
  display: inline-block;
  margin: 0;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
}

li {
  list-style: none;
  font-size: var(--h5-laptop);
  font-family: "Open Sans";
  font-weight: normal;
  margin: 0.5rem;
  text-align: left;
  max-width: 100%;
  word-wrap: break-word;
}
span {
  font-weight: bold;
  font-size: inherit;
}
.openHour{
  font-weight: normal;
}
.card {
  padding: 1rem;
  background-color: var(--black-5);
}
form {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  gap: 1rem;
  padding: 1rem 0;

  max-width: 100%;
}
h1 {
  margin: 0;
  font-size: var(--h4-laptop);
}
.form-control {
  margin: 0.5rem 0;
  /* display:flex;
        flex-direction:column;
        justify-content:center;
        width: inherit;
        align-items:center; */
  text-align: left;
  max-width: 100%;
}
.form-control label {
  font-family: "Open Sans";
  font-size: var(--h6-laptop);
  font-weight: bold;
}
h5 {
  font-size: var(--h5-laptop);
}
h4 {
  font-size: var(--h4-laptop);
}
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  gap: 1rem;
}
.form-container {
  padding: 0.5rem;
  max-width: 100%;
}

input,
select {
  display: block;
  max-width: 100%;
  margin-top: 0.5rem;
  height: 2.5rem;
  border: 1px solid var(--primary-color);
  padding: 0.5rem;
  border-radius: 8px;
  font-size: var(--h6-laptop);
}
input:focus,
select:focus {
  background-color: var(--black-5);
}
#validation-message p {
  color: red;
  font-size: var(--h6-laptop);
  margin: 1rem;
}
#validation-message {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.error-message {
  color: red;
  font-size: var(--h6-laptop);
}
.row {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  max-width: 100%;
  margin: 1rem 0;
  gap: 1rem;
  /* border: 1px solid black;
      border-radius: 8px;
      padding:0.5rem; */
}
.chief-doctor {
  grid-column-start: span 3;
}

.main-top-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  flex-direction: column;
  max-width: 100%;
  gap: 1rem;
}
.top-container h5 {
  font-size: var(--h5-laptop);
  margin: 0;
  text-align: start;
}
.top-container {
  border: 1px solid black;
  border-radius: 8px;
  padding: 0.5rem;
  max-width: 100%;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.row h6 {
  font-size: var(--h6-laptop);
  margin: 0;
}
@media (max-width: 1400px) {
  .top-container {
    max-width: 100%;
  }

  .main-top-container {
    display: flex;
    flex-direction: column;
  }
}
</style>
