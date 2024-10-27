<!-- need to implement-->
<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { defineEmits, defineProps } from "vue";

const props = defineProps<{ event_id: string }>();
const emit = defineEmits(["deleteEvent", "cancelDelete"]);

async function deleteEvent() {
  try {
    await fetchy(`/api/events/${props.event_id}`, "DELETE");
    emit("deleteEvent"); // Notify parent that the event was deleted
  } catch (error) {
    console.error("Failed to delete event:", error);
  }
}
</script>

<template>
  <div>
    <p>Are you sure you want to delete this event?</p>
    <button @click="deleteEvent" class="btn-danger">Confirm Delete</button>
    <button @click="emit('cancelDelete')">Cancel</button>
  </div>
</template>

<style scoped>
div {
  background-color: #f3e8f9;
  padding: 1em;
  border-radius: 10px;
  text-align: center;
}

p {
  color: #4b2e67;
  font-weight: 500;
  margin-bottom: 1em;
}

.btn-danger {
  background-color: #9b59b6; /* Softer purple for delete */
  color: white;
  border: none;
  padding: 0.6em 1.2em;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 0.5em;
  transition: background-color 0.3s;
}

.btn-danger:hover {
  background-color: #8e44ad; /* Darker shade on hover */
}

button {
  background-color: #4b2e67; /* Matching theme color for cancel */
  color: white;
  border: none;
  padding: 0.6em 1.2em;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3d2458;
}
</style>
