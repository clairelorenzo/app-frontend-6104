<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import CreateGoalForm from "../components/Goal/CreateGoalForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const goals = ref<Array<Record<string, any>>>([]);
const otherGoals = ref<Array<Record<string, any>>>([]);

// Load user's goals on component mount
async function loadUserGoals() {
  try {
    const goalsResponse = await fetchy(`/api/goals`, "GET", { query: { author: currentUsername.value } });
    goals.value = goalsResponse;
  } catch (error) {
    console.error("Failed to load goals:", error);
  }
}

// Update goal status
async function toggleGoalStatus(goalId: string, newStatus: boolean) {
  try {
    await fetchy(`/api/goals/${goalId}`, "PATCH", {
      body: { options: { completed: newStatus } },
    });
    loadUserGoals(); // Refresh the goals list after updating
  } catch (error) {
    console.error("Failed to update goal status:", error);
  }
}

onMounted(loadUserGoals);
</script>

<template>
  <main v-if="isLoggedIn">
    <h1>{{ currentUsername }}'s goals page</h1>

    <section class="goals-section">
      <h2>My Goals</h2>
      <ul v-if="goals.length">
        <li v-for="goal in goals" :key="goal._id" class="goal-item">
          <label>
            <input 
              type="checkbox" 
              :checked="goal.options.completed" 
              @change="toggleGoalStatus(goal._id, !goal.options.completed)"
            />
            
          </label>
          <span><strong>{{ goal.content }}</strong></span>
          <p>Status: {{ goal.options.completed ? "Completed" : "In Progress" }}</p>
        </li>
      </ul>
      <p v-else>No goals set yet.</p>
    </section>

    <CreateGoalForm @refreshPosts="loadUserGoals" />
    <section class="goals-section">
  <h2>Friends' Goals</h2>
  <ul v-if="goals.length">
    <li v-for="goal in goals" :key="goal._id" class="goal-item">
      <ul v-if="goal.author != currentUsername">
        <p>Author: {{ goal.author }}</p>
        <span><strong>{{ goal.content }}</strong></span>
        <p>Status: {{ goal.options.completed ? "Completed" : "In Progress" }}</p>
      </ul>
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
main {
  background-color: #f3e8ff; /* Light purple background */
  font-family: 'Arial', sans-serif;
  color: #4b2e67;
  padding: 2em;
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
  background-color: #fdf3e4;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.5em 0;
  border-bottom: 1px solid #eee;
}

input[type="checkbox"] {
  transform: scale(1.2);
  accent-color: #7a3b99; /* Purple checkbox color */
}

h1, h2 {
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
}

button:hover {
  background: #d1a5e7;
}
</style>
