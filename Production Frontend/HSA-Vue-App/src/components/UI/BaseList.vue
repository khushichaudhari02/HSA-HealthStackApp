<template>
    <ol>
        <slot></slot>
    </ol>
</template>

<style scoped>
ol{
    display: grid;
    row-gap: 4rem;
   justify-content: space-between;
    max-width:100%;
    grid-template-columns:1fr 1fr 1fr;
    column-gap: 3rem;
    grid-auto-flow: row;
    margin: 1rem auto;
    padding: 1rem 0 ;
    padding-inline-start: 0;
    list-style:none;
}
@media (max-width:1200px) {
    ol{
        grid-template-columns: 1fr 1fr;
        column-gap: 1rem;

    }
}
@media (max-width:1400px) {
    ol{
        column-gap: 1rem;
    }
}
@media (max-width:600px) {
    ol{
        grid-template-columns: 1fr;
    }
}

</style>
