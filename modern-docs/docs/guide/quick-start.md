---
outline: false
pageClass: quick-start-page
description: "Embed Tuva Data Tools in a web page with React 18, load a dataset, and control the plot through the actions API."
---

# Quick Start

Get up and running with Tuva Data Tools in minutes.

## Prerequisites

- React 18 and React DOM 18 (UMD builds)
- jQuery 3.2.1+ (will be removed in future versions)
- A modern browser (Chrome, Firefox, Safari, Edge)

## Step 1: Import Dependencies

Add React, React DOM, and jQuery to your page:

```html
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

## Step 2: Add Tuva Data Tools

Import the library and stylesheet from the Tuva CDN. The script defines a global `TuvaDataTools` component:

```html
<link rel="stylesheet" href="https://tools.tuvalabs.com/data-exploration/tools-docs/tuva-data-tools.min.css">
<script src="https://tools.tuvalabs.com/data-exploration/tools-docs/tuva-data-tools.min.js"></script>
```

## Step 3: Prepare Your Data

Tuva Data Tools expects data in a specific format:

```javascript
// Column identifiers (used internally)
const columnIds = ['id', 'name', 'age', 'score'];

// Human-readable column names
const columnNames = ['Case', 'Name', 'Age', 'Score'];

// Row data as 2D array
const rowData = [
  [1, 'Alice', '12', '85'],
  [2, 'Bob', '13', '90'],
  [3, 'Charlie', '12', '88'],
  [4, 'David', '11', '92'],
  [5, 'Eve', '13', '87']
];

// Metadata describing each field
const metaData = {
  fields: [
    { id: 'id', name: 'Case' },
    { id: 'name', name: 'Name' },
    { id: 'age', name: 'Age', type: 'numeric' },
    { id: 'score', name: 'Score', type: 'numeric' }
  ]
};
```

## Step 4: Create the Component

`TuvaDataTools` is a class component, so a `ref` gives you the instance. Its API methods live on the `actions` property:

```javascript
let tuvaDataTools;

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData,
    // Called with the component instance once it mounts
    ref: (instance) => {
      if (!instance) return;
      tuvaDataTools = instance;
      tuvaDataTools.actions.changeTheme('dark');
      tuvaDataTools.actions.setGridLines(true);
    }
  })
);
```

::: tip Legacy `ReactDOM.render`
`ReactDOM.render()` still works in React 18 (with a deprecation warning) and returns the instance directly. The live editors on this site use it for brevity.
:::

## Step 5: Using the API

Access methods through the `actions` property:

```javascript
// Change appearance
tuvaDataTools.actions.changeTheme('dark');
tuvaDataTools.actions.setFontSize(1.2); // multiplier, not pixels
tuvaDataTools.actions.setGridLines(true);

// Get data
const data = tuvaDataTools.actions.getRawData();
const columns = tuvaDataTools.actions.getColumnNames();

// Save/restore state
const state = tuvaDataTools.actions.getPlotState();
localStorage.setItem('savedState', JSON.stringify(state));

// Later...
const saved = JSON.parse(localStorage.getItem('savedState'));
tuvaDataTools.actions.setPlotState(saved);
```

## Try It Out

<script setup>
const quickStartCode = `// Prepare sample data
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

// Create and render the component
const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData
  }),
  root
);

// Try some API methods after a short delay
setTimeout(() => {
  if (tuvaDataTools && tuvaDataTools.actions) {
    console.log('Component mounted!');
    console.log('Column names:', tuvaDataTools.actions.getColumnNames());
    const rawData = tuvaDataTools.actions.getRawData();
    console.log('Raw data rows:', rawData.length);
    console.log('First row:', rawData[0]);
  }
}, 1000);`
</script>

<LiveEditor :initialCode="quickStartCode" />

## Complete Example

Here's a full working example:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Required: the library bundle is UTF-8 -->
  <meta charset="utf-8">
  <title>Tuva Data Tools Demo</title>
  <link rel="stylesheet" href="https://tools.tuvalabs.com/data-exploration/tools-docs/tuva-data-tools.min.css">
</head>
<body>
  <div id="root" style="width: 100%; height: 600px;"></div>

  <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://tools.tuvalabs.com/data-exploration/tools-docs/tuva-data-tools.min.js"></script>
  
  <script>
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

    // Render component; the ref receives the instance once it mounts
    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(TuvaDataTools, {
        columnIds: columnIds,
        columnNames: columnNames,
        rowData: rowData,
        metaData: metaData,
        ref: (tuvaDataTools) => {
          if (!tuvaDataTools) return;
          tuvaDataTools.actions.changeTheme('tuva');
          tuvaDataTools.actions.setGridLines(true);
          tuvaDataTools.actions.setAnimation(true);
        }
      })
    );
  </script>
</body>
</html>
```

## Next Steps

- Explore the [API Reference](/api/) for all available methods
- Try the [Playground](/playground) to experiment interactively
- See [Configuration](/api/configuration) for customization options
- Learn about [Plot State](/api/plot-state) for saving and sharing visualizations
- Validate saved plot states against the [Plot State JSON Schema](/schema/plot-state.schema.json)
