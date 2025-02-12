'use client';

import React, { useState } from 'react';
import { visualizeDataset } from '@/utilities/apiUtils';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const VisualizeWallet: React.FC = () => {
  const [sourceType, setSourceType] = useState<'local' | 'address'>('address');
  const [address, setAddress] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [maxNodes, setMaxNodes] = useState<number | null>(null);
  const [visualizationUrl, setVisualizationUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to shorten the URL
  const shortenUrl = (url: string) => {
    if (url.length > 50) {
      return `${url.slice(0, 50)}...${url.slice(-10)}`;
    }
    return url;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setVisualizationUrl(null);

    try {
      const response = await visualizeDataset({
        sourceType,
        address: sourceType === 'address' ? address : null,
        filename: sourceType !== 'address' ? filename : null,
        maxNodes,
      });

      if (response.visualization_url) {
        setVisualizationUrl(response.visualization_url);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Error visualizing dataset:', err);
      setError('Failed to visualize dataset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content bg-background-color flex flex-col items-center text-center p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Visualize Wallet Relationships</h1>

      <div className="form-container w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        {/* Source Type Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Source Type</label>
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value as 'local' | 'address')}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="address">Ethereum Address</option>
            <option value="local">Local Dataset</option>
          </select>
        </div>

        {/* Ethereum Address Input */}
        {sourceType === 'address' && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              Ethereum Address
              <Tippy content="Enter a valid Ethereum address to visualize the wallet's relationships.">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 ml-2" />
              </Tippy>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Ethereum address"
              className="w-full p-2 border rounded focus:outline-none"
            />
          </div>
        )}

        {/* Filename Input for Local */}
        {sourceType === 'local' && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              Filename
              <Tippy content="Specify the filename for the local dataset you wish to visualize.">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 ml-2" />
              </Tippy>
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              className="w-full p-2 border rounded focus:outline-none"
            />
          </div>
        )}

        {/* Max Nodes Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2 flex items-center">
            Max Nodes
            <Tippy content="Limit the maximum number of nodes to visualize for clarity.">
              <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 ml-2" />
            </Tippy>
          </label>
          <input
            type="number"
            value={maxNodes || ''}
            onChange={(e) => setMaxNodes(Number(e.target.value))}
            placeholder="Max nodes to visualize"
            className="w-full p-2 border rounded focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-neorange text-white py-2 rounded hover:bg-neohover"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Visualize'}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Visualization Iframe */}
        {visualizationUrl && (
          <div className="visualization-container mt-4">
            <p className="text-green-500">Visualization generated:</p>
            <p>
              Visualization URL:{" "}
              <a href={visualizationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {shortenUrl(visualizationUrl)}
              </a>
            </p>
            <iframe
              src={visualizationUrl}
              className="w-full h-96 border rounded-md shadow-md mt-4"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      <style jsx>{`
        .visualization-container {
          margin-top: 20px;
        }
        iframe {
          width: 100%;
          height: 400px;
        }
      `}</style>
    </div>
  );
};

export default VisualizeWallet;
