<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const posts = ref<Array<Record<string, any>>>([]);
const goals = ref<Array<Record<string, any>>>([]);

// Load user's posts and goals on component mount
async function loadProfileData() {
  if (!currentUsername.value) return;

  try {
    // Fetch posts
    const postsResponse = await fetchy(`/api/posts`, "GET", { query: { author: currentUsername.value } });
    posts.value = postsResponse || [];

    // Fetch goals
    const goalsResponse = await fetchy(`/api/goals`, "GET", { query: { author: currentUsername.value } });
    goals.value = goalsResponse || [];
  } catch (error) {
    console.error("Failed to load profile data:", error);
  }
}

onMounted(loadProfileData);
</script>

<template>
  <main v-if="isLoggedIn">
    <h1>{{ currentUsername }}'s profile</h1>

    <!-- User's Posts Section -->
    <section class="profile-section">
      <h2>Posts</h2>
      <ul v-if="posts.length">
        <li v-for="post in posts" :key="post._id" class="post-item">
          <p><strong>{{ post.author }}:</strong> {{ post.content }}</p>
          <p class="post-timestamp">Posted on: {{ new Date(post.dateCreated).toLocaleDateString() }}</p>
          <p v-if="post.dateUpdated !== post.dateCreated" class="post-timestamp">Edited on: {{ new Date(post.dateUpdated).toLocaleDateString() }}</p>
        </li>
      </ul>
      <p v-else>No posts yet.</p>
    </section>

    <!-- User's Goals Section -->
    <section class="profile-section">
      <h2>Goals</h2>
      <ul v-if="goals.length">
        <li v-for="goal in goals" :key="goal._id" class="goal-item">
          <p><strong>{{ goal.title }}</strong></p>
          <p>{{ goal.description }}</p>
          <p>Status: {{ goal.completed ? "Completed" : "In Progress" }}</p>
          <p>Due Date: {{ new Date(goal.dueDate).toLocaleDateString() }}</p>
        </li>
      </ul>
      <p v-else>No goals set yet.</p>
    </section>
  </main>

  <section v-else>
    <h2>Please login to view your profile.</h2>
  </section>
</template>

<style scoped>
/* General page background */
main {
  background-color: #f3e8ff; /* light purple */
  padding: 2em;
  font-family: Arial, sans-serif;
  color: #4b2e67; /* deep purple */
}

/* Centering titles and adding padding */
h1, h2 {
  text-align: center;
  font-weight: bold;
  color: #7a3b99; /* slightly darker purple */
  margin-bottom: 1em;
}

/* Section styling for consistent spacing */
.profile-section {
  background-color: #fdf3e4;
  margin: 2em auto;
  padding: 1.5em;
  border-radius: 12px;
  border: 1px solid #d1a5e7; /* light border for contrast */
  max-width: 600px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

/* List styling */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.post-item, .goal-item {
  padding: 0.5em 0;
  border-bottom: 1px solid #eee;
  transition: background 0.3s ease;
}

/* Add hover effect to make items interactive */
.post-item:hover, .goal-item:hover {
  background-color: #efe2fc; /* subtle purple hover effect */
}

/* Styling for the last list item */
.post-item:last-child, .goal-item:last-child {
  border-bottom: none;
}

/* Timestamp styling for subtle display */
.post-timestamp {
  font-size: 0.85em;
  color: #7a3b99;
}

/* Responsive styling for mobile screens */
@media (max-width: 600px) {
  .profile-section {
    padding: 1em;
  }
}
</style>
