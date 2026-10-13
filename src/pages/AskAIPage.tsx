import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Send,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChatMessage, Facility, Building } from '../types/campus';
import { askCampusAI } from '../services/ai/geminiClient';
import { campusService } from '../services/firebase/campusService';

const SUGGESTIONS = [
  'Where is the SAC Room?',
  'Where is the library?',
  'What are the mess timings?',
  'Where is the Medical Room?',
  'Which block has CSE?',
  'Where is the outdoor OAT?',
  'Where is the Student Hub?',
  'Where is the nearest washroom?',
  'Where is the Examination Cell?',
];

export const AskAIPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! I'm VVITU AI, your campus assistant. Ask me about university blocks, departments, labs, seminar halls, library, mess timings or other campus facilities.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([campusService.getFacilities(), campusService.getBuildings()]).then(
      ([f, b]) => {
        setFacilities(f);
        setBuildings(b);
      }
    );
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || inputText).trim();
    if (!q || isTyping) return;

    setInputText('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const resp = await askCampusAI(q, facilities, buildings);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: resp.answer,
        timestamp: new Date().toISOString(),
        matchedFacilities: resp.matchedFacilities,
        clarificationOptions: resp.clarificationOptions,
        isFallback: resp.isFallback,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'An error occurred while connecting to the assistant. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 bg-white">
      {/* Page Header with Official Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-2xl shadow-sm border-2 border-[#E67E6A] shrink-0">
            <img
              src="/vvit-logo.jpg"
              alt="VVIT University Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#E67E6A] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#E67E6A]" />
              <span>Interactive Campus Guide</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
              Ask VVIT AI
            </h1>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'assistant',
                text: "Hi! I'm VVITU AI, your campus assistant. Ask me about university blocks, departments, labs, seminar halls, library, mess timings or other campus facilities.",
                timestamp: new Date().toISOString(),
              },
            ])
          }
          type="button"
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Grounding banner */}
      <div className="bg-black text-white border border-[#E67E6A] p-3.5 rounded-2xl flex items-center gap-2.5 text-xs">
        <ShieldAlert className="w-4 h-4 text-[#E67E6A] shrink-0" />
        <span>
          <strong className="text-[#E67E6A]">Strict Grounding Policy:</strong> VVIT AI answers exclusively from published database facts. Unknown room numbers and unverified timings are explicitly acknowledged.
        </span>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-3xl border-2 border-black shadow-lg flex flex-col h-[550px] overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-neutral-50">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-black text-[#E67E6A] border border-[#E67E6A] flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-xs ${
                    isUser
                      ? 'bg-[#E67E6A] text-white font-medium rounded-br-xs'
                      : 'bg-white text-black border border-neutral-300 rounded-bl-xs font-medium'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                  {/* Clarification Options */}
                  {m.clarificationOptions && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-200 flex flex-wrap gap-1.5">
                      {m.clarificationOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSend(opt)}
                          className="text-xs bg-black text-white hover:bg-[#E67E6A] font-bold px-3 py-1.5 rounded-lg border border-neutral-700 transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matched Facilities Directory Links */}
                  {m.matchedFacilities && m.matchedFacilities.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-200 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-black block">
                        Direct Campus Links:
                      </span>
                      {m.matchedFacilities.map((fac) => (
                        <Link
                          key={fac.id}
                          to={`/facility/${fac.id}`}
                          className="flex items-center justify-between text-xs font-bold text-black hover:text-white bg-neutral-100 hover:bg-[#E67E6A] p-2.5 rounded-lg transition-colors border border-neutral-300 hover:border-[#E67E6A]"
                        >
                          <span>{fac.canonicalName}</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {!isUser && (
                    <div className="mt-2.5 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopy(m.text, m.id)}
                        className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 transition-colors font-medium"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#E67E6A]" />
                            <span className="text-[#E67E6A] font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy response</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-black text-[#E67E6A] border border-[#E67E6A] flex items-center justify-center shrink-0 text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-neutral-300 rounded-2xl p-4 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E67E6A] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#E67E6A] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#E67E6A] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-neutral-200 flex gap-1.5 overflow-x-auto scrollbar-none">
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleSend(sug)}
              className="text-xs whitespace-nowrap bg-neutral-100 hover:bg-[#E67E6A] text-black hover:text-white px-3 py-1 rounded-full border border-neutral-300 transition-colors font-medium"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white border-t border-neutral-300 flex items-center gap-2"
        >
          <input
            type="text"
            id="ask-ai-page-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your campus question here..."
            aria-label="Ask VVIT AI a campus question"
            className="flex-1 bg-neutral-100 text-black placeholder:text-neutral-500 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E6A] border border-neutral-300 font-semibold"
          />
          <button
            type="submit"
            id="ask-ai-page-submit"
            disabled={!inputText.trim() || isTyping}
            className="px-5 py-3 bg-[#E67E6A] hover:bg-[#d66c58] disabled:bg-neutral-200 text-white disabled:text-neutral-400 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
