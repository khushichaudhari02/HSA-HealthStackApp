<template>
    <footer>
      <div id="copyright">(c) Copyright HSA 2024. All rights reserved.</div>
      <ul>
        <li>Privacy Policy</li>
        <li>Terms & Conditions</li>
      </ul>
      <ul>
        <li>Home</li>
        <li>Contact</li>
      </ul>
    </footer>
  </template>
  
  <script>
  export default {
    props: ['title']
  }
  </script>
  
  <style scoped>
  footer {
    width: 100%;
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin:0 ;
    padding:2rem 4rem;
    background-color: var(--black-5);

  }
  
  footer #copyright {

    font-family: 'Inter',sans-serif;
    font-weight:light;
    font-size: var(--h6-laptop);
      margin: 0;
  }

  

  ul{
    display: flex;
    list-style: none;
    justify-content: center;
    align-items: center;
    gap:2rem;
  }
  li{
    font-family: 'Inter', sans-serif;
    color:black;
    font-size: 1.1rem;
    font-weight: bold;
  }
  @media (max-width:600px) {
    footer{
      flex-direction: column;
    }
}
  </style>