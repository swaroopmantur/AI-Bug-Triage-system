import { useState, useEffect } from "react";

import './App.css'

function findDuplicateBug(title, description, bugs) {
  const stopWords = [
    "the", "is", "a", "an", "and", "to", "in",
    "on", "when", "it", "does", "not", "my"
  ];

  function getWords(text) {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(word => word.length > 1 && !stopWords.includes(word))
    );
  }

  const newWords = getWords(`${title} ${description}`);

  for (const bug of bugs) {
    const oldWords = getWords(
      `${bug.title} ${bug.description}`
    );

    if (newWords.size === 0 || oldWords.size === 0) {
      continue;
    }

    let commonWords = 0;

    for (const word of newWords) {
      if (oldWords.has(word)) {
        commonWords++;
      }
    }

    const similarity =
      commonWords / Math.min(newWords.size, oldWords.size);

    if (similarity >= 0.6) {
      return bug;
    }
  }

  return null;
}

function App() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Other")
 const [priority, setPriority] = useState("Medium")
  const [severity, setSeverity] = useState("Medium")
  const [status, setStatus] = useState("Open")
  const [bugs, setBugs] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
const [filterCategory, setFilterCategory] = useState("All");
const [filterPriority, setFilterPriority] = useState("All");
const [filterStatus, setFilterStatus] = useState("All");
const [filterSeverity, setFilterSeverity] = useState("All");
const [aiReason, setAiReason] = useState("");
const [suggestedFix, setSuggestedFix] = useState("");
  useEffect(() => {
    fetch("http://localhost:5000/bugs")
        .then((response) => response.json())
        .then((data) => {
            setBugs(data);
        });
}, []);

  
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
        setMessage("Please enter a title and description.");
        return;
    }
    const duplicate = findDuplicateBug(
  title,
  description,
  bugs
);

if (duplicate) {
  const shouldSubmit = window.confirm(
    `Possible duplicate found: "${duplicate.title}".\n\n` +
    "Do you still want to submit this bug?"
  );

  if (!shouldSubmit) {
    setMessage("Submission cancelled: possible duplicate found.");
    return;
  }
}

    setMessage("");

    try {
        const response = await fetch("http://localhost:5000/bugs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title.trim(),
                description: description.trim(),
                category,
                priority,
                severity,
                status
            })
        });

        if (!response.ok) {
            throw new Error("Failed to submit bug");
        }

        const result = await response.json();

        setBugs((previousBugs) => [result, ...previousBugs]);

        setTitle("");
        setDescription("");
        setCategory("Other");
        setPriority("Medium");
        setSeverity("Medium");
        setStatus("Open");

        setMessage("Bug submitted successfully!");
    } catch (error) {
        console.error("Error submitting bug:", error);
        setMessage("Failed to submit bug. Please try again.");
    }
};

async function handleAnalyzeBug() {
  if (!title.trim() || !description.trim()) {
    setMessage("Enter a title and description first.");
    return;
  }

  try {
    setMessage("Analyzing bug with Gemini...");

    const response = await fetch("http://localhost:5000/bugs/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, description })
    });

    if (!response.ok) {
      throw new Error("Gemini analysis failed. Check the backend.");
    }

    const suggestions = await response.json();
    setAiReason(suggestions.reason || "");
    setSuggestedFix(suggestions.suggestedFix || "");

    setCategory(suggestions.category);
    setPriority(suggestions.priority);
    setSeverity(suggestions.severity);

    setMessage("Gemini suggestions generated. Review before submitting.");
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    setMessage("Analysis failed. Check that the backend and Gemini API are running.");
  }
}

const filteredBugs = bugs.filter((bug) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
        bug.title.toLowerCase().includes(search) ||
        bug.description.toLowerCase().includes(search);

    const matchesCategory =
    filterCategory === "All" ||
    (bug.category || "").trim().toLowerCase() ===
    filterCategory.trim().toLowerCase();

    const matchesPriority =
        filterPriority === "All" ||
        bug.priority === filterPriority;

    const matchesStatus =
        filterStatus === "All" ||
        bug.status === filterStatus;

    const matchesSeverity =
    filterSeverity === "All" ||
    bug.severity === filterSeverity;

    return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesStatus &&
        matchesSeverity
    );
});

const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this bug?");

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/bugs/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete bug");
        }

        setBugs((previousBugs) =>
            previousBugs.filter((bug) => bug._id !== id)
        );

        setMessage("Bug deleted successfully!");
    } catch (error) {
        console.error(error);
        setMessage("Failed to delete bug.");
    }
};

const handleEdit = async (bug) => {
    const newTitle = window.prompt("Enter the bug title:", bug.title);

    if (newTitle === null || newTitle.trim() === "") {
        return;
    }

    const newDescription = window.prompt(
        "Enter the bug description:",
        bug.description
    );

    if (newDescription === null || newDescription.trim() === "") {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/bugs/${bug._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...bug,
                title: newTitle.trim(),
                description: newDescription.trim()
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update bug");
        }

        const updatedBug = await response.json();

        setBugs((previousBugs) =>
            previousBugs.map((item) =>
                item._id === updatedBug._id ? updatedBug : item
            )
        );

        setMessage("Bug updated successfully!");
    } catch (error) {
        console.error(error);
        setMessage("Failed to update bug.");
    }
};

