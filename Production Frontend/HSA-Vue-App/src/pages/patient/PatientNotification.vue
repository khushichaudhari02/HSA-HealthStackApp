<template>
  <section>
    <h2>Your Notifications</h2>
    <base-card v-if="notificationsTotal">
      <h3>Total Unseen Notifications: <base-badge mode="elegant">{{ notificationsTotal }}</base-badge></h3>
      <ul>
        <NotificationItem
          v-for="(item, index) of notificationsItems"
          :key="item?.appointmentId"
          :message="item?.message"
          :onClickPath="item?.onClickPath"
          :id="item?.appointmentId"
          :index="index"
        ></NotificationItem>
      </ul>
    </base-card>
    <base-card v-if="seenNotificationsTotal">
      <h3>Total Seen Notifications: <base-badge mode="elegant">{{ seenNotificationsTotal }}</base-badge></h3>
      <ul>
        <NotificationItem
          v-for="item in seenNotificationsItems"
          :key="item?.appointmentId"
          :message="item?.message"
          :id="item?.appointmentId"
          :onClickPath="item?.onClickPath"
        ></NotificationItem>
      </ul>
    </base-card>
  </section>
</template>

<script>
import NotificationItem from '../../components/patient/NotificationItem.vue';

export default {
  components: {
    NotificationItem,
  },
  computed: {
    notificationsTotal() {
      return this.$store.getters['patient/notificationsCount'] ?? 0;
    },
    notificationsItems() {
      return this.$store.getters['patient/notifications'] ?? [];
    },
    seenNotificationsItems(){
      return this.$store.getters['patient/seenNotifications'] ?? [];
    },
    seenNotificationsTotal(){
      return this.$store.getters['patient/seenNotificationsCount'] ?? 0;
    }
  },
  async created(){
    try {
      await this.$store.dispatch('patient/fetchNotifications');
    } catch(err) {
      // console.log(err);
    }
  }
};
</script>

<style scoped>
section {
  margin: 2rem auto;
 max-width: 100%;;
    flex:1;
}

h2 {
  color: #292929;
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 1rem;
}

h3 {
 text-align: center;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>