<script setup lang="ts">
import CreateEventComponent from "@/components/Event/CreateEventForm.vue";
import DeleteEventComponent from "@/components/Event/DeleteEventComponent.vue";
import EditEventForm from "@/components/Event/EditEventForm.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { format, isSameDay } from "date-fns"; // Useful for date formatting and comparisons
import { storeToRefs } from "pinia";
import 'v-calendar/style.css';
import { computed, onBeforeMount, ref } from "vue";


const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const deletingEventId = ref<string | null>(null);
let events = ref<Array<Record<string, string>>>([]);
let selectedDate = ref<Date | null>(null); // Stores the selected date
const eventToEdit = ref<string | null>(null);
// Fetch posts on component mount
async function loadEvents() {
  try {
    const response = await fetchy("/api/events", "GET", {query:{author: currentUsername.value}});
    events.value = response;
  } catch (error) {
    console.error("Failed to load events:", error);
  }
}

onBeforeMount(loadEvents);

// Format the events for VCalendar
const formattedEvents = computed(() => {
  return events.value.map(event => ({
    key: event._id,  // Unique key for each event
    dates: { start: new Date(event.startTime), end: new Date(event.endTime) },  // Date range
    content: event.name,  // Event title to show on hover
    barColor: '#4caf50',  // Bar color for the event
    popover: { label: event.name },  // Tooltip when hovering over the event
  }));
});

// Filter events for the selected date
const filteredEventsForSelectedDay = computed(() => {
  if (!selectedDate.value) return []; // No date selected
  return events.value.filter(event => {
    const eventStart = new Date(event.startTime);
    return isSameDay(eventStart, selectedDate.value? selectedDate.value:new Date()); // Filter by same day
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()); // Sort by start time
});

function closeEditForm() {
  eventToEdit.value = null; // Reset eventToEdit to hide EditEventForm
}
function closeDeleteForm() {
  deletingEventId.value = null;
}
// Handle when a day is clicked
function onDayClick({ date }: { date: Date }) {
  selectedDate.value = new Date(date); // Ensure date is a Date object
}
// Function to set the selected event for editing
function editSelectedEvent(event_id: string) {
  eventToEdit.value = event_id; // Set the event to be edited
}
function deleteSelectedEvent(event_id: string) {
  deletingEventId.value = event_id;
}

</script>

<template>
    <main>
      <h1>Calendar</h1>
      <section v-if="isLoggedIn">
        <h2>Events for {{ currentUsername }}</h2>
        
  
        <!-- Show selected day's events -->
        <div v-if="selectedDate">
          <h3>Events for {{ format(selectedDate, 'yyyy-MM-dd') }}</h3>
          <ul v-if="filteredEventsForSelectedDay.length">
            <li v-for="event in filteredEventsForSelectedDay" :key="event._id">
              <strong>{{ event.name }}</strong>: 
              {{ format(new Date(event.startTime), 'HH:mm') }} - 
              {{ format(new Date(event.endTime), 'HH:mm') }}
              <button @click="editSelectedEvent(event._id)">Edit</button>
              <button @click="deleteSelectedEvent(event._id)" class="btn-danger">Delete</button>
              <EditEventForm
                v-if="eventToEdit"
                :event_id="eventToEdit"
                @editEvent="loadEvents, closeEditForm"
                @refreshEvents="loadEvents"
                @cancelEdit="closeEditForm"
            />
            <DeleteEventComponent 
                v-if="deletingEventId" 
                :event_id="deletingEventId" 
                @deleteEvent="loadEvents, closeDeleteForm" 
                @cancelDelete="closeDeleteForm" 
            />
            </li>
          </ul>
          <p v-else>No events for this day.</p>
        </div>
        <div v-else>
            <h3>Events for {{ format(new Date(), 'yyyy-MM-dd') }}</h3>
            <li v-for="event in filteredEventsForSelectedDay" :key="event._id">
              <strong>{{ event.name }}</strong>: 
              {{ format(new Date(event.startTime), 'HH:mm') }} - 
              {{ format(new Date(event.endTime), 'HH:mm') }}
              <button @click="editSelectedEvent(event._id)">Edit</button>
              <button @click="deleteSelectedEvent(event._id)" class="btn-danger">Delete</button>
            </li>
            
        </div>
        <EditEventForm
                v-if="eventToEdit"
                :event_id="eventToEdit"
                @editEvent="loadEvents, closeEditForm"
                @refreshEvents="loadEvents"
                @cancelEdit="closeEditForm"
            />
        <DeleteEventComponent 
            v-if="deletingEventId" 
            :event_id="deletingEventId" 
            @deleteEvent="loadEvents, closeDeleteForm" 
            @cancelDelete="closeDeleteForm" 
      />
      </section>
      
  
      <section v-else>
        <h2>Please login to view your calendar.</h2>
      </section>
      <vc-calendar
          :attributes="formattedEvents"
          is-range
          :week-start="1"
          :show-date-header="true"
          mode="month"
          @dayclick="onDayClick" 
        />
      <CreateEventComponent></CreateEventComponent>
        
        <!-- VCalendar Component with Events -->
        
    </main>
  </template>
  
  <style scoped>
h1, h2 {
  text-align: center;
  color: #4b2e67; /* Deep purple for headers */
}

main {
  max-width: 900px;
  margin: 2em auto;
  background-color: #f3eaf7; /* Light lavender background */
  padding: 1em;
  border-radius: 1em;
  box-shadow: 0 4px 8px rgba(150, 100, 190, 0.2); /* Soft shadow */
}

.calendar {
  max-width: 100%;
  margin: 2em auto;
}

.event-content {
  background-color: #a770d1; /* Soft purple for event content */
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5em 0;
  background-color: #f8f3fc; /* Soft background for events */
  border-left: 4px solid #4b2e67; /* Border to indicate event item */
  padding: 0.5em 1em;
  border-radius: 0.5em;
}

button {
  font-size: 1em;
  padding: 0.4em 0.8em;
  margin-left: 0.5em;
  color: white;
  background: linear-gradient(135deg, #d1a5e7, #7a3b99);
  border: none;
  border-radius: 0.4em;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: linear-gradient(135deg, #7a3b99, #d1a5e7); /* Darker purple on hover */
}

button:active {
  background: #4b2e67; /* Deep purple when clicked */
}

.btn-danger {
  background: linear-gradient(135deg, #d14b4b, #7a1b1b); /* Gradient for delete button */
}

h3 {
  margin-top: 1.5em;
  color: #4b2e67;
}

div {
  max-width: 250px;
  min-width: 200px;
  display: inline-block;
  vertical-align: top;
}
</style>
