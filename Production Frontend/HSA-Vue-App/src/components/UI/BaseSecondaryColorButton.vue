<template>
    <button><slot></slot></button>
    </template>
<script>
export default{

}</script>
<style scoped >
button{
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
     color: #fff;
     font-size: 21px;
     padding:1.5rem 3rem ;
    border-radius: 100px;
    width: 100%;
    font-weight: bold;
     border:none;
     word-wrap: break-word;
}
button:active, button:hover{
    background-color : #10B4C9 ;
    color:black;
}
</style>