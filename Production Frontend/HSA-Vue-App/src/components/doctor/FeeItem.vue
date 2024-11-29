<template>
    <li >
        <article>
          <h4  > <span >Fees</span> <span v-show="index+1">{{index+1}}</span></h4> 
          <base-grid>    
              <li ><span>Date:</span> {{this.date }}</li> 
              <li><span>Daily Count: </span> {{this.dailyCount}}</li>
              <li><span>Total Fees:  </span> {{ totalFees}} Rs</li>
              <!-- <li><span>Specialty: </span>{{ getSpecialty}}</li> -->
          </base-grid>
          <base-button-container>
            <base-button link :to="viewDetail" mode="primary small">View Detail</base-button>
          </base-button-container>
        </article>
    </li>
    
    </template>
    <script>

        export default{
            props:['date','dailyCount','totalFees','index','dId'],
            computed:{
                viewDetail(){
                    if(this.$store.getters['auth/isAdmin']){
                        return '/admin/fees/'+this.dId +'/'+this.date
                    }
                    return '/doctor/fees/'+this.date
                },
}
    
    
        }
    </script>
    
    <style scoped>
    
    li{
    list-style: none;
    max-width: 100%;
    

    }
   article h4{
        font-size:var(--h5-laptop);
    }
    article li{
        font-size:var(--h6-laptop);
        margin:0.5rem;
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
    padding:1rem;
    }
    @media (max-width:1200px) {
    li{
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
    margin:1rem;
    }
    
    </style>
    
    