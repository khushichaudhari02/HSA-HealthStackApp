import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router.js';
import BaseBadge from './components/UI/BaseBadge.vue';
import BaseButton from './components/UI/BaseButton.vue';
import BaseButtonContainer from './components/UI/Base-Button-Container.vue';
import BaseCard from './components/UI/BaseCard.vue';
import BaseGrid from './components/UI/BaseGrid.vue';
import BaseList from './components/UI/BaseList.vue';
import BasePrimaryColorButton from './components/UI/BasePrimaryColorButton.vue';
import BaseSecondaryColorButton from './components/UI/BaseSecondaryColorButton.vue';
import BasePrimaryColorButtonSmall from './components/UI/BasePrimaryButtonSmall.vue'
import BaseSecondaryColorButtonSmall from './components/UI/BaseSecondaryButtonSmall.vue'
import CardDetailsGridElement from './components/UI/CardDetailsGridElement.vue'
import BaseSpinner from './components/UI/Base-Spinner.vue'
import BaseDialog from './components/UI/Base-Dialog.vue'
import BaseStaffList from './components/UI/BaseStaffList.vue';


import './base.css'
import BaseCardGrid from './components/UI/BaseCardGrid.vue';
const app =createApp(App);
app.component('base-card',BaseCard);
app.component('base-badge',BaseBadge)
app.component('base-card-grid',BaseCardGrid);
app.component('base-grid',BaseGrid);
app.component('base-button',BaseButton);
app.component('base-primary-color-button',BasePrimaryColorButton);
app.component('base-secondary-color-button',BaseSecondaryColorButton)
app.component('base-primary-color-button-small',BasePrimaryColorButtonSmall);
app.component('base-secondary-color-button-small',BaseSecondaryColorButtonSmall)
app.component('base-list',BaseList);
app.component('base-staff-list',BaseStaffList)
app.component('card-details-grid-element',CardDetailsGridElement)
app.component('base-spinner',BaseSpinner);
app.component('base-button-container',BaseButtonContainer);
app.component('base-dialog',BaseDialog);
app.use(store);
app.use(router);

app.mount("#app");

