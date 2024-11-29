<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
          <p class="error-message" >{{ error }}</p>
        </base-dialog>
        <base-dialog :show="success" title="Profile Updated Successfullly" @close="handleSuccess">
          <p class="success" >Profile Updated Successfullly</p>
        </base-dialog>
        <base-dialog v-if="isLoading && !error" :show="isLoading" title="Loading..." fixed>
          <base-spinner></base-spinner>
        </base-dialog>

<section v-else-if="!isEditing && !isLoading">
    
    <h1>Profile</h1>
    <base-card>
    <ol >
        <li><span> Name: </span>{{ getName }}</li>
        <li> <span>Email: </span>{{ getEmail }}</li>
        <li><span>Phone Number: </span>{{ getPhoneNumber}}</li>
        <li> <span>Age: </span>{{ getAge }}</li>
        <li> <span>Sex: </span>{{ getSex }}</li>
        <li><span>Height: </span>{{ getHeight}}</li>
        <li><span>Weight: </span>{{ getWeight }}</li>
        <li><span>Address: </span>{{ getAddress}}</li>
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
            <div class="container">
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
            
        </div>
        <h5>Address</h5>
        <div class="container">
                <div class="form-control">
              <label for="streetAddress1">StreetAddress 1:</label>
              <input type="text" id="streetAddress1" v-model.trim="streetAddress1" />
            </div>
            <div class="form-control">
              <label for="streetAddress2">StreetAddress 2:</label>
              <input type="text" id="streetAddress2" v-model.trim="streetAddress2" />
            </div>
            <div class="form-control">
              <label for="city">City</label>
              <input type="text" id="city" v-model.trim="city" />
            </div>
            <div class="form-control">
              <label for="district">District</label>
              <input type="text" id="district" v-model.trim="district" />
            </div>
            <div class="form-control">
              <label for="state">State</label>
              <input type="text" id="state" v-model.trim="state" />
            </div>
            <div class="form-control">
              <label for="postalCode">Pincode</label>
              <input type="text" id="postalCode" v-model.trim="postalCode" />
            </div>
        </div>
        <h5>Height</h5>
        <div class="container">
                <div class="form-control">
              <label for="heightFoot">Foot</label>
              <input type="number" id="heightFoot" v-model.trim="heightFoot" />
            </div>
            <div class="form-control">
              <label for="heightInch">Inches</label>
              <input type="number" id="heightInch" v-model.trim="heightInch" />
            </div>
            
        </div>
        <h5>Weight</h5>
        <div class="container">
                <div class="form-control">
              <label for="weight">Weight</label>
              <input type="number" id="weight" v-model.trim="weight" />
            </div>
           
            
        </div>
               
       
</form> 
<p id="validation-message"
          v-if="!formIsValid"
        >
        Please enter firstName and lastName ,valid email, phoneNumber, age and sex.</p>
    
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


