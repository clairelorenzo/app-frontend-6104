<!-- need to implement-->
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const startTime = ref("");
const endTime = ref("");
const options = ref("social"); // Default event type to 'focus'
const emit = defineEmits(["refreshEvents"]);
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const createEvent = async () => {
  try {
    console.log(typeof(startTime.value));
    await fetchy("/api/events", "POST", {
      body: { 
        author: currentUsername.value,
        name: name.value,
        startTime: startTime.value, 
        endTime: endTime.value, 
        options: { type: options.value } 

       },
    });
  } catch (_) {
    return;
  }
  emit("refreshEvents", currentUsername.value);
  // emit("refreshComments", props.postId);
  emptyForm();
};

const emptyForm = () => {
    name.value = "";
  startTime.value = "";
  endTime.value = "";
  options.value = "social";
};
</script>
<!-- <h1>Create new event!</h1> -->
<template>
    <form @submit.prevent="createEvent">
      <label for="name">Event Name:</label>
      <input id="name" v-model="name" placeholder="Event name" required />
  
      <label for="startTime">Start Time:</label>
      <input id="startTime" type="datetime-local" v-model="startTime" required />
  
      <label for="endTime">End Time:</label>
      <input id="endTime" type="datetime-local" v-model="endTime" required />
  
      <label for="options">Event Type:</label>
      <select v-model="options">
        <option value="focus">Focus</option>
        <option value="social">Social</option>
      </select>
  
      <button type="submit" class="pure-button-primary pure-button">Add Event</button>
    </form>
  </template>
  
  <style scoped>
form {
  background-color: #f3eaf7; /* Light lavender background */
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1.5em;
  box-shadow: 0 4px 8px rgba(150, 100, 190, 0.2); /* Soft shadow with purple tint */
}

input, select, textarea {
  font-family: inherit;
  font-size: 1em;
  padding: 0.75em;
  border-radius: 0.5em;
  border: 1px solid #d4a5e2;
  background-color: #f8f3fc;
  color: #4b2e67; /* Dark purple for text */
}

input::placeholder, textarea::placeholder {
  color: #c1b1d6; /* Light purple for placeholder */
}

button {
  font-size: 1em;
  padding: 0.75em 1em;
  color: white;
  background: linear-gradient(135deg, #d1a5e7, #7a3b99);
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: linear-gradient(135deg, #7a3b99, #d1a5e7); /* Darker purple on hover */
}

button:active {
  background: #4b2e67; /* Deep purple when clicked */
}
</style>
