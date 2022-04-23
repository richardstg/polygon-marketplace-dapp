import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Redirect,
} from "react-router-dom";
import Navbar from "./components/shared/UI/navbar/navbar";
import Available from "./pages/available";
import CreateAdd from "./pages/create-add";
import Rented from "./pages/rented";
import Listed from "./pages/listed";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Available />} />
        <Route path="/new-add" element={<CreateAdd />} />
        <Route path="/rented" element={<Rented />} />
        <Route path="/listed" element={<Listed />} />
      </Routes>
    </Router>
  );
}

export default App;
