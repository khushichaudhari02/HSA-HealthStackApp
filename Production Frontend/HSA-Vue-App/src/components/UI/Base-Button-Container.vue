<template>
    <div class="button-container">
        <slot></slot>
    </div>
</template>
<style scoped>
    .button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  margin-top: 1rem;

}
@media (max-width: 1200px) {
  }
</style>