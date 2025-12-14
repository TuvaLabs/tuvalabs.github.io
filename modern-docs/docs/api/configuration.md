---
outline: deep
---

<script setup>
const changeThemeCode = `// Setup data
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

// Create component
const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData
  }),
  root
);

// Add theme selector buttons
setTimeout(() => {
  const container = document.createElement('div');
  container.style.cssText = 'margin: 10px 0; display: flex; gap: 10px; flex-wrap: wrap;';
  
  const themes = ['tuva', 'yellow-on-blue', 'reverse-contrast', 'black-on-rose'];
  themes.forEach(theme => {
    const btn = document.createElement('button');
    btn.textContent = theme;
    btn.onclick = () => {
      if (tuvaDataTools && tuvaDataTools.actions) {
        tuvaDataTools.actions.changeTheme(theme);
        console.log('Theme changed to:', theme);
      }
    };
    btn.style.cssText = 'padding: 6px 12px; cursor: pointer;';
    container.appendChild(btn);
  });
  
  root.parentElement.insertBefore(container, root);
}, 1000);`

const gridLinesCode = `// Setup data
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

const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData
  }),
  root
);

// Add toggle button
setTimeout(() => {
  const btn = document.createElement('button');
  btn.textContent = 'Toggle Grid Lines';
  let gridVisible = true;
  btn.onclick = () => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      gridVisible = !gridVisible;
      tuvaDataTools.actions.setGridLines(gridVisible);
      console.log('Grid lines:', gridVisible ? 'visible' : 'hidden');
    }
  };
  btn.style.cssText = 'margin: 10px 0; padding: 8px 16px;';
  root.parentElement.insertBefore(btn, root);
}, 1000);`

const fontSizeCode = `// Setup data
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

const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData
  }),
  root
);

// Add font size controls
setTimeout(() => {
  const container = document.createElement('div');
  container.style.cssText = 'margin: 10px 0; display: flex; gap: 10px; align-items: center;';
  
  const label = document.createElement('span');
  label.textContent = 'Font Size:';
  
  const sizes = [1, 1.2, 1.3];
  sizes.forEach(size => {
    const btn = document.createElement('button');
    btn.textContent = size + 'x';
    btn.onclick = () => {
      if (tuvaDataTools && tuvaDataTools.actions) {
        tuvaDataTools.actions.setFontSize(size);
        sizeLabel.textContent = size + 'x';
        console.log('Font size set to:', size);
      }
    };
    btn.style.cssText = 'padding: 6px 12px;';
    container.appendChild(btn);
  });
  
  const sizeLabel = document.createElement('span');
  sizeLabel.textContent = '1x';
  sizeLabel.style.cssText = 'min-width: 50px; font-weight: bold;';
  
  container.insertBefore(label, container.firstChild);
  container.appendChild(sizeLabel);
  root.parentElement.insertBefore(container, root);
}, 1000);`
</script>

# Configuration API

These methods control the visual appearance and interactive behavior of the Tuva Data Tool. Access them via the `actions` property of the component instance.

## changeTheme

Switch between visual themes.

```typescript
changeTheme(theme: 'tuva' | 'yellow-on-blue' | 'reverse-contrast' | 'black-on-rose'): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `theme` | `'tuva' \| 'yellow-on-blue' \| 'reverse-contrast' \| 'black-on-rose'` | The theme to apply |

### Example

```javascript
// Switch to different themes
tuvaDataTools.actions.changeTheme('reverse-contrast');
tuvaDataTools.actions.changeTheme('tuva');
tuvaDataTools.actions.changeTheme('yellow-on-blue');
tuvaDataTools.actions.changeTheme('black-on-rose');
```

### Try It Out

<LiveEditor :initialCode="changeThemeCode" />

---

## setGridLines

Toggle the visibility of grid lines on the plot.

```typescript
setGridLines(value: boolean): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `boolean` | `true` to show grid lines, `false` to hide |

### Example

```javascript
// Show grid lines
tuvaDataTools.actions.setGridLines(true);

// Hide grid lines
tuvaDataTools.actions.setGridLines(false);
```

### Try It Out

