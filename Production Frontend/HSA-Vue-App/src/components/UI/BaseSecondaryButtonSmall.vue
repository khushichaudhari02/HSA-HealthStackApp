<template>
    <button>
        <slot></slot>
    </button>

</template>

<style scoped>
button{
    background-color: var(--secondary-color);
    color:white;
    padding: 1rem 2rem;
    border-radius: 100px;
    text-align: center;
    width: 100%;
    font-weight: bold;
    max-width:calc((100% - 2rem));
    border:none;
    word-wrap: break-word;
}
button:hover , button:active{
    background-color: var(--secondary-color-light) ;
    cursor:pointer
}
/* @media (max-width:650px) {
        button{
          
        }
} */

</style>