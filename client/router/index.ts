import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useSettingsStore } from "@/stores/settings"; // Import settings store to check focus mode
import { useUserStore } from "@/stores/user";
import CalendarView from "../views/CalendarView.vue";
import FocusModeView from "../views/FocusModeView.vue"; // Page to show when focus mode is active
import GoalsView from "../views/GoalsView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/profile",
      name: "My Profile",
      component: ProfileView,
    },
    {
      path: "/calendar",
      name: "Calendar",
      component: CalendarView,
    },
    {
      path: "/goals",
      name: "Goals",
      component: GoalsView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/focus-mode",
      name: "FocusMode",
      component: FocusModeView,
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent unauthorized access during focus mode.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());
  const settingsStore = useSettingsStore(); // Access settings store directly to use actions and state
  const { isFocusMode } = storeToRefs(settingsStore);

  // Check if authentication is required and user is logged in
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }

  // Restrict all routes except the settings page when focus mode is active
  if (isFocusMode.value && to.name !== "Settings" && to.name !== "FocusMode") {
    return { name: "FocusMode" }; // Redirect to focus mode message page
  }
});

export default router;
