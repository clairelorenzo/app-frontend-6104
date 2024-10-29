<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="title">
        <RouterLink :to="{ name: 'Home' }">
          <h1>glow</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> 
            <img src="@/assets/images/home.svg" alt="Home" class="icon" />
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'My Profile' }" :class="{ underline: currentRouteName == 'My Profile' }"> 
            <img src="@/assets/images/profile.svg" alt="My Profile" class="icon" />
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Goals' }" :class="{ underline: currentRouteName == 'Goals' }"> 
            <img src="@/assets/images/goals.svg" alt="Goals" class="icon" />
          </RouterLink>
        </li>

        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Calendar' }" :class="{ underline: currentRouteName == 'Calendar' }">
            <img src="@/assets/images/calendar.svg" alt="Calendar" class="icon" />
          </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> 
            <img src="@/assets/images/settings.svg" alt="Settings" class="icon" />
          </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

/* Navbar styles */
nav {
  padding: 0.5em 1.5em; /* Make navbar narrower */
  background-color: #fdf3e4; /* Off-white background */
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

/* Logo and title styling */
.title {
  display: flex;
  align-items: center;
  gap: 0.4em;
}

h1 {
  font-size: 2em;
  margin: 0;
  font-weight: bold;
  background: linear-gradient(90deg, #bf79da, #5f2279, #341539); /* Purple ombre gradient */
  -webkit-background-clip: text;
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
  color: transparent;
  background-clip: text;
  text-shadow: 0px 0px 4px rgba(155, 89, 182, 0.3);
}
img {
  height: 2em;
}

/* Link and icon styling */
a {
  font-size: large;
  color: #333;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.icon {
  width: 1.5em;
  height: 1.5em;
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1));
}

.underline {
  text-decoration: underline;
}
</style>
