import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import { useState } from 'react'
import './App.css'
import LandingPage from './landingPage.tsx';
import InsertPage from './insert/insertPage.tsx';
import NavBar from "./navbar/navbar.tsx";
import UpdatePage from "./update/updatePage.tsx";
import SelectPage from "./select/selectPage.tsx";
import ReportsPage from "./reports/reportsPage.tsx";
import { resetDemo } from './api/demoBackend';
import './demo.css';

function App() {
  return(
    <Router>
      <div className="demo-notice" role="note">
        <a href="../#work">← Back to portfolio</a>
        <span><strong>Student project demo.</strong> Fictional records stored in this browser. Not an official government service.</span>
        <button type="button" onClick={() => { if (window.confirm('Reset all sample records in this browser?')) { resetDemo(); window.location.reload(); } }}>Reset sample data</button>
      </div>
      <NavBar/>
      <div className="content">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/select" element={<SelectPage/>}/>
          <Route path="/insert" element={<InsertPage/>}/>
          <Route path="/update" element={<UpdatePage/>}/>
          <Route path="/reports" element={<ReportsPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App
