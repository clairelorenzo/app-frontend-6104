

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth } from 'date-fns';
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from 'vue';
import CreateEventForm from "../components/Event/CreateEventForm.vue";
import DeleteEventComponent from "../components/Event/DeleteEventComponent.vue";

// Initial calendar state
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDate = ref<Date | null>(null);
const editingEvent = ref<string | null>(null);
const deletingEvent = ref<string | null>(null);
// Get user data
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let events = ref<Array<Record<string, string>>>([]);

async function loadEvents() {
  try {
    const response = await fetchy("/api/events", "GET", { query: { author: currentUsername.value } });
    events.value = response;
  } catch (error) {
    console.error("Failed to load events:", error);
  }
}

// Fetch events when component mounts
onMounted(loadEvents);

// Calendar calculations
const daysInMonth = computed(() => {
  const start = startOfMonth(new Date(currentYear.value, currentMonth.value));
  const end = endOfMonth(start);
  return eachDayOfInterval({ start, end });
});

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Filter events for the selected date
const filteredEventsForSelectedDay = computed(() => {
  if (!selectedDate.value) return [];
  return events.value.filter(event => {
    const eventStart = new Date(event.startTime);
    return isSameDay(eventStart, selectedDate.value? selectedDate.value : new Date()); // Compare both dates
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
});

// Handle day clicks
function onDayClick(date: Date) {
  selectedDate.value = date;
}

// Change month
function changeMonth(offset: number) {
  const newDate = addMonths(new Date(currentYear.value, currentMonth.value), offset);
  currentMonth.value = newDate.getMonth();
  currentYear.value = newDate.getFullYear();
}

function editSelectedEvent(event_id: string) {
  editingEvent.value = event_id;
}


function deleteSelectedEvent(event_id: string) {
  deletingEvent.value = event_id;
}


function onEventEdited() {
  editingEvent.value = null;
  loadEvents(); // Refresh events after edit
}

function onEventDeleted() {
  deletingEvent.value = null;
  loadEvents(); // Refresh events after delete
  deletingEvent.value = null;
}

function cancelEdit() {
  editingEvent.value = null;
}

function cancelDelete() {
  deletingEvent.value = null;
}
</script>
<template>
  <div>
    <h1 font="Georgia">Calendar</h1>
    <h2 font="Georgia">Click on a Date to View Your Events:</h2>
    <div class="month">
      <ul>
        <li class="prev" @click="changeMonth(-1)">&#10094;</li>
        <li class="next" @click="changeMonth(1)">&#10095;</li>
        <li>
          {{ monthNames[currentMonth] }}<br>
          <span style="font-size:18px">{{ currentYear }}</span>
        </li>
      </ul>
    </div>

    <ul class="weekdays">
      <li v-for="day in weekdays" :key="day">{{ day }}</li>
    </ul>

    <ul class="days">
      <li
        v-for="(day, index) in daysInMonth"
        :key="index"
        :class="{ active: selectedDate && isSameDay(day, selectedDate) }"
        @click="onDayClick(day)"
      >
        <span :class="{ active: selectedDate && day.getDate() === selectedDate.getDate() }">
          {{ day.getDate() }}
        </span>
      </li>
    </ul>

    <!-- Display events for selected day -->
    <div v-if="selectedDate">
      <h3>Events for {{ format(selectedDate, 'yyyy-MM-dd') }}</h3>
      <ul v-if="filteredEventsForSelectedDay.length">
        <li v-for="event in filteredEventsForSelectedDay" :key="event._id">
          <strong>{{ event.name }}</strong>:
          {{ format(new Date(event.startTime), 'HH:mm') }} - 
          {{ format(new Date(event.endTime), 'HH:mm') }}
          <button @click="deleteSelectedEvent(event._id)" class="btn-danger">Delete</button>
        </li>
        <ul v-if="deletingEvent">
            <DeleteEventComponent event_id="event._id"></DeleteEventComponent>
          </ul>

      </ul>
      <p v-else>No events for this day.</p>
    </div>
    <h2 text-align> Add a New Event to Your Schedule!</h2>
    <CreateEventForm></CreateEventForm>
  </div>
</template>
<style scoped>
* {box-sizing: border-box;}
ul {list-style-type: none;}
body {font-family: Verdana, sans-serif;}
h1, h2, h3, h4 {
  text-align: center;
  color: #7a3b99; /* darker purple for headings */
  font-weight: bold;
}
.month {
  padding: 70px 25px;
  width: 100%;
  background: #c794ec;
  text-align: center;
}

.month ul {
  margin: 0;
  padding: 0;
}

.month ul li {
  color: white;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.month .prev {
  float: left;
  padding-top: 10px;
}

.month .next {
  float: right;
  padding-top: 10px;
}

.weekdays {
  margin: 0;
  padding: 10px 0;
  background-color: #fdf3e4;
}

.weekdays li {
  display: inline-block;
  width: 13.6%;
  color:#2a0449;
  text-align: center;
}

.days {
  padding: 10px 0;
  background: #fbf7f0;
  margin: 0;
}

.days li {
  list-style-type: none;
  display: inline-block;
  width: 13.6%;
  text-align: center;
  margin-bottom: 5px;
  font-size:12px;
  color: #2a0449;
  cursor: pointer;
}

.days li .active {
  padding: 5px;
  background: #3c1373;
  color: white !important
}

@media screen and (max-width:720) {
  .weekdays li, .days li {width: 13.1%;}
}

@media screen and (max-width: 420px) {
  .weekdays li, .days li {width: 12.5%;}
  .days li .active {padding: 2px;}
}

@media screen and (max-width: 290px) {
  .weekdays li, .days li {width: 12.2%;}
}
</style>

