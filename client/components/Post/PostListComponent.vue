<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CommentListComponent from "../Comment/CommentListComponent.vue";
import CreateCommentForm from "../Comment/CreateCommentForm.vue";
import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

const comments = ref<Array<Record<string,string>>>([]);

async function loadComments(postId: string) {
  let commentResults;
  try {
    commentResults = await fetchy("/api/comments/", "GET", {body: {postId:postId}});
  } catch (_) {
    return;
  }
  comments.value = commentResults;
  
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
    <CreatePostForm @refreshPosts="getPosts" />
  </section>
  <div class="row">
    <h2 v-if="!searchAuthor">Posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm @getPostsByAuthor="getPosts" />
  </div>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent class="post-container" v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" showComments/>
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <CommentListComponent :postId="post._id" />
      <CreateCommentForm :postId="post._id" @refresh-comments="loadComments" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: #fdf3e4;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

/* Post styling */
.post-container {
  background-color: #f3e8fd;
  padding: 1em;
  margin: 0.5em 0;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);
  font-size: 0.95em;
  color: #3d1a52;
}

/* Comment styling */
.comment-container {
  /* background-color: #f7f2fc;  */
  padding: 0.5em;
  margin: 0.3em 0;
  border-radius: 5px;
  font-size: 0.85em;
  font: Georgia;
  color: #3d1a52;
}

</style>
