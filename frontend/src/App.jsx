import { useEffect, useState } from "react";
import {
  LayoutDashboard, Lightbulb, Video, Kanban, CalendarDays,
  BarChart3, Captions, Sparkles, WandSparkles, Menu, Plus,
  Search, Trash2, RefreshCw, CheckCircle2, Clock, TrendingUp,
  Play, Copy, Download, Camera, MonitorPlay, FileText, Target,
  ArrowRight, Zap, X
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar
} from "recharts";
import "./index.css";

const initialIdeas = [
  { id: 1, title: "5 Editing Tricks That Make Shorts Viral", platform: "YouTube Shorts", status: "Ready", priority: "High" },
  { id: 2, title: "How I Would Start MMA From Zero", platform: "Instagram", status: "Planning", priority: "Medium" },
  { id: 3, title: "The Psychology Behind Viral Hooks", platform: "YouTube", status: "Planning", priority: "High" }
];

const initialProjects = [
  { id: 1, title: "Ultimate MMA Beginner Guide", status: "Editing", deadline: "2026-11-05" },
  { id: 2, title: "Video Editing Secrets", status: "Scripting", deadline: "2026-11-08" },
  { id: 3, title: "Creator Productivity", status: "Published", deadline: "2026-10-25" }
];

const weekly = [
  { day: "Mon", views: 1200 }, { day: "Tue", views: 2100 },
  { day: "Wed", views: 1800 }, { day: "Thu", views: 3400 },
  { day: "Fri", views: 2900 }, { day: "Sat", views: 4600 },
  { day: "Sun", views: 3900 }
];

const menu = [
  ["Overview", LayoutDashboard],
  ["AI Content Studio", Sparkles],
  ["Content Ideas", Lightbulb],
  ["Projects", Video],
  ["Production Board", Kanban],
  ["Caption Studio", Captions],
  ["Publishing Calendar", CalendarDays],
  ["Analytics", BarChart3]
];

