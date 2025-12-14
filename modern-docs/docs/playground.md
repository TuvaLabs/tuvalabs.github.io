---
sidebar: false
aside: false
pageClass: playground-page
---

<div class="playground-header">
  <h1 class="playground-title">Playground</h1>
  <p class="playground-description">Try out the JavaScript code below. You can edit the code on the left and click "Run" to see the result on the right.</p>
</div>

<script setup>
const demoCode = `// Define the data
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
  "fields": [{
      name: "Case",
      id: "id",
  },{
      name: "Name",
      id: "name",
  },{
      name: "Age",
      id: "age",
  },{
      name: "Score",
      id: "score",
  }]
};

// Render the TuvaDataTools component
// ReactDOM.render returns the component instance which has an 'actions' property
const tuvaDataTools = ReactDOM.render(
  React.createElement(TuvaDataTools, {
    columnIds: columnIds,
    columnNames: columnNames,
    rowData: rowData,
    metaData: metaData
  }),
  root
);

console.log('Rendered successfully!');
if (tuvaDataTools && tuvaDataTools.actions) {
  console.log('Available actions:', Object.keys(tuvaDataTools.actions));
} else {
  console.log('Component instance created but actions not yet available');
}`
</script>

<LiveEditor :initialCode="demoCode" />
