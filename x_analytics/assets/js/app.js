const { useState, useEffect, useRef } = React;

// SearchBar component for tweet search input
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter search keywords"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </div>
    </form>
  );
}

// ResultsDisplay component to list tweets
function ResultsDisplay({ tweets }) {
  if (!tweets || tweets.length === 0) {
    return <div>No tweets found</div>;
  }
  
  return (
    <div className="list-group">
      {tweets.map(tweet => (
        <a
          key={tweet.id}
          href={`https://twitter.com/i/web/status/${tweet.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="list-group-item list-group-item-action"
        >
          {tweet.text}
        </a>
      ))}
    </div>
  );
}

// DataVisualization component using D3
function DataVisualization({ tweets }) {
  const ref = useRef(null);

  useEffect(() => {
    // Clear previous chart content
    d3.select(ref.current).selectAll("*").remove();
    
    if (tweets.length === 0) return;
    
    // Process tweets: count tweets per day based on created_at field
    const parseTime = d3.isoParse;
    const counts = {};
    tweets.forEach(tweet => {
      if (tweet.created_at) {
        const date = parseTime(tweet.created_at).toISOString().split("T")[0];
        counts[date] = (counts[date] || 0) + 1;
      }
    });

    const data = Object.keys(counts).map(date => ({ date: new Date(date), count: counts[date] }));
    
    // Set dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const svg = d3.select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .nice()
      .range([height, 0]);
    
    const xAxis = d3.axisBottom(x).ticks(5);
    const yAxis = d3.axisLeft(y);
    
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
      
    svg.append("g")
      .call(yAxis);
      
    // Draw line
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.count));
      
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [tweets]);
  
  return <div ref={ref} className="chart-container"></div>;
}

// ExportTools component for CSV export
function ExportTools({ tweets }) {
  const handleExport = () => {
    if (!tweets || tweets.length === 0) {
      alert("No tweets to export!");
      return;
    }

    const headers = ["id", "text", "created_at"];
    const csvRows = [
      headers.join(","),
      ...tweets.map(tweet => 
        headers.map(header => `"${tweet[header] ? tweet[header].replace(/\"/g, '""') : ''}"`).join(",")
      )
    ];
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "tweets.csv";
    a.click();
    
    window.URL.revokeObjectURL(url);
  };
  
  return <button className="btn btn-secondary mt-3" onClick={handleExport}>Export CSV</button>;
}

// Main App component
function App() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchTweets = async (query) => {
    if (!query) {
      alert("Please enter a search query");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // Get the current hostname or use the deployment URL
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/tweets?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data) {
        setTweets(data.data);
      } else {
        setTweets([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3">
      <h1 className="mb-4">Twitter API Dashboard</h1>
      <SearchBar onSearch={searchTweets} />
      {loading && <div className="loading"></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-md-6">
          <h3>Tweets</h3>
          <ResultsDisplay tweets={tweets} />
          <ExportTools tweets={tweets} />
        </div>
        <div className="col-md-6">
          <h3>Data Visualization</h3>
          <DataVisualization tweets={tweets} />
        </div>
      </div>
    </div>
  );
}

// Render the App
ReactDOM.render(<App />, document.getElementById('root')); 