---
outline: deep
---

<script setup>
const resizeCode = `// Setup data
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

// Add resize button and make container resizable
setTimeout(() => {
  root.style.border = '2px dashed #ccc';
  root.style.minHeight = '400px';
  
  const btn = document.createElement('button');
  btn.textContent = 'Trigger Resize';
  btn.onclick = () => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      tuvaDataTools.actions.resize();
      console.log('Resize triggered');
    }
  };
  btn.style.cssText = 'margin: 10px 0; padding: 8px 16px;';
  root.parentElement.insertBefore(btn, root);
  
  // Simulate container resize
  const resizeBtn = document.createElement('button');
  resizeBtn.textContent = 'Change Container Size';
  let isSmall = false;
  resizeBtn.onclick = () => {
    isSmall = !isSmall;
    root.style.height = isSmall ? '300px' : '500px';
    root.style.width = isSmall ? '80%' : '100%';
    if (tuvaDataTools && tuvaDataTools.actions) {
      setTimeout(() => tuvaDataTools.actions.resize(), 100);
    }
  };
  resizeBtn.style.cssText = 'margin: 10px 0 10px 10px; padding: 8px 16px;';
  root.parentElement.insertBefore(resizeBtn, root);
}, 1000);`

const setLanguageCode = `// Setup data
const columnIds = ['id', 'name', 'age', 'score'];
const columnNames = ['Case', 'Name', 'Age', 'Score'];
const rowData = [
  [1, 'Alice', '12', '85'],
  [2, 'Bob', '13', '90'],
  [3, 'Charlie', '12', '88']
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

// Add language selector
setTimeout(() => {
  const container = document.createElement('div');
  container.style.cssText = 'margin: 10px 0; display: flex; gap: 10px; align-items: center;';
  
  const label = document.createElement('label');
  label.textContent = 'Language:';
  label.style.cssText = 'font-weight: 600;';
  
  const select = document.createElement('select');
  select.innerHTML = '<option value="en">English</option><option value="es">Español</option><option value="fr">Français</option>';
  select.onchange = (e) => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      tuvaDataTools.actions.setLanguage(e.target.value);
      console.log('Language changed to:', e.target.value);
    }
  };
  select.style.cssText = 'padding: 6px 12px;';
  
  container.appendChild(label);
  container.appendChild(select);
  root.parentElement.insertBefore(container, root);
}, 1000);`
</script>

# Utility Methods API

Utility methods handle component lifecycle, layout adjustments, and localization.

## resize

Trigger a recalculation and redraw of the visualization. Call this when the container dimensions change.

```typescript
resize(): void
```

### When to Use

- After the parent container is resized
- When showing a previously hidden visualization
- After switching tabs or accordion panels
- When exiting fullscreen mode

### Example

```javascript
// Handle window resize
window.addEventListener('resize', () => {
  if (tuvaDataTools && tuvaDataTools.actions) {
    tuvaDataTools.actions.resize();
  }
});

// After showing a hidden element
function showVisualization() {
  document.getElementById('viz-container').style.display = 'block';
  // Must call resize after element becomes visible
  if (tuvaDataTools && tuvaDataTools.actions) {
    tuvaDataTools.actions.resize();
  }
}
```

### With ResizeObserver

```javascript
// Render component
const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData
  }),
  document.getElementById('root')
);

// Set up resize observer
const container = document.getElementById('root');
const resizeObserver = new ResizeObserver(() => {
  if (tuvaDataTools && tuvaDataTools.actions) {
    tuvaDataTools.actions.resize();
  }
});

resizeObserver.observe(container);

// Clean up
// resizeObserver.disconnect();
```

### Try It Out

<LiveEditor :initialCode="resizeCode" />

---

## destroy

Clean up and unmount the Tuva Data Tool component. This properly disposes of all resources and removes the component from the DOM.

```typescript
destroy(): void
```

### When to Use

- When removing the visualization from the page
- Before navigating away in a single-page application
- When replacing with a different visualization

### Example

```javascript
// Clean up component
if (tuvaDataTools && tuvaDataTools.actions) {
  tuvaDataTools.actions.destroy();
  tuvaDataTools = null;
}

// OR use ReactDOM.unmountComponentAtNode
const container = document.getElementById('root');
ReactDOM.unmountComponentAtNode(container);
tuvaDataTools = null;
```

### Conditional Rendering

```javascript
let tuvaDataTools = null;

function showVisualization() {
  const container = document.getElementById('root');
  tuvaDataTools = ReactDOM.render(
    React.createElement(TuvaDataTools, {
      columnIds: columnIds,
      columnNames: columnNames,
      rowData: rowData,
      metaData: metaData
    }),
    container
  );
}

function hideVisualization() {
  if (tuvaDataTools && tuvaDataTools.actions) {
    tuvaDataTools.actions.destroy();
    tuvaDataTools = null;
  }
}
```

