<script setup>
import { ref } from 'vue'

const props = defineProps({
  initialCode: {
    type: String,
    default: `// Write JavaScript here
// The 'root' element is available for rendering
const element = document.createElement('h3');
element.textContent = 'Hello from Live Editor!';
element.style.color = '#10b981';
root.appendChild(element);

console.log("Calculation:", 40 + 2);`
  }
})

const code = ref(props.initialCode)
const output = ref('')
const error = ref('')
const previewContainer = ref(null)

const runCode = () => {
  error.value = ''
  output.value = ''
  
  if (previewContainer.value) {
    previewContainer.value.innerHTML = ''
  }

  const logs = []
  
  const customConsole = {
    log: (...args) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
    },
    error: (...args) => {
      logs.push('Error: ' + args.join(' '))
    },
    warn: (...args) => {
      logs.push('Warn: ' + args.join(' '))
    }
  }

  try {
    // Create a function that takes 'console' and 'root' as arguments
    const func = new Function('console', 'root', code.value)
    
    // Execute the function
    func(customConsole, previewContainer.value)
    
    if (logs.length > 0) {
      output.value = logs.join('\n')
    }
  } catch (e) {
    error.value = e.toString()
  }
}
</script>

<template>
  <div class="live-editor">
    <div class="editor-pane">
      <div class="toolbar">
        <span class="label">JavaScript Editor</span>
        <button class="run-btn" @click="runCode">
          <span class="icon">▶</span> Run
        </button>
      </div>
      <div class="editor-container">
        <textarea v-model="code" spellcheck="false" placeholder="Enter your code here..."></textarea>
      </div>
    </div>
    <div class="preview-pane">
      <div class="toolbar">
        <span class="label">Result / Preview</span>
      </div>
      <div class="output-container">
        <div ref="previewContainer" class="dom-preview"></div>
        <div v-if="output" class="console-output">
          <div class="console-label">Console:</div>
          <pre>{{ output }}</pre>
        </div>
        <div v-if="error" class="error-output">
          <div class="console-label">Error:</div>
          <pre>{{ error }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-editor {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 2rem 0;
  background-color: var(--vp-c-bg);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .live-editor {
    flex-direction: row;
    height: 80vh;
  }
}

.editor-pane, .preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.editor-pane {
  border-bottom: 1px solid var(--vp-c-divider);
}

@media (min-width: 768px) {
  .editor-pane {
    border-bottom: none;
    border-right: 1px solid var(--vp-c-divider);
    flex: 0 0 40%;
  }
  .preview-pane {
    flex: 0 0 60%;
  }
}

.toolbar {
  padding: 0.75rem 1rem;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.run-btn {
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.run-btn:hover {
  background-color: var(--vp-c-brand-dark);
}

.editor-container {
  flex: 1;
  position: relative;
}

textarea {
  width: 100%;
  height: 100%;
  resize: none;
  padding: 1rem;
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  border: none;
  outline: none;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.output-container {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: var(--vp-c-bg-alt);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dom-preview {
  flex: 1;
  width: 100%;
  min-height: 50px;
}

.console-output, .error-output {
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: monospace;
}

.console-output {
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.error-output {
  background-color: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  color: #dc2626;
}

.console-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 0.25rem;
  font-weight: bold;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
