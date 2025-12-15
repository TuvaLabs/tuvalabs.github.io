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
const previewControls = ref(null)
const showConsole = ref(false)
const showError = ref(true)
const mountedComponent = ref(null)

const openInNewWindow = () => {
  // Use this component's own code ref - it's already bound to the textarea via v-model
  // This ensures we get the code from the correct LiveEditor instance
  const currentCode = code.value
  
  // Store the code in sessionStorage with a timestamp to ensure it's fresh
  sessionStorage.setItem('liveEditorCode', currentCode)
  sessionStorage.setItem('liveEditorCodeTimestamp', Date.now().toString())
  
  // Open a new window with the playground page
  const width = Math.min(1400, window.screen.width - 100)
  const height = Math.min(900, window.screen.height - 100)
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2
  
  // Always use absolute path for VitePress
  const playgroundPath = '/playground'
  
  console.log('Opening playground with code length:', currentCode.length)
  console.log('Stored code:', sessionStorage.getItem('liveEditorCode') ? 'YES' : 'NO')
  
  // Open playground page
  const newWindow = window.open(
    playgroundPath,
    'liveEditor',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  )
  
  // If window was blocked, try again with a small delay
  if (!newWindow) {
    setTimeout(() => {
      window.open(
        playgroundPath,
        'liveEditor',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      )
    }, 100)
  }
  
  if (newWindow) {
    // Wait for the new window to load, then set the code
    newWindow.addEventListener('load', () => {
      setTimeout(() => {
        if (newWindow.setEditorCode) {
          newWindow.setEditorCode(code.value)
        }
      }, 500)
    })
  }
}

