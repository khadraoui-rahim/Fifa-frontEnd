import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllTeams, initializeSaveSlot } from '../services/leagueApi';
import './TeamSelection.css';

function TeamSelection() {
    const navigate = useNavigate();
    const { slotNumber } = useParams();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const response = await getAllTeams();
            setTeams(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTeamSelect = async (teamId) => {
        if (initializing) return;

        try {
            setInitializing(true);
            await initializeSaveSlot(slotNumber, teamId);
            navigate(`/league-format/dashboard/${slotNumber}`);
        } catch (err) {
            alert('Failed to initialize save slot: ' + err.message);
            setInitializing(false);
        }
    };

    const filteredTeams = teams.filter(team =>
        team.team.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="team-selection">
                <div className="loading">Loading teams...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="team-selection">
                <div className="error">Error: {error}</div>
                <button onClick={() => navigate('/league-format')}>Back</button>
            </div>
        );
    }

    return (
        <div className="team-selection">
            <div className="selection-header">
                <button className="back-btn" onClick={() => navigate('/league-format')}>
                    ← Back
                </button>
                <h1>Select Your Team - Slot {slotNumber}</h1>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {initializing && (
                <div className="initializing-overlay">
                    <div className="initializing-content">
                        <div className="spinner"></div>
                        <p>Initializing league...</p>
                        <p className="sub-text">Creating standings and fixtures</p>
                    </div>
                </div>
            )}

            <div className="teams-grid">
                {filteredTeams.map((team) => (
                    <div
                        key={team._id}
                        className="team-card"
                        onClick={() => handleTeamSelect(team._id)}
                    >
                        {team.logo && (
                            <img src={team.logo} alt={team.team} className="team-logo" />
                        )}
                        <h3>{team.team}</h3>
                        <div className="team-rating">
                            <span className="rating-label">Rating:</span>
                            <span className="rating-value">{team.rating.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTeams.length === 0 && (
                <div className="no-results">
                    <p>No teams found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
}

export default TeamSelection;