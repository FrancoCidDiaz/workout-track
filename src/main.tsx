import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route  } from "react-router";
import Login from './components/Login.tsx';
import GetWorkouts from './components/GetWorkouts.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      <Routes>
        <Route path="/app" element={<App />} />
      </Routes> 
      <Routes>
        <Route path="/workouts" element={<GetWorkouts />} />
      </Routes>

    </BrowserRouter>
  </StrictMode>,
)
