import React, { useState, useEffect } from "react";
import Logout from "./Logout";
import "../style/dashboard.css";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [url, setUrl] = useState("");
  const [schedule, setSchedule] = useState("*/5 * * * *");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  };

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(process.env.REACT_APP_FETCH_URLS_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUrls(response.data);
    } catch (err) {
      console.error('Error fetching URLs:', err);
      if (err.response && err.response.status === 400) {
        setError('Invalid request, please try again.');
      } else {
        setError('An error occurred, please try again.');
      }
    }
  };

  const checkWebsite = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.post(
       process.env.REACT_APP_CHECK_WEBSITE_API,
        { url, schedule },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data);
      fetchUrls();
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          time: new Date().toLocaleTimeString(),
          responseTime: response.data.responseTime,
          currentStatus: response.data.currentStatus === 'up' ? 100 : 0,
        },
      ]);

      if (response.data.emailSent) {
        alert("Email sent successfully.");
      } else {
        alert(`Failed to send email: ${response.data.emailError}`);
      }
    } catch (err) {
      setError("Error occured while checking");
    } finally {
      setLoading(false);
    }
  };

  const responseTimeData = {
    labels: history.map((entry) => entry.time),
    datasets: [
      {
        label: "Response Time (ms)",
        data: history.map((entry) => entry.responseTime),
        backgroundColor: "#4bc0c0",
      },
    ],
  };

  const uptimeData = {
    labels: history.map((entry) => entry.time),
    datasets: [
      {
        label: "Uptime (%)",
        data: history.map((entry) => entry.currentStatus),
        backgroundColor: "#ff6384",
      },
    ],
  };

  const responseTimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Response Time History",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Response Time (ms)',
        },
      },
    },
  };

  const uptimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Uptime History",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Uptime (%)',
        },
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        },
      },
    },
  };

  return (
    <div className="dasboard-app">
    <Logout />
    <header className="dashboard-header">
      <h1>Uptime Monitor</h1>
      <div className="dashboard-content">
        <div className="left-side">
          <input
            className="dashboard-input"
            type="text"
            value={url}
            onChange={handleInputChange}
            placeholder="https://example.com"
          />
          <button className="check-btn" onClick={() => checkWebsite()} disabled={loading}>
            {loading ? "Checking..." : "Check"}
          </button>
          {error && <p className="error">{error}</p>}
          {result && (
            <div className="result">
              <p>Status Code: {result.statusCode}</p>
              <p>Response Time: {result.responseTime}ms</p>
              <p>Status: {result.currentStatus === 'up' ? <i className="fa-solid fa-up-long" style={{color:'green'}}></i> : <i className="fa-solid fa-down-long" style={{color:"red"}}></i>}</p>
            </div>
          )}
          <div className="chart-container">
            <Bar data={responseTimeData} options={responseTimeOptions} />
          </div>
          <div className="chart-container">
            <Bar data={uptimeData} options={uptimeOptions} />
          </div>
        </div>
        <div className="right-side">
          <select className="schedule-select" value={schedule} onChange={handleScheduleChange}>
            <option value="*/5 * * * *">Every 5 minutes</option>
            <option value="*/10 * * * *">Every 10 minutes</option>
            <option value="0 * * * *">Every hour</option>
            <option value="0 0 * * *">Every day</option>
            <option value="0 0 * * 0">Every week</option>
          </select>
          <i> Change the time to get emails of website responses</i>
          <ul className="list-ul">
            {urls?.map((url, index) => (
              <li key={index}>
                <p><b>URL:</b> {url.url}</p>
                <p>Status Code: {url.statusCode}</p>
                <p>Response Time: {url.responseTime}ms</p>
                <p>Status: {url.currentStatus === 'up' ? <i className="fa-solid fa-up-long" style={{color:'green'}}></i> : <i className="fa-solid fa-down-long" style={{color:"red"}}></i>}</p>
                <p><b>Checked At: </b>{new Date(url.checkedAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  </div>
  );
};

export default Home;
