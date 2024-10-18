<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["postId"]); // Pass post ID to associate the comment with the post
const content = ref("");
const emit = defineEmits(["refreshComments"]);

const createComment = async (content: string) => {
  try {
    await fetchy(`/api/comments/`, "POST", {
      body: { postId: props.postId, content: content },
    });
  } catch (_) {
    return;
  }
  emit("refreshComments", props.postId);
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createComment(content)">
    <label for="content">Comment:</label>
    <textarea id="content" v-model="content" placeholder="Add a comment" required></textarea>
    <button type="submit" class="pure-button-primary pure-button">Comment</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  height: 4em;
  resize: none;
}
</style>