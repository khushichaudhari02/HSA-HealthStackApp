<template>
    <section class="main-section">
        <div class="CTA-container">
         <p>View Current Patient Data</p>
         <base-button-container>
           <base-button link mode="primary big" to="/superAdmin/hospitals"
             >View Hospitals</base-button
           >
         </base-button-container>
       </div>
    </section>
</template>

<style scoped>
.main-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5rem 4rem 0;
  padding: 5rem 0;
  flex:1;
}
.main-section .appointment-container {
  max-width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
}
section {
  border-bottom: 1px solid var(--black-10);
}
.CTA-container {
  padding: 2rem 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.CTA-container p {
  display: inline-block;
  text-align: justify;
  font-family: "Open Sans", sans-serif;
  font-size: var(--h4-laptop);
  color: var(--black);
  font-weight: 300;
  line-height: 145%;
}

h2 {
  font-size: var(--h4-laptop);
  margin-bottom: 3rem;
}

</style>