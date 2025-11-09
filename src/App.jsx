import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ClassicMatch from './pages/ClassicMatch'
import Prediction from './pages/Prediction'
import Players from './pages/Players'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classic-match" element={<ClassicMatch />} />
        <Route path="/classic-match/prediction" element={<Prediction />} />
        <Route path="/players" element={<Players />} />
        <Route path="/league-format" element={<div>League Format Page - Coming Soon</div>} />
      </Routes>
    </Router>
  )
}

export default App