function readSaved(key, fallback) {
  try {
    const saved = localStorage.getItem("creatorflow_" + key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

export default function App() {
  const [page, setPage] = useState("Overview");
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ideaInput, setIdeaInput] = useState("");
  const [projectInput, setProjectInput] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [topic, setTopic] = useState("");
  const [generated, setGenerated] = useState("");
  const [tool, setTool] = useState("Script Generator");
  const [platform, setPlatform] = useState("YouTube Shorts");
  const [captionText, setCaptionText] = useState("");
  const [captionStyle, setCaptionStyle] = useState("Bold");
  const [hook, setHook] = useState("");
  const [hookScore, setHookScore] = useState(null);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("October 2026");
  const [notice, setNotice] = useState("");

  const API = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

  const notify = message => {
    setNotice(message);
    setTimeout(() => setNotice(""), 2500);
  };

  const loadData = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${API}/api/ideas`),
        fetch(`${API}/api/projects`),
        fetch(`${API}/api/tasks`)
      ]);
      if (responses.some(response => !response.ok)) throw new Error("API request failed");
      const [ideasData, projectsData, tasksData] = await Promise.all(responses.map(response => response.json()));
      setIdeas(ideasData);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (error) {
      console.error("CreatorFlow API error:", error);
      notify("Could not load data. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const addIdea = async () => {
    if (!ideaInput.trim()) return;
    try {
      const response = await fetch(`${API}/api/ideas`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: ideaInput.trim(), platform, status: "New", priority: "Medium", category: "General" })
      });
      if (!response.ok) throw new Error("Idea could not be saved");
      const savedIdea = await response.json();
      setIdeas(current => [...current, savedIdea]);
      setIdeaInput("");
      notify("Content idea saved to database");
    } catch (error) { console.error(error); notify("Could not save idea"); }
  };

  const addProject = async () => {
    if (!projectInput.trim()) return;
    try {
      const response = await fetch(`${API}/api/projects`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: projectInput.trim(), description: "", platform: "YouTube", status: "Idea", priority: "Medium", deadline: null })
      });
      if (!response.ok) throw new Error("Project could not be saved");
      const savedProject = await response.json();
      setProjects(current => [...current, savedProject]);
      setProjectInput("");
      notify("Project saved to database");
    } catch (error) { console.error(error); notify("Could not save project"); }
  };

  const deleteIdea = async id => {
    try {
      const response = await fetch(`${API}/api/ideas/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setIdeas(current => current.filter(item => item.id !== id));
      notify("Idea deleted");
    } catch (error) { console.error(error); notify("Could not delete idea"); }
  };

  const deleteProject = async id => {
    try {
      const response = await fetch(`${API}/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setProjects(current => current.filter(item => item.id !== id));
      notify("Project deleted");
    } catch (error) { console.error(error); notify("Could not delete project"); }
  };

  const generate = () => {
    if (!topic.trim()) return notify("Enter a topic first");
    const t = topic.trim();
    const outputs = {
      "Script Generator": `VIDEO SCRIPT: ${t.toUpperCase()}\n\nHOOK (0–3 seconds)\n"Most people get ${t} completely wrong. Here's what you need to know."\n\nINTRODUCTION\nToday we're breaking down ${t} and explaining why it matters.\n\nMAIN CONTENT\n1. Start with the most important concept.\n2. Explain the common mistake people make.\n3. Give a practical example viewers can use.\n4. Deliver one surprising insight.\n\nENDING\n"Try this yourself and tell me what you think in the comments."\n\nCTA: Follow for more content like this.`,
      "Video Ideas": `5 VIDEO IDEAS ABOUT ${t.toUpperCase()}\n\n1. The biggest mistake beginners make with ${t}.\n2. Everything I wish I knew before learning ${t}.\n3. The truth about ${t} nobody explains.\n4. I tested the most popular ${t} advice.\n5. Beginner vs expert: understanding ${t}.`,
      "Titles & Hashtags": `TITLE IDEAS\n\n1. The Truth About ${t}\n2. Stop Making This ${t} Mistake!\n3. Everything You Need to Know About ${t}\n4. Nobody Talks About This Side of ${t}\n5. ${t}: Beginner to Advanced\n\nHASHTAGS\n#${t.replace(/\s+/g, "")} #CreatorTips #LearnSomething #ContentCreation #Shorts`,
      "Content Repurposer": `REPURPOSING PLAN: ${t}\n\nSHORT 1 — The biggest lesson\nExtract the most surprising point and make it a 30-second short.\n\nSHORT 2 — The common mistake\nExplain one mistake and how to avoid it.\n\nSHORT 3 — Quick tips\nTurn three useful takeaways into a rapid-fire video.\n\nCAROUSEL\nConvert the main lessons into five educational slides.\n\nCOMMUNITY POST\nAsk your audience what they struggle with most about ${t}.`,
      "Content Strategy": `CONTENT STRATEGY: ${t}\n\nPILLAR 1 — EDUCATION\nTeach the basics and explain useful concepts.\n\nPILLAR 2 — ENTERTAINMENT\nUse challenges, reactions and storytelling.\n\nPILLAR 3 — AUTHORITY\nShare experiments, results and lessons learned.\n\nWEEKLY PLAN\nMonday: Educational short\nWednesday: Storytelling video\nFriday: Tips and tutorial\nSunday: Audience engagement post`
    };
    setGenerated(outputs[tool]);
  };

  const analyzeHook = () => {
    if (!hook.trim()) return;
    const words = hook.trim().split(/\s+/).length;
    const score = Math.min(100, Math.max(10,
      35 + (hook.includes("?") ? 12 : 0) +
      (hook.includes("!") ? 8 : 0) +
      (/\b(secret|mistake|never|truth|why|how|stop|nobody)\b/i.test(hook) ? 20 : 0) +
      (words >= 5 && words <= 14 ? 20 : 5)
    ));
    setHookScore(score);
  };

  const filteredIdeas = ideas.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
  const completedTasks = tasks.filter(t => t.done || t.status === "Completed").length;

  const moveProject = async (id, status) => {
    const project = projects.find(item => item.id === id);
    if (!project) return;
    const updated = { ...project, status, deadline: project.deadline || null };
    try {
      const response = await fetch(`${API}/api/projects/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (!response.ok) throw new Error("Project update failed");
      const savedProject = await response.json();
      setProjects(current => current.map(item => item.id === id ? savedProject : item));
      notify("Project status updated");
    } catch (error) { console.error(error); notify("Could not update project status"); }
  };

  const copyText = text => {
    navigator.clipboard?.writeText(text);
    notify("Copied to clipboard");
  };

  const downloadSrt = () => {
    if (!captionText.trim()) return notify("Enter your caption text first");
    const lines = captionText.trim().split(/[.!?]+/).filter(Boolean);
    const srt = lines.map((line, i) =>
      `${i + 1}\n00:00:${String(i * 4).padStart(2, "0")},000 --> 00:00:${String(i * 4 + 3).padStart(2, "0")},000\n${line.trim()}\n`
    ).join("\n");
    const url = URL.createObjectURL(new Blob([srt], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url; a.download = "creatorflow-captions.srt"; a.click();
    URL.revokeObjectURL(url);
    notify("SRT file downloaded");
  };

  const heading = (title, description, action) => (
    <div className="page-heading">
      <div><div className="eyebrow">CREATOR WORKSPACE / {title.toUpperCase()}</div><h1>{title}</h1><p>{description}</p></div>
      {action}
    </div>
  );

  const inputRow = (value, setter, placeholder, action, label = "Add") => (
    <div className="input-row">
      <input value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} onKeyDown={e => e.key === "Enter" && action()} />
      <button className="primary-btn" onClick={action}><Plus size={17}/>{label}</button>
    </div>
  );

  const Overview = () => (
    <>
      {heading("Overview", "Your entire content operation, in one place.",
        <button className="secondary-btn" onClick={() => setPage("AI Content Studio")}><Sparkles size={16}/> Open AI Studio</button>)}
      <div className="stats-grid">
        <Stat icon={Lightbulb} label="Content Ideas" value={ideas.length} note="Ideas in your library"/>
        <Stat icon={Video} label="Video Projects" value={projects.length} note="Projects tracked"/>
        <Stat icon={CheckCircle2} label="Tasks Completed" value={`${completedTasks}/${tasks.length}`} note="Your productivity"/>
        <Stat icon={TrendingUp} label="Completion Rate" value={`${tasks.length ? Math.round(completedTasks / tasks.length * 100) : 0}%`} note="Task completion"/>
      </div>
      <div className="two-grid">
        <section className="panel">
          <div className="panel-head"><div><h3>Weekly performance</h3><p className="muted">Illustrative demo data — not live channel analytics</p></div><span className="tag">DEMO DATA</span></div>
          <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weekly}><defs><linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9275ff" stopOpacity={0.4}/><stop offset="100%" stopColor="#9275ff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#292e40" vertical={false}/><XAxis dataKey="day" stroke="#818ba4"/><YAxis stroke="#818ba4"/><Tooltip contentStyle={{background:"#171b2b",border:"1px solid #333"}}/><Area type="monotone" dataKey="views" stroke="#9275ff" strokeWidth={3} fill="url(#viewsFill)"/></AreaChart></ResponsiveContainer></div>
        </section>
        <section className="panel">
          <div className="panel-head"><h3>Production progress</h3><button className="text-btn" onClick={() => setPage("Production Board")}>View board <ArrowRight size={14}/></button></div>
          {["Idea", "Scripting", "Editing", "Review", "Published"].map(s => {
            const count = projects.filter(p => p.status === s).length;
            return <div className="progress-row" key={s}><span>{s}</span><div className="progress-track"><div style={{width: `${projects.length ? count / projects.length * 100 : 0}%`}}/></div><b>{count}</b></div>;
          })}
          <div className="quick-tip"><Zap size={18}/><span>Consistency beats perfection. Keep your publishing pipeline moving.</span></div>
        </section>
      </div>
      <section className="panel"><div className="panel-head"><h3>Recent projects</h3><button className="text-btn" onClick={() => setPage("Projects")}>View all <ArrowRight size={14}/></button></div>
        {projects.slice(0, 4).map(p => <div className="record" key={p.id}><div><b>{p.title}</b><p className="muted">{p.deadline}</p></div><span className="tag">{p.status}</span></div>)}
        {!projects.length && <p className="muted">Your projects will appear here.</p>}
      </section>
    </>
  );

  const AIStudio = () => (
    <>
      {heading("AI Content Studio", "Turn a topic into a complete content plan.")}
      <div className="studio-layout">
        <section className="panel">
          <div className="eyebrow">CONTENT GENERATOR</div>
          <h3>What are we creating today?</h3>
          <label>Choose a tool</label>
          <div className="tool-grid">{["Script Generator", "Video Ideas", "Titles & Hashtags", "Content Repurposer", "Content Strategy"].map(t => <button className={tool === t ? "tool-option selected" : "tool-option"} key={t} onClick={() => {setTool(t);setGenerated("");}}><Sparkles size={16}/>{t}</button>)}</div>
          <label>Topic or video concept</label>
          <textarea rows="4" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Example: How beginners can improve their MMA wrestling..."/>
          <label>Target platform</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)}><option>YouTube Shorts</option><option>Instagram</option><option>YouTube</option><option>TikTok</option></select>
          <button className="primary-btn full-btn" onClick={generate}><WandSparkles size={17}/> Generate content</button>
          <p className="muted small">Built-in template generation. Connect an AI provider for genuine AI-generated responses.</p>
        </section>
        <section className="panel output-panel">
          <div className="panel-head"><h3><Sparkles size={18}/> Generated output</h3>{generated && <button className="secondary-btn" onClick={() => copyText(generated)}><Copy size={15}/> Copy</button>}</div>
          {generated ? <pre className="generated">{generated}</pre> : <div className="empty-state"><Sparkles size={35}/><h3>Your next big idea starts here</h3><p>Choose a tool, enter your topic and generate your content.</p></div>}
        </section>
      </div>
      <section className="panel hook-panel"><div><div className="eyebrow">CONTENT OPTIMIZATION</div><h3>Hook Analyzer</h3><p className="muted">Get a heuristic score for your opening line. This is a guide, not a prediction of virality.</p></div>
        <textarea rows="2" value={hook} onChange={e => {setHook(e.target.value);setHookScore(null);}} placeholder="Example: Stop making this mistake when editing videos..."/>
        <button className="primary-btn" onClick={analyzeHook}><Target size={16}/> Analyze hook</button>
        {hookScore !== null && <div className="score-result"><strong>{hookScore}/100</strong><div className="progress-track"><div style={{width: `${hookScore}%`}}/></div><span>{hookScore >= 75 ? "Strong opening — test it with your audience." : "Consider adding curiosity, specificity or a stronger promise."}</span></div>}
      </section>
    </>
  );

  const Ideas = () => (
    <>
      {heading("Content Ideas", "Capture, prioritize and organize your next videos.")}
      <section className="panel"><h3>New content idea</h3>{inputRow(ideaInput, setIdeaInput, "Write your next video idea...", addIdea)}
        <div className="input-row"><select value={platform} onChange={e => setPlatform(e.target.value)}><option>YouTube Shorts</option><option>Instagram</option><option>YouTube</option><option>TikTok</option></select><span className="muted">Platform for the next idea</span></div>
      </section>
      <section className="panel"><div className="panel-head"><h3>Your idea library ({ideas.length})</h3><div className="search-box"><Search size={16}/><input placeholder="Search ideas..." value={search} onChange={e => setSearch(e.target.value)}/></div></div>
        {filteredIdeas.map(i => <div className="record" key={i.id}><div><b>{i.title}</b><p className="muted">{i.platform} · {i.priority} priority</p></div><div className="record-actions"><span className="tag">{i.status}</span><button className="icon-btn" onClick={() => deleteIdea(i.id)}><Trash2 size={16}/></button></div></div>)}
        {!filteredIdeas.length && <p className="muted">No matching ideas. Add a new one above.</p>}
      </section>
    </>
  );

  const Projects = () => (
    <>
      {heading("Projects", "Manage every video from concept to publication.")}
      <section className="panel"><h3>Create a video project</h3>{inputRow(projectInput, setProjectInput, "Project name...", addProject)}</section>
      <div className="project-grid">{projects.map(p => <section className="panel project-card" key={p.id}><div className="project-icon"><Video size={21}/></div><h3>{p.title}</h3><p className="muted">Deadline: {p.deadline || "Not set"}</p><span className="tag">{p.status}</span><button className="danger-btn" onClick={() => deleteProject(p.id)}><Trash2 size={15}/> Delete project</button></section>)}</div>
    </>
  );

  const Board = () => (
    <>
      {heading("Production Board", "Move your videos through the production pipeline.")}
      <div className="board">{["Idea", "Scripting", "Editing", "Review", "Published"].map(status => <section className="board-column" key={status}><div className="board-title"><b>{status}</b><span>{projects.filter(p => p.status === status).length}</span></div>
        {projects.filter(p => p.status === status).map(p => <div className="board-card" key={p.id}><b>{p.title}</b><p className="muted">Deadline: {p.deadline || "Not set"}</p><select value={p.status} onChange={e => moveProject(p.id, e.target.value)}>{["Idea","Scripting","Editing","Review","Published"].map(s => <option key={s}>{s}</option>)}</select></div>)}
        {!projects.some(p => p.status === status) && <p className="muted small">No projects</p>}
      </section>)}</div>
    </>
  );

  const Captions = () => (
    <>
      {heading("Caption Studio", "Prepare subtitle text and export an SRT file.")}
      <div className="two-grid">
        <section className="panel"><h3>Caption editor</h3><label>Paste your transcript or video text</label><textarea rows="9" value={captionText} onChange={e => setCaptionText(e.target.value)} placeholder="Paste your spoken words here..."/><label>Caption appearance</label><select value={captionStyle} onChange={e => setCaptionStyle(e.target.value)}><option>Bold</option><option>Minimal</option><option>Classic</option></select><button className="primary-btn full-btn" onClick={downloadSrt}><Download size={17}/> Export SRT subtitles</button><p className="muted small">Timing is estimated from sentence order. For accurate word-level timing, connect speech recognition software.</p></section>
        <section className="panel"><h3>Live preview</h3><div className={"caption-preview " + captionStyle.toLowerCase()}><span>{captionText.trim() ? captionText.trim().split(/[.!?]/)[0] : "YOUR CAPTIONS APPEAR HERE"}</span></div><p className="muted small">Preview of the opening caption.</p></section>
      </div>
    </>
  );

  const Calendar = () => (
    <>
      {heading("Publishing Calendar", "Plan your publishing rhythm.")}
      <section className="panel"><div className="panel-head"><h3>{month}</h3><div><button className="secondary-btn" onClick={() => setMonth(month === "October 2026" ? "November 2026" : "October 2026")}>Switch month</button></div></div>
        <div className="calendar-grid">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <b key={d}>{d}</b>)}{Array.from({length:35},(_,i) => <div className="calendar-day" key={i}><span>{i < 31 ? i+1 : ""}</span>{i < ideas.length && <small>{ideas[i]?.title.slice(0,20)}</small>}</div>)}</div>
        <p className="muted small">Planning view: assign actual publishing dates as you develop your schedule.</p>
      </section>
    </>
  );

  const Analytics = () => (
    <>
      {heading("Creator Analytics", "Understand your performance and growth.")}
      <div className="stats-grid"><Stat icon={TrendingUp} label="Weekly Views" value="19.0K" note="Illustrative demo data"/><Stat icon={Target} label="Engagement" value="6.8%" note="Illustrative demo data"/><Stat icon={Play} label="Published Videos" value={projects.filter(p => p.status === "Published").length} note="From your project board"/><Stat icon={Lightbulb} label="Ideas Available" value={ideas.length} note="From your idea library"/></div>
      <section className="panel"><div className="panel-head"><h3>Weekly views trend</h3><span className="tag">DEMO DATA</span></div><div className="chart tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={weekly}><CartesianGrid stroke="#292e40" vertical={false}/><XAxis dataKey="day" stroke="#818ba4"/><YAxis stroke="#818ba4"/><Tooltip contentStyle={{background:"#171b2b",border:"1px solid #333"}}/><Bar dataKey="views" fill="#9275ff" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></section>
      <section className="panel"><h3>Connect your channels</h3><p className="muted">These are setup placeholders. Live account data requires official platform authorization.</p><div className="channel-row"><MonitorPlay/> YouTube <span className="tag">Not connected</span></div><div className="channel-row"><Camera/> Instagram <span className="tag">Not connected</span></div></section>
    </>
  );

  const pages = {
    "Overview": <Overview/>,
    "AI Content Studio": <AIStudio/>,
    "Content Ideas": <Ideas/>,
    "Projects": <Projects/>,
    "Production Board": <Board/>,
    "Caption Studio": <Captions/>,
    "Publishing Calendar": <Calendar/>,
    "Analytics": <Analytics/>
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span>✦</span> CreatorFlow</div>
        <div className="side-label">CREATOR WORKSPACE</div>
        <nav>{menu.map(([name, Icon]) => <button key={name} className={page === name ? "active" : ""} onClick={() => setPage(name)}><Icon size={18}/><span>{name}</span></button>)}</nav>
        <div className="sidebar-bottom"><div className="avatar">CF</div><div><b>Creator Workspace</b><small>Personal studio</small></div><span className="online-dot"/></div>
      </aside>
      <main className="main">
        <header className="topbar"><div><span className="eyebrow">CREATORFLOW STUDIO</span><p>Plan. Create. Publish. Grow.</p></div><div className="top-actions"><span className="live-pill"><i/> Workspace active</span><div className="profile">CF</div></div></header>
        <div className="content">{loading ? <section className="panel">Loading your CreatorFlow data...</section> : pages[page]}</div>
        <footer>CREATORFLOW <span>·</span> Creator management platform <span>·</span> Academic project demo</footer>
      </main>
      {notice && <div className="toast"><CheckCircle2 size={17}/>{notice}</div>}
    </div>
  );
}

function Stat({ icon: Icon, label, value, note }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon size={19}/></div></div><h2>{value}</h2><p>{note}</p></div>;
}

