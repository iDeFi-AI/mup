import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperPlane, faPencilAlt, faCog } from '@fortawesome/free-solid-svg-icons'; // Added faCog for the gear icon
import AgentManagementModal from '@/components/agents'; // Import the Agent modal component

const AIChat: React.FC = () => {
  const [Spline, setSpline] = useState<any>(null);
  const [input, setInput] = useState<string>(''); // User prompt input
  const [listening, setListening] = useState<boolean>(false); // Voice recognition state
  const [showModal, setShowModal] = useState<boolean>(false); // Modal control
  const [modalType, setModalType] = useState<'voice' | 'text' | null>(null); // Modal type to handle text/voice input
  const [showAgentModal, setShowAgentModal] = useState<boolean>(false); // State for agent management modal

  // Preloaded prompt example to showcase AI syncing with addresses (or any other use case)
  const preloadedPrompt = 'Syncing addresses and analyzing transactions for potential risks...';

  // Voice recognition setup
  const SpeechRecognition =
    typeof window !== 'undefined' &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

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
    if (!recognition) return;

    setListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); // Set the spoken text to input field
      setListening(false);
      handleSubmit(); // Automatically submit after voice input
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };
  };

  // Handle submitting the prompt input
  const handleSubmit = async (prompt?: string) => {
    const userPrompt = prompt || input;
    if (!userPrompt) return;

    // For now, just log the prompt or handle it differently as per your needs
    console.log('Submitted Prompt:', userPrompt);
  };

  // Open modal for voice or text input
  const openModal = (type: 'voice' | 'text') => {
    setModalType(type);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  // Show preloaded prompt on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleSubmit(preloadedPrompt); // Automatically trigger AI with preloaded prompt
    }
  }, []);

  // Open agent modal when gear is clicked
  const openAgentModal = () => {
    setShowAgentModal(true);
  };

  // Close agent modal
  const closeAgentModal = () => {
    setShowAgentModal(false);
  };

  const handleMintAgent = (agentRole: string) => {
    console.log(`Minted agent with role: ${agentRole}`);
    setShowAgentModal(false);
  };

  return (
    <div style={styles.container}>
      {/* Icons Grouped in One Container */}
      <div style={styles.iconGroup}>
        <div onClick={() => openModal('text')} style={styles.iconContainer}>
          <FontAwesomeIcon icon={faPencilAlt} style={styles.icon} />
        </div>
        <div onClick={() => openModal('voice')} style={styles.iconContainer}>
          <FontAwesomeIcon icon={faMicrophone} style={styles.icon} />
        </div>
        <div onClick={openAgentModal} style={styles.iconContainer}>
          <FontAwesomeIcon icon={faCog} style={styles.icon} />
        </div>
      </div>

      {/* Render AIChat modal when either pencil or microphone is clicked */}
      {showModal && (
        <div className="modal-container" style={styles.modalContainer}>
          <div className="modal-content" style={styles.modalContent}>
            <h2>{modalType === 'voice' ? 'Voice Input' : 'Text Input'} for AI</h2>

            {modalType === 'text' && (
              <div style={styles.inputSection}>
                <input
                  type="text"
                  placeholder="Enter a prompt for the AI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={styles.input}
                />
                <button onClick={() => handleSubmit()} style={styles.sendButton}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            )}

            {modalType === 'voice' && (
              <div style={styles.inputSection}>
                <button onClick={startListening} style={styles.micButton}>
                  <FontAwesomeIcon icon={faMicrophone} /> Start Voice Command
                </button>
                {listening && <div style={styles.soundBar}>Listening...</div>}
              </div>
            )}

            <button onClick={closeModal} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Agent Management Modal */}
      {showAgentModal && (
        <AgentManagementModal onClose={closeAgentModal} onMint={handleMintAgent} />
      )}

      {/* Render AIChat agent */}
      <div style={styles.splineContainer}>
        {Spline ? (
          <Spline
            scene="https://prod.spline.design/YzJ9nu0DOvW6uWZO/scene.splinecode"
            style={styles.spline}
            onWheel={(e: any) => e.preventDefault()} // Prevent scroll zoom
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

// Styling for the component
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    position: 'relative',
  },
  iconGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '150px', // Ensure enough space between icons
    position: 'absolute',
    top: '20px',
    zIndex: 1002,
  },
  iconContainer: {
    padding: '8px',
    backgroundColor: 'rgba(0, 123, 255, 0.2)',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  icon: {
    fontSize: '24px',
    color: '#007bff',
  },
  splineContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '250px',
    height: '250px',
    borderRadius: '15px', // Slightly larger border radius for modern look
    overflow: 'hidden',
    position: 'relative',
  },
  spline: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  inputSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    width: '70%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  sendButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  micButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  soundBar: {
    marginTop: '10px',
    backgroundColor: '#007bff',
    height: '5px',
    width: '100%',
    animation: 'soundbarAnimation 1s infinite',
  },
  closeButton: {
    backgroundColor: '#ff7e2f',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AIChat;
