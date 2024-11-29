<template>
    <button><slot></slot></button>
    </template>
<script>
export default{

}</script>
<style scoped >
button{
    background-color: var(--primary-color);
    border-color: var(--primary-color);
     color: #fff;
     font-size: 21px;
     border:none;
     padding:1.5rem 3rem ;
     border-radius: 100px;
    width: 100%;
    font-weight: bold;
    word-wrap: break-word;
}
button:active, button:hover{
    background-color:#1587DF;
    color:black;
    
}
/* @media (max-width:600px) {
    
} */
</style>