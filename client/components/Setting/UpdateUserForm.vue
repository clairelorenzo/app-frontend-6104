<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

let username = ref("");
let currentPassword = ref("");
let newPassword = ref("");

const { updateUserUsername, updateUserPassword, updateSession } = useUserStore();

async function updateUsername() {
  await updateUserUsername(username.value);
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUserPassword(currentPassword.value, newPassword.value);
  await updateSession();
  currentPassword.value = newPassword.value = "";
}
</script>

<template>
  <div class="update-user-container">
    <h2>Update user details</h2>
    <form @submit.prevent="updateUsername" class="form">
      <fieldset>
        <legend>Change your username</legend>
        <input type="text" placeholder="New username" v-model="username" required />
        <button type="submit" class="button update-button">Update username</button>
      </fieldset>
    </form>

    <form @submit.prevent="updatePassword" class="form">
      <fieldset>
        <legend>Change your password</legend>
        <input type="password" placeholder="Old password" v-model="currentPassword" required />
        <input type="password" placeholder="New password" v-model="newPassword" required />
        <button type="submit" class="button update-button">Update password</button>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
.update-user-container {
  background-color: #e8e4f1; /* Light lavender background */
  color: #4b3d68; /* Darker purple for text */
  font-family: 'Arial', sans-serif; /* Change to your preferred font */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #5c4d8e; /* Medium purple for headings */
  margin-bottom: 20px;
  font-size: 2rem; /* Adjust font size */
}

.form {
  margin-bottom: 20px; /* Space between forms */
}

fieldset {
  border: none; /* Remove fieldset border */
  margin: 10px 0; /* Margin for fieldset */
}

legend {
  font-weight: bold; /* Bold legend for form sections */
}

input[type="text"],
input[type="password"] {
  width: 100%; /* Full width inputs */
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #d0cde1; /* Light border for inputs */
  margin-bottom: 10px; /* Space below inputs */
}

input[type="text"]:focus,
input[type="password"]:focus {
  outline: none; /* Remove default outline */
  border-color: #5c4d8e; /* Dark purple border on focus */
}

.button {
  background-color: #d4c8e0; /* Pastel lavender for buttons */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #b0a1c8; /* Slightly darker pastel lavender on hover */
}
</style>
