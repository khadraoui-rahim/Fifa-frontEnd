import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSaveSlot, getStandings, getNextMatch, getMatchdayFixtures } from '../services/leagueApi';
import './LeagueDashboard.css';

function LeagueDashboard() {
    const navigate = useNavigate();
    const { slotNumber } = useParams();
    const [saveSlot, setSaveSlot] = useState(null);
    const [standings, setStandings] = useState([]);
    const [nextMatch, setNextMatch] = useState(null);
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('standings');

    useEffect(() => {
        loadDashboardData();
    }, [slotNumber]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [slotRes, standingsRes, matchRes] = await Promise.all([
                getSaveSlot(slotNumber),
                getStandings(slotNumber),
                getNextMatch(slotNumber).catch(() => ({ data: null }))
            ]);

            setSaveSlot(slotRes.data);
            setStandings(standingsRes.data);
            setNextMatch(matchRes.data);

            // Load current matchday fixtures
            if (slotRes.data?.currentMatchday) {
                const fixturesRes = await getMatchdayFixtures(slotNumber, slotRes.data.currentMatchday);
                setFixtures(fixturesRes.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getPositionColor = (position) => {
        if (position <= 4) return '#4caf50'; // Champions League
        if (position <= 6) return '#2196f3'; // Europa League
        if (position >= 18) return '#f44336'; // Relegation
        return '#666';
    };

    if (loading) {
        return (
            <div className="league-dashboard">
                <div className="loading">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="league-dashboard">
                <div className="error">Error: {error}</div>
                <button onClick={() => navigate('/league-format')}>Back to Slots</button>
            </div>
        );
    }

    return (
        <div className="league-dashboard">
            <div className="dashboard-header">
                <button className="back-btn" onClick={() => navigate('/league-format')}>
                    ← Back to Slots
                </button>
                <div className="header-info">
                    <div className="team-info">
                        {saveSlot?.userTeam?.logo && (
                            <img src={saveSlot.userTeam.logo} alt={saveSlot.userTeam.team} />
                        )}
                        <div>
                            <h1>{saveSlot?.userTeam?.team}</h1>
                            <p>Season {saveSlot?.currentSeason} - Matchday {saveSlot?.currentMatchday}/38</p>
                        </div>
                    </div>
                </div>
            </div>

            {nextMatch && (
                <div className="next-match-banner">
                    <h2>🎮 Next Match</h2>
                    <div className="match-info">
                        <div className="team">
                            <img src={nextMatch.homeTeam.logo} alt={nextMatch.homeTeam.team} />
                            <span>{nextMatch.homeTeam.team}</span>
                        </div>
                        <div className="vs">VS</div>
                        <div className="team">
                            <img src={nextMatch.awayTeam.logo} alt={nextMatch.awayTeam.team} />
                            <span>{nextMatch.awayTeam.team}</span>
                        </div>
                    </div>
                    <button
                        className="play-match-btn"
                        onClick={() => navigate(`/league-format/match/${slotNumber}`)}
                    >
                        Play Match
                    </button>
                </div>
            )}

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'standings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('standings')}
                >
                    Standings
                </button>
                <button
                    className={`tab ${activeTab === 'fixtures' ? 'active' : ''}`}
                    onClick={() => setActiveTab('fixtures')}
                >
                    Fixtures
                </button>
            </div>

            {activeTab === 'standings' && (
                <div className="standings-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Team</th>
                                <th>P</th>
                                <th>W</th>
                                <th>D</th>
                                <th>L</th>
                                <th>GF</th>
                                <th>GA</th>
                                <th>GD</th>
                                <th>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standings.map((standing) => (
                                <tr
                                    key={standing._id}
                                    className={standing.isUserTeam ? 'user-team' : ''}
                                >
                                    <td>
                                        <span
                                            className="position"
                                            style={{ color: getPositionColor(standing.position) }}
                                        >
                                            {standing.position}
                                        </span>
                                    </td>
                                    <td className="team-cell">
                                        <img src={standing.team.logo} alt={standing.team.team} />
                                        <span>{standing.team.team}</span>
                                    </td>
                                    <td>{standing.matchesPlayed}</td>
                                    <td>{standing.wins}</td>
                                    <td>{standing.draws}</td>
                                    <td>{standing.losses}</td>
                                    <td>{standing.goalsFor}</td>
                                    <td>{standing.goalsAgainst}</td>
                                    <td>{standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}</td>
                                    <td className="points"><strong>{standing.points}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'fixtures' && (
                <div className="fixtures-list">
                    <h3>Matchday {saveSlot?.currentMatchday} Fixtures</h3>
                    {fixtures.map((fixture) => (
                        <div
                            key={fixture._id}
                            className={`fixture-card ${fixture.isUserMatch ? 'user-match' : ''} ${fixture.status !== 'pending' ? 'completed' : ''}`}
                        >
                            <div className="fixture-teams">
                                <div className="fixture-team">
                                    <img src={fixture.homeTeam.logo} alt={fixture.homeTeam.team} />
                                    <span>{fixture.homeTeam.team}</span>
                                </div>
                                <div className="fixture-score">
                                    {fixture.status !== 'pending' ? (
                                        <span className="score">{fixture.homeScore} - {fixture.awayScore}</span>
                                    ) : (
                                        <span className="vs">VS</span>
                                    )}
                                </div>
                                <div className="fixture-team">
                                    <img src={fixture.awayTeam.logo} alt={fixture.awayTeam.team} />
                                    <span>{fixture.awayTeam.team}</span>
                                </div>
                            </div>
                            {fixture.status !== 'pending' && (
                                <div className="fixture-status">
                                    {fixture.status === 'completed' ? '✅ Played' : '🤖 Simulated'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LeagueDashboard;