<template>
<li >
    <article>
      <h4 > Notification <span v-show="index+1">{{index+1}}</span></h4> 
     <p>{{message}}</p>
    
      <base-button-container>
        <base-button link :to="onClickPath" mode="primary">View Detail</base-button>
        <base-button v-if="!seen" @click='setSeen' mode="flat">Seen</base-button>
      </base-button-container>
    </article>
</li>

</template>
<script>


    export default{
        props:['message','id','index','seen',''],
        methods:{
            // setSeen(){
            //    console.log(this.id);
            //     const payload={
            //         id:this.id
            //     }
            //     if(this.$store.getters['auth/isAdmin']){
            //         this.$store.dispatch('admin/setSeenNotification',payload)
            //     }
               
            //     if(this.$store.getters['auth/isPatient']){
            //         this.$store.dispatch('patient/setSeenNotification',payload)
            //     }
            // }
            
        },
        computed:{
            onClickPath(){
                    if(this.$store.getters['auth/isAdmin']){
                        return '/admin/appoinments/' + this.id ??''
                    }
                return "/patient/appointments/"+this.id ??''
            }
        }


    }
</script>

<style scoped>

li{
list-style: none;
max-width: 100%;
display: flex;
align-items: center;
justify-content: center;

}
article {
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

max-width:100%;
max-height: 32rem;

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

