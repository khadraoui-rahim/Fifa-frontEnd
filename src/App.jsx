import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ClassicMatch from './pages/ClassicMatch'
import Prediction from './pages/Prediction'
import Players from './pages/Players'
import LeagueFormat from './pages/LeagueFormat'
import TeamSelection from './pages/TeamSelection'
import LeagueDashboard from './pages/LeagueDashboard'
import MatchPlay from './pages/MatchPlay'
import Standings from './pages/Standings'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classic-match" element={<ClassicMatch />} />
        <Route path="/classic-match/prediction" element={<Prediction />} />
        <Route path="/players" element={<Players />} />
        <Route path="/league-format" element={<LeagueFormat />} />
        <Route path="/league-format/team-selection/:slotNumber" element={<TeamSelection />} />
        <Route path="/league-format/dashboard/:slotNumber" element={<LeagueDashboard />} />
        <Route path="/league-format/match/:slotNumber" element={<MatchPlay />} />
        <Route path="/league-format/standings/:slotNumber" element={<Standings />} />
      </Routes>
    </Router>
  )
}

export default App
