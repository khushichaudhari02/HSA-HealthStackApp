<template>
    <li>
        <slot></slot>
    </li>
</template>

<style scoped>
li{

border: 1px solid black;
border-radius: 1px;
padding:0.2rem;
font-size: 1.25rem;
font-family: 'Open Sans' sans-serif;
font-weight: normal;
text-align: left;
max-width: 100%;
word-wrap: break-word;

}
@media (max-width:600px) {
    li{
        width: 100%;
    }
    
}
</style>
