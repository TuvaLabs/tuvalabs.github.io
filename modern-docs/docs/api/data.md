---
outline: deep
---

<script setup>
const getRawDataCode = `// Setup data
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

// Get and display raw data
setTimeout(() => {
  if (tuvaDataTools && tuvaDataTools.actions) {
    const rawData = tuvaDataTools.actions.getRawData();
    console.log('Raw Data:', JSON.stringify(rawData, null, 2));
    console.log('Total rows:', rawData.length);
    console.log('First row:', rawData[0]);
  }
}, 1000);`

const getColumnNamesCode = `// Setup data
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

// Display column information
setTimeout(() => {
  if (tuvaDataTools && tuvaDataTools.actions) {
    const ids = tuvaDataTools.actions.getColumnIds();
    const names = tuvaDataTools.actions.getColumnNames();
    
    console.log('Column IDs:', ids);
    console.log('Column Names:', names);
    
    // Create a mapping
    const mapping = ids.map((id, i) => ({ id, name: names[i] }));
    console.log('Column Mapping:', JSON.stringify(mapping, null, 2));
  }
}, 1000);`

const appendRawDataCode = `// Setup initial data
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

// Add button to append data
setTimeout(() => {
  const btn = document.createElement('button');
  btn.textContent = 'Add New Row';
  btn.onclick = () => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      // Each row contains values for non-Case columns; the Case number is auto-assigned.
      const newRow = ['New Student', '12', String(Math.floor(Math.random() * 20) + 80)];
      tuvaDataTools.actions.appendRawData([newRow]);
      console.log('Added row:', newRow);
      console.log('Total rows now (incl. header):', tuvaDataTools.actions.getRawData().length);
    }
  };
  btn.style.cssText = 'margin: 10px 0; padding: 8px 16px;';
  root.parentElement.insertBefore(btn, root);
}, 1000);`
</script>

# Data Methods API

These methods allow you to retrieve and manipulate the underlying dataset in your Tuva Data Tool.

## getRawData

Retrieve the complete dataset as a 2D array.

```typescript
getRawData(): any[][]
```

### Returns

| Type | Description |
|------|-------------|
| `any[][]` | Two-dimensional array where each inner array represents a row |

### Example

```javascript
const data = tuvaDataTools.actions.getRawData();
console.log(data);
// [
//   [1, 'Alice', '12', '85'],
//   [2, 'Bob', '13', '90'],
//   [3, 'Charlie', '12', '88']
// ]
```

### Try It Out

<LiveEditor :initialCode="getRawDataCode" />

---

## getColumnIds

Get the unique identifiers for each column.

```typescript
getColumnIds(): string[]
```

### Returns

| Type | Description |
|------|-------------|
| `string[]` | Array of column ID strings |

### Example

```javascript
const columnIds = tuvaDataTools.actions.getColumnIds();
console.log(columnIds);
// ['id', 'name', 'age', 'score']
```

---

## getColumnNames

Get the human-readable display names for each column.

```typescript
getColumnNames(): string[]
```

### Returns

| Type | Description |
|------|-------------|
| `string[]` | Array of column name strings |

### Example

```javascript
const columnNames = tuvaDataTools.actions.getColumnNames();
console.log(columnNames);
// ['Case', 'Name', 'Age', 'Score']
```

### Try It Out

<LiveEditor :initialCode="getColumnNamesCode" />

---

## appendRawData

Add new rows to the existing dataset.

```typescript
appendRawData(rows: any[][]): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `rows` | `any[][]` | Array of rows to append, each row matching the column structure |

### Example

```javascript
// Each row supplies values for the non-Case columns in column order.
// Case numbers are auto-assigned by appendRawData — do not include them.

// Add a single row
tuvaDataTools.actions.appendRawData([
  ['David', '14', '95']
]);

// Add multiple rows
tuvaDataTools.actions.appendRawData([
  ['Eve',   '13', '87'],
  ['Frank', '12', '91'],
  ['Grace', '14', '89']
]);
```

::: warning
Ensure the new rows match the existing column structure. Mismatched columns may cause rendering issues.
:::

### Try It Out

<LiveEditor :initialCode="appendRawDataCode" />

---

## setRawData

Replace the entire row dataset in place, preserving the current column schema and plot state.

```typescript
setRawData(rows: any[][]): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `rows` | `any[][]` | Replacement rows. Each row should match the existing column count and **omit the Case column** — case numbers are reassigned automatically. |

