<template>
   <div id="parent-container"> 
    <h1>Welcome To <span>The Health Stack App</span></h1>
    
    <div id='CTA-container'>
         <div><p>Book Appointments by signing up! or If you are looking to join us as hospital click on Contact Us to fill form.</p></div>
         <base-button-container>
             <base-button  link mode="primary big" to="/signup">Signup</base-button>
                 <base-button link mode="outline big" to="/login">Login</base-button>
         </base-button-container>
     </div>
    </div>

 </template>
 
 <script>
import router from '@/router';

 
 export default{
    methods:{
        goToLogin(){
            router.push('/login')
        },
        goToSignup(){
            router.push('/signup')
        }
        
    }
 }
 
 
 </script>
 <style scoped>
 #parent-container{
    display:flex;
    justify-content:center;
    align-items: center;
    gap: 1rem;
    margin:5rem 5rem 0;  
    flex:1;
 }
#CTA-container {
    width:100%;
    display:flex;
    flex-direction:column;
  
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
span{
    background: var(--brand-gradient-color);
    background-clip:text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
 

 </style>
 