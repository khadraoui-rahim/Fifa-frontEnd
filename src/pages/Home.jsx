import { useNavigate } from 'react-router-dom';
import { GiSoccerBall } from 'react-icons/gi';
import { FaUsers, FaTrophy } from 'react-icons/fa';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="player-diamond"></div>
      <div className="player-image"></div>
      <div className="menu-grid">
        <div className="menu-item" tabIndex="0" onClick={() => navigate('/classic-match')}>
          <span className="menu-title">CLASSIC MATCH</span>
          <GiSoccerBall className="menu-icon" />
        </div>
        <div className="menu-item" tabIndex="0" onClick={() => navigate('/players')}>
          <span className="menu-title">PLAYERS</span>
          <FaUsers className="menu-icon" />
        </div>
        <div className="menu-item" tabIndex="0" onClick={() => navigate('/league-format')}>
          <span className="menu-title">LEAGUE FORMAT</span>
          <FaTrophy className="menu-icon" />
        </div>
      </div>
    </div>
  );
}

export default Home;
