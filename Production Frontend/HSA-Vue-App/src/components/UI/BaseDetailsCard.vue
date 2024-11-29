<template>
    <article>
        <slot></slot>
    </article>
    </template>

<style scoped>
article {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background-color: var(--black-5);
    border: 1px solid var(--primary-color);
    width: calc((100vw- 4rem)/2);
    max-width:calc((100vw- 4rem)/2);;
    max-height: 32rem;
    padding: 1.5rem 2rem;
    border-radius:16px;

}
