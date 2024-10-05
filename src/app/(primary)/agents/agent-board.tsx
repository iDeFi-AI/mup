import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faRobot,
  faAtom,
  faCheckCircle,
  faTimesCircle,
  faQuestionCircle,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const AgentBoard: React.FC = () => {
  const [agents, setAgents] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false); // For manual refresh

  useEffect(() => {
    fetchAgents();
  }, []);

  // Function to fetch agent statuses
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/agents/status'); // Update the endpoint to match the API path
      setAgents(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch agent status.');
      setLoading(false);
    }
  };

  // Function to trigger an agent task manually
  const triggerAgentTask = async (agentName: string) => {
    try {
      await axios.post('/api/agents/trigger', { agent_name: agentName });
      alert(`Task triggered for ${agentName}`);
      fetchAgents(); // Fetch updated agent status after triggering
    } catch (error) {
      alert(`Failed to trigger task for ${agentName}`);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAgents();
    setRefreshing(false);
  };

  // Display loading, error, or the agent list
  if (loading) {
    return <p className="text-center text-xl font-semibold">Loading agents...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Agent Dashboard</h2>
        <button
          onClick={handleRefresh}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <FontAwesomeIcon icon={faSyncAlt} spin={refreshing} className="mr-2" />
          {refreshing ? 'Refreshing...' : 'Refresh Agents'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Object.keys(agents).map((agentKey) => {
          const agent = agents[agentKey];
          const isTaskCompleted = agent.status === 'Task Completed';
          const isQuantumAgent = agentKey.startsWith('Q');
          const isSmartAgent = agentKey.startsWith('Agent');

          // Icons for agents
          const agentIcon = isQuantumAgent ? faAtom : isSmartAgent ? faRobot : faBolt;
          const agentStatusColor = isTaskCompleted ? 'text-green-500' : 'text-red-500';

          return (
            <div
              key={agentKey}
              className="flex flex-col items-center text-center border p-6 rounded-lg shadow-md bg-white relative"
            >
              {/* Agent Icon */}
              <FontAwesomeIcon icon={agentIcon} className={`text-5xl mb-4 ${isTaskCompleted ? 'text-neorange' : 'text-gray-400'}`} />

              {/* Agent Name */}
              <h3 className="text-lg font-semibold text-gray-800">{agentKey}</h3>
              <p className="text-gray-500 mb-4">Status: {agent.status}</p>

              {/* Tooltip for showing results */}
              <Tippy
                content={agent.result ? `Last result: ${JSON.stringify(agent.result)}` : 'No result available'}
                placement="top"
                theme="light"
              >
                <FontAwesomeIcon icon={faQuestionCircle} className="text-gray-500 absolute top-4 right-4 cursor-pointer" />
              </Tippy>

              {/* Task Status */}
              <div className="mt-4 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={isTaskCompleted ? faCheckCircle : faTimesCircle}
                  className={`${agentStatusColor} text-3xl mr-2`}
                />
                <p className="text-gray-600">{isTaskCompleted ? 'Task Completed' : 'Running...'}</p>
              </div>

              {/* Trigger Agent Button */}
              <button
                className="py-2 px-4 bg-neorange text-white rounded mt-6 hover:bg-orange-600 w-full"
                onClick={() => triggerAgentTask(agentKey)}
              >
                Trigger Task
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentBoard;