const runCode = () => {
  error.value = ''
  output.value = ''
  
  // Clear preview controls to prevent duplicates when re-running
  if (previewControls.value) {
    // Clear all dynamically added controls
    previewControls.value.innerHTML = ''
  }
  
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
    const containerEl = previewContainer.value
    const controlsEl = previewControls?.value || null
    
    if (!containerEl) {
      error.value = 'Preview container not available'
      return
    }
    
    if (!controlsEl) {
      // previewControls might not be ready yet, but that's okay - we'll handle it in moveButtonsToHeader
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
    
    // Execute the function with a delay to ensure DOM is ready after clearing
    // Increased delay to ensure proper rendering
    setTimeout(() => {
      try {
        func(customConsole, containerEl, window.React, window.ReactDOM, window.TuvaDataTools)
        
        // Move any buttons/controls created before root to the preview header
        // Use multiple checks to catch buttons created with different timeouts
        const moveButtonsToHeader = () => {
          try {
            // Get fresh references to avoid stale closures
            const container = previewContainer?.value
            const controls = previewControls?.value
            if (container && controls) {
              const parent = container.parentElement
              if (parent) {
                // Find elements inserted before the preview container
                const allChildren = Array.from(parent.children)
                const containerIndex = allChildren.indexOf(container)
                
                // Get existing label texts in controls to prevent duplicates
                const existingLabels = new Set()
                const existingControls = controls.querySelectorAll('label')
                existingControls.forEach(label => {
                  const labelText = label.textContent.trim()
                  if (labelText) {
                    existingLabels.add(labelText)
                  }
                })
                
                // Collect elements to move (buttons or divs with buttons/selects)
                const elementsToMove = []
                const movedLabels = new Set() // Track labels to prevent duplicates in this run
                
                for (let i = 0; i < containerIndex; i++) {
                  const element = allChildren[i]
                  if (element && element !== controls && element !== container) {
                    // Check for buttons, selects, or divs containing controls
                    const hasControls = element.querySelector && (
                      element.querySelector('button') || 
                      element.querySelector('select') ||
                      element.tagName === 'BUTTON' ||
                      element.tagName === 'SELECT' ||
                      (element.tagName === 'DIV' && element.children.length > 0)
                    )
                    if (hasControls) {
                      // Check if already moved (element is not a child of controls)
                      if (!controls.contains(element)) {
                        // Check for duplicate labels to prevent duplicates
                        const label = element.querySelector('label')
                        const labelText = label ? label.textContent.trim() : ''
                        
                        // Skip if this label already exists in controls or has been moved in this run
                        if (labelText && (existingLabels.has(labelText) || movedLabels.has(labelText))) {
                          // This is a duplicate, remove it from DOM instead of moving
                          try {
                            element.remove()
                          } catch (e) {
                            // Ignore removal errors
                          }
                          continue
                        }
                        
                        // This is a new element, add it to move list
                        elementsToMove.push(element)
                        if (labelText) {
                          movedLabels.add(labelText)
                          existingLabels.add(labelText) // Track it for future checks
                        }
                      }
                    }
                  }
                }
                
                // Move elements to preview controls header
                elementsToMove.forEach(el => {
                  // Ensure buttons inside have proper styling
                  const buttons = el.querySelectorAll('button')
                  buttons.forEach(btn => {
                    if (!btn.style.cssText.includes('padding')) {
                      btn.style.cssText += 'padding: 0.5rem 1rem; border: 2px solid var(--vp-c-divider); background-color: var(--vp-c-bg); color: var(--vp-c-text-1); border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); min-height: 36px;'
                    }
                  })
                  controls.appendChild(el)
                })
              }
            }
          } catch (e) {
            // Silently ignore errors when moving buttons - not critical
            // Don't log to avoid cluttering console
          }
        }
        
        // Restore original render after execution (do this first)
        if (originalRender && window.ReactDOM) {
          window.ReactDOM.render = originalRender
        }
        
        // Store the component instance for cleanup and trigger resize
        if (capturedInstance && containerEl) {
          mountedComponent.value = capturedInstance
          
          // Call resize() after delays to ensure component is fully rendered and layout is correct
          setTimeout(() => {
            if (capturedInstance && capturedInstance.actions && capturedInstance.actions.resize) {
              try {
                capturedInstance.actions.resize()
                // Call resize again after a short delay to ensure layout is correct
                setTimeout(() => {
                  if (capturedInstance && capturedInstance.actions && capturedInstance.actions.resize) {
                    capturedInstance.actions.resize()
                  }
                }, 300)
              } catch (e) {
                // Ignore resize errors
              }
            }
          }, 500)
        }
        
        // Move buttons to header (do this after main execution to not interfere)
        // Check immediately, then again after delays to catch buttons created with setTimeout
        setTimeout(() => moveButtonsToHeader(), 50)
        setTimeout(() => moveButtonsToHeader(), 100)
        setTimeout(() => moveButtonsToHeader(), 500)
        setTimeout(() => moveButtonsToHeader(), 1200) // Catch buttons created with 1000ms timeout
        
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
    }, 200)
    
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
        // Add additional delay before running to ensure DOM is ready
        setTimeout(() => {
          runCode()
        }, 400)
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
  const containerEl = previewContainer.value
  if (mountedComponent.value && containerEl && window.ReactDOM) {
    try {
      window.ReactDOM.unmountComponentAtNode(containerEl)
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
        <div class="toolbar-actions">
          <button class="open-window-btn" @click="openInNewWindow" title="Open in larger window">
            <span class="icon">⛶</span>
          </button>
          <button class="run-btn" @click="runCode">
            <span class="icon">▶</span> Run
          </button>
        </div>
      </div>
      <div class="editor-container">
        <textarea v-model="code" spellcheck="false" placeholder="Enter your code here..."></textarea>
      </div>
    </div>
    <div class="preview-pane">
      <div class="toolbar">
        <span class="label">Result / Preview</span>
        <div ref="previewControls" class="preview-controls"></div>
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
  gap: 1rem;
  min-height: 48px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.toolbar .label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  flex-shrink: 0;
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.preview-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  justify-content: flex-end;
  margin: 0;
  padding: 0;
}

.preview-controls > div {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}

/* Style dropdowns in preview controls */
.preview-controls select {
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-controls select:hover {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft);
}

.preview-controls select:focus {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

/* Style labels in preview controls */
.preview-controls label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Style switches in preview controls */
.preview-controls label[style*="position: relative"] {
  margin: 0 !important;
  padding: 0 !important;
  vertical-align: middle !important;
  display: inline-flex !important;
  align-items: center !important;
}

.preview-controls input[type="checkbox"] {
  margin: 0 !important;
}

.preview-controls span[style*="position: absolute"] {
  margin: 0 !important;
}

/* Switch styling - ensure proper animation */
.preview-controls label[style*="position: relative"] span[style*="position: absolute"] span {
  transition: left 0.3s ease !important;
}

/* Ensure labels with switches align properly */
.preview-controls > div label {
  display: flex !important;
  align-items: center !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Ensure controls don't expand header */
.preview-controls > div {
  max-width: 100%;
  overflow: hidden;
}

.preview-controls {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}


.preview-controls button {
  padding: 0.5rem 1rem;
  border: 2px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  position: relative;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.preview-controls button:hover {
  background-color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 68, 69, 0.2);
  transform: translateY(-2px);
}

.preview-controls button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 68, 69, 0.15);
}

.preview-controls button:focus {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.preview-controls span {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: 600;
  margin-right: 0.5rem;
  white-space: nowrap;
}

/* Style buttons that are direct children of preview-controls containers */
.preview-controls > div > button,
.preview-controls > button {
  padding: 0.5rem 1rem;
  border: 2px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.preview-controls > div > button:hover,
.preview-controls > button:hover {
  background-color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 68, 69, 0.2);
  transform: translateY(-2px);
}

.preview-controls > div > button:active,
.preview-controls > button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 68, 69, 0.15);
}

/* Style all buttons in the output container to ensure they look like buttons */
.output-container button,
.dom-preview button {
  padding: 0.5rem 1rem !important;
  border: 2px solid var(--vp-c-divider) !important;
  background-color: var(--vp-c-bg) !important;
  color: var(--vp-c-text-1) !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  transition: all 0.2s ease !important;
  white-space: nowrap !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08) !important;
  min-height: 36px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 !important;
}

.output-container button:hover,
.dom-preview button:hover {
  background-color: var(--vp-c-brand) !important;
  border-color: var(--vp-c-brand) !important;
  color: white !important;
  box-shadow: 0 4px 8px rgba(0, 68, 69, 0.2) !important;
  transform: translateY(-2px) !important;
}

.output-container button:active,
.dom-preview button:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 4px rgba(0, 68, 69, 0.15) !important;
}

.label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.open-window-btn {
  background-color: transparent;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  padding: 0.4rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  position: relative;
}

.open-window-btn:hover {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider-dark);
}

.open-window-btn .icon {
  font-size: 1.1rem;
  line-height: 1;
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
