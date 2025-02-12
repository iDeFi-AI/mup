import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faAtom, faBolt } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react'; // Tooltip for additional info

const CreateAgent: React.FC = () => {
  const [agentName, setAgentName] = useState<string>('');
  const [assignedTools, setAssignedTools] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Dashboard tools that can be assigned to the Free Agent
  const dashboardTools = [
    { name: 'Security Check', id: 'SecurityCheck' },
    { name: 'Financial Roadmap', id: 'FinancialRoadmap' },
    { name: 'Investment Simulator', id: 'InvestmentSimulator' },
    { name: 'Visualize Wallet', id: 'VisualizeWallet' },
  ];

  const handleToolAssignment = (tool: string) => {
    setAssignedTools((prevTools) =>
      prevTools.includes(tool) ? prevTools.filter((t) => t !== tool) : [...prevTools, tool]
    );
  };

  const createFreeAgent = async () => {
    if (agentName && assignedTools.length > 0) {
      try {
        const payload = {
          agentName,
          agentType: 'free-agent',
          assignedTools,
        };

        // Assuming the backend will handle the agent creation logic
        const response = await fetch('/api/agents/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          setStatusMessage(`Free Agent "${agentName}" created successfully with tools: ${data.tools}`);
        } else {
          const errorData = await response.json();
          setStatusMessage(`Error: ${errorData.error}`);
        }
      } catch (error) {
        setStatusMessage('An error occurred while creating the agent.');
      }
    } else {
      setStatusMessage('Please provide an agent name and assign at least one tool.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Mint and Deploy a New iNFAgent</h2>

      {/* Agent creation options */}
      <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md bg-gray-100 mb-4">
        <input
          type="text"
          placeholder="Name Your iNFAgent"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          className="mb-4 p-2 border rounded"
        />

        {/* Tool Assignment */}
        <div className="mb-4">
          <h4 className="mb-2">Assign Tools to you iNFAgent:</h4>
          <div className="flex flex-wrap gap-4">
            {dashboardTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolAssignment(tool.id)}
                className={`py-2 px-4 border rounded ${
                  assignedTools.includes(tool.id) ? 'bg-neorange text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={createFreeAgent}
          className="py-2 px-4 bg-neorange text-white rounded mt-4 hover:bg-neorange-dark"
        >
          Create Free Agent
        </button>

        {/* Status Message */}
        {statusMessage && (
          <p className="mt-4 text-gray-700">{statusMessage}</p>
        )}
      </div>

      {/* Greyed out agent options for Agent, Smart Agent, and Quantum Agent */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Agent (Greyed Out) */}
        <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md bg-gray-100 opacity-50">
          <FontAwesomeIcon icon={faBolt} className="text-3xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">Agent</h3>
          <p className="text-gray-500">Custom analytics and AI agent tools.</p>
          <p className="text-red-500 mt-2">Not available in Beta</p>
          <Tippy content="This agent handles basic AI tasks such as API interactions and analytics. It is not available in the beta version.">
            <span className="cursor-pointer text-blue-500 text-sm">Learn more</span>
          </Tippy>
        </div>

        {/* Smart Agent (Greyed Out) */}
        <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md bg-gray-100 opacity-50">
          <FontAwesomeIcon icon={faRobot} className="text-3xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">Smart Agent</h3>
          <p className="text-gray-500">Enhanced analytics and smart contract AI tools.</p>
          <p className="text-red-500 mt-2">Not available in Beta</p>
          <Tippy content="This agent integrates smart contracts, automates blockchain tasks, and provides real-time insights. Not available in beta.">
            <span className="cursor-pointer text-blue-500 text-sm">Learn more</span>
          </Tippy>
        </div>

        {/* Quantum Agent (Greyed Out) */}
        <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md bg-gray-100 opacity-50">
          <FontAwesomeIcon icon={faAtom} className="text-3xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">Quantum Agent</h3>
          <p className="text-gray-500">Advanced quantum-powered analytics and AI tools.</p>
          <p className="text-red-500 mt-2">Not available in Beta</p>
          <Tippy content="This agent uses quantum computing to optimize portfolios and perform complex calculations. Not available in beta.">
            <span className="cursor-pointer text-blue-500 text-sm">Learn more</span>
          </Tippy>
        </div>
      </div>
    </div>
  );
};

export default CreateAgent;
