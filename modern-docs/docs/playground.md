---
sidebar: false
aside: false
pageClass: playground-page
---

<div class="playground-header">
  <h1 class="playground-title">Playground</h1>
  <p class="playground-description">Try out the JavaScript code below. You can edit the code on the left and click "Run" to see the result on the right.</p>
</div>

<script setup>
import { ref, onMounted } from 'vue'

// Default demo code
const defaultCode = `// Define the data
const columnIds = ['id', 'name', 'age', 'score'];
const columnNames = ['Case', 'Name', 'Age', 'Score'];
const rowData = [
  [1, 'Alice', '12', '85'],
  [2, 'Bob', '13', '90'],
  [3, 'Charlie', '12', '88'],
  [4, 'David', '11', '92'],
  [5, 'Eve', '13', '87']
];
const metaData = {
  "fields": [{
      name: "Case",
      id: "id",
  },{
      name: "Name",
      id: "name",
  },{
      name: "Age",
      id: "age",
  },{
      name: "Score",
      id: "score",
  }]
};

// Render the TuvaDataTools component
// ReactDOM.render returns the component instance which has an 'actions' property
const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData
  }),
  root
);

console.log('Rendered successfully!');
if (tuvaDataTools && tuvaDataTools.actions) {
  console.log('Available actions:', Object.keys(tuvaDataTools.actions));
} else {
  console.log('Component instance created but actions not yet available');
}`

// Check for code from sessionStorage BEFORE initializing the ref
// This ensures the stored code is used from the start
let initialCode = defaultCode
if (typeof window !== 'undefined') {
  const storedCode = sessionStorage.getItem('liveEditorCode')
  const timestamp = sessionStorage.getItem('liveEditorCodeTimestamp')
  
  console.log('Playground initializing, checking for stored code...')
  console.log('Stored code found:', storedCode ? storedCode.substring(0, 50) + '...' : 'none')
  console.log('Timestamp:', timestamp)
  
  // Only use stored code if it's recent (within last 10 seconds) to avoid stale data
  if (storedCode && timestamp) {
    const codeAge = Date.now() - parseInt(timestamp, 10)
    console.log('Code age:', codeAge, 'ms')
    if (codeAge < 10000) {
      console.log('Using stored code')
      initialCode = storedCode
      sessionStorage.removeItem('liveEditorCode')
      sessionStorage.removeItem('liveEditorCodeTimestamp')
    } else {
      console.log('Code too old, ignoring')
    }
  } else {
    console.log('No stored code or timestamp found')
  }
}

const demoCode = ref(initialCode)

onMounted(() => {
  if (typeof window !== 'undefined') {
    
    // Expose function to set code from parent window
    window.setEditorCode = (code) => {
      demoCode.value = code
      // Wait for Vue to update, then trigger run
      setTimeout(() => {
        const editor = document.querySelector('.live-editor textarea')
        if (editor) {
          editor.dispatchEvent(new Event('input', { bubbles: true }))
        }
        setTimeout(() => {
          const runBtn = document.querySelector('.run-btn')
          if (runBtn) {
            runBtn.click()
          }
        }, 100)
      }, 100)
    }
  }
})
</script>

<LiveEditor :initialCode="demoCode" />
