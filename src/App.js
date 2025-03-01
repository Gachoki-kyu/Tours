import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import "./App.css";
import "chart.js/auto";

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [sentimentCounts, setSentimentCounts] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [pieChartData, setPieChartData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://sentiment-5-zes6.onrender.com/analyze-csv/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      setResults(data.results || []);
      setSentimentCounts(
        data.sentiment_counts || { positive: 0, negative: 0, neutral: 0 }
      );
    } catch (error) {
      console.error("Error analyzing the file:", error);
      alert("An error occurred while analyzing the file. Please try again.");
    }
  };

  const handleGeneratePieChart = async () => {
    try {
      const response = await axios.get(
        "https://sentiment-5-zes6.onrender.com/generate-pie-chart/"
      );
      setPieChartData(response.data);
    } catch (error) {
      console.error("Error generating pie chart:", error);
      alert(
        "An error occurred while generating the pie chart. Please analyze a CSV file first."
      );
    }
  };



  return (
    <div className="App">
      <h1>Sentiment Analysis of Social Media Data</h1>
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload CSV File
      </label>
      <input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} />
      <br />
      <button className="btn" onClick={handleAnalyze}>
        Analyze Sentiment
      </button>
      <button className="btn2" onClick={handleGeneratePieChart}>
        Generate Pie Chart
      </button>
      <div className="results">
        <h2>Sentiment Distribution:</h2>
        {pieChartData && (
          <div className="chart-container">
            <Pie data={pieChartData} />
          </div>
        )}

        <h2>Results:</h2>
        {results.map((result, index) => (
          <div key={index} className={`result ${result.sentiment}`}>
            <p>
              <strong>Comment:</strong> {result.text}
            </p>
            <p>
              <strong>Sentiment:</strong> {result.sentiment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
