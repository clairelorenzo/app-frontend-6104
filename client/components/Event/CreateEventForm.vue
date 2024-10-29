<!-- CreateEventForm.vue -->
<template>
  <form @submit.prevent="createEvent">
    <!-- Event Name Input -->
    <label for="name">Event Name:</label>
    <input id="name" v-model="name" placeholder="Event name" required />

    <!-- Start Time Input -->
    <label for="startTime">Start Time:</label>
    <input id="startTime" type="time" v-model="startTime" required />

    <!-- End Time Input -->
    <label for="endTime">End Time:</label>
    <input id="endTime" type="time" v-model="endTime" required />

    <!-- Event Type Selector -->
    <label for="options">Event Type:</label>
    <select v-model="options">
      <option value="focus">Focus</option>
      <option value="social">Social</option>
    </select>
    <h4> Select a Date Here!</h4>
    <!-- Calendar -->
    <div class="month">
      <ul>
        <li class="prev" @click="prevMonth">&#10094;</li>
        <li class="next" @click="nextMonth">&#10095;</li>
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
        v-for="n in getDaysInMonth(currentMonth, currentYear)" 
        :key="n" 
        @click="onDayClick(n)" 
        :class="{ active: selectedDate && selectedDate.getDate() === n && selectedDate.getMonth() === currentMonth }">
        <span>{{ n }}</span>
      </li>
    </ul>

    <!-- Display Selected Date -->
    <p v-if="selectedDate">Selected Date: {{ selectedDate.toLocaleDateString() }}</p>

    <!-- Submit Button -->
    <button type="submit" class="pure-button-primary pure-button">Add Event</button>
  </form>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const startTime = ref("");
const endTime = ref("");
const options = ref("social");
const selectedDate = ref<Date | null>(null);
const emit = defineEmits(["refreshEvents"]);
const { currentUsername } = storeToRefs(useUserStore());

const currentMonth = ref(new Date().getMonth()); // Current month (0-11)
const currentYear = ref(new Date().getFullYear()); // Current year

// Event creation function
const createEvent = async () => {
  try {
    await fetchy("/api/events", "POST", {
      body: { 
        author: currentUsername.value,
        name: name.value,
        startTime: `${selectedDate.value?.toISOString().split("T")[0]}T${startTime.value}`, 
        endTime: `${selectedDate.value?.toISOString().split("T")[0]}T${endTime.value}`, 
        options: { type: options.value } 
       },
    });
  } catch (_) {
    return;
  }
  emit("refreshEvents", currentUsername.value);
  emptyForm();
};

// Reset form fields
const emptyForm = () => {
  name.value = "";
  startTime.value = "";
  endTime.value = "";
  options.value = "social";
  selectedDate.value = null;
};

// Handle day click
function onDayClick(day: number) {
  selectedDate.value = new Date(currentYear.value, currentMonth.value, day);
}

// Navigate to previous month
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

// Navigate to next month
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

// Helper function to get days in the current month
function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
</script>

<style scoped>
/* Form and button styles */
form {
  background-color: #f3eaf7;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1.5em;
  box-shadow: 0 4px 8px rgba(150, 100, 190, 0.2);
}
h1, h2, h3, h4 {
  text-align: center;
  color: #7a3b99; /* darker purple for headings */
  font-weight: bold;
}
input, select {
  font-family: inherit;
  font-size: 1em;
  padding: 0.75em;
  border-radius: 0.5em;
  border: 1px solid #d4a5e2;
  background-color: #f8f3fc;
  color: #4b2e67;
}

button {
  font-size: 1em;
  padding: 0.75em 1em;
  color: white;
  background: linear-gradient(135deg, #d1a5e7, #7a3b99);
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: linear-gradient(135deg, #7a3b99, #d1a5e7);
}

button:active {
  background: #4b2e67;
}

/* Calendar styling */
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
  color: #2a0449;
  text-align: center;
}

.days {
  padding: 10px 0;
  background: #fbf7f0;
  margin: 0;
}

.days li {
  display: inline-block;
  width: 13.6%;
  text-align: center;
  margin-bottom: 5px;
  font-size: 12px;
  color: #2a0449;
  cursor: pointer;
}

.days li.active span {
  padding: 5px;
  background: #3c1373;
  color: white !important;
}

/* Add media queries for smaller screens */
@media screen and (max-width: 720px) {
  .weekdays li, .days li { width: 13.1%; }
}

@media screen and (max-width: 420px) {
  .weekdays li, .days li { width: 12.5%; }
  .days li.active span { padding: 2px; }
}

@media screen and (max-width: 290px) {
  .weekdays li, .days li { width: 12.2%; }
}
</style>
