<template>
    <section class="main-section">
        <div class="CTA-container">
         <p>Manage Staff or Search By Name</p>
         <base-button-container>
           <base-button link mode="primary" to="/admin/doctors"
             >Manage Doctors</base-button
           >
           <base-button link class="outline" to="/admin/receptionists"
             >Manage Receptionists</base-button
           >
           <base-button link class="outline" to="/admin/nurses"
             >Manage Nurses</base-button
           >
           <base-button link class="outline" to="/admin/admins"
             >Manage Admins</base-button
           >
         </base-button-container>
       </div>
       <base-card>
      <h4>Search Staff Member</h4>
      <div class="form-container">
        <form>
          <div class="form-control">
            <label for="staffName">Staff Name</label>
            <input type="text" id="staffName" v-model.trim="staffName" />
          </div>

         
    
        </form>
        <div id="validation-message" v-if="!formIsValid">
          <p >Please enter a valid name</p>
        </div>

        <base-button-container>
          <base-button mode="primary" @click.prevent="search"
            >Search</base-button
          >  <base-button mode="flat" :to="create" link
            >Create New Staff</base-button
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
            staffName:'',
            error:null,
            formIsValid:true

        }
    },
    methods:    {
        async    search(){
                this.formIsValid=true;
                if(!this.staffName || this.staffName===''){
                    this.formIsValid=false;
                    return
                }
                
                this.$router.replace({ path: '/admin/staff/search', query: { staffName:this.staffName } })

            },
           
    },
    computed:{
      create(){
              return '/admin/staff/create'
            }
    }
}
</script>
<style scoped>
@media (max-width:1200px) {
    .main-section{
        flex-direction: column;
    }
}
.button-container{
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  align-items: center;
  row-gap:1rem;
}
.main-section {
    display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 1rem 4rem;
  flex:1;
}
.main-section .appointment-container {
  max-width: 100%;
  list-style: none;
  margin: 1rem auto;
  
  padding: 0;
  border-bottom: 1px solid var(--black-10);
}
.card{
    margin:1rem;
    height: fit-content;
}
.CTA-container {
  padding: 2rem 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.CTA-container p {
  display: inline-block;
  text-align: justify;
  font-family: "Open Sans", sans-serif;
  font-size: var(--h4-laptop);
  color: var(--black);
  font-weight: 300;
  line-height: 145%;
}

h2 {
  font-size: var(--h4-laptop);
  margin-bottom: 3rem;
}
.form-control {
  margin: 0.5rem 0;
  /* display:flex;
        flex-direction:column;
        justify-content:center;
        width: inherit;
        align-items:center; */
  text-align: left;
}
.form-control label {
  font-family: "Open Sans" sans-serif;
  font-size: var(--h6-laptop);
  font-weight: bold;
}
form {
  display: flex;
    flex-direction: column;
  
  align-items: center;
  max-width: 100%;

  gap: 1rem;
}
.form-container {
  padding: 1rem;
  background-color: transparent;
}

input,
select {
  display: block;
  margin-top: 0.5rem;
  height: 2.5rem;
  border: 1px solid var(--primary-color);
  padding: 0.5rem;
  border-radius: 8px;
  font-size: var(--h6-laptop);
}
span {
  font-weight: normal;
}
input:focus {
  background-color: var(--black-5);
}
#validation-message {
  color: red;
  font-size: var(--h6-laptop);
}
h4{
  font-size:var(--h5-laptop) ;
  margin:1rem;
}
</style>