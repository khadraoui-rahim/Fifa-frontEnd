import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Players.css';

function Players() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [teamIndex, setTeamIndex] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [players, setPlayers] = useState([]);
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

  const handlePrev = () => {
    setTeamIndex((prev) => (prev === 0 ? teams.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setTeamIndex((prev) => (prev === teams.length - 1 ? 0 : prev + 1));
  };

  const handleSelectTeam = async () => {
    const team = teams[teamIndex];
    setSelectedTeam(team);
    setLoading(true);

    try {
      // Encode team name properly for URL (spaces become %20)
      const encodedTeamName = encodeURIComponent(team.team);
      const response = await fetch(`http://localhost:5000/api/players/team/${encodedTeamName}`);
      const data = await response.json();
      
      console.log('Players response:', data);
      
      if (data.players) {
        setPlayers(data.players);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTeam = teams[teamIndex];

  return (
    <div className="players-container">
      <h1 className="page-title">SELECT TEAM</h1>

      <div className="players-content">
        {/* Team Selection Panel */}
        {!selectedTeam && (
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
              <button className="nav-button" onClick={handlePrev}>
                <span>‹</span>
              </button>

              <div className="team-display">
                {currentTeam && (
                  <>
                    <h3 className="team-name">{currentTeam.team}</h3>
                    <div className="rating-badge">{currentTeam.rating}</div>
                    <img 
                      src={currentTeam.logo} 
                      alt={currentTeam.team} 
                      className="team-logo"
                    />
                  </>
                )}
              </div>

              <button className="nav-button" onClick={handleNext}>
                <span>›</span>
              </button>
            </div>

            <div className="team-footer">
              <h4 className="team-label">TEAM</h4>
              <button 
                className="select-button"
                onClick={handleSelectTeam}
                disabled={!currentTeam}
              >
                <span>✓</span> SELECT TEAM
              </button>
            </div>
          </div>
        )}

        {/* Squad List */}
        {selectedTeam && (
          <div className="squad-container">
            <div className="squad-header">
              <img 
                src={selectedTeam.logo} 
                alt={selectedTeam.team} 
                className="squad-team-logo"
              />
              <h2 className="squad-team-name">{selectedTeam.team}</h2>
              <button className="change-team-button" onClick={() => {
                setSelectedTeam(null);
                setPlayers([]);
              }}>
                Change Team
              </button>
            </div>

            {loading ? (
              <div className="loading-panel">
                <div className="loading-spinner"></div>
                <p>Loading players...</p>
              </div>
            ) : (
              <div className="players-grid">
                {players.map((player, index) => (
                  <div key={index} className="player-card">
                    <div className="player-rating">{player.overall}</div>
                    <div className="player-info">
                      <h3 className="player-name">{player.name}</h3>
                      <p className="player-position">{player.position}</p>
                      <p className="player-nationality">{player.nationality}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
}

export default Players;
