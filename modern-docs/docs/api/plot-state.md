---
outline: deep
---

<script setup>
const getPlotStateCode = `// Setup data
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
  fields: [
    { id: 'id', name: 'Case' },
    { id: 'name', name: 'Name' },
    { id: 'age', name: 'Age', type: 'numeric' },
    { id: 'score', name: 'Score', type: 'numeric' }
  ]
};

// Render component
const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData
  }),
  root
);

// Get plot state after interaction
setTimeout(() => {
  const btn = document.createElement('button');
  btn.textContent = 'Get Current Plot State';
  btn.onclick = () => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      const state = tuvaDataTools.actions.getPlotState();
      console.log('Current Plot State:', JSON.stringify(state, null, 2));
    }
  };
  btn.style.cssText = 'margin: 10px 0; padding: 8px 16px;';
  root.parentElement.insertBefore(btn, root);
}, 1000);`

const resetPlotCode = `// Setup data
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
  fields: [
    { id: 'id', name: 'Case' },
    { id: 'name', name: 'Name' },
    { id: 'age', name: 'Age', type: 'numeric' },
    { id: 'score', name: 'Score', type: 'numeric' }
  ]
};

// Render component
const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData
  }),
  root
);

// Add reset button
setTimeout(() => {
  const btn = document.createElement('button');
  btn.textContent = 'Reset Plot';
  btn.onclick = () => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      tuvaDataTools.actions.resetPlot();
      console.log('Plot has been reset to initial state');
    }
  };
  btn.style.cssText = 'margin: 10px 0; padding: 8px 16px; background: #ef4444; color: white;';
  root.parentElement.insertBefore(btn, root);
}, 1000);`
</script>

# Plot State API

Plot state methods allow you to capture, restore, and validate the complete visualization state. This is essential for saving user configurations, sharing visualizations, and implementing undo/redo functionality.

## getPlotState

Capture the current state of the visualization, including axis assignments, filters, and display settings.

```typescript
getPlotState(): PlotState
```

### Returns

| Type | Description |
|------|-------------|
| `PlotState` | Object representing the complete visualization state |

### Example

```javascript
const state = tuvaDataTools.actions.getPlotState();
console.log(state);
// {
//   plotview: {
//     xAxisView: { attributeID: ['age'] },
//     yAxisView: { attributeID: ['score'] },
//     ...
//   }
// }

// Save to localStorage
localStorage.setItem('savedPlotState', JSON.stringify(state));
```

### Try It Out

<LiveEditor :initialCode="getPlotStateCode" />

---

## setPlotState

Restore a previously saved visualization state.

```typescript
setPlotState(plotState: PlotState): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `plotState` | `PlotState` | A valid plot state object to restore |

### Example

```javascript
// Restore from localStorage
const savedState = JSON.parse(localStorage.getItem('savedPlotState'));
if (savedState && tuvaDataTools && tuvaDataTools.actions) {
  tuvaDataTools.actions.setPlotState(savedState);
}
```

::: tip
Always validate the plot state before applying it using `validatePlotState()` to avoid errors from malformed or outdated state objects.
:::

---

## validatePlotState

Validate a plot state object against the current schema. Automatically updates older plot state versions to the latest format.

```typescript
validatePlotState(plotState: PlotState): ValidationResult
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `plotState` | `PlotState` | The plot state to validate |

### Returns

| Type | Description |
|------|-------------|
| `ValidationResult` | Validation result with errors if any |

### ValidationResult Structure

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  path: string;
  message: string;
}
```

### Example

```javascript
const stateToRestore = JSON.parse(userInput);
const validation = tuvaDataTools.actions.validatePlotState(stateToRestore);

if (validation.valid) {
  tuvaDataTools.actions.setPlotState(stateToRestore);
} else {
  console.error('Invalid plot state:', validation.errors);
  // Handle validation errors
  validation.errors.forEach(err => {
    console.log(`Error at ${err.path}: ${err.message}`);
  });
}
```

---

## getPlotStateWithSummary

Get the current plot state along with computed statistical summaries.

```typescript
getPlotStateWithSummary(): PlotStateWithSummary
```

### Returns

| Type | Description |
|------|-------------|
| `PlotStateWithSummary` | Plot state with embedded summary statistics |

### Example

```javascript
const stateWithSummary = this.tuvaToolRef.getPlotStateWithSummary();
console.log(stateWithSummary);
// {
//   plotState: { ... },
//   summary: {
//     count: 150,
//     mean: { age: 12.5, score: 87.3 },
//     median: { age: 12, score: 88 },
//     ...
//   }
// }
```

---

## getPlotPreview

Generate a preview image of the current visualization. The preview is returned asynchronously via callback.

```typescript
getPlotPreview(callback: (preview: string) => void): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `callback` | `function` | Function called with the preview data URL |

### Example

```javascript
tuvaDataTools.actions.getPlotPreview((previewDataUrl) => {
  // Display the preview
  const img = document.createElement('img');
  img.src = previewDataUrl;
  document.getElementById('preview-container').appendChild(img);
});
```

### Use Case: Thumbnail Generation

