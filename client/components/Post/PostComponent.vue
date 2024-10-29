<script setup lang="ts">
import CommentListComponent from "@/components/Comment/CommentListComponent.vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post", "showComments"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};
</script>

<template>
  <div class="post-container">
    <p class="author">{{ props.post.author }}</p>
    <p>{{ props.post.content }}</p>
    <div class="base">
      <menu v-if="props.post.author == currentUsername">
        <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
        <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
    </div>
    <CommentListComponent v-if="props.showComments" :postId="props.post._id" />
  </div>
</template>

<style scoped>
.template {
  background-color: #fdf3e4;
}
.post-container {
  background-color: #f3e8ff; /* Light purple background */
  border: 1px solid #c794ec; /* Soft purple border */
  border-radius: 8px;
  padding: 1em;
  margin: 1em 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

p {
  margin: 0em;
  color: #4b2e67; /* Deep purple text color */
}

.author {
  font-weight: bold;
  font-size: 1.2em;
  color: #7a3b99; /* Darker purple for author */
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
  color: #4b2e67; /* Deep purple for timestamp */
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}

/* Button styling for delete */
.button-error {
  background-color: #ff6666; /* Red background for delete button */
  color: white; /* White text */
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.button-error:hover {
  background-color: #ff4c4c; /* Darker red on hover */
}

.btn-small {
  background-color: #c794ec; /* Soft purple background for buttons */
  color: white; /* White text */
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-small:hover {
  background-color: #b378d1; /* Darker soft purple on hover */
}
</style>
