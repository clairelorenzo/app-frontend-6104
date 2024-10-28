<script setup lang="ts">
import router from "@/router";
import { useSettingsStore } from "@/stores/settings";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";
const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();
const settingsStore = useSettingsStore();
const { isFocusMode } = storeToRefs(settingsStore); // Use storeToRefs only for state properties
const toggleFocusMode = settingsStore.toggleFocusMode; // Access actions directly
async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="settings-container">
    <h1>Settings for {{ currentUsername }}</h1>
    <div class="focus-mode-container">
      <label>
        <input type="checkbox" :checked="isFocusMode" @change="toggleFocusMode" />
        Focus Mode
      </label>
    </div>
    <button class="button logout-button" @click="logout">Logout</button>
    <button class="button delete-button" @click="delete_">Delete User</button>
    <UpdateUserForm />
  </main>
</template>
<style scoped>
.settings-container {
  background-color: #e8e4f1; /* Light lavender background */
  color: #4b3d68; /* Darker purple for text */
  font-family: 'Arial', sans-serif; /* Change to your preferred font */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #5c4d8e; /* Medium purple for headings */
  margin-bottom: 20px;
  font-size: 2rem; /* Adjust font size */
}

.focus-mode-container {
  margin: 20px 0; /* Space around the checkbox */
}

label {
  font-size: 1.2rem; /* Font size for the checkbox label */
  cursor: pointer;
}

.button {
  background-color: #d4c8e0; /* Pastel lavender for general buttons */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  margin: 5px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #b0a1c8; /* Slightly darker pastel lavender on hover */
}

.logout-button {
  background-color: #4c33ef; /* Pastel orange for logout */
}

.delete-button {
  background-color: #600e72; /* Pastel pink for delete */
}


.logout-button:hover {
  background-color: #e6a532; /* Darker pastel orange on hover */
}

.delete-button:hover {
  background-color: #e27ab8; /* Darker pastel pink on hover */
}

.button:focus {
  outline: none; /* Remove outline */
}
</style>
