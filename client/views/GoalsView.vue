<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const posts = ref<Array<Record<string, any>>>([]);
const goals = ref<Array<Record<string, any>>>([]);
const otherGoals = ref<Array<Record<string, any>>>([]);

// Load user's posts and goals on component mount
async function loadUserGoals() {
  if (!currentUsername.value) return;

  try {
    // Fetch goals
    const goalsResponse = await fetchy(`/api/goals`, "GET", { query: { author: currentUsername.value } });
    goals.value = goalsResponse || [];
  } catch (error) {
    console.error("Failed to load goals:", error);
  }
}
async function loadOtherUserGoals() {
  if (!currentUsername.value) return;

  try {
    // Fetch goals
    const goalsResponse = await fetchy(`/api/goals`, "GET", {query: { excludeAuthor: currentUsername.value }});
    otherGoals.value = goalsResponse || [];
  } catch (error) {
    console.error("Failed to load goals:", error);
  }
}

onMounted(loadUserGoals);
</script>

<template>
  <main v-if="isLoggedIn">
    <h1>{{ currentUsername }}'s Profile</h1>

    <section class="goals-section">
      <h2>My Goals</h2>
      <ul v-if="goals.length">
        <li v-for="goal in goals" :key="goal._id" class="goal-item">
          <p><strong>{{ goal.title }}</strong></p>
          <p>{{ goal.description }}</p>
          <p>Status: {{ goal.options.completed ? "Completed" : "In Progress" }}</p>
    
        </li>
      </ul>
      <p v-else>No goals set yet.</p>
    </section>
    <section class="goals-section">
      <h2>Friends' Goals</h2>
      <ul v-if="otherGoals.length">
        <li v-for="goal in otherGoals" :key="goal._id" class="goal-item">
          <p><strong>{{ goal.title }}</strong></p>
          <p>{{ goal.description }}</p>
          <p>Status: {{ goal.options.completed ? "Completed" : "In Progress" }}</p>
        </li>
      </ul>
      <p v-else>You're up to date on your friends' goals!</p>
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

.goals-section {
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
