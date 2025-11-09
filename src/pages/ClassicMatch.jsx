import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClassicMatch.css';

function ClassicMatch() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [homeTeamIndex, setHomeTeamIndex] = useState(0);
  const [awayTeamIndex, setAwayTeamIndex] = useState(0);
  const [selectedHomeTeam, setSelectedHomeTeam] = useState(null);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState(null);
  const [homeTeamLocked, setHomeTeamLocked] = useState(false);
  const [awayTeamLocked, setAwayTeamLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch teams from backend
    fetch('http://localhost:5000/api/teams')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTeams(data.data);
        }
      })
      .catch(err => console.error('Error fetching teams:', err));
  }, []);

  const handlePrevHome = () => {
    setHomeTeamIndex((prev) => (prev === 0 ? teams.length - 1 : prev - 1));
  };

  const handleNextHome = () => {
    setHomeTeamIndex((prev) => (prev === teams.length - 1 ? 0 : prev + 1));
  };

  const handlePrevAway = () => {
    setAwayTeamIndex((prev) => (prev === 0 ? teams.length - 1 : prev - 1));
  };

  const handleNextAway = () => {
    setAwayTeamIndex((prev) => (prev === teams.length - 1 ? 0 : prev + 1));
  };

  const handleSelectHomeTeam = () => {
    if (!homeTeamLocked) {
      setSelectedHomeTeam(teams[homeTeamIndex]);
      setHomeTeamLocked(true);
      checkAndSimulate(teams[homeTeamIndex], selectedAwayTeam);
    }
  };

  const handleSelectAwayTeam = () => {
    if (!awayTeamLocked) {
      setSelectedAwayTeam(teams[awayTeamIndex]);
      setAwayTeamLocked(true);
      checkAndSimulate(selectedHomeTeam, teams[awayTeamIndex]);
    }
  };

  const checkAndSimulate = async (home, away) => {
    if (home && away) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teamA: home.team,
            teamB: away.team,
          }),
        });

        const data = await response.json();
        if (data.prediction) {
          // Navigate to prediction page with data
          navigate('/classic-match/prediction', {
            state: {
              homeTeam: home,
              awayTeam: away,
              prediction: data.prediction
            }
          });
        }
      } catch (error) {
        console.error('Error fetching prediction:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const homeTeam = teams[homeTeamIndex];
  const awayTeam = teams[awayTeamIndex];

  return (
    <div className="classic-match-container">
      <h1 className="page-title">SELECT TEAMS</h1>
      
      <div className="team-selection-wrapper">
        {/* Home Team Selection */}
        <div className="team-panel">
          <div className="country-section">
            <h2 className="country-name">SPAIN</h2>
            <img 
              src="https://flagcdn.com/w320/es.png" 
              alt="Spain Flag" 
              className="country-flag"
            />
          </div>

          <div className="team-selector">
            <button className="nav-button" onClick={handlePrevHome}>
              <span>‹</span>
            </button>

            <div className="team-display">
              {homeTeam && (
                <>
                  <h3 className="team-name">{homeTeam.team}</h3>
                  <div className="rating-badge">{homeTeam.rating}</div>
                  <img 
                    src={homeTeam.logo} 
                    alt={homeTeam.team} 
                    className="team-logo"
                  />
                </>
              )}
            </div>

            <button className="nav-button" onClick={handleNextHome}>
              <span>›</span>
            </button>
          </div>

          <div className="team-footer">
            <h4 className="team-label">HOME TEAM</h4>
            <button 
              className={`select-button ${homeTeamLocked ? 'locked' : ''}`}
              onClick={handleSelectHomeTeam}
              disabled={!homeTeam || homeTeamLocked}
            >
              <span>{homeTeamLocked ? '🔒' : '✓'}</span> {homeTeamLocked ? 'LOCKED' : 'SELECT TEAM'}
            </button>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="loading-panel">
            <div className="loading-spinner"></div>
            <p>Generating prediction...</p>
          </div>
        )}

        {/* Away Team Selection */}
        <div className="team-panel">
          <div className="country-section">
            <h2 className="country-name">SPAIN</h2>
            <img 
              src="https://flagcdn.com/w320/es.png" 
              alt="Spain Flag" 
              className="country-flag"
            />
          </div>

          <div className="team-selector">
            <button className="nav-button" onClick={handlePrevAway}>
              <span>‹</span>
            </button>

            <div className="team-display">
              {awayTeam && (
                <>
                  <h3 className="team-name">{awayTeam.team}</h3>
                  <div className="rating-badge">{awayTeam.rating}</div>
                  <img 
                    src={awayTeam.logo} 
                    alt={awayTeam.team} 
                    className="team-logo"
                  />
                </>
              )}
            </div>

            <button className="nav-button" onClick={handleNextAway}>
              <span>›</span>
            </button>
          </div>

          <div className="team-footer">
            <h4 className="team-label">AWAY TEAM</h4>
            <button 
              className={`select-button ${awayTeamLocked ? 'locked' : ''}`}
              onClick={handleSelectAwayTeam}
              disabled={!awayTeam || awayTeamLocked}
            >
              <span>{awayTeamLocked ? '🔒' : '✓'}</span> {awayTeamLocked ? 'LOCKED' : 'SELECT TEAM'}
            </button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
}

export default ClassicMatch;
