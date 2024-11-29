<template>
    <button>
        <slot></slot>
    </button>

</template>

<style scoped>
button{
    background-color: var(--primary-color);
    color:white;
    padding: 1rem 2rem;
    border-radius: 100px;
    width: 100%;
    max-width:calc((100% - 2rem));
    font-weight: bold;
    border:none;
    word-wrap: break-word;
}
button:hover , button:active{
    background-color: var(--primary-color-light) ;
    cursor:pointer
}



</style>