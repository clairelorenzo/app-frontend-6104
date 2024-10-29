<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const emit = defineEmits(["getPostsByAuthor"]);
</script>

<template>
  <form @submit.prevent="emit('getPostsByAuthor', author)" class="search-form">
    <fieldset>
      <legend>Search by Author</legend>
      <input id="author" type="text" v-model="author" placeholder="Username" class="author-input" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
.search-form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}

.author-input {
  border: 1px solid #ccc; /* Border for input field */
  border-radius: 4px; /* Rounded corners */
  padding: 0.5em; /* Padding inside the input */
  font-size: 1em; /* Font size */
  color: #3d1a52; /* Deep purple text color */
}

/* Optional: Styles for the button, if you want to customize further */
.pure-button {
  background-color: #c794ec; /* Light purple for button */
  color: white; /* White text color */
  border: none; /* Remove border */
  border-radius: 4px; /* Rounded corners */
  padding: 0.5em 1em; /* Padding for the button */
}

.pure-button:hover {
  background-color: #b583d7; /* Darker purple on hover */
}
</style>
