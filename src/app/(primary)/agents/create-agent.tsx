import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faAtom, faBolt } from '@fortawesome/free-solid-svg-icons';

const CreateAgent: React.FC = () => {
  // URL of the contact form (upgrade process)
  const contactFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScQvaB9z86SbaM3JXgxFMhKLe0rJlfKyLBbn8BvkpHk1-gQlA/viewform";

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Create Your Agent</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
      <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md bg-gray-100">
          <FontAwesomeIcon icon={faBolt} className="text-3xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">Agent</h3>
          <p className="text-gray-500">Custom analytics and personal AI agent tools.</p>
          <p className="text-red-500 mt-2">Not available in Beta</p>
          <a
            href={contactFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 bg-gray-300 text-gray-600 rounded mt-2 hover:bg-neorange hover:text-white"
          >
            Contact Us to Upgrade
          </a>
        </div>
        {/* Smart Agent */}
        <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md bg-gray-100">
          <FontAwesomeIcon icon={faRobot} className="text-3xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">Smart Agent</h3>
          <p className="text-gray-500">Enhanced analytics and smart contract AI agent tools.</p>
          <p className="text-red-500 mt-2">Not available in Beta</p>
          <a
            href={contactFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 bg-gray-300 text-gray-600 rounded mt-2 hover:bg-neorange hover:text-white"
          >
            Contact Us to Upgrade
          </a>
        </div>

        {/* Quantum Agent */}
        <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md bg-gray-100">
          <FontAwesomeIcon icon={faAtom} className="text-3xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">Quantum Agent</h3>
          <p className="text-gray-500">Advanced quantum-powered analytics and AI tools.</p>
          <p className="text-red-500 mt-2">Not available in Beta</p>
          <a
            href={contactFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 bg-gray-300 text-gray-600 rounded mt-2 hover:bg-neorange hover:text-white"
          >
            Contact Us to Upgrade
          </a>
        </div>        
      </div>
    </div>
  );
};

export default CreateAgent;
