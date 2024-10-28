<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const emit = defineEmits(["refreshGoals"]);

const createGoals = async (content: string, completed=false) => {
  try {
    await fetchy("/api/goals", "POST", {
      body: { content: content,  options: {completed: completed}},
    });
  } catch (_) {
    return;
  }
  emit("refreshGoals");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createGoals(content, completed)">
    <label for="content">Goal Content:</label>
    <textarea id="content" v-model="content" placeholder="Create a goal today!" required> </textarea>
    <label>
        <input
          type="checkbox"
          v-model="completed"
        />
        Completed
      </label>
      <button type="submit" class="pure-button-primary pure-button">Create A Goal Today</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
button {
  font-size: 1em;
  padding: 0.75em 1em;
  color: white;
  background:#7a3b99;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #d1a5e7; /* Darker purple on hover */
}

button:active {
  background: #4b2e67; /* Deep purple when clicked */
}
</style>


