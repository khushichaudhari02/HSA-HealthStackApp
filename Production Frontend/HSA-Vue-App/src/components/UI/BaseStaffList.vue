<template>
    <ol>
        <slot></slot>
    </ol>
</template>

<style scoped>
ol{
    display: flex;
    flex-direction: column;
    gap:1rem;
    max-width:100%;
    margin: 1rem auto;
    /* padding: 1rem ; */
    align-items: center;
    justify-content: center;
    padding-inline-start: 0;
    list-style:none;
}
@media (max-width:1200px) {
   
}
@media (max-width:1400px) {
 
}
@media (max-width:600px) {
   
}

</style>
