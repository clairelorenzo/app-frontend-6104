
<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

// Define the posts array
let posts = ref<Array<Record<string, string>>>([]);


// Fetch posts on component mount
async function loadPosts() {
  try {
    const response = await fetchy("/api/posts", "GET");
    posts.value = response;
  } catch (error) {
    console.error("Failed to load posts:", error);
  }
}

onBeforeMount(loadPosts);
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <section v-if="isLoggedIn">
      <h2>Posts</h2>
      <PostListComponent :posts="posts" />
    </section>
  
  </main>
</template>

<style scoped>
h1, h2 {
  text-align: center;
}
</style>