### Example

```javascript
// Replace all rows with a new set
tuvaDataTools.actions.setRawData([
  ['Alice',   '12', '85'],
  ['Bob',     '13', '90'],
  ['Charlie', '12', '88'],
]);
```

::: tip
Use `setRawData` when the column schema (column IDs, names, metadata) is unchanged and you only need to swap the rows. If the schema also needs to change, re-mount the component with new props instead.
:::

---

## clearData

Remove all rows from the dataset, keeping the column schema and plot configuration intact.

```typescript
clearData(): void
```

### Example

```javascript
// Wipe all rows
tuvaDataTools.actions.clearData();

// After clearData, you can stream rows in again with appendRawData
tuvaDataTools.actions.appendRawData([
  ['Alice', '12', '85'],
]);
```

---

## getMetaData

Retrieve the metadata describing the dataset structure and field properties.

```typescript
getMetaData(): MetaData
```

### Returns

| Type | Description |
|------|-------------|
| `MetaData` | Object containing field definitions and properties |

### MetaData Structure

```typescript
interface MetaData {
  fields: Field[];
}

interface Field {
  id: string;        // Unique identifier
  name: string;      // Display name
  type?: string;     // Data type (numeric, categorical, etc.)
  unit?: string;     // Unit of measurement
  precision?: number; // Decimal precision for numeric fields
}
```

### Example

```javascript
const metaData = tuvaDataTools.actions.getMetaData();
console.log(metaData);
// {
//   fields: [
//     { id: 'id', name: 'Case' },
//     { id: 'name', name: 'Name' },
//     { id: 'age', name: 'Age', type: 'numeric' },
//     { id: 'score', name: 'Score', type: 'numeric' }
//   ]
// }
```

---

## getDirtyRawData

Get the modified data that hasn't been persisted. Useful for tracking user edits.

```typescript
getDirtyRawData(): any[][]
```

### Returns

| Type | Description |
|------|-------------|
| `any[][]` | Array of modified rows |

### Example

```javascript
const unsavedChanges = tuvaDataTools.actions.getDirtyRawData();
if (unsavedChanges.length > 0) {
  console.log('There are unsaved changes:', unsavedChanges);
  // Prompt user to save or handle accordingly
}
```

---

## Working with Data: Complete Examples

### Exporting Data to CSV

```javascript
function exportToCSV() {
  if (!tuvaDataTools || !tuvaDataTools.actions) return;
  
  const columnNames = tuvaDataTools.actions.getColumnNames();
  const data = tuvaDataTools.actions.getRawData();
  
  // Create CSV content
  let csv = columnNames.join(',') + '\n';
  data.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data-export.csv';
  a.click();
}
```

### Real-time Data Updates

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

// Poll for new data every 5 seconds
const interval = setInterval(async () => {
  const response = await fetch('/api/new-records');
  const newRows = await response.json();
  
  if (newRows.length > 0 && tuvaDataTools && tuvaDataTools.actions) {
    tuvaDataTools.actions.appendRawData(newRows);
  }
}, 5000);

// Clean up
// clearInterval(interval);
```

### Data Validation Before Append

```javascript
function validateAndAppend(newRows) {
  if (!tuvaDataTools || !tuvaDataTools.actions) return;
  
  const columnIds = tuvaDataTools.actions.getColumnIds();
  const expectedColumns = columnIds.length;
  
  const validRows = newRows.filter(row => {
    if (row.length !== expectedColumns) {
      console.warn('Row has incorrect number of columns:', row);
      return false;
    }
    return true;
  });
  
  if (validRows.length > 0) {
    tuvaDataTools.actions.appendRawData(validRows);
    console.log(`Added ${validRows.length} rows`);
  }
}
```

### Comparing Original and Modified Data

```javascript
function hasUnsavedChanges() {
  if (!tuvaDataTools || !tuvaDataTools.actions) return false;
  
  const original = tuvaDataTools.actions.getRawData();
  const dirty = tuvaDataTools.actions.getDirtyRawData();
  
  return dirty.length > 0;
}

function promptSaveBeforeLeave() {
  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  });
}
```
