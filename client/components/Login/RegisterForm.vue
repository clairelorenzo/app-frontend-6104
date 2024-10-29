<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  await createUser(username.value, password.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="register-form" @submit.prevent="register">
    <h3>Register User</h3>
    <fieldset>
      <div class="form-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="form-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="form-controls">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
body {
  background-color: #f3e6f7; /* Light purple background */
  font-family: 'Arial', sans-serif;
  color: #4b2e67;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.register-form {
  background-color: #ffffff;
  border-radius: 1em;
  padding: 2em;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #4b2e67;
  text-align: center;
  margin-bottom: 1em;
}

.form-group {
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  color: #7a3b99;
  margin-bottom: 0.5em;
}

input {
  font-family: inherit;
  font-size: 1em;
  padding: 0.5em;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #4b2e67;
}

button {
  font-size: 1em;
  padding: 0.75em 1em;
  color: white;
  background: #7a3b99;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
}

button:hover {
  background: #d1a5e7; /* Lighter purple on hover */
}
</style>
