
console.log("=== APP FILE LOADED ===");

import Index from "./pages/Index";

const App = () => {
  console.log("=== APP COMPONENT RENDERING ===");
  
  return <Index />;
};

console.log("=== APP COMPONENT DEFINED ===");

export default App;
