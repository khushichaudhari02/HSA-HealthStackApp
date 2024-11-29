<template>
    <button v-if="!link" :class="mode" type="button">
      <slot></slot>
    </button>
    <router-link  v-else :to="to" :class="mode">
      <slot></slot>
    </router-link>
  </template>
  
  <script>
  export default {
    props: {
      mode: {
        type: String,
        required: false,
        default: null
      },
      link: {
        type: Boolean,
        required: false,
        default: false
      },
      to: {
        type: String,
        required: false,
        default: '/'
      }
    }
  }
  </script>
  
  <style scoped>
  button,
  a {
    border-radius: 100px;
    font-weight: bold;
    max-width: 100%;
    border:none;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    margin-right: 0.5rem;
    display: inline-block;
    font-family:'Open Sans';
    font-size:1rem;

  }
  .red{
    background-color: var(--error);
    color:white;
    border:2px solid var(--error)
  }
  .red:hover,.red:active{
    background-color: maroon;
  }
  .primary{
    background-color: var(--primary-color);
    color: #fff;
    border:2px solid var(--primary-color);
  }
  .primary:hover,.primar:active{
    background-color: var(--primary-color-light) ;
    color:black;
  }
  /* .secondary{
    background-color: var(--secondary-color);
    color:white;
    border:none;
  }
  .secondary:hover,.secondary:active{
    background-color: var(--secondary-color-light) ;
    color:black;
  } */
  .big{
     padding:1.5rem 3rem ;
     border-radius: 100px;
    max-width: 100%;

      font-size: 1.25rem;
  }
  .small {
    padding:0.5rem 1rem;
    font-size: 1rem;
  }
  .flat {
    background-color: transparent;
    color: var(--primary-color);
    border:2px solid transparent;
  }
 
  
  .outline {
    border: 2px solid var(--primary-color);
    background-color: transparent;
    border-color: var(--primary-color);
    color: var(--primary-color);
  } 

 .outline:Hover,.outline:active, .flat:hover,
  .flat:active
 {
    background-color: var(--primary-color-light);

  }
  .disable{
   color:var(--black-75);
   background-color: grey;
   border-color: grey;
  }
  </style>