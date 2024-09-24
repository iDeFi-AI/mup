import React, { useState, useEffect } from "react";
import {
  pushAiInsights,
  storeJsonData,
  triggerEmailNotification, // Import the function to trigger email notifications
} from "@/utilities/firebaseClient"; // Assuming this is the path to your Firebase client
import { getAuth } from "firebase/auth";
import axios from "axios"; // To interact with the backend if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faWallet, faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import 'tippy.js/dist/tippy.css'; // Import Tippy.js CSS for the tooltips
import Tippy from '@tippyjs/react'; // Import Tippy.js for tooltips

const Notifications: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [notificationEmail, setNotificationEmail] = useState<string>(""); // New state for email input
  const [monitoringData, setMonitoringData] = useState<any>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch user email from Firebase Auth
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  // Monitor the address (frontend calls backend endpoint to monitor the address)
  const handleMonitorAddress = async () => {
    if (!walletAddress) {
      setAlerts((prevAlerts) => [...prevAlerts, "Please enter a wallet address."]);
      return;
    }

    if (!notificationEmail) {
      setAlerts((prevAlerts) => [...prevAlerts, "Please enter an email address for notifications."]);
      return;
    }

    try {
      // Call the API endpoint to monitor the address
      const response = await axios.post("/api/endpoints", {
        endpoint: "monitor_address",
        address: walletAddress,
      });
      setMonitoringData(response.data);

      // If any issues like dusting are found, trigger alerts
      if (response.data.dusting_patterns && response.data.dusting_patterns.length > 0) {
        setAlerts((prevAlerts) => [
          ...prevAlerts,
          "Dusting patterns detected on your wallet.",
        ]);
        triggerEmailNotification(
          "Dusting detected on your wallet",
          "We found dusting patterns in your monitored wallet.",
          notificationEmail // Pass the entered email for alerts
        );
      }

      // If no dusting is found, notify the user that the wallet is safe
      if (!response.data.dusting_patterns || response.data.dusting_patterns.length === 0) {
        setAlerts((prevAlerts) => [
          ...prevAlerts,
          "No dusting patterns found. Your wallet is safe.",
        ]);
      }

      // Store insights in Firebase
      await pushAiInsights({
        userAddress: walletAddress,
        insights: "Monitoring insights were generated.",
        timestamp: Date.now(),
      });
    } catch (error) {
      setAlerts((prevAlerts) => [...prevAlerts, "Failed to monitor the address. Please try again."]);
      console.error("Error monitoring address:", error);
    }
  };

  // Trigger email notification by adding a document to Firestore (Firestore trigger)
  const triggerEmailNotification = async (subject: string, messageText: string, email: string) => {
    try {
      const emailData = {
        to: [email], // Use the entered email address
        message: {
          subject: subject,
          text: messageText,
          html: `<p>${messageText}</p>`, // Optionally, HTML format for the email body
        },
      };

      // Store in the Firestore "mail" collection which will trigger the email
      await storeJsonData(emailData);
      console.log("Email notification triggered");
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background-color flex flex-col items-center text-center p-6">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Monitor Wallet Address</h1>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faWallet} className="text-4xl text-blue-600 mb-4" />
            <div className="w-full">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter Ethereum wallet address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="w-full mt-4">
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
              <Tippy content="We'll send notifications to this email when changes are detected.">
                <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-blue-600 cursor-pointer" />
              </Tippy>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6">
            <button
              onClick={handleMonitorAddress}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faBell} className="mr-2" />
              Monitor Address
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Alerts</h2>
          <ul className="space-y-2 mt-4">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <li
                  key={index}
                  className="bg-yellow-100 text-yellow-700 p-3 rounded-md shadow-md flex items-center"
                >
                  <FontAwesomeIcon icon={alert.includes("safe") ? faCheck : faTimes} className="mr-2" />
                  {alert}
                </li>
              ))
            ) : (
              <p className="text-gray-700">No alerts yet. Monitor an address to receive alerts.</p>
            )}
          </ul>
        </div>

        {monitoringData && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Monitoring Data</h2>
            <div className="bg-gray-100 p-4 rounded-md shadow-md mt-2">
              <pre className="text-left">{JSON.stringify(monitoringData, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
