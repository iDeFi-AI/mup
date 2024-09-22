import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faAtom, faBolt } from '@fortawesome/free-solid-svg-icons';

const UpgradePlanModal: React.FC = () => {
  // URL of the contact form
  const contactFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScQvaB9z86SbaM3JXgxFMhKLe0rJlfKyLBbn8BvkpHk1-gQlA/viewform";

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Upgrade Your Plan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Free Beta Plan */}
        <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md">
          <FontAwesomeIcon icon={faBolt} className="text-3xl mb-4" />
          <h3 className="text-lg font-semibold">Beta (Free)</h3>
          <p className="text-gray-600">Limited access to all features, but free during beta.</p>
          <button className="py-2 px-4 bg-neorange text-white rounded mt-2" disabled>
            Current Plan
          </button>
        </div>

        {/* Smart Agent Plan */}
        <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md">
          <FontAwesomeIcon icon={faRobot} className="text-3xl mb-4" />
          <h3 className="text-lg font-semibold">Smart Agents</h3>
          <p className="text-gray-600">Enhanced analytics, models, and upgraded AI agent tools with faster support.</p>
          <a
            href={contactFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 bg-gray-300 text-gray-600 rounded mt-2 hover:bg-neorange hover:text-white"
          >
            Contact Us to Upgrade
          </a>
        </div>

        {/* Quantum Agent Plan */}
        <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md">
          <FontAwesomeIcon icon={faAtom} className="text-3xl mb-4" />
          <h3 className="text-lg font-semibold">Quantum Agents</h3>
          <p className="text-gray-600">Quantum-powered analytics, models, and AI agent tools for advanced users.</p>
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

export default UpgradePlanModal;
