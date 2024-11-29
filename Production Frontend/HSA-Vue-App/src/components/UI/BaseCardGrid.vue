<template>
    <ul>
        <slot></slot>
    </ul>
</template>

<style scoped>
ul{
    display: grid;
    justify-content: space-evenly;
    grid-template-columns:1fr 1fr 1fr;
    width: fit-content;
    align-items: center;
    margin: 5rem auto;
    background-color: grey;
    padding: 2rem;
    row-gap: 1rem;

}
</style>
