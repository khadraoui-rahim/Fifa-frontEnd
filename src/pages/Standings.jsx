import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSaveSlot, getStandings } from '../services/leagueApi';
import './Standings.css';

function Standings() {
    const navigate = useNavigate();
    const { slotNumber } = useParams();
    const [saveSlot, setSaveSlot] = useState(null);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStandingsData();
    }, [slotNumber]);

    const loadStandingsData = async () => {
        try {
            setLoading(true);
            const [slotRes, standingsRes] = await Promise.all([
                getSaveSlot(slotNumber),
                getStandings(slotNumber)
            ]);

            setSaveSlot(slotRes.data);
            setStandings(standingsRes.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getUserTeamPosition = () => {
        const userStanding = standings.find(s => s.isUserTeam);
        return userStanding ? userStanding.position : null;
    };

    const getOrdinalSuffix = (num) => {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return num + 'ST';
        if (j === 2 && k !== 12) return num + 'ND';
        if (j === 3 && k !== 13) return num + 'RD';
        return num + 'TH';
    };

    if (loading) {
        return (
            <div className="standings-page">
                <div className="loading">Loading standings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="standings-page">
                <div className="error">Error: {error}</div>
                <button onClick={() => navigate(`/league-format/dashboard/${slotNumber}`)}>Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="standings-page">
            <div className="top-bar">
                <button className="back-btn" onClick={() => navigate(`/league-format/dashboard/${slotNumber}`)}>
                    ← Back to Dashboard
                </button>
                <div className="team-banner team-banner-compact">
                    <div className="team-banner-content">
                        {saveSlot?.userTeam?.logo && (
                            <img
                                src={saveSlot.userTeam.logo}
                                alt={saveSlot.userTeam.team}
                                className="team-logo team-logo-inline"
                            />
                        )}
                        <h1 className="team-name">{saveSlot?.userTeam?.team}</h1>
                    </div>
                    <div className="position-badge">
                        {getUserTeamPosition() && getOrdinalSuffix(getUserTeamPosition())}
                    </div>
                </div>
            </div>

            <div className="full-standings-container">
                <div className="standings-header">
                    <div className="league-badge">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/512px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png" alt="La Liga" />
                    </div>
                    <h2>La Liga Full Standings</h2>
                </div>

                <div className="full-standings-table">
                    <div className="table-header">
                        <span className="col-pos">P</span>
                        <span className="col-team"></span>
                        <span className="col-stat">MP</span>
                        <span className="col-stat">W</span>
                        <span className="col-stat">D</span>
                        <span className="col-stat">L</span>
                        <span className="col-stat">GF</span>
                        <span className="col-stat">GA</span>
                        <span className="col-stat">GD</span>
                        <span className="col-stat">PTS</span>
                    </div>
                    {standings.map((standing) => (
                        <div
                            key={standing._id}
                            className={`table-row ${standing.isUserTeam ? 'user-team' : ''}`}
                        >
                            <span className="col-pos">{standing.position}</span>
                            <div className="col-team">
                                <img src={standing.team.logo} alt={standing.team.team} />
                                <span>{standing.team.team}</span>
                            </div>
                            <span className="col-stat">{standing.played}</span>
                            <span className="col-stat">{standing.wins}</span>
                            <span className="col-stat">{standing.draws}</span>
                            <span className="col-stat">{standing.losses}</span>
                            <span className="col-stat">{standing.goalsFor}</span>
                            <span className="col-stat">{standing.goalsAgainst}</span>
                            <span className="col-stat">{standing.goalsFor - standing.goalsAgainst}</span>
                            <span className="col-stat col-pts">{standing.points}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Standings;
