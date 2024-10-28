import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const isFocusMode = ref(false);

  function toggleFocusMode() {
    isFocusMode.value = !isFocusMode.value;
  }

  return { isFocusMode, toggleFocusMode };
});
