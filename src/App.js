import { Route, BrowserRouter, Routes } from "react-router-dom";
import { CreatePet } from "./pages/CreatePet";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/pets/create" element={<CreatePet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