const totalBugs = bugs.length;

const openBugs = bugs.filter(
    (bug) => bug.status === "Open"
).length;

const criticalBugs = bugs.filter(
    (bug) => bug.priority === "Critical"
).length;

const resolvedBugs = bugs.filter(
    (bug) => bug.status === "Resolved"
).length;



  return (
    <>
      <section id="center">
        <div className="dashboard">
    <h1>AI Bug Triage Dashboard</h1>
    
<div className="dashboard-stats">
    <div className="stat-card total-card">
        <h3>Total Bugs</h3>
        <p>{totalBugs}</p>
    </div>

    <div className="stat-card open-card">
        <h3>Open Bugs</h3>
        <p>{openBugs}</p>
    </div>

    <div className="stat-card critical-card">
        <h3>Critical Bugs</h3>
        <p>{criticalBugs}</p>
    </div>

    <div className="stat-card resolved-card">
        <h3>Resolved Bugs</h3>
        <p>{resolvedBugs}</p>
    </div>
</div>

    <p className="subtitle">
        Report, manage and analyze software bugs
    </p>

    {/* Your existing form and Bug List stay here */}
</div>
        <div>
            
<div className="filters">
    <input
        type="text"
        placeholder="Search by title or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />


    <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
    >
        <option value="All">All Categories</option>
        <option value="UI">UI</option>
        <option value="Backend">Backend</option>
        <option value="Other">Other</option>
    </select>

    <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
    >
        <option value="All">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
    </select>
    
<select
    value={filterSeverity}
    onChange={(e) => setFilterSeverity(e.target.value)}
>
    <option value="All">All Severities</option>
    <option value="Critical">Critical</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
</select>


    <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
    >
        <option value="All">All Statuses</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
    </select>

    <button
        type="button"
        onClick={() => {
            setSearchTerm("");
            setFilterCategory("All");
            setFilterPriority("All");
            setFilterStatus("All");
        }}
    >
        Clear Filters
    </button>
</div>

          
        <div className="bug-list">
  <h2>Bug List</h2>
{filteredBugs.length === 0 && (
    <p>No bugs found. Try changing your search or filters.</p>
)}

{filteredBugs.map((bug) => (
    <div className="bug-card" key={bug._id}>
        <h3>{bug.title}</h3>

        <p>{bug.description}</p>

        
<div className="bug-info">
  <span className="badge category-badge">
    Category: {bug.category}
  </span>
  <span className={`badge priority-${bug.priority.toLowerCase()}`}>
    Priority: {bug.priority}
  </span>
  <span className={`badge severity-${bug.severity.toLowerCase()}`}>
    Severity: {bug.severity}
  </span>
  <span className={`badge status-${bug.status.toLowerCase().replace(/\s+/g, "-")}`}>
    Status: {bug.status}
  </span>
</div>

        
<div className="bug-actions">
    <button type="button" onClick={() => handleEdit(bug)}>
        Edit
    </button>

    <button
        type="button"
        onClick={() => handleDelete(bug._id)}
    >
        Delete
    </button>
</div>

    </div>
))}
</div>
          <input
           type="text"
           placeholder="Bug title"
           value={title}
           onChange={(e) => setTitle(e.target.value)}
         />
         <textarea
    placeholder="Bug description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
></textarea>
<label>Bug Category</label>
<select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
>
    <option value="UI">UI</option>
    <option value="Backend">Backend</option>
    <option value="Database">Database</option>
    <option value="Authentication">Authentication</option>
    <option value="Performance">Performance</option>
    <option value="Other">Other</option>
</select>
<label>Priority</label>
<select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
    <option value="Critical">Critical</option>
</select>
<label>Severity</label>
<select
    value={severity}
    onChange={(e) => setSeverity(e.target.value)}
>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
    <option value="Critical">Critical</option>
</select>
<label>Status</label>
<select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
>
    <option value="Open">Open</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
    <option value="Closed">Closed</option>
</select>
<button
  type="button"
  onClick={handleAnalyzeBug}
  style={{ marginRight: "30px" }}
>
  Analyze Bug
</button>
 
{aiReason && (
  <div className="ai-results">
    <h3>AI Analysis</h3>
    <p><strong>Reason:</strong> {aiReason}</p>
    <p><strong>Suggested Fix:</strong> {suggestedFix}</p>
  </div>
)}



<button
  type="button"
  onClick={handleSubmit}
  style={{ marginLeft: "30px" }}
>
    Submit Bug
</button>
 <p>{message}</p>
         
         
        </div>
        
      </section>

      <div className="ticks"></div>

      

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