<LiveEditor :initialCode="gridLinesCode" />

---

## setFontSize

Adjust the base font size for the visualization using a multiplier.

```typescript
setFontSize(value: number): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `number` | Font size multiplier (1, 1.2, or 1.3) |

### Example

```javascript
// Set standard font size
tuvaDataTools.actions.setFontSize(1);

// Set larger font for presentations
tuvaDataTools.actions.setFontSize(1.2);

// Set even larger font
tuvaDataTools.actions.setFontSize(1.3);
```

### Try It Out

<LiveEditor :initialCode="fontSizeCode" />

---

## setCaseIconSize

Set the size of case icons in the visualization.

```typescript
setCaseIconSize(value: number): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `number` | Size of case icons: 0 (standard/default), 5, 10, 15, 20, 40, or 80 |

### Example

```javascript
// Standard size (default)
tuvaDataTools.actions.setCaseIconSize(0);

// Larger case icons
tuvaDataTools.actions.setCaseIconSize(10);

// Smaller case icons for dense data
tuvaDataTools.actions.setCaseIconSize(5);
```

---

## setAnimation

Enable or disable animation transitions.

```typescript
setAnimation(value: boolean): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `boolean` | `true` to enable animations, `false` to disable |

### Example

```javascript
// Enable smooth transitions
tuvaDataTools.actions.setAnimation(true);

// Disable for better performance with large datasets
tuvaDataTools.actions.setAnimation(false);
```

---

## setPlotTitleVisible

Control the visibility of the plot title.

```typescript
setPlotTitleVisible(value: boolean): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `boolean` | `true` to show title, `false` to hide |

### Example

```javascript
// Hide title for embedded views
tuvaDataTools.actions.setPlotTitleVisible(false);
```

---

## setStatsLabels

Show or hide statistics labels on the plot.

```typescript
setStatsLabels(value: boolean): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `boolean` | `true` to show labels, `false` to hide |

### Example

```javascript
// Show statistics labels
tuvaDataTools.actions.setStatsLabels(true);

// Hide statistics labels (default)
tuvaDataTools.actions.setStatsLabels(false);
```

---

## setAttributeKeyboardSupport

Enable or disable keyboard navigation for attribute selection.

```typescript
setAttributeKeyboardSupport(value: boolean): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `boolean` | `true` to enable keyboard navigation |

### Example

```javascript
// Enable accessibility features
tuvaDataTools.actions.setAttributeKeyboardSupport(true);
```

---

## changeMode

Change the display mode of the visualization.

```typescript
changeMode(mode: 'elem' | 'middle' | 'high' | ''): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `mode` | `'elem' \| 'middle' \| 'high' \| ''` | Display mode to apply |

### Example

```javascript
tuvaDataTools.actions.changeMode('elem');
tuvaDataTools.actions.changeMode('middle');
tuvaDataTools.actions.changeMode('high');
```

---

## Other Configuration Methods

### setDisplayAttributeSetting

Configure how attributes are displayed in the interface.

```typescript
setDisplayAttributeSetting(value: object): void
```

### setCaseCardCollapsible

Enable or disable the collapsibility of case cards.

```typescript
setCaseCardCollapsible(value: boolean): void
```

### setCustomAttribute

Set custom attribute configurations.

```typescript
setCustomAttribute(value: object): void
```

### setPlotReset

Configure the plot reset behavior.

```typescript
setPlotReset(value: boolean): void
```

---

## Complete Configuration Example

Here's an example showing multiple configuration methods used together:

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

// Apply configuration after render
setTimeout(() => {
  // Theme
  tuvaDataTools.actions.changeTheme('reverse-contrast');
  
  // Visual settings
  tuvaDataTools.actions.setFontSize(1.2);
  tuvaDataTools.actions.setCaseIconSize(10);
  tuvaDataTools.actions.setGridLines(true);
  tuvaDataTools.actions.setStatsLabels(true);
  
  // Enable animations for smooth transitions
  tuvaDataTools.actions.setAnimation(true);
  
  // Accessibility
  tuvaDataTools.actions.setAttributeKeyboardSupport(true);
}, 500);
```
