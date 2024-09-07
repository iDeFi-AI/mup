import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faAtom, faBolt } from '@fortawesome/free-solid-svg-icons';

interface UpgradePlanModalProps {
  onClose: () => void;
}

const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({ onClose }) => {
  // URL of the contact form
  const contactFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScQvaB9z86SbaM3JXgxFMhKLe0rJlfKyLBbn8BvkpHk1-gQlA/viewform";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">Upgrade Your Plan</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Free Beta Plan */}
          <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md">
            <FontAwesomeIcon icon={faBolt} className="text-3xl mb-4" />
            <h3 className="text-lg font-semibold">Beta (Free)</h3>
            <p className="text-gray-600">Limited access to all features, but free during beta.</p>
            <button className="bg-neorange text-white py-2 px-4 rounded mt-2" disabled>
              Current Plan
            </button>
          </div>

          {/* Agent+ Plan */}
          <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md">
            <FontAwesomeIcon icon={faRobot} className="text-3xl mb-4" />
            <h3 className="text-lg font-semibold">AI + Agents</h3>
            <p className="text-gray-600">Enhanced analytics, models and upgraded AI agent tools with faster support.</p>
            <a
              href={contactFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-300 text-white py-2 px-4 rounded mt-2 hover:bg-neorange"
            >
              Contact Us
            </a>
          </div>

          {/* Quantum Agents Plan */}
          <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-md">
            <FontAwesomeIcon icon={faAtom} className="text-3xl mb-4" />
            <h3 className="text-lg font-semibold">Quantum Agents</h3>
            <p className="text-gray-600">Quantum-powered analytics, models and AI agent tools for advanced users.</p>
            <a
              href={contactFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-300 text-white py-2 px-4 rounded mt-2 hover:bg-neorange"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Close button */}
        <div className="text-center mt-4">
          <button
            onClick={onClose}
            className="text-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlanModal;
