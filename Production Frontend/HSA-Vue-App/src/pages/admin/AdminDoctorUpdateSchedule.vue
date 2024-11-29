<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p class="error-message">{{ error }}</p>
    </base-dialog>
    <base-dialog
      :show="success && !error"
      title="Doctor Schedule Updated Successfully"
      @close="handleSuccess"
    >
      <p class="success">Updated Successfullly</p>
    </base-dialog>
    <base-dialog
      v-if="isLoading && !error"
      :show="isLoading"
      title="Loading..."
      fixed
    >
      <base-spinner></base-spinner>
    </base-dialog>
    <section>
      <h1>Add Off Days</h1>
      <base-card>
      <div id="validation-message" v-if="!formIsValid">
              <p v-for="error of this.errors" :key="error">{{ error }}</p>
            </div>
  
        <div class="form-container">
          <form>
            <div class="top-top-container">
              <div
                class="top-container"
                v-for="(offDay, index) of offDays"
                :key="offDay"
              >
                <h5>OffDay {{ index + 1 }}</h5>
                <div class="form-control">
                  <label f>Date</label>
                  <input type="date" v-model.trim="offDay.date" />
                </div>
                <h5>Shifts</h5>
                <div
                  class="row"
                  v-for="(shift, sIndex) of offDays[index].shifts"
                  :key="shift"
                >
                  <h6>{{ sIndex + 1 }}</h6>
                  <div class="form-control">
                    <label for="">Start</label>
                    <input type="time" v-model.trim="shift.startTime" />
                  </div>
                  <div class="form-control">
                    <label>End</label>
                    <input type="time" v-model.trim="shift.endTime" />
                  </div>
                  <base-button-container>
                    <base-button
                      mode="primary small"
                      @click.prevent="addShift(index)"
                      >Add Shift</base-button
                    >
                    <base-button
                      @click.prevent="removeShift(index, sIndex)"
                      mode="red small"
                      >Remove Shift</base-button
                    >
                  </base-button-container>
                </div>
                <base-button-container>
                  <base-button mode="primary small" @click.prevent="addOffDay()"
                    >Add OffDay</base-button
                  >
                  <base-button
                    @click.prevent="removeOffDay(index)"
                    mode="red small"
                    >Remove OffDay</base-button
                  >
                </base-button-container>
              </div>
            </div>
           
            <base-button-container>
              <base-button mode="primary " @click="submitEdit"
                >Submit</base-button
              >
              <base-button mode="outline" @click="backToProfile"
                >Cancel</base-button
              >
            </base-button-container>
          </form>
        </div>
      </base-card>
    </section>
  </template>
  <script>
  export default {
    props:['dId'],
    data() {
      return {
        error: null,
        errors: [],
        isLoading: false,
        success: false,
        offDays: [
          {
            date: "",
            shifts: [
              {
                startTime: "",
                endTime: "",
              },
            ],
          },
        ],
      };
    },
    computed: {
      // offDays(){
      //     return this.offDaysSetup
      // },
      // errors(){
      //     return this.errorsSetup
      // }
    },
    methods: {
      addOffDay() {
          for (const offDay of this.offDays) {
          if (
            !offDay.date ||
            offDay.date === "" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(offDay.date)
          ) {
            return;
          }
          if (offDay.shifts.length > 0) {
            for (const shift of offDay.shifts) {
              if (!shift.startTime || shift.startTime === "") {
                return;
              }
              if (!shift.endTime || shift.endTime === "") {
               return 
              }
            }
          }
        
        }
        this.offDays.push({
          date: "",
          shifts: [{ startTime: "", endTime: "" }],
        });
       
      },
      removeOffDay(index) {
        if (this.offDays.length > 1) {
          this.offDays.splice(index, 1);
        }
      },
      addShift(dayIndex) {
        
          for (const shift of this.offDays[dayIndex].shifts) {
            if (!shift.startTime || shift.startTime === "") {
              return;
            }
            if (!shift.endTime || shift.endTime === "") {
              return;
            }
          }
        this.offDays[dayIndex].shifts.push({ startTime: "", endTime: "" });
      },
      removeShift(dayIndex, shiftIndex) {
        if (this.offDays[dayIndex].shifts.length > 1) {
          this.offDays[dayIndex].shifts.splice(shiftIndex, 1);
        }
      },
    async  submitEdit() {
        this.formIsValid = true;
        if (!this.checkForm()) {
          this.formIsValid = false;
          return;
        }
        let offDays = JSON.stringify(this.offDays);
        offDays = JSON.parse(offDays);
        const payload = {
        dId:this.dId,
          offDays: offDays,
        };
        console.log(payload);
        this.isLoading=true;
        try{
          await this.$store.dispatch('admin/updateDoctorOffDays',payload);
          this.success=true;
        }catch(err){
          this.error = err.message || 'Failed to update, try later.';
        }finally{
          this.isLoading=false;
        }
       
      },
      backToProfile() {
        this.$router.back();
      },
      handleError(){
            this.error=null;
          },
          handleSuccess(){
            this.success=false;
         
          },
      checkForm() {
        this.errors = [];
  
        for (const [index, offDay] of this.offDays.entries()) {
          if (
            !offDay.date ||
            offDay.date === "" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(offDay.date)
          ) {
            this.errors.push("Date of Offday is empty at index" + (index + 1));
          }
          if (this.offDays[index].shifts.length > 0) {
            console.log("here 2");
            for (const [sIndex, shift] of this.offDays[index].shifts.entries()) {
              if (!shift.startTime || shift.startTime === "") {
                this.errors.push(
                  "Shift Start not be empty, at shift index " +
                    (sIndex + 1) +
                    "of OffDay with  index" +
                    (index + 1)
                );
              }
              if (!shift.endTime || shift.endTime === "") {
                this.errors.push(
                  "Shift End not be empty, at shift index " +
                    (sIndex + 1) +
                    "of OffDay with index" +
                    (index + 1)
                );
              }
            }
          }
        }
  
        if (!this.errors.length) {
          return true;
        }
        return false;
      },
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
  form {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    gap: 1rem;
    padding: 1rem 0;
    max-width: 100%;
  }
  .card {
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
  #validation-message {
    color: red;
    font-size: var(--h6-laptop);
  }
  .error-message {
    color: red;
    font-size: var(--h6-laptop);
  }
  .row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    max-width: 100%;
    margin: 1rem 0;
    gap: 1rem;
    /* border: 1px solid black;
        border-radius: 8px;
        padding:0.5rem; */
    border: 1px solid black;
    border-radius: 8px;
  }
  .top-top-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  
    max-width: 100%;
  
    column-gap: 2rem;
  }
  .top-container h5 {
    font-size: var(--h5-laptop);
    margin: 0;
    text-align: center;
  }
  .top-container {
    border: 1px solid black;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem;
    max-width: 100%;
  }
  
  .row h6 {
    font-size: var(--h6-laptop);
    margin: 0;
  }
  </style>
  