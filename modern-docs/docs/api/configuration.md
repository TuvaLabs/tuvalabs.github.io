---
outline: false
pageClass: configuration-page
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

// Add theme selector dropdown
setTimeout(() => {
  const container = document.createElement('div');
  container.style.cssText = 'margin: 0; display: flex; gap: 0.5rem; align-items: center;';
  
  const label = document.createElement('label');
  label.textContent = 'Theme:';
  label.style.cssText = 'font-weight: 600; font-size: 0.85rem; white-space: nowrap;';
  
  const select = document.createElement('select');
  select.innerHTML = '<option value="tuva">tuva</option><option value="yellow-on-blue">yellow-on-blue</option><option value="reverse-contrast">reverse-contrast</option><option value="black-on-rose">black-on-rose</option>';
  select.value = 'tuva';
  select.onchange = (e) => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      tuvaDataTools.actions.changeTheme(e.target.value);
      console.log('Theme changed to:', e.target.value);
    }
  };
  select.style.cssText = 'padding: 0.4rem 0.75rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; background-color: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 0.85rem; cursor: pointer; min-width: 150px;';
  
  container.appendChild(label);
  container.appendChild(select);
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

// Add grid lines switch
setTimeout(() => {
  const container = document.createElement('div');
  container.style.cssText = 'margin: 0; display: flex; gap: 0.5rem; align-items: center; flex-wrap: nowrap;';
  
  const label = document.createElement('label');
  label.textContent = 'Grid Lines:';
  label.style.cssText = 'font-weight: 600; font-size: 0.85rem; white-space: nowrap; cursor: pointer; margin: 0; padding: 0; display: flex; align-items: center;';
  
  const switchContainer = document.createElement('label');
  switchContainer.style.cssText = 'position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer; margin: 0; padding: 0; vertical-align: middle;';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  checkbox.style.cssText = 'opacity: 0; width: 0; height: 0;';
  
  const slider = document.createElement('span');
  slider.style.cssText = 'position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3eaf7c; transition: 0.3s; border-radius: 24px;';
  
  const sliderCircle = document.createElement('span');
  sliderCircle.style.cssText = 'position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);';
  
  checkbox.onchange = (e) => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      tuvaDataTools.actions.setGridLines(e.target.checked);
      slider.style.backgroundColor = e.target.checked ? '#3eaf7c' : '#ccc';
      sliderCircle.style.left = e.target.checked ? 'calc(100% - 21px)' : '3px';
      console.log('Grid lines:', e.target.checked ? 'visible' : 'hidden');
    }
  };
  
  slider.appendChild(sliderCircle);
  switchContainer.appendChild(checkbox);
  switchContainer.appendChild(slider);
  
  container.appendChild(label);
  container.appendChild(switchContainer);
  root.parentElement.insertBefore(container, root);
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

// Add font size dropdown
setTimeout(() => {
  const container = document.createElement('div');
  container.style.cssText = 'margin: 0; display: flex; gap: 0.5rem; align-items: center;';
  
  const label = document.createElement('label');
  label.textContent = 'Font Size:';
  label.style.cssText = 'font-weight: 600; font-size: 0.85rem; white-space: nowrap;';
  
  const select = document.createElement('select');
  select.innerHTML = '<option value="1">1x</option><option value="1.2">1.2x</option><option value="1.3">1.3x</option>';
  select.value = '1';
  select.onchange = (e) => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      const size = parseFloat(e.target.value);
      tuvaDataTools.actions.setFontSize(size);
      console.log('Font size set to:', size + 'x');
    }
  };
  select.style.cssText = 'padding: 0.4rem 0.75rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; background-color: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 0.85rem; cursor: pointer; min-width: 80px;';
  
  container.appendChild(label);
  container.appendChild(select);
  root.parentElement.insertBefore(container, root);
}, 1000);`

const caseIconSizeCode = `// Setup data
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

