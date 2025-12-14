---
outline: deep
---

# API Reference

The Tuva Data Tools API provides programmatic control over data visualization and exploration. Access these methods through the `actions` property of the component instance returned by `ReactDOM.render()`.

## Quick Setup

```javascript
// Render the component - ReactDOM.render returns the component instance
const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData
  }),
  document.getElementById('root')
);

// Access API methods via the .actions property
tuvaDataTools.actions.changeTheme('dark');
tuvaDataTools.actions.setGridLines(true);
```

## API Categories

### [Configuration](/api/configuration)

Control the visual appearance and behavior of your data tool.

| Method | Description |
|--------|-------------|
| `changeTheme(theme)` | Switch between themes (tuva, yellow-on-blue, reverse-contrast, black-on-rose) |
| `setGridLines(value)` | Toggle grid line visibility |
| `setFontSize(value)` | Adjust text size (multiplier: 1, 1.2, 1.3) |
| `setCaseIconSize(value)` | Set case icon dimensions (0, 5, 10, 15, 20, 40, 80) |
| `setAnimation(value)` | Enable/disable animations |
| `setPlotTitleVisible(value)` | Show/hide plot title |
| `setStatsLabels(value)` | Show/hide statistics labels |
| `setAttributeKeyboardSupport(value)` | Enable keyboard navigation for attributes |

### [Data Methods](/api/data)

Retrieve and manipulate the underlying dataset.

| Method | Description |
|--------|-------------|
| `getRawData()` | Get the complete dataset |
| `getColumnIds()` | Retrieve column identifiers |
| `getColumnNames()` | Get human-readable column names |
| `appendRawData(rows)` | Add new rows to the dataset |
| `getMetaData()` | Access field metadata |
| `getDirtyRawData()` | Get modified (unsaved) data |

### [Plot State](/api/plot-state)

Manage the visualization state for saving, restoring, and validating plots.

| Method | Description |
|--------|-------------|
| `getPlotState()` | Capture current visualization state |
| `setPlotState(plotState)` | Restore a saved state |
| `validatePlotState(plotState)` | Validate state before applying |
| `getPlotStateWithSummary()` | Get state with statistical summary |
| `getPlotPreview(cb)` | Generate a preview image |
| `resetPlot()` | Reset to initial state |

### [Utility Methods](/api/utility)

Lifecycle and localization controls.

| Method | Description |
|--------|-------------|
| `resize()` | Trigger recalculation on container resize |
| `destroy()` | Clean up and unmount the component |
| `setLanguage(language)` | Change the UI language |
| `openTour()` | Launch the interactive tour |

## Type Definitions

```typescript
interface TuvaDataToolsInstance {
  actions: {
    // Configuration
    changeTheme: (theme: 'tuva' | 'yellow-on-blue' | 'reverse-contrast' | 'black-on-rose') => void;
    changeMode: (mode: 'elem' | 'middle' | 'high' | '') => void;
    setGridLines: (value: boolean) => void;
    setFontSize: (value: number) => void; // multiplier: 1, 1.2, 1.3
    setCaseIconSize: (value: number) => void; // 0, 5, 10, 15, 20, 40, 80
    setAnimation: (value: boolean) => void;
    setPlotTitleVisible: (value: boolean) => void;
    setDisplayAttributeSetting: (value: object) => void;
    setCaseCardCollapsible: (value: boolean) => void;
    setCustomAttribute: (value: object) => void;
    setStatsLabels: (value: boolean) => void;
    setAttributeKeyboardSupport: (value: boolean) => void;
    setPlotReset: (value: boolean) => void;

    // Data
    getRawData: () => any[][];
    getColumnIds: () => string[];
    getColumnNames: () => string[];
    appendRawData: (rows: any[][]) => void;
    getMetaData: () => MetaData;
    getDirtyRawData: () => any[][];

    // Plot State
    getPlotState: () => PlotState;
    setPlotState: (plotState: PlotState) => void;
    validatePlotState: (plotState: PlotState) => ValidationResult;
    getPlotStateWithSummary: () => PlotStateWithSummary;
    getPlotPreview: (callback: (preview: string) => void) => void;
    resetPlot: () => void;

    // Summary
    getSummary: () => Summary;
    setSummary: (summary: Summary) => void;

    // Utility
    resize: () => void;
    destroy: () => void;
    setLanguage: (language: string) => void;
    openTour: () => void;
  };
}
```
