import React, { useEffect, useState } from 'react';

interface SoundbarProps {
  listening: boolean;
}

const Soundbar: React.FC<SoundbarProps> = ({ listening }) => {
  const [audioLevels, setAudioLevels] = useState<number[]>([5, 5, 5, 5, 5]);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array;
    let animationFrameId: number;

    const initializeAudio = async () => {
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 32;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
        updateAudioLevels();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    const updateAudioLevels = () => {
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        const levels = Array.from(dataArray.slice(0, 5)).map(value => (value / 255) * 30 + 5);
        setAudioLevels(levels);
      }
      animationFrameId = requestAnimationFrame(updateAudioLevels);
    };

    if (listening) {
      initializeAudio();
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [listening]);

  return (
    <div className="soundbar">
      {audioLevels.map((level, index) => (
        <div key={index} className="bar" style={{ height: `${level}px` }}></div>
      ))}

      <style jsx>{`
        .soundbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 60px;
          height: 30px;
          margin: 15px auto;
        }

        .bar {
          width: 5px;
          background-color: #5fd2d2;
          border-radius: 2px;
          transition: height 0.1s;
        }
      `}</style>
    </div>
  );
};

export default Soundbar;
