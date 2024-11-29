<template>
    <ol>
        <slot></slot>
    </ol>
</template>

<style scoped>
ol{
    list-style: none;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    
    padding-left: 0;
    box-sizing: border-box;
    /* border:1px solid black; */
    width: calc(100% - 1rem);
    max-width:  calc(100% - 1rem);
    
}
@media (max-width:600px) {
        ol{
            display: grid;
            grid-template-columns: 1fr;
            justify-items: center;
        }
};


</style>