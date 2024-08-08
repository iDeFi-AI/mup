'use client'

import React, { useEffect, useState } from 'react';

interface HexagonScoreProps {
  seed: string;
  generatedScore: number | null;
  flagged: boolean;
}

const HexagonScore: React.FC<HexagonScoreProps> = ({ seed, generatedScore, flagged }) => {
  const [currentScore, setCurrentScore] = useState<number | null>(null);

  useEffect(() => {
    if (generatedScore !== null) {
      setCurrentScore(generatedScore);
    } else {
      const hash = hashCode(seed);
      const uniqueScore = Math.abs(hash) % 851; // Ensure it's between 0 and 850
      setCurrentScore(uniqueScore);
    }
  }, [seed, generatedScore]);

  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    return hash;
  };

  // Simple color indicator based on the flagged status
  const getBackgroundColor = (flagged: boolean): string => {
    return flagged ? '#ff6666' : '#4caf50'; // Red for flagged, green for not flagged
  };

  const backgroundColor = getBackgroundColor(flagged);

  return (
    <div className="flex flex-col items-center mb-6">
      <span className="text-3xl" style={{ color: backgroundColor }}>
        {currentScore !== null ? currentScore : 'Score'}
      </span>
    </div>
  );
};

export default HexagonScore;