export default{
  data(){
    return {
        isLoading:false,
        isEditing:false,
      error:null,
      profile:{},
      sexes:['male','female','others'],
            firstName:"",
            middleName:'',
            lastName:"",
            email:'',
            age:'',
            phoneNumber:"",
            streetAddress1:'',
            streetAddress2:'',
            city:'',
            district:'',
            state:'',
            postalCode:'',
            heightFoot:null,
            heightInch:null,
            weight:null,
            formIsValid:true,
            success:false
    }
  }  ,
  computed:{
    editUrl(){
        return this.$route.path+'/edit'
    },
    getName(){
let s=this.profile?.name?.firstName + " " + this.profile?.name?.middleName + " " + this.profile?.name?.lastName;
      return this.profile?.name ? s:"";
    },
    getEmail(){
      return this.profile?.email ?? "";
    },
    getAge(){
      return this.profile?.age ?? "";

    },
 
    getSex() {
      return this.profile?.sex ?? "";
    },
    getHeight() {
      return this.profile?.height
        ? this.profile.height.foot + " foot " + this.profile.height.inches + " inch"
        : "";
    },
    getWeight() {
      return this.profile?.weight ? this.profile.weight + " kg" : "";
    },
    getAddress() {
      const address = this.profile?.address ?? {};
      const streetAddresses = address.streetAddress ?? [];
      return address.state || address.city || this.profile?.district || streetAddresses[0] || streetAddresses[1] || address.postalCode
        ? streetAddresses[0] + ", " + address.city + ", " + address.state + ", " + address.postalCode
        : "";
    },
    getPhoneNumber() {
      return this.profile?.phoneNumber ?? "";
    },
 
  },
  methods:{
    backToProfile(){
         this.isEditing=false;
            },
       edit() {
      this.isEditing = true;
      const { name, email, phoneNumber, sex, age, height, weight, address } = this.profile;
      this.firstName = name?.firstName ?? "";
      this.middleName = name?.middleName ?? "";
      this.lastName = name?.lastName ?? "";
      this.email = email ?? "";
      this.phoneNumber = phoneNumber ?? "";
      this.sex = sex ?? "";
      this.age = age ?? "";
      this.heightFoot = height?.foot ?? null;
      this.heightInch = height?.inches ?? null;
      this.weight = weight ?? null;
      this.state = address?.state ?? "";
      this.district = address?.district ?? "";
      this.city = address?.city ?? "";
      this.streetAddress1 = address?.streetAddress?.[0] ?? "";
      this.streetAddress2 = address?.streetAddress?.[1] ?? "";
      this.postalCode = address?.postalCode ?? "";
    },
    async submitEdit() {
      const addressIsFull =
        this.state &&
        this.district &&
        this.city &&
        (this.streetAddress1 || this.streetAddress2) &&
        this.postalCode &&
        this.landmark;

      const addressisEmpty =
        !this.state &&
        !this.district &&
        !this.city &&
        !this.streetAddress1 &&
        !this.streetAddress2 &&
        !this.postalCode &&
        !this.landmark;

      if (
        this.firstName === "" ||
        this.lastName === "" ||
        this.email === "" ||
        !this.email.includes("@") ||
        this.phoneNumber === "" ||
        this.phoneNumber.length !== 10 ||
        (!addressIsFull && !addressisEmpty) ||
        this.age === "" ||
        this.sex === ""
      ) {
        this.formIsValid = false;
        return;
      }

      const address = {
        state: this.state,
        district: this.district,
        city: this.city,
        streetAddresss: [this.streetAddress1, this.streetAddress2],
        postalCode: this.postalCode,
      };
      const payload = {
        name: {
          firstName: this.firstName,
          middleName: this.middleName,
          lastName: this.lastName,
        },
        email: this.email,
        phoneNumber: this.phoneNumber,
        age: this.age,
        sex: this.sex,
        weight: this.weight,
        height: {
          heightFoot: this.heightFoot,
          heightInch: this.heightInch,
        },
        address: address,
      };
      this.isLoading = true;
      try {
        await this.$store.dispatch("patient/updatePatientDetails", payload);
      
        this.success = true;
        this.isEditing = false;
      } catch (err) {
        this.error = err.message || "Failed to update, try later.";
      }
      finally{
        this.isLoading = false;
      }
      
     
    },
            handleError(){
          this.error=null;
        },
        handleSuccess(){
          this.success=false;
       
        }
  },
async created(){
  this.isLoading = true;
    try {
      await this.$store.dispatch("patient/fetchPatientDetails");
      const patient = this.$store.getters["patient/patient"];
      this.profile = {
        name: patient.name,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        address: patient.address,
        height: patient.height ?? null,
        weight: patient.weight ?? null,
        sex: patient.sex,
        age: patient.age,
      };
      this.isLoading = false;
    } catch (err) {
      this.error = err.message || "Failed to fetch, try later.";
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
      width: 100%;
      max-width: 100%;
        
    }
    
      input,select {
        display: block;
        width:100%;
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
</style>