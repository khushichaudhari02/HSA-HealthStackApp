<template>
    <li >
        <article>
          <h4  > <span >Patient:</span> <span v-show="index+1">{{index+1}}</span></h4> 
          <ul>    
              <li ><span>Name:</span>{{getName }}</li> 
              <li><span>Email: </span>{{ getEmail}}</li>
              <li><span>Phone No.: </span>{{ getPhoneNumber}}</li>
              <li><span>Age:</span> {{ getAge}}</li>
              <li><span>Sex:</span> {{ getSex}}</li>

              <!-- <li><span>Specialty: </span>{{ getSpecialty}}</li> -->
          </ul>
          <base-button-container>
            <base-button link :to="viewDetail" mode="primary">View Detail</base-button>
            <base-button mode="outline" @click="back">Back</base-button>
          </base-button-container>
        </article>
    </li>
    
    </template>
    <script>
    
        export default{
            props:['message','name','index','email','id','phoneNumber','age','sex'],
            methods:{
                back(){
                    this.$router.back()
                }
            },
            computed:{
                viewDetail(){
                    if (this.$store.getters['auth/isDoctor']) {
        return `/doctor/patients/${this.id}`;
    }
    if (this.$store.getters['auth/isAdmin']) {
        return `/admin/patients/${this.id}`;
    }
    return `${this.$route.path}/patients/${this.id ?? ''}`;
                    
                },
                getName(){
                    return `${this.name?.firstName ?? ''} ${this.name?.middleName ?? ''} ${this.name?.lastName ?? ''}`.trim();
                },
    getEmail(){
        return this.email ?? '';
    },
    getAge(){
        return this.age ?? '';

    },
    getSex(){
        return this.sex ?? ' ';

    },
    getPhoneNumber(){
        return this.phoneNumber ?? '';

    },
   
              
//  
            }
    
    
        }
    </script>
    
    <style scoped>
    
    li{
    list-style: none;
    max-width: 100%;
   

    }
   article ul{
        list-style: none;
        display:grid;
        grid-template-columns: 1fr 1fr;
        justify-content:space-between;
        align-items: center;
    }
    article li{
        font-size:var(--h5-laptop);
        padding:0.5rem;
        text-align: left;

    }
    span{
        font-weight: bold;
    }
    article {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border:1px solid black;
    border-radius: 8px;
    max-width:100%;
    max-height: 32rem;
    padding:1rem;
    }
    @media (max-width:1200px) {
    .appointmentDetail{
        max-width: 100%;
    }
    article{
        padding:0.5rem;
        max-width: 100%;
    
    }
    }
    @media (max-width:600px) {
    article{
        display: grid;
        justify-items: center;
       width:100%;
    
    }
    .appointmentDetail{
        width:100%;
        padding:0;
    }
    }
    
    
    h4 {
    font-size: var(--h5-laptop);
    }
    
    </style>
    
    