// Add case icon size dropdown
setTimeout(() => {
  const container = document.createElement('div');
  container.style.cssText = 'margin: 0; display: flex; gap: 0.5rem; align-items: center;';
  
  const label = document.createElement('label');
  label.textContent = 'Case Icon Size:';
  label.style.cssText = 'font-weight: 600; font-size: 0.85rem; white-space: nowrap;';
  
  const select = document.createElement('select');
  select.innerHTML = '<option value="0">0 (Standard)</option><option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20">20</option><option value="40">40</option><option value="80">80</option>';
  select.value = '0';
  select.onchange = (e) => {
    // Check if API is available when user changes the value
    if (tuvaDataTools && tuvaDataTools.actions && tuvaDataTools.actions.setCaseSize) {
      const size = parseInt(e.target.value, 10);
      tuvaDataTools.actions.setCaseSize(size);
      console.log('Case icon size set to:', size);
    } else {
      console.error('setCaseSize not available. Available actions:', tuvaDataTools?.actions ? Object.keys(tuvaDataTools.actions) : 'none');
    }
  };
  select.style.cssText = 'padding: 0.4rem 0.75rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; background-color: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 0.85rem; cursor: pointer; min-width: 140px;';
  
  container.appendChild(label);
  container.appendChild(select);
  root.parentElement.insertBefore(container, root);
}, 1000);`

const animationCode = `// Setup data
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

// Add animation switch
setTimeout(() => {
  const container = document.createElement('div');
  container.style.cssText = 'margin: 0; display: flex; gap: 0.5rem; align-items: center;';
  
  const label = document.createElement('label');
  label.textContent = 'Animation:';
  label.style.cssText = 'font-weight: 600; font-size: 0.85rem; white-space: nowrap; cursor: pointer; margin: 0; padding: 0; display: flex; align-items: center;';
  
  const switchContainer = document.createElement('label');
  switchContainer.style.cssText = 'position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer; margin: 0; padding: 0; vertical-align: middle;';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  checkbox.style.cssText = 'opacity: 0; width: 0; height: 0;';
  
  const slider = document.createElement('span');
  slider.style.cssText = 'position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3eaf7c; transition: 0.3s; border-radius: 24px;';
  
  const sliderCircle = document.createElement('span');
  sliderCircle.style.cssText = 'position: absolute; height: 18px; width: 18px; left: calc(100% - 21px); bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);';
  
  checkbox.onchange = (e) => {
    if (tuvaDataTools && tuvaDataTools.actions) {
      tuvaDataTools.actions.setAnimation(e.target.checked);
      slider.style.backgroundColor = e.target.checked ? '#3eaf7c' : '#ccc';
      sliderCircle.style.left = e.target.checked ? 'calc(100% - 21px)' : '3px';
      console.log('Animation:', e.target.checked ? 'enabled' : 'disabled');
    }
  };
  
  slider.appendChild(sliderCircle);
  switchContainer.appendChild(checkbox);
  switchContainer.appendChild(slider);
  
  container.appendChild(label);
  container.appendChild(switchContainer);
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

## setCaseSize

Set the size of case icons in the visualization.

```typescript
setCaseSize(value: number): void
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `number` | Size of case icons: 0 (standard/default), 5, 10, 15, 20, 40, or 80 |

### Example

```javascript
// Standard size (default)
tuvaDataTools.actions.setCaseSize(0);

// Larger case icons
tuvaDataTools.actions.setCaseSize(10);

// Smaller case icons for dense data
tuvaDataTools.actions.setCaseSize(5);
```

### Try It Out

<LiveEditor :initialCode="caseIconSizeCode" />

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

### Try It Out

<LiveEditor :initialCode="animationCode" />

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
  tuvaDataTools.actions.setCaseSize(10);
  tuvaDataTools.actions.setGridLines(true);
  tuvaDataTools.actions.setStatsLabels(true);
  
  // Enable animations for smooth transitions
  tuvaDataTools.actions.setAnimation(true);
  
  // Accessibility
  tuvaDataTools.actions.setAttributeKeyboardSupport(true);
}, 500);
```
