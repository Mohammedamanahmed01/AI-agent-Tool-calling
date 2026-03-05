import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Menu, Plus, MessageSquare, X, Sparkles } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0d0e14;
    --surface: #13141c;
    --surface2: #1a1b26;
    --border: rgba(255,255,255,0.07);
    --accent: #00e5a0;
    --accent2: #7c6aff;
    --text: #e8e9f0;
    --muted: #5a5c70;
    --user-bubble: #1e1f2e;
    --ai-bubble: #13141c;
    --sidebar-w: 260px;
  }

  html, body, #root { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }

  .app {
    display: flex;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }

  .overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 40;
    backdrop-filter: blur(2px);
  }
  .overlay.active { display: block; }

  /* SIDEBAR */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 20px 14px;
    gap: 12px;
    flex-shrink: 0;
    z-index: 50;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 6px 16px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 4px;
  }
  .brand-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 17px; font-weight: 800;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .close-btn {
    margin-left: auto; background: none; border: none;
    color: var(--muted); cursor: pointer; display: flex;
    align-items: center; padding: 4px; border-radius: 6px;
    transition: color 0.2s;
  }
  .close-btn:hover { color: var(--text); }

  .new-chat-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 14px; border-radius: 10px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.03);
    color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 500; cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    width: 100%;
  }
  .new-chat-btn:hover {
    background: rgba(0,229,160,0.08);
    border-color: rgba(0,229,160,0.3);
    color: var(--accent);
  }

  .section-label {
    font-size: 10.5px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted); padding: 0 6px; margin-top: 4px;
  }

  .history-item {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 10px; border-radius: 9px;
    color: var(--muted); font-size: 13px; cursor: pointer;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .history-item:hover { background: rgba(255,255,255,0.05); color: var(--text); }
  .history-item.active { background: rgba(0,229,160,0.08); color: var(--accent); }

  /* MAIN */
  .main {
    flex: 1; display: flex; flex-direction: column;
    min-width: 0; overflow: hidden; background: var(--bg);
  }

  /* HEADER */
  .header {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    background: rgba(13,14,20,0.85);
    backdrop-filter: blur(12px);
    flex-shrink: 0;
  }
  .menu-btn {
    background: none; border: none; color: var(--muted);
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; padding: 6px; border-radius: 8px;
    transition: color 0.2s, background 0.2s; flex-shrink: 0;
  }
  .menu-btn:hover { color: var(--text); background: rgba(255,255,255,0.06); }
  .header-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700; color: var(--text); flex: 1;
  }
  .header-badge {
    font-size: 11px; padding: 3px 10px; border-radius: 20px;
    background: rgba(0,229,160,0.1); color: var(--accent);
    border: 1px solid rgba(0,229,160,0.2); font-weight: 500;
    white-space: nowrap;
  }

  /* CHAT */
  .chat {
    flex: 1; overflow-y: auto; padding: 28px 20px;
    display: flex; flex-direction: column; gap: 20px;
    scroll-behavior: smooth;
  }
  .chat::-webkit-scrollbar { width: 5px; }
  .chat::-webkit-scrollbar-track { background: transparent; }
  .chat::-webkit-scrollbar-thumb { background: #2a2b38; border-radius: 3px; }

  .chat-inner {
    max-width: 760px; width: 100%; margin: 0 auto;
    display: flex; flex-direction: column; gap: 20px;
    flex: 1;
  }

  /* EMPTY STATE */
  .empty-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; padding: 60px 20px; text-align: center; flex: 1;
  }
  .empty-icon {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, rgba(0,229,160,0.15), rgba(124,106,255,0.15));
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(0,229,160,0.2);
  }
  .empty-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; }
  .empty-sub { font-size: 14px; color: var(--muted); max-width: 340px; line-height: 1.6; }

  .suggestion-chips {
    display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 8px;
  }
  .chip {
    padding: 8px 14px; border-radius: 20px;
    border: 1px solid var(--border); background: var(--surface);
    color: var(--muted); font-size: 12.5px; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .chip:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,229,160,0.06); }

  /* MESSAGE */
  .message {
    display: flex; gap: 12px; align-items: flex-start;
    animation: fadeUp 0.3s ease both;
  }
  .message.user { flex-direction: row-reverse; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .avatar {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #00b37a);
    color: #0d0e14;
  }
  .message.user .avatar {
    background: linear-gradient(135deg, var(--accent2), #5a48cc);
    color: white;
  }

  .bubble {
    background: var(--ai-bubble);
    border: 1px solid var(--border);
    padding: 12px 16px;
    border-radius: 4px 14px 14px 14px;
    line-height: 1.65; font-size: 14px;
    max-width: min(520px, 78%);
    color: var(--text); word-break: break-word;
  }
  .message.user .bubble {
    background: var(--user-bubble);
    border-color: rgba(124,106,255,0.15);
    border-radius: 14px 4px 14px 14px;
  }

  /* TYPING */
  .typing { display: flex; align-items: center; gap: 5px; padding: 16px !important; }
  .typing span {
    width: 7px; height: 7px; background: var(--accent);
    border-radius: 50%; animation: pulse 1.4s ease infinite; opacity: 0.4;
  }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulse {
    0%,100% { opacity: 0.3; transform: scale(0.85); }
    50%      { opacity: 1;   transform: scale(1); }
  }

  /* INPUT */
  .input-area {
    padding: 16px 20px 20px;
    border-top: 1px solid var(--border);
    background: rgba(13,14,20,0.9);
    backdrop-filter: blur(12px);
    flex-shrink: 0;
  }
  .input-wrap { max-width: 760px; margin: 0 auto; }
  .input-form {
    display: flex; align-items: flex-end;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: border-color 0.2s;
    overflow: hidden;
  }
  .input-form:focus-within { border-color: rgba(0,229,160,0.4); }
  .input-form textarea {
    flex: 1; border: none; background: none;
    padding: 14px 16px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; resize: none; line-height: 1.5;
    max-height: 140px; min-height: 52px;
  }
  .input-form textarea::placeholder { color: var(--muted); }
  .send-btn {
    border: none; background: none; padding: 14px 16px;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; color: var(--muted);
    transition: color 0.2s; flex-shrink: 0; align-self: flex-end;
  }
  .send-btn.active { color: var(--accent); }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .send-btn.active:not(:disabled):hover { color: #00ffb3; }

  .disclaimer {
    text-align: center; font-size: 11.5px;
    color: var(--muted); margin-top: 10px;
  }

  /* MARKDOWN CONTENT */
  .md { width: 100%; }
  .md p { margin-bottom: 10px; line-height: 1.7; }
  .md p:last-child { margin-bottom: 0; }
  .md h1,.md h2,.md h3 {
    font-family: 'Syne', sans-serif; font-weight: 700;
    margin: 14px 0 6px; color: var(--text);
  }
  .md h1 { font-size: 18px; }
  .md h2 { font-size: 15px; }
  .md h3 { font-size: 13.5px; }
  .md ul, .md ol { padding-left: 20px; margin-bottom: 10px; }
  .md li { margin-bottom: 4px; line-height: 1.65; }
  .md strong { color: #fff; font-weight: 600; }
  .md em { font-style: italic; color: #c8c9d4; }

  /* CODE BLOCK */
  .code-block {
    margin: 10px 0;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
    background: #0a0b10;
  }
  .code-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 14px;
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .code-lang {
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--accent);
    font-family: 'DM Sans', sans-serif;
  }
  .copy-btn {
    display: flex; align-items: center; gap: 5px;
    background: none; border: 1px solid rgba(255,255,255,0.1);
    color: var(--muted); border-radius: 6px;
    padding: 3px 10px; font-size: 11.5px; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .copy-btn:hover { border-color: var(--accent); color: var(--accent); }
  .copy-btn.copied { border-color: var(--accent); color: var(--accent); background: rgba(0,229,160,0.06); }
  .code-block pre {
    margin: 0; padding: 14px 16px;
    overflow-x: auto; font-size: 13px; line-height: 1.6;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    color: #c9d1d9;
    white-space: pre;
  }
  .code-block pre::-webkit-scrollbar { height: 5px; }
  .code-block pre::-webkit-scrollbar-track { background: transparent; }
  .code-block pre::-webkit-scrollbar-thumb { background: #2a2b38; border-radius: 3px; }
  .inline-code {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px; padding: 1px 6px;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12.5px; color: var(--accent);
  }

  /* MOBILE */
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      top: 0; left: 0; height: 100%;
      transform: translateX(-100%);
    }
    .sidebar.open { transform: translateX(0); }
    .header-badge { display: none; }
    .chat { padding: 16px 12px; }
    .bubble { max-width: 85%; }
    .input-area { padding: 12px 12px 16px; }
    .empty-title { font-size: 18px; }
    .chip { font-size: 12px; padding: 7px 12px; }
  }

  @media (max-width: 480px) {
    .bubble { max-width: 90%; font-size: 13.5px; }
    .header { padding: 12px 14px; }
    .empty-state { padding: 40px 16px; }
  }
`;

// ── Copy button for code blocks ──────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ── Parse and render message content with markdown-like formatting ────────────
function MessageContent({ content }) {
  const parts = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", value: content.slice(last, match.index) });
    }
    parts.push({ type: "code", lang: match[1] || "text", value: match[2].trimEnd() });
    last = match.index + match[0].length;
  }
  if (last < content.length) {
    parts.push({ type: "text", value: content.slice(last) });
  }

  const renderText = (raw) => {
    const lines = raw.split("\n");
    const elements = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (/^### (.+)/.test(line)) {
        elements.push(<h3 key={i}>{line.replace(/^### /, "")}</h3>);
      } else if (/^## (.+)/.test(line)) {
        elements.push(<h2 key={i}>{line.replace(/^## /, "")}</h2>);
      } else if (/^# (.+)/.test(line)) {
        elements.push(<h1 key={i}>{line.replace(/^# /, "")}</h1>);
      } else if (/^[-*] (.+)/.test(line)) {
        const items = [];
        while (i < lines.length && /^[-*] (.+)/.test(lines[i])) {
          items.push(<li key={i}>{renderInline(lines[i].replace(/^[-*] /, ""))}</li>);
          i++;
        }
        elements.push(<ul key={`ul-${i}`}>{items}</ul>);
        continue;
      } else if (/^\d+\. (.+)/.test(line)) {
        const items = [];
        while (i < lines.length && /^\d+\. (.+)/.test(lines[i])) {
          items.push(<li key={i}>{renderInline(lines[i].replace(/^\d+\. /, ""))}</li>);
          i++;
        }
        elements.push(<ol key={`ol-${i}`}>{items}</ol>);
        continue;
      } else if (line.trim() === "") {
        // skip blank lines between block elements
      } else {
        elements.push(<p key={i}>{renderInline(line)}</p>);
      }
      i++;
    }
    return elements;
  };

  const renderInline = (text) => {
    const result = [];
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let last = 0, m, idx = 0;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > last) result.push(text.slice(last, m.index));
      const val = m[0];
      if (val.startsWith("`")) {
        result.push(<code key={idx++} className="inline-code">{val.slice(1, -1)}</code>);
      } else if (val.startsWith("**")) {
        result.push(<strong key={idx++}>{val.slice(2, -2)}</strong>);
      } else if (val.startsWith("*")) {
        result.push(<em key={idx++}>{val.slice(1, -1)}</em>);
      }
      last = m.index + m[0].length;
    }
    if (last < text.length) result.push(text.slice(last));
    return result;
  };

  return (
    <div className="md">
      {parts.map((part, i) =>
        part.type === "code" ? (
          <div className="code-block" key={i}>
            <div className="code-header">
              <span className="code-lang">{part.lang || "code"}</span>
              <CopyButton text={part.value} />
            </div>
            <pre>{part.value}</pre>
          </div>
        ) : (
          <span key={i}>{renderText(part.value)}</span>
        )
      )}
    </div>
  );
}

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a Python web scraper",
  "Help me plan a trip to Japan",
  "Summarize a complex topic",
];

