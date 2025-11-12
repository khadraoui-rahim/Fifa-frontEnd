import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNextMatch, playMatch } from '../services/leagueApi';
import './MatchPlay.css';

function MatchPlay() {
    const navigate = useNavigate();
    const { slotNumber } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);
    const [error, setError] = useState(null);
    const [simulationResults, setSimulationResults] = useState(null);

    useEffect(() => {
        loadMatch();
    }, [slotNumber]);

    const loadMatch = async () => {
        try {
            setLoading(true);
            const response = await getNextMatch(slotNumber);
            setMatch(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayMatch = async () => {
        if (simulating) return;

        try {
            setSimulating(true);
            const response = await playMatch(slotNumber);
            setSimulationResults(response.data);
        } catch (err) {
            alert('Failed to simulate match: ' + err.message);
            setSimulating(false);
        }
    };

    const handleBackToDashboard = () => {
        navigate(`/league-format/dashboard/${slotNumber}`);
    };

    if (loading) {
        return (
            <div className="match-play">
                <div className="loading">Loading match...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="match-play">
                <div className="error">Error: {error}</div>
                <button onClick={handleBackToDashboard}>Back to Dashboard</button>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="match-play">
                <div className="no-match">
                    <h2>🏆 Season Complete!</h2>
                    <p>No more matches to play</p>
                    <button onClick={handleBackToDashboard}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    if (simulationResults) {
        return (
            <div className="match-play">
                <div className="results-screen">
                    <h1>✅ Match Complete!</h1>
                    
                    <div className="user-result">
                        <h2>Your Match Result</h2>
                        <div className="result-display">
                            <div className="result-team">
                                <img src={simulationResults.userMatch.homeTeam.logo} alt={simulationResults.userMatch.homeTeam.team} />
                                <span>{simulationResults.userMatch.homeTeam.team}</span>
                            </div>
                            <div className="result-score">
                                <span className="score">{simulationResults.userMatch.homeScore} - {simulationResults.userMatch.awayScore}</span>
                            </div>
                            <div className="result-team">
                                <img src={simulationResults.userMatch.awayTeam.logo} alt={simulationResults.userMatch.awayTeam.team} />
                                <span>{simulationResults.userMatch.awayTeam.team}</span>
                            </div>
                        </div>
                        {simulationResults.userMatch.description && (
                            <p className="match-description">{simulationResults.userMatch.description}</p>
                        )}
                    </div>

                    <div className="simulation-info">
                        <h3>🤖 AI Simulation Complete</h3>
                        <p>{simulationResults.simulatedMatches} matches simulated</p>
                        {simulationResults.matchdayComplete && (
                            <p className="matchday-complete">
                                ✅ Matchday Complete!
                                <br />
                                Next: Matchday {simulationResults.nextMatchday}
                            </p>
                        )}
                    </div>

                    <button
                        className="dashboard-btn"
                        onClick={handleBackToDashboard}
                    >
                        View Updated Standings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="match-play">
            <div className="match-container">
                <button className="back-btn" onClick={handleBackToDashboard}>
                    ← Back
                </button>

                <div className="match-header">
                    <h1>Matchday {match.matchday}</h1>
                    <p>Enter your match result</p>
                </div>

                <div className="match-display">
                    <div className="match-team">
                        <img src={match.homeTeam.logo} alt={match.homeTeam.team} />
                        <h2>{match.homeTeam.team}</h2>
                        <span className="rating">Rating: {match.homeTeam.rating.toFixed(2)}</span>
                    </div>

                    <div className="vs-section">
                        <span className="vs">VS</span>
                    </div>

                    <div className="match-team">
                        <img src={match.awayTeam.logo} alt={match.awayTeam.team} />
                        <h2>{match.awayTeam.team}</h2>
                        <span className="rating">Rating: {match.awayTeam.rating.toFixed(2)}</span>
                    </div>
                </div>

                <div className="play-section">
                    <button
                        className="simulate-btn"
                        onClick={handlePlayMatch}
                        disabled={simulating}
                    >
                        {simulating ? '⚽ Simulating Match...' : '🎮 Play Match'}
                    </button>

                    {simulating && (
                        <div className="simulating-info">
                            <div className="spinner"></div>
                            <p>Using AI to simulate your match...</p>
                            <p className="sub-text">This may take a few seconds</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MatchPlay;