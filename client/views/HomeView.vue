
<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

// Define the posts array
let posts = ref<Array<Record<string, string>>>([]);


// Fetch posts on component mount
async function loadPosts() {
  try {
    const response = await fetchy("/api/posts", "GET");
    posts.value = response;
  } catch (error) {
    console.error("Failed to load posts:", error);
  }
}

onBeforeMount(loadPosts);
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <section v-if="isLoggedIn">
      <h2>Posts</h2>
      <PostListComponent :posts="posts" />
    </section>
  
  </main>
</template>

<style scoped>

body, main {
  background-color: #f3e8fd; 
  color: #4a2c6e;
  font-family: 'Arial', sans-serif;
  padding: 2em;
}

/* Header styling */
h1, h2 {
  text-align: center;
  color: #4a2c6e;
  font-weight: bold;
  margin-bottom: 0.5em;
}

/* General layout for sections */
section {
  background-color: #f3e8fd; /* Light lavender background */
  max-width: 800px;
  margin: 1em auto;
  padding: 1.5em;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Button styling */
button {
  background-color: #b385d2; /* Calming purple button */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5em 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #8e65b7; /* Darker purple on hover */
}
</style>

