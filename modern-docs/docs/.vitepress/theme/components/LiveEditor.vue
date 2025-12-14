<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  initialCode: {
    type: String,
    default: `// Write JavaScript here
// The 'root' element is available for rendering
// React, ReactDOM, and TuvaDataTools are available globally
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
const showConsole = ref(false)
const showError = ref(true)
const mountedComponent = ref(null)

const runCode = () => {
  error.value = ''
  output.value = ''
  
  // Properly unmount React component if it exists
  if (previewContainer.value) {
    // Always try to unmount first if ReactDOM is available
    if (window.ReactDOM) {
      try {
        // Unmount any existing React component
        window.ReactDOM.unmountComponentAtNode(previewContainer.value)
      } catch (e) {
        // If unmount fails (e.g., no component mounted), that's okay
      }
    }
    
    // Clear the container after unmounting
    previewContainer.value.innerHTML = ''
    mountedComponent.value = null
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
    // Wait for React and ReactDOM to be available
    if (!window.React || !window.ReactDOM) {
      error.value = 'React or ReactDOM not loaded. Please wait a moment and try again.'
      return
    }
    
    // Ensure container is ready
    if (!previewContainer.value) {
      error.value = 'Preview container not available'
      return
    }
    
    // Create a wrapper that captures any component instances created via ReactDOM.render
    let capturedInstance = null
    let originalRender = null
    
    if (window.ReactDOM && window.ReactDOM.render) {
      originalRender = window.ReactDOM.render.bind(window.ReactDOM)
      
      // Temporarily override ReactDOM.render to capture the instance
      window.ReactDOM.render = function(element, container, callback) {
        const instance = originalRender(element, container, callback)
        capturedInstance = instance
        return instance
      }
    }
    
    // Create a function that takes 'console', 'root', 'React', 'ReactDOM', and 'TuvaDataTools' as arguments
    const func = new Function('console', 'root', 'React', 'ReactDOM', 'TuvaDataTools', code.value)
    
    // Execute the function with a small delay to ensure DOM is ready after clearing
    setTimeout(() => {
      try {
        func(customConsole, previewContainer.value, window.React, window.ReactDOM, window.TuvaDataTools)
        
        // Restore original render after execution
        if (originalRender && window.ReactDOM) {
          window.ReactDOM.render = originalRender
        }
        
        // Store the component instance for cleanup
        if (capturedInstance && previewContainer.value) {
          mountedComponent.value = capturedInstance
        }
        
        if (logs.length > 0) {
          output.value = logs.join('\n')
        }
      } catch (innerError) {
        // Restore original render in case of error
        if (originalRender && window.ReactDOM) {
          window.ReactDOM.render = originalRender
        }
        
        let errorMsg = innerError.toString()
        if (errorMsg.includes('ReactDOM') || errorMsg.includes('render')) {
          errorMsg += '\n\nTip: Make sure ReactDOM is loaded. The scripts may still be loading.'
        }
        error.value = errorMsg
      }
    }, 50)
    
  } catch (e) {
    let errorMsg = e.toString()
    if (errorMsg.includes('ReactDOM') || errorMsg.includes('render')) {
      errorMsg += '\n\nTip: Make sure ReactDOM is loaded. The scripts may still be loading.'
    }
    error.value = errorMsg
  }
}

onMounted(() => {
  // Auto-run on mount if code is provided
  // Wait longer to ensure React and ReactDOM are loaded
  if (props.initialCode && props.initialCode.trim().length > 0) {
    let attempts = 0
    const maxAttempts = 20 // Wait up to 4 seconds
    
    const checkAndRun = () => {
      attempts++
      if (window.React && window.ReactDOM && window.TuvaDataTools) {
        setTimeout(() => {
          runCode()
        }, 200)
      } else if (attempts < maxAttempts) {
        // Retry after a short delay
        setTimeout(checkAndRun, 200)
      } else {
        error.value = 'Dependencies not loaded. React: ' + (window.React ? '✓' : '✗') + 
                      ', ReactDOM: ' + (window.ReactDOM ? '✓' : '✗') + 
                      ', TuvaDataTools: ' + (window.TuvaDataTools ? '✓' : '✗')
      }
    }
    checkAndRun()
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (mountedComponent.value && previewContainer.value && window.ReactDOM) {
    try {
      window.ReactDOM.unmountComponentAtNode(previewContainer.value)
    } catch (e) {
      // Ignore errors during cleanup
    }
  }
})
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
        <div ref="previewContainer" class="dom-preview" style="width: 100%; height: 100%;"></div>
        <div v-if="output || error" class="console-wrapper">
          <div v-if="output" class="console-output">
            <div class="console-header" @click="showConsole = !showConsole">
              <span class="console-label">Console</span>
              <button class="console-toggle" @click.stop="showConsole = !showConsole">
                {{ showConsole ? '▼' : '▲' }}
              </button>
            </div>
            <div v-show="showConsole" class="console-content">
              <pre>{{ output }}</pre>
            </div>
          </div>
          <div v-if="error" class="error-output">
            <div class="console-header" @click="showError = !showError">
              <span class="console-label">Error</span>
              <button class="console-toggle" @click.stop="showError = !showError">
                {{ showError ? '▼' : '▲' }}
              </button>
            </div>
            <div v-show="showError" class="console-content">
              <pre>{{ error }}</pre>
            </div>
          </div>
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
  overflow: hidden;
  background-color: var(--vp-c-bg-alt);
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 0;
}

.dom-preview {
  flex: 1;
  width: 100%;
  min-height: 200px;
  overflow: auto;
}

.console-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-shrink: 0;
  max-height: 180px;
  overflow: hidden;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 0.5rem;
}

.console-output, .error-output {
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: monospace;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  cursor: pointer;
}

.console-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  opacity: 0.8;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.console-toggle {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.console-toggle:hover {
  background-color: var(--vp-c-bg-alt);
}

.console-content {
  padding: 0.75rem;
  max-height: 120px;
  overflow-y: auto;
  flex-shrink: 0;
  background-color: var(--vp-c-bg);
}

.error-output .console-content {
  background-color: rgba(220, 38, 38, 0.05);
}

.console-content::-webkit-scrollbar {
  width: 6px;
}

.console-content::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
}

.console-content::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 3px;
}

.console-content::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

.console-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.8rem;
  line-height: 1.4;
}
</style>
