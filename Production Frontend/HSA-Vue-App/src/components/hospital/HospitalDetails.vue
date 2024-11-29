<template>
  <base-card>
    <ol>
      <li><span>Name: </span>{{ hospital.name }}</li>
      <li><span>Phone Number: </span>{{ hospital.phoneNumber }}</li>
      <li><span>Email: </span>{{ hospital.email }}</li>
      <li>
        <span>Total Doctors:</span>{{ hospital.staff?.doctors?.length ?? 0 }}
      </li>
      <li>
        <span>Total Admins: </span>{{ hospital.staff?.admins?.length ?? 0 }}
      </li>
      <li>
        <span>Total Nurses: </span>{{ hospital.staff?.nurses?.length ?? 0 }}
      </li>
      <li>
        <span>Total Receptionists: </span
        >{{ hospital.staff?.receptionists?.length ?? 0 }}
      </li>

      <!-- <li><span>Chief Doctor </span>{{chiefDoctor.name }}</li> -->
      <li><span>Specialty: </span>{{ hospital.specialty.join(", ") }}</li>
      <li><span>Services: </span>{{ hospital.service.join(", ") }}</li>
      <li>
        <span>Open Hours: </span>
        <span
          class="openHour"
          v-for="openHour of hospital.openHours ?? []"
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
        <li><span>Age: </span>{{ getChiefDoctorAge }}</li>
        <li><span>Sex: </span>{{ getChiefDoctorSex }}</li>
        <li><span>Address: </span>{{ getChiefDoctorAddress }}</li>
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
        <li><span>Shifts: </span>{{ getChiefDoctorShifts }}</li>
        <li><span>Specialty: </span>{{ getChiefDoctorSpecialty }}</li>
      </ol>
    </div>
  </base-card>
</template>

<script>
import { DateTime } from "luxon";
export default {
  props: ["hospital", "chiefDoctor"],
  data() {
    return {};
  },
  computed: {
    getAddress() {
      if(this.hospital?.address){
        return `${this.hospital.address?.streetAddress?.[0] ?? ""},${
        this.hospital.address?.streetAddress?.[1] ?? ""
      }, ${this.hospital.address?.city ?? ""}, ${
        this.hospital.address?.state ?? ""
      } ${this.hospital.address?.postalCode ?? ""}`;
      }
      return ''
    },
    getChiefDoctorName() {
      return `${this.chiefDoctor?.name?.firstName ?? ""} ${
        this.chiefDoctor?.name?.middleName ?? ""
      } ${this.chiefDoctor?.name?.lastName ?? ""}`;
    },
    getChiefDoctorEmail() {
      return this.chiefDoctor?.email ?? "";
    },
    getChiefDoctorAge() {
      if (!this.chiefDoctor.age) {
        return "";
      }
      return this.chiefDoctor.age;
    },
    getChiefDoctorSex() {
      if (!this.chiefDoctor.sex) {
        return " ";
      }
      return this.chiefDoctor.sex;
    },

    getChiefDoctorAddress() {
      if (this.chiefDoctor?.address) {
    const { streetAddress, city, state, postalCode } = this.chiefDoctor.address;
    const addressParts = [
        streetAddress?.[0],
        streetAddress?.[1],
        city,
        state,
        postalCode
    ].filter(part => part); // Filter out empty elements

    return addressParts.join(', '); // Join remaining elements with a comma
}
return '';  
    },
    getChiefDoctorPhoneNumber() {
      return this.chiefDoctor?.phoneNumber ?? "";
    },
    getChiefDoctorEducation() {
      return this.chiefDoctor?.educationQualification?.join(', ') ?? '';

      // let e = "";
      // for (const [
      //   index,
      //   ed,
      // ] of this.chiefDoctor.educationQualification.entries()) {
      //   if (index != this.chiefDoctor.educationQualification.length - 1) {
      //     e += ed + ",";
      //   } else {
      //     e += ed;
      //   }
      // }
      // return e;
    },
    getChiefDoctorRegistrationNumber() {
    return this.chiefDoctor?.registrationNumber ?? '';
},

getChiefDoctorStateMedicalCouncil() {
    return this.chiefDoctor?.stateMedicalCouncil ?? '';
},

getChiefDoctorYearOfRegistration() {
    return this.chiefDoctor?.yearOfRegistration ?? '';
},

getChiefDoctorAppointmentDuration() {
    return this.chiefDoctor?.appointmentDuration ? `${this.chiefDoctor.appointmentDuration} minutes` : 'Not set';
},

getChiefDoctorSpecialty() {
    return this.chiefDoctor?.specialty?.join(', ') ?? '';
},

getChiefDoctorShifts() {
    let s = '';
    for (const [index, shift] of (this.chiefDoctor?.shifts ?? []).entries()) {
        const start = DateTime.fromFormat(shift.startTime, "HH:mm", { zone: "Asia/Kolkata" })
            .toLocaleString({ hour: "numeric", minute: "2-digit" })
            .toLowerCase();
        const end = DateTime.fromFormat(shift.endTime, "HH:mm", { zone: "Asia/Kolkata" })
            .toLocaleString({ hour: "numeric", minute: "2-digit" })
            .toLowerCase();

        s += (index !== this.chiefDoctor.shifts.length - 1) ? `${start} - ${end},` : `${start} - ${end}`;
    }
    return s;
},
  },
  methods: {
    getOpenHours(openHour) {
      let s='';
      if(openHour?.start && openHour?.end){
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

      s= start + " - " + end + " ";
      }
      return s;
    },
  },
};
</script>

<style scoped>
.card {
  max-width: 100%;
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

h2 {
  font-size: var(--h5-laptop);
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
.openHour {
  font-weight: normal;
}
ul {
  padding: 0;
  list-style: none;
  margin-left: 1rem;
}
</style>