::: warning
After calling `destroy()`, the component reference becomes invalid. You must create a new instance to show the visualization again.
:::

---

## setLanguage

Change the UI language for all text elements in the visualization.

```typescript
setLanguage(language: string): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `language` | `string` | Language code (e.g., 'en', 'es', 'fr') |

### Supported Languages

| Code | Language |
|------|----------|
| `en` | English |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `pt` | Portuguese |

### Example

```javascript
// Switch to Spanish
if (tuvaDataTools && tuvaDataTools.actions) {
  tuvaDataTools.actions.setLanguage('es');
}

// Language selector
const select = document.createElement('select');
select.innerHTML = '<option value="en">English</option><option value="es">Español</option><option value="fr">Français</option>';
select.onchange = (e) => {
  if (tuvaDataTools && tuvaDataTools.actions) {
    tuvaDataTools.actions.setLanguage(e.target.value);
  }
};
```

### Detecting Browser Language

```javascript
function setAutoLanguage() {
  if (!tuvaDataTools || !tuvaDataTools.actions) return;
  
  const browserLang = navigator.language.split('-')[0];
  const supported = ['en', 'es', 'fr', 'de', 'pt'];
  
  if (supported.includes(browserLang)) {
    tuvaDataTools.actions.setLanguage(browserLang);
  } else {
    tuvaDataTools.actions.setLanguage('en'); // Default to English
  }
}
```

### Try It Out

<LiveEditor :initialCode="setLanguageCode" />

---

## openTour

Launch the interactive guided tour to help users learn the visualization interface.

```typescript
openTour(): void
```

### Example

```javascript
// Help button
const helpBtn = document.createElement('button');
helpBtn.textContent = 'Take a Tour';
helpBtn.onclick = () => {
  if (tuvaDataTools && tuvaDataTools.actions) {
    tuvaDataTools.actions.openTour();
  }
};
```

### First-time User Experience

```javascript
const hasSeenTour = localStorage.getItem('hasSeenTour');

if (!hasSeenTour) {
  // Show tour for first-time users
  setTimeout(() => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      tuvaDataTools.actions.openTour();
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, 1000); // Small delay to let the UI render
}
```

---

## Complete Integration Example

Here's a comprehensive example showing all utility methods in a real-world context:

```javascript
import React, { Component, createRef } from 'react';

class FullFeaturedVisualization extends Component {
  containerRef = createRef();
  resizeObserver = null;
  
  state = {
    language: 'en',
    isFullscreen: false
  };

  componentDidMount() {
    // Auto-detect language
    this.detectAndSetLanguage();
    
    // Set up resize observer
    this.setupResizeObserver();
    
    // Show tour for new users
    this.maybeShowTour();
  }

  componentWillUnmount() {
    // Clean up
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.tuvaToolRef) {
      this.tuvaToolRef.destroy();
    }
  }

  detectAndSetLanguage() {
    const browserLang = navigator.language.split('-')[0];
    const supported = ['en', 'es', 'fr'];
    const lang = supported.includes(browserLang) ? browserLang : 'en';
    
    this.setState({ language: lang });
    if (this.tuvaToolRef) {
      this.tuvaToolRef.setLanguage(lang);
    }
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.tuvaToolRef) {
        this.tuvaToolRef.resize();
      }
    });
    
    if (this.containerRef.current) {
      this.resizeObserver.observe(this.containerRef.current);
    }
  }

  maybeShowTour() {
    const hasSeenTour = localStorage.getItem('tuva-tour-completed');
    if (!hasSeenTour) {
      setTimeout(() => {
        if (this.tuvaToolRef) {
          this.tuvaToolRef.openTour();
          localStorage.setItem('tuva-tour-completed', 'true');
        }
      }, 1500);
    }
  }

  handleLanguageChange = (e) => {
    const lang = e.target.value;
    this.setState({ language: lang });
    if (this.tuvaToolRef) {
      this.tuvaToolRef.setLanguage(lang);
    }
  }

  toggleFullscreen = () => {
    const container = this.containerRef.current;
    
    if (!this.state.isFullscreen) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    
    this.setState({ isFullscreen: !this.state.isFullscreen }, () => {
      // Resize after fullscreen change
      setTimeout(() => {
        if (this.tuvaToolRef) {
          this.tuvaToolRef.resize();
        }
      }, 100);
    });
  }

  render() {
    return (
      <div ref={this.containerRef} className="viz-container">
        <div className="toolbar">
          <select 
            value={this.state.language} 
            onChange={this.handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
          
          <button onClick={() => {
            if (this.tuvaToolRef) {
              this.tuvaToolRef.openTour();
            }
          }}>
            Help
          </button>
          
          <button onClick={this.toggleFullscreen}>
            {this.state.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
        
        <TuvaDataTool 
          {...this.props} 
          ref={ref => this.tuvaToolRef = ref}
        />
      </div>
    );
  }
}

export default FullFeaturedVisualization;
```
