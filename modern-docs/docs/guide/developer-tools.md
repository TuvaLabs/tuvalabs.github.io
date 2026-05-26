---
outline: deep
pageClass: developer-tools-page
---

# Developer Tools & Resources

This page provides helpful tools and resources for developers working with Tuva Data Tools.

## Code Snippets

### Quick Component Setup

```javascript
// Minimal setup template
const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: ['id', 'name', 'age'],
    columnNames: ['ID', 'Name', 'Age'],
    rowData: [[1, 'Alice', '25'], [2, 'Bob', '30']],
    metaData: {
      fields: [
        { id: 'id', name: 'ID' },
        { id: 'name', name: 'Name' },
        { id: 'age', name: 'Age', type: 'numeric' }
      ]
    }
  }),
  document.getElementById('root')
);
```

### State Management Helper

```javascript
// Helper to save and restore plot state
const PlotStateManager = {
  save: (name = 'default') => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      const state = tuvaDataTools.actions.getPlotState();
      localStorage.setItem(`tuva-plot-${name}`, JSON.stringify(state));
      return state;
    }
  },
  
  load: (name = 'default') => {
    const saved = localStorage.getItem(`tuva-plot-${name}`);
    if (saved && tuvaDataTools && tuvaDataTools.actions) {
      const state = JSON.parse(saved);
      const validation = tuvaDataTools.actions.validatePlotState(state);
      if (validation.valid) {
        tuvaDataTools.actions.setPlotState(state);
        return true;
      }
    }
    return false;
  },
  
  list: () => {
    const states = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tuva-plot-')) {
        states.push(key.replace('tuva-plot-', ''));
      }
    }
    return states;
  }
};
```

### Data Export Utilities

```javascript
// Export data to various formats
const DataExporter = {
  toCSV: () => {
    if (!tuvaDataTools || !tuvaDataTools.actions) return;
    
    const columnNames = tuvaDataTools.actions.getColumnNames();
    const data = tuvaDataTools.actions.getRawData();
    
    let csv = columnNames.join(',') + '\n';
    data.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tuva-data-export.csv';
    link.click();
  },
  
  toJSON: () => {
    if (!tuvaDataTools || !tuvaDataTools.actions) return;
    
    const exportData = {
      columnIds: tuvaDataTools.actions.getColumnIds(),
      columnNames: tuvaDataTools.actions.getColumnNames(),
      rowData: tuvaDataTools.actions.getRawData(),
      metaData: tuvaDataTools.actions.getMetaData(),
      plotState: tuvaDataTools.actions.getPlotState()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tuva-data-export.json';
    link.click();
  },
  
  toPlotStateJSON: () => {
    if (!tuvaDataTools || !tuvaDataTools.actions) return;
    
    const plotState = tuvaDataTools.actions.getPlotState();
    const blob = new Blob([JSON.stringify(plotState, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tuva-plot-state.json';
    link.click();
  }
};
```

### Debug Helper

```javascript
// Debug utility to inspect component state
const TuvaDebugger = {
  inspect: () => {
    if (!tuvaDataTools || !tuvaDataTools.actions) {
      console.warn('TuvaDataTools not initialized');
      return;
    }
    
    console.group('Tuva Data Tools Debug Info');
    console.log('Column IDs:', tuvaDataTools.actions.getColumnIds());
    console.log('Column Names:', tuvaDataTools.actions.getColumnNames());
    console.log('Row Count:', tuvaDataTools.actions.getRawData().length);
    console.log('Metadata:', tuvaDataTools.actions.getMetaData());
    console.log('Plot State:', tuvaDataTools.actions.getPlotState());
    console.log('Available Actions:', Object.keys(tuvaDataTools.actions));
    console.groupEnd();
  },
  
  watchState: (callback) => {
    let lastState = null;
    setInterval(() => {
      if (tuvaDataTools && tuvaDataTools.actions) {
        const currentState = JSON.stringify(tuvaDataTools.actions.getPlotState());
        if (currentState !== lastState) {
          lastState = currentState;
          callback(tuvaDataTools.actions.getPlotState());
        }
      }
    }, 1000);
  }
};
```

## Browser Console Helpers

Add these to your browser console for quick access:

```javascript
// Quick access to component instance (if stored globally)
window.tuva = tuvaDataTools;

// Quick theme switcher
window.switchTheme = (theme) => {
  if (window.tuva && window.tuva.actions) {
    window.tuva.actions.changeTheme(theme);
  }
};

// Quick data getter
window.getData = () => {
  if (window.tuva && window.tuva.actions) {
    return window.tuva.actions.getRawData();
  }
};
```

## React Integration Examples

### With React Hooks

