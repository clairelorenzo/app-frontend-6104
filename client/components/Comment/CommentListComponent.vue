<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
const props = defineProps(["postId"]);
const comments = ref<Array<Record<string,string>>>([]);

const loadComments = async () => {
  try {
    comments.value = await fetchy(`/api/comments/`, "GET", {body:{postId: props.postId}});
  } catch (e) {
    console.error("Error loading comments", e);
  }
};

onBeforeMount(loadComments);
</script>

<template>
  <section>
    <h3>Comments</h3>
    <div v-if="comments.length">
      <article v-for="comment in comments" :key="comment._id">
        <p><strong>{{ comment.author }}:</strong> {{ comment.content }}</p>
      </article>
    </div>
    <p v-else>No comments yet.</p>
  </section>
</template>

<style scoped>
section {
  margin-top: 1em;
}
article {
  background-color: var(--comment-bg);
  border-radius: 4px;
  padding: 1em;
  margin-bottom: 1em;
}
</style>