import { createRouter, createWebHistory } from "vue-router";
import EditorDiff from "../views/EditorDiff.vue";
import EditorDouble from "../views/EditorDouble.vue";

const routes = [
  { path: "", redirect: { path: "/json-format" } },
  {
    path: '/json-format',
    component: EditorDouble
  },
  {
    path: '/url-parser',
    component: EditorDouble
  },
  {
    path: '/text-diff',
    component: EditorDiff
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