```javascript
import { useEffect, useRef } from 'react';

function TuvaVisualization({ data }) {
  const containerRef = useRef(null);
  const tuvaRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !tuvaRef.current) {
      tuvaRef.current = ReactDOM.render(
        React.createElement(TuvaDataTools, {
          columnIds: data.columnIds,
          columnNames: data.columnNames,
          rowData: data.rowData,
          metaData: data.metaData
        }),
        containerRef.current
      );
    }

    return () => {
      if (tuvaRef.current && tuvaRef.current.actions) {
        tuvaRef.current.actions.destroy();
        tuvaRef.current = null;
      }
    };
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
}
```

### With React Class Component

```javascript
class TuvaVisualization extends React.Component {
  containerRef = React.createRef();
  tuvaInstance = null;

  componentDidMount() {
    if (this.containerRef.current) {
      this.tuvaInstance = ReactDOM.render(
        React.createElement(TuvaDataTools, {
          ...this.props.data
        }),
        this.containerRef.current
      );
    }
  }

  componentWillUnmount() {
    if (this.tuvaInstance && this.tuvaInstance.actions) {
      this.tuvaInstance.actions.destroy();
    }
  }

  render() {
    return <div ref={this.containerRef} style={{ width: '100%', height: '600px' }} />;
  }
}
```

## Performance Tips

1. **Disable animations for large datasets:**
   ```javascript
   tuvaDataTools.actions.setAnimation(false);
   ```

2. **Use resize() after container changes:**
   ```javascript
   // After showing/hiding or resizing container
   tuvaDataTools.actions.resize();
   ```

3. **Batch data updates:**
   ```javascript
   // Instead of multiple appendRawData calls, batch them
   tuvaDataTools.actions.appendRawData([row1, row2, row3]);
   ```

## Common Patterns

### Auto-save Pattern

```javascript
let autoSaveTimer;
const autoSave = () => {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      const state = tuvaDataTools.actions.getPlotState();
      localStorage.setItem('autosave', JSON.stringify(state));
    }
  }, 2000); // Save 2 seconds after last change
};

// Call autoSave() after any state-changing operation
```

### URL State Sharing

```javascript
// Share plot state via URL
const sharePlot = () => {
  if (tuvaDataTools && tuvaDataTools.actions) {
    const state = tuvaDataTools.actions.getPlotState();
    const encoded = btoa(JSON.stringify(state));
    const url = `${window.location.origin}${window.location.pathname}?state=${encoded}`;
    navigator.clipboard.writeText(url);
    alert('Share link copied to clipboard!');
  }
};

// Load from URL
const loadFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('state');
  if (encoded && tuvaDataTools && tuvaDataTools.actions) {
    try {
      const state = JSON.parse(atob(encoded));
      const validation = tuvaDataTools.actions.validatePlotState(state);
      if (validation.valid) {
        tuvaDataTools.actions.setPlotState(state);
      }
    } catch (e) {
      console.error('Failed to load state from URL:', e);
    }
  }
};
```

## Testing Utilities

```javascript
// Generate test data
const generateTestData = (rowCount = 100) => {
  const columnIds = ['id', 'x', 'y', 'category'];
  const columnNames = ['ID', 'X Value', 'Y Value', 'Category'];
  const categories = ['A', 'B', 'C', 'D'];
  
  const rowData = [];
  for (let i = 1; i <= rowCount; i++) {
    rowData.push([
      i,
      Math.random() * 100,
      Math.random() * 100,
      categories[Math.floor(Math.random() * categories.length)]
    ]);
  }
  
  return {
    columnIds,
    columnNames,
    rowData,
    metaData: {
      fields: [
        { id: 'id', name: 'ID' },
        { id: 'x', name: 'X Value', type: 'numeric' },
        { id: 'y', name: 'Y Value', type: 'numeric' },
        { id: 'category', name: 'Category' }
      ]
    }
  };
};
```

## Troubleshooting

### Component Not Rendering

```javascript
// Check if all dependencies are loaded
console.log('React:', typeof React !== 'undefined');
console.log('ReactDOM:', typeof ReactDOM !== 'undefined');
console.log('TuvaDataTools:', typeof TuvaDataTools !== 'undefined');
```

### Actions Not Available

```javascript
// Wait for component to fully initialize
const waitForActions = (callback, maxAttempts = 10) => {
  let attempts = 0;
  const check = () => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      callback();
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(check, 100);
    } else {
      console.error('Actions not available after', maxAttempts, 'attempts');
    }
  };
  check();
};

// Usage
waitForActions(() => {
  tuvaDataTools.actions.changeTheme('dark');
});
```

## Additional Resources

- [API Reference](/api/) - Complete API documentation
- [Playground](/playground) - Interactive code editor
- [GitHub Repository](https://github.com/TuvaLabs/tuvalabs.github.io) - Source code and issues

