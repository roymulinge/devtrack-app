
import AppContent from "./AppContent";
import { useContext } from "react";
import { BrowserRouter as Router,  } from "react-router-dom";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
