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
    const [upcomingFixtures, setUpcomingFixtures] = useState([]);

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

                // Get upcoming fixtures (next 5 matches after next match)
                const upcoming = fixturesRes.data
                    .filter(f => f.status === 'pending')
                    .slice(0, 5);
                setUpcomingFixtures(upcoming);
            }
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
        <>
            <div className="league-dashboard">
                <div className="top-bar">
                    <button className="back-btn" onClick={() => navigate('/league-format')}>
                        ← Back to Slots
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

                {/* Main Content Grid */}
                <div className="dashboard-grid">
                    {/* Left: Standings Table */}
                    <div
                        className="standings-section standings-clickable"
                        onClick={() => navigate(`/league-format/standings/${slotNumber}`)}
                    >
                        <div className="standings-header">
                            <div className="league-badge">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/512px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png" alt="La Liga" />
                            </div>
                            <h2>La Liga Standings</h2>
                        </div>
                        <div className="standings-table">
                            <div className="table-header">
                                <span className="col-pos">P</span>
                                <span className="col-team"></span>
                                <span className="col-stat">W</span>
                                <span className="col-stat">D</span>
                                <span className="col-stat">L</span>
                                <span className="col-stat">GF</span>
                                <span className="col-stat">GA</span>
                                <span className="col-stat">PTS</span>
                            </div>
                            {standings.slice(0, 9).map((standing) => (
                                <div
                                    key={standing._id}
                                    className={`table-row ${standing.isUserTeam ? 'user-team' : ''}`}
                                >
                                    <span className="col-pos">{standing.position}</span>
                                    <div className="col-team">
                                        <img src={standing.team.logo} alt={standing.team.team} />
                                        <span>{standing.team.team}</span>
                                    </div>
                                    <span className="col-stat">{standing.wins}</span>
                                    <span className="col-stat">{standing.draws}</span>
                                    <span className="col-stat">{standing.losses}</span>
                                    <span className="col-stat">{standing.goalsFor}</span>
                                    <span className="col-stat">{standing.goalsAgainst}</span>
                                    <span className="col-stat col-pts">{standing.points}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Next Game & Upcoming Fixtures */}
                    <div className="right-panel">
                        {/* Next Game */}
                        {nextMatch && (
                            <div className="next-game-card">
                                <h2>NEXT GAME</h2>
                                <div className="match-display">
                                    <div className="match-team">
                                        <img src={nextMatch.homeTeam.logo} alt={nextMatch.homeTeam.team} />
                                        <span>{nextMatch.homeTeam.team}</span>
                                    </div>
                                    <div className="vs">VS</div>
                                    <div className="match-team">
                                        <img src={nextMatch.awayTeam.logo} alt={nextMatch.awayTeam.team} />
                                        <span>{nextMatch.awayTeam.team}</span>
                                    </div>
                                </div>
                                <button
                                    className="simulate-btn"
                                    onClick={() => navigate(`/league-format/match/${slotNumber}`)}
                                >
                                    Simulate Game
                                </button>
                            </div>
                        )}

                        {/* Upcoming Fixtures */}
                        <div className="upcoming-fixtures-card">
                            <h2>UPCOMING FIXTURES</h2>
                            <div className="fixtures-list">
                                {upcomingFixtures.map((fixture, index) => (
                                    <div key={fixture._id || index} className="fixture-item">
                                        <div className="fixture-team-left">
                                            <span>{fixture.homeTeam.team}</span>
                                            <img src={fixture.homeTeam.logo} alt={fixture.homeTeam.team} />
                                        </div>
                                        <span className="fixture-vs">VS</span>
                                        <div className="fixture-team-right">
                                            <img src={fixture.awayTeam.logo} alt={fixture.awayTeam.team} />
                                            <span>{fixture.awayTeam.team}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LeagueDashboard; 