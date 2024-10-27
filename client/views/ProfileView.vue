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
    <h1>{{ currentUsername }}'s Profile</h1>

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
h1, h2 {
  text-align: center;
}

.profile-section {
  margin: 2em 0;
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

ul {
  list-style-type: none;
  padding: 0;
}

.post-item, .goal-item {
  padding: 0.5em 0;
  border-bottom: 1px solid #eee;
}

.post-item:last-child, .goal-item:last-child {
  border-bottom: none;
}

.post-timestamp {
  font-size: 0.8em;
  color: #666;
}

</style>
