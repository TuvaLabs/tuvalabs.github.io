---
sidebar: false
aside: false
pageClass: playground-page
---

# Playground

Try out the JavaScript code below. You can edit the code on the left and click "Run" to see the result on the right.

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
// We use React.createElement because we are not using JSX here
const element = React.createElement(TuvaDataTools, {
  columnIds: columnIds,
  columnNames: columnNames,
  rowData: rowData,
  metaData: metaData,
  // Add any other required props here
});

// The 'root' element is automatically provided by the playground environment
const rootInstance = ReactDOM.createRoot(root);
rootInstance.render(element);
console.log('Rendered successfully!');`
</script>

<LiveEditor :initialCode="demoCode" />
