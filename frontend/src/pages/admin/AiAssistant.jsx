import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { Bot, Send, Sparkles, User, AlertCircle, FileText } from 'lucide-react';

export const AiAssistant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am ResolveAI Knowledge Query Engine. Ask me anything regarding company IT policies, network setups, VPN instructions, or past resolved incidents.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query.trim();
    setQuery('');
    setError('');

    // Add user query to chat
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    try {
      setLoading(true);
      const answer = await aiService.askRag(userText);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: typeof answer === 'string' ? answer : JSON.stringify(answer, null, 2) },
      ]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to query RAG model.';
      setError(msg);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an issue retrieving the knowledge. Please ensure documents are uploaded and indexed.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-brand-400" />
          RAG Knowledge Assistant
        </h1>
        <p className="text-xs text-slate-400">
          Query your vectorized knowledge base directly to verify embeddings & document answers
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Chat Window */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[550px] shadow-2xl overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-brand-400" />
                Querying MongoDB Vector embeddings & Gemini RAG...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-slate-950/80 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a technical or policy question (e.g., How to configure SSH tunnel?)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl shadow transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;
