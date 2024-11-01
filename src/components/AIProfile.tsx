import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperPlane, faPencilAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import Soundbar from './Soundbar';

interface AIProfileProps {
  selectedAgent: number;
  onAgentChange: (index: number) => void;
}

const AIProfile: React.FC<AIProfileProps> = ({ selectedAgent, onAgentChange }) => {
  const [Spline, setSpline] = useState<any>(null);
  const [input, setInput] = useState<string>('');
  const [listening, setListening] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'voice' | 'text' | null>(null);
  const [showAgentModal, setShowAgentModal] = useState<boolean>(false);

  const agents = [
    {
      name: 'iNFA #001',
      imageUrl: '/iNFA1.png',
      traits: { Mining: 75, Building: 60, Defending: 45, Scouting: 85, Healing: 55 },
    },
    {
      name: 'iNFA #002',
      imageUrl: '/iNFA2.png',
      traits: { Mining: 65, Building: 75, Defending: 60, Scouting: 50, Healing: 70 },
    },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async () => {
        try {
          const SplineModule = await import('@splinetool/react-spline');
          setSpline(() => SplineModule.default);
        } catch (error) {
          console.error('Error loading Spline:', error);
        }
      })();
    }
  }, []);

  const startListening = () => {
    setListening(true);
    // Implement voice recognition logic
  };

  const openModal = (type: 'voice' | 'text') => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  const openAgentModal = () => {
    setShowAgentModal(true);
  };

  const closeAgentModal = () => {
    setShowAgentModal(false);
  };

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value, 10);
    onAgentChange(selectedIndex); // Sync with parent component
  };

  return (
    <div className="container">
      <div className="iconGroup">
        <div onClick={() => openModal('text')} className="iconContainer">
          <FontAwesomeIcon icon={faPencilAlt} className="icon" />
        </div>
        <div onClick={() => openModal('voice')} className="iconContainer">
          <FontAwesomeIcon icon={faMicrophone} className="icon" />
        </div>
        <div onClick={openAgentModal} className="iconContainer">
          <FontAwesomeIcon icon={faCog} className="icon" />
        </div>
      </div>

      {showModal && (
        <div className="modalContainer">
          <div className="modalContent">
            <h2>{modalType === 'voice' ? 'Voice Input' : 'Text Input'} for AI</h2>
            {modalType === 'text' && (
              <div className="inputSection">
                <textarea
                  placeholder="Enter a prompt for the AI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="input"
                />
                <button className="sendButton">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            )}
            {modalType === 'voice' && (
              <div className="inputSection">
                <div className="voiceInput">
                  <input
                    type="text"
                    placeholder="Listening..."
                    value={input}
                    readOnly
                    className="input voiceDisplay"
                  />
                  {listening && <Soundbar listening={listening} />}
                </div>
                <button onClick={startListening} className="micButton">
                  <FontAwesomeIcon icon={faMicrophone} /> Start Voice Command
                </button>
              </div>
            )}
            <button onClick={closeModal} className="closeButton">Close</button>
          </div>
        </div>
      )}

      {showAgentModal && (
        <div className="modalContainer">
          <div className="modalContent">
            <h2>Review Your Agent(s)</h2>
            <select onChange={handleAgentChange} value={selectedAgent} className="agentSelect">
              {agents.map((agent, index) => (
                <option key={index} value={index}>
                  {agent.name}
                </option>
              ))}
            </select>

            <div className="agentDetails">
              <img src={agents[selectedAgent].imageUrl} alt={agents[selectedAgent].name} className="agentImage" />
              <div className="traits">
                {Object.entries(agents[selectedAgent].traits).map(([trait, level]) => (
                  <div key={trait} className="trait">
                    <span className="traitIcon">{getTraitIcon(trait)}</span>
                    <span className="traitName">{trait}</span>
                    <div className="progressBar">
                      <div className="progress" style={{ width: `${level}%`, backgroundColor: getTraitColor(trait) }}>
                        {level}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={closeAgentModal} className="closeButton">Close</button>
          </div>
        </div>
      )}

      <div className="splineContainer">
        {Spline ? (
          <Spline
            scene="https://prod.spline.design/YzJ9nu0DOvW6uWZO/scene.splinecode"
            className="spline"
            onWheel={(e: any) => e.preventDefault()}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <style jsx>{`
        .container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          position: relative;
        }

        .iconGroup {
          display: flex;
          justify-content: space-between;
          width: 150px;
          position: absolute;
          top: 20px;
          z-index: 1002;
        }

        .iconContainer {
          padding: 8px;
          background-color: rgba(0, 123, 255, 0.2);
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .icon {
          font-size: 24px;
          color: #007bff;
        }

        .splineContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 250px;
          height: 250px;
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          z-index: 1000;
        }

        .modalContainer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1004;
        }

        .modalContent {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          max-width: 600px;
          width: 90%;
        }

        .inputSection {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .input {
          width: 100%;
          padding: 20px;
          font-size: 20px;
          border-radius: 8px;
          border: 1px solid #ddd;
          resize: none;
          min-height: 150px;
        }

        .voiceInput {
          width: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .voiceDisplay {
          font-size: 18px;
          text-align: center;
        }

        .sendButton, .micButton {
          padding: 15px 30px;
          font-size: 18px;
          background-color: #007bff;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          border: none;
        }

        .closeButton {
          background-color: #ff7e2f;
          color: white;
          padding: 10px 20px;
          font-size: 16px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 15px;
          border: none;
        }

        .agentSelect {
          margin-top: 10px;
          padding: 12px;
          font-size: 18px;
          width: 100%;
          border-radius: 4px;
        }

        .agentDetails {
          margin-top: 20px;
        }

        .agentImage {
          width: 100px;
          height: 100px;
          border-radius: 20%;
          margin-bottom: 20px;
        }

        .traits {
          text-align: left;
        }

        .trait {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .traitIcon {
          width: 24px;
          margin-right: 8px;
        }

        .traitName {
          width: 80px;
          font-weight: bold;
        }

        .progressBar {
          flex: 1;
          background-color: #000;
          border-radius: 10px;
          overflow: hidden;
          height: 15px;
          margin-left: 15px;
        }

        .progress {
          height: 100%;
          color: white;
          text-align: right;
          padding-right: 5px;
          border-radius: 5px;
          font-size: 10px;
        }
      `}</style>
    </div>
  );
};

const getTraitIcon = (trait: string) => {
  switch (trait) {
    case 'Mining': return '⛏️';
    case 'Building': return '🏗️';
    case 'Defending': return '🛡️';
    case 'Scouting': return '🔍';
    case 'Healing': return '➕';
    default: return '';
  }
};

const getTraitColor = (trait: string) => {
  switch (trait) {
    case 'Mining': return '#FF7300';
    case 'Building': return '#BF52B4';
    case 'Defending': return '#55D0FF';
    case 'Scouting': return '#FFE600';
    case 'Healing': return '#45DC6F';
    default: return '#C8C8D9';
  }
};

export default AIProfile;