```javascript
async function generateThumbnail() {
  return new Promise((resolve) => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      tuvaDataTools.actions.getPlotPreview((dataUrl) => {
        resolve(dataUrl);
      });
    }
  });
}

// Save state with thumbnail
async function saveVisualization(name) {
  if (!tuvaDataTools || !tuvaDataTools.actions) return;
  
  const state = tuvaDataTools.actions.getPlotState();
  const thumbnail = await generateThumbnail();
  
  const saved = {
    name,
    state,
    thumbnail,
    createdAt: new Date().toISOString()
  };
  
  // Save to your backend
  await fetch('/api/visualizations', {
    method: 'POST',
    body: JSON.stringify(saved)
  });
}
```

---

## resetPlot

Reset the visualization to its initial state, clearing all axis assignments and filters.

```typescript
resetPlot(): void
```

### Example

```javascript
// Add a reset button handler
function handleReset() {
  if (confirm('Reset the plot? All changes will be lost.')) {
    if (tuvaDataTools && tuvaDataTools.actions) {
      tuvaDataTools.actions.resetPlot();
    }
  }
}
```

### Try It Out

<LiveEditor :initialCode="resetPlotCode" />

---

## Summary Methods

### getSummary

Get the current statistical summary of the visualization.

```typescript
getSummary(): Summary
```

### setSummary

Manually set summary statistics.

```typescript
setSummary(summary: Summary): void
```

### Example

```javascript
// Get current summary
if (tuvaDataTools && tuvaDataTools.actions) {
  const summary = tuvaDataTools.actions.getSummary();
  console.log('Summary:', summary);

  // Set custom summary (useful for pre-computed stats)
  tuvaDataTools.actions.setSummary({
    count: 150,
    mean: { score: 87.5 },
    // ...other statistics
  });
}
```

---

## Complete Examples

### Implementing Undo/Redo

```javascript
class UndoableVisualization extends React.Component {
  constructor(props) {
    super(props);
    this.undoStack = [];
    this.redoStack = [];
  }

  captureState() {
    if (!this.tuvaToolRef) return;
    
    const currentState = this.tuvaToolRef.getPlotState();
    this.undoStack.push(JSON.stringify(currentState));
    this.redoStack = []; // Clear redo stack on new action
  }

  undo() {
    if (this.undoStack.length === 0 || !this.tuvaToolRef) return;
    
    // Save current state for redo
    const current = this.tuvaToolRef.getPlotState();
    this.redoStack.push(JSON.stringify(current));
    
    // Restore previous state
    const previous = JSON.parse(this.undoStack.pop());
    this.tuvaToolRef.setPlotState(previous);
  }

  redo() {
    if (this.redoStack.length === 0 || !this.tuvaToolRef) return;
    
    // Save current for undo
    const current = this.tuvaToolRef.getPlotState();
    this.undoStack.push(JSON.stringify(current));
    
    // Restore redo state
    const next = JSON.parse(this.redoStack.pop());
    this.tuvaToolRef.setPlotState(next);
  }

  render() {
    return (
      <div>
        <button onClick={() => this.undo()} disabled={this.undoStack.length === 0}>
          Undo
        </button>
        <button onClick={() => this.redo()} disabled={this.redoStack.length === 0}>
          Redo
        </button>
        <TuvaDataTool 
          {...this.state} 
          ref={ref => this.tuvaToolRef = ref}
          onStateChange={() => this.captureState()}
        />
      </div>
    );
  }
}
```

### Sharing Visualizations via URL

```javascript
// Encode state in URL
function shareVisualization() {
  if (!this.tuvaToolRef) return;
  
  const state = this.tuvaToolRef.getPlotState();
  const encoded = btoa(JSON.stringify(state));
  const shareUrl = `${window.location.origin}/view?state=${encoded}`;
  
  navigator.clipboard.writeText(shareUrl);
  alert('Share link copied to clipboard!');
}

// Load state from URL on page load
function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('state');
  
  if (encoded && this.tuvaToolRef) {
    try {
      const state = JSON.parse(atob(encoded));
      const validation = this.tuvaToolRef.validatePlotState(state);
      
      if (validation.valid) {
        this.tuvaToolRef.setPlotState(state);
      }
    } catch (e) {
      console.error('Failed to load state from URL:', e);
    }
  }
}
```

### Auto-save with Debounce

```javascript
import { debounce } from 'lodash';

class AutoSaveVisualization extends React.Component {
  componentDidMount() {
    // Auto-save every 5 seconds of inactivity
    this.autoSave = debounce(() => {
      if (this.tuvaToolRef) {
        const state = this.tuvaToolRef.getPlotState();
        localStorage.setItem('autosave', JSON.stringify({
          state,
          timestamp: Date.now()
        }));
        console.log('Auto-saved');
      }
    }, 5000);
  }

  handleStateChange = () => {
    this.autoSave();
  }

  render() {
    return (
      <TuvaDataTool 
        {...this.state} 
        ref={ref => this.tuvaToolRef = ref}
        onStateChange={this.handleStateChange}
      />
    );
  }
}
```
