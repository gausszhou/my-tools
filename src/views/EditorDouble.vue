<<template>
  <div id="editor-double"></div>
</template>

<script setup lang="ts">
import localforage from 'localforage';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { processContent } from '../utils/transform';
import {
  addCommandSave,
  addContainer,
  addEditorIntoManageList,
  createEditorContainer, 
  createEditorInstance, 
  createEditorModel, 
  disposeEditorList, 
  setModelLanguage
} from '../editor/editor';
import editorConsoleInstance from '../editor/console';

const code1 = `{"hello": "world", "foo": "bar"}`;
const code2 = ``;
const model1 = createEditorModel(code1, "javascript");
const model2 = createEditorModel(code2, "javascript");
const $container1 = createEditorContainer();
const $container2 = createEditorContainer();
const editor1 = createEditorInstance($container1, model1);
const editor2 = createEditorInstance($container2, model2, { readOnly: true }); // 第二个编辑器为只读

const route = useRoute();


async function save() {
  const code1 = model1.getValue();
  console.log(route.path)
  await localforage.setItem(`tool${route.path}`, code1)
  editorConsoleInstance.addConsole("\t[INFO]\t" + "Save Success")
}

async function fetch() {
  await localforage.getItem(`tool${route.path}`).then((value) => {
    if(route.path == '/json-format') {
      model1.setValue(value as string || code1)
    } 
    if(route.path == '/url-parser') {
      model1.setValue(value as string || window.location.href)
    }

    
  })
  editorConsoleInstance.addConsole("\t[INFO]\t" + "Fetch Success")
}

addCommandSave(editor1, async () => {
  save()
})

onMounted(async () => {
  addEditorIntoManageList(editor1);
  addEditorIntoManageList(editor2);
  addContainer(document.getElementById("editor-double") as HTMLElement, $container1);
  addContainer(document.getElementById("editor-double") as HTMLElement, $container2);
  await fetch()
  await excute()
});

watch(route, async () => {
  await fetch()
});


onUnmounted(() => {
  disposeEditorList()
});

async function excute() {
  const value1 = editor1.getValue();
  const type = route.path;
  try {
    const [value, flag] = await processContent(value1, type);
    editor2.setValue(value as string);
    if (flag === "unrealized") {
      editorConsoleInstance.addConsole("\t[WARN]\t" + "Format Unrealized");
    }
    if (flag === "success") {
      editorConsoleInstance.addConsole("\t[INFO]\t" + "Format Success");
    }
  } catch (error: any) {
    editor2.setValue("");
    editorConsoleInstance.addConsole("\t[Error]\t" + error.message);
  }
}

editor1.onDidChangeModelContent((e) => {
  excute();
});
</script>

<style scoped>
#editor-double {
  width: 100%;
  height: 100%;
  display: flex;
}

</style>

<style>
#editor-double .container {
  width: 50%;
  height: 100%;
}
</style>
