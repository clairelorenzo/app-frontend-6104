<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps<{ event_id: string }>();
const emit = defineEmits(["editEvent", "refreshEvents", "cancelEdit"]);

// Ref to hold the edited values
const name = ref("");
const startTime = ref("")
const endTime = ref("") // Format to YYYY-MM-DDTHH:MM

// Function to edit the event
const editEvent = async () => {
  try {
    await fetchy(`/api/events/${props.event_id}`, "PATCH", {
      body: { name: name.value, startTime: startTime.value, endTime: endTime.value },
    });
    emit("editEvent");
    emit("refreshEvents");
  } catch (error) {
    console.error("Failed to edit event:", error);
  }
};
</script>

<template>
  <form @submit.prevent="editEvent">
    <h3>Edit Event</h3>
    <label for="name">Event Name:</label>
    <input type="text" v-model="name" placeholder="Event Name" required />

    <label for="startTime">Start Time:</label>
    <input type="datetime-local" v-model="startTime" required />

    <label for="endTime">End Time:</label>
    <input type="datetime-local" v-model="endTime" required />

    <div class="base">
      <button class="btn-small pure-button-primary pure-button" type="submit">Save</button>
      <button type="button" @click="emit('cancelEdit')">Cancel</button>
    </div>
    </form>
    
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

label {
  font-weight: bold;
}

input {
  font-family: inherit;
  font-size: inherit;
  border-radius: 4px;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  font-size: 0.9em;
  font-style: italic;
}
</style>
