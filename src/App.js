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
  const [loading, setLoading] = useState(false)
  const [generate, setGenerate] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a CSV file");
      return;
    }

    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  };

  const handleGeneratePieChart = async () => {
    setGenerate(true)
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
    } finally{
      setGenerate(false)
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-brand"> Sentiment Analysis</div>
        <ul className="navbar-links">
          <li>
            {" "}
            <a href="#home">Home</a>
          </li>
          <li>
            {" "}
            <a href="#Analyze">Analyze</a>
          </li>
          <li>
            {" "}
            <a href="#Results">results</a>
          </li>
        </ul>
      </nav>
      <section id="home" className="landing-section">
        <h1>Sentiment Analysis of Social Media Data</h1>
        <p>Upload a csv file to analyze sentiment of social media comments</p>
      </section>
      <section id="Analyze" className="analyze-section">
        <label htmlFor="file-upload" className="custom-file-upload">
          Upload CSV File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        <br />
        <button className="btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? "analyzing..." : "Analyze Sentiment"}
        </button>
      </section>
      <section id='Results' className="results-section">
        <h2> Sentiment distribution</h2>
        <div className="sentiment-counts">
          <p><strong>Positive:</strong> {sentimentCounts.positive}</p>
          <p><strong>Negative:</strong> {sentimentCounts.negative}</p>
          <p><strong>Neutral:</strong> {sentimentCounts.neutral}</p>
        </div>
      <button
        className="btn2"
        onClick={handleGeneratePieChart}
        disabled={generate}
      >
        {generate ? "generating..." : "Generate Pie Chart"}
      </button>
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
        </section>
      {(loading || generate) && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default App;
