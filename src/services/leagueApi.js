const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Save Slot APIs
export const getAllSaveSlots = async () => {
    const response = await fetch(`${API_BASE_URL}/save-slots`);
    if (!response.ok) throw new Error('Failed to fetch save slots');
    return response.json();
};

export const getSaveSlot = async (slotNumber) => {
    const response = await fetch(`${API_BASE_URL}/save-slots/${slotNumber}`);
    if (!response.ok) throw new Error('Failed to fetch save slot');
    return response.json();
};

export const initializeSaveSlot = async (slotNumber, teamId) => {
    const response = await fetch(`${API_BASE_URL}/save-slots/${slotNumber}/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initialize save slot');
    }
    return response.json();
};

export const deleteSaveSlot = async (slotNumber) => {
    const response = await fetch(`${API_BASE_URL}/save-slots/${slotNumber}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete save slot');
    return response.json();
};

// Team APIs
export const getAllTeams = async () => {
    const response = await fetch(`${API_BASE_URL}/teams`);
    if (!response.ok) throw new Error('Failed to fetch teams');
    return response.json();
};

// League Standings APIs
export const getStandings = async (slotNumber) => {
    const response = await fetch(`${API_BASE_URL}/save-slots/${slotNumber}/standings`);
    if (!response.ok) throw new Error('Failed to fetch standings');
    return response.json();
};

// Match APIs
export const getMatchdayFixtures = async (slotNumber, matchday) => {
    const response = await fetch(`${API_BASE_URL}/save-slots/${slotNumber}/matchday/${matchday}/fixtures`);
    if (!response.ok) throw new Error('Failed to fetch fixtures');
    return response.json();
};

export const getNextMatch = async (slotNumber) => {
    const response = await fetch(`${API_BASE_URL}/save-slots/${slotNumber}/next-match`);
    if (!response.ok) throw new Error('Failed to fetch next match');
    return response.json();
};

export const playMatch = async (slotNumber) => {
    const response = await fetch(`${API_BASE_URL}/save-slots/${slotNumber}/play-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to play match');
    }
    return response.json();
};

export const submitMatchResult = async (slotNumber, matchId, homeScore, awayScore) => {
    const response = await fetch(`${API_BASE_URL}/save-slots/${slotNumber}/submit-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, homeScore, awayScore })
    });
    if (!response.ok) throw new Error('Failed to submit match result');
    return response.json();
};