const HISTORY = ["Getting started", "Code review session", "Trip planning"];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  };

  const sendMessage = async (text) => {
    const userMessage = text.trim();
    if (!userMessage || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    try {
      const apiUrl =
        (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
        "http://localhost:8000";
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Connection error. Please make sure the backend is running.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const newChat = () => {
    setMessages([]);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        {/* Mobile overlay */}
        {isMobile && (
          <div
            className={`overlay ${sidebarOpen ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-brand">
            <div className="brand-icon">
              <Sparkles size={16} color="#0d0e14" />
            </div>
            <span className="brand-name">AI Agent</span>
            {isMobile && (
              <button className="close-btn" onClick={() => setSidebarOpen(false)}>
                <X size={18} />
              </button>
            )}
          </div>

          <button className="new-chat-btn" onClick={newChat}>
            <Plus size={16} /> New Chat
          </button>

          <span className="section-label">Recent</span>

          {HISTORY.map((item, i) => (
            <div key={i} className={`history-item ${i === 0 ? "active" : ""}`}>
              <MessageSquare size={14} />
              {item}
            </div>
          ))}
        </aside>

        {/* Main */}
        <main className="main">
          <header className="header">
            <button
              className="menu-btn"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <span className="header-title">AI Agent Workspace</span>
            <span className="header-badge">● Online</span>
          </header>

          <div className="chat">
            <div className="chat-inner">
              {messages.length === 0 && !isLoading ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Sparkles size={28} color="var(--accent)" />
                  </div>
                  <div className="empty-title">How can I help you?</div>
                  <div className="empty-sub">
                    Ask me anything — I can write, code, explain, plan, and much more.
                  </div>
                  <div className="suggestion-chips">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} className="chip" onClick={() => sendMessage(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>
                      <div className="avatar">
                        {msg.role === "assistant" ? <Bot size={17} /> : <User size={17} />}
                      </div>
                      <div className="bubble"><MessageContent content={msg.content} /></div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="message assistant">
                      <div className="avatar">
                        <Bot size={17} />
                      </div>
                      <div className="bubble typing">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="input-area">
            <div className="input-wrap">
              <form className="input-form" onSubmit={handleSubmit}>
                <textarea
                  ref={textareaRef}
                  placeholder="Message AI Agent... (Shift+Enter for new line)"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResize();
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  rows={1}
                />
                <button
                  type="submit"
                  className={`send-btn ${input.trim() ? "active" : ""}`}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
              <p className="disclaimer">AI can make mistakes. Always verify important information.</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}