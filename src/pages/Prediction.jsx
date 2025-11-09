import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Prediction.css';

function Prediction() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scores, setScores] = useState({ home: null, away: null });
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!location.state) {
      navigate('/classic-match');
      return;
    }

    // Extract scores and description from prediction text
    const { prediction } = location.state;
    extractPrediction(prediction);
  }, [location.state, navigate]);

  const extractPrediction = (predictionText) => {
    // Try to extract structured format: Score: X-Y and Description: ...
    const scoreMatch = predictionText.match(/Score:\s*(\d+)\s*[-–—]\s*(\d+)/i);
    const descMatch = predictionText.match(/Description:\s*(.+)/is);
    
    if (scoreMatch) {
      setScores({
        home: parseInt(scoreMatch[1]),
        away: parseInt(scoreMatch[2])
      });
    } else {
      // Fallback: try to extract any score pattern
      const fallbackScore = predictionText.match(/(\d+)\s*[-–—]\s*(\d+)/);
      if (fallbackScore) {
        setScores({
          home: parseInt(fallbackScore[1]),
          away: parseInt(fallbackScore[2])
        });
      } else {
        setScores({ home: 0, away: 0 });
      }
    }

    if (descMatch) {
      setDescription(descMatch[1].trim());
    } else {
      // If no structured description, use the whole text
      setDescription(predictionText);
    }
  };

  if (!location.state) {
    return null;
  }

  const { homeTeam, awayTeam, prediction } = location.state;

  return (
    <div className="prediction-container">
      <h1 className="prediction-page-title">MATCH PREDICTION</h1>

      <div className="score-display-wrapper">
        {/* Home Team */}
        <div className="team-score-panel">
          <img 
            src={homeTeam.logo} 
            alt={homeTeam.team} 
            className="team-score-logo"
          />
          <h2 className="team-score-name">{homeTeam.team}</h2>
          <div className="score-box">{scores.home !== null ? scores.home : '-'}</div>
        </div>

        {/* VS Divider */}
        <div className="vs-divider">
          <span>VS</span>
        </div>

        {/* Away Team */}
        <div className="team-score-panel">
          <img 
            src={awayTeam.logo} 
            alt={awayTeam.team} 
            className="team-score-logo"
          />
          <h2 className="team-score-name">{awayTeam.team}</h2>
          <div className="score-box">{scores.away !== null ? scores.away : '-'}</div>
        </div>
      </div>

      {/* Match Description */}
      {description && (
        <div className="prediction-details">
          <h3 className="prediction-details-title">Match Summary</h3>
          <div className="prediction-details-content">
            <p>{description}</p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/classic-match')}>
        ← Back to Team Selection
      </button>
    </div>
  );
}

export default Prediction;
