import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSaveSlots, deleteSaveSlot } from '../services/leagueApi';
import './LeagueFormat.css';

function LeagueFormat() {
    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSlots();
    }, []);

    const loadSlots = async () => {
        try {
            setLoading(true);
            const response = await getAllSaveSlots();
            setSlots(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotClick = (slot) => {
        if (slot.isEmpty) {
            // Navigate to team selection
            navigate(`/league-format/team-selection/${slot.slotNumber}`);
        } else {
            // Navigate to league dashboard
            navigate(`/league-format/dashboard/${slot.slotNumber}`);
        }
    };

    const handleDeleteSlot = async (e, slotNumber) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this save slot?')) {
            try {
                await deleteSaveSlot(slotNumber);
                loadSlots();
            } catch (err) {
                alert('Failed to delete slot: ' + err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="league-format">
                <div className="loading">Loading save slots...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="league-format">
                <div className="error">Error: {error}</div>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="league-format">
            <div className="league-header">
                <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
                <h1>League Format - Save Slots</h1>
            </div>

            <div className="slots-container">
                {slots.map((slot) => (
                    <div
                        key={slot.slotNumber}
                        className={`save-slot ${slot.isEmpty ? 'empty' : 'occupied'}`}
                        onClick={() => handleSlotClick(slot)}
                    >
                        <div className="slot-header">
                            <h2>Slot {slot.slotNumber}</h2>
                            {!slot.isEmpty && (
                                <button
                                    className="delete-btn"
                                    onClick={(e) => handleDeleteSlot(e, slot.slotNumber)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {slot.isEmpty ? (
                            <div className="slot-content empty-content">
                                <div className="empty-icon">+</div>
                                <p>Create New Save</p>
                            </div>
                        ) : (
                            <div className="slot-content">
                                {slot.userTeam?.logo && (
                                    <img
                                        src={slot.userTeam.logo}
                                        alt={slot.userTeam.team}
                                        className="team-logo"
                                    />
                                )}
                                <h3>{slot.userTeam?.team}</h3>
                                <div className="slot-info">
                                    <p>Season {slot.currentSeason}</p>
                                    <p>Matchday {slot.currentMatchday}/38</p>
                                    <p>Matches: {slot.totalMatchesPlayed}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LeagueFormat;