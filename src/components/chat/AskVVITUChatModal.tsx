import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { ChatMessage, Facility, Building } from '../../types/campus';
import { askCampusAI } from '../../services/ai/geminiClient';
import { campusService } from '../../services/firebase/campusService';

const SUGGESTED_QUESTIONS = [
  'Where is the SAC Room?',
  'Where is the library?',
  'What are the mess timings?',
  'Where is the Medical Room?',
  'Which block has CSE?',
  'Where is the outdoor OAT?',
  'Where is the Student Hub?',
  'Where is the nearest washroom?',
];

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  sender: 'assistant',
  text: "Hi! I'm VVITU AI, your campus assistant. Ask me about university blocks, departments, labs, seminar halls, library, mess timings or other campus facilities.",
  timestamp: new Date().toISOString(),
};

interface AskVVITUChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskVVITUChatModal: React.FC<AskVVITUChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const [facs, blds] = await Promise.all([
        campusService.getFacilities(),
        campusService.getBuildings(),
      ]);
      setFacilities(facs);
      setBuildings(blds);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isTyping) return;

    setInputQuery('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const aiResponse = await askCampusAI(text, facilities, buildings);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: aiResponse.answer,
        timestamp: new Date().toISOString(),
        matchedFacilities: aiResponse.matchedFacilities,
        clarificationOptions: aiResponse.clarificationOptions,
        isFallback: aiResponse.isFallback,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I couldn't process this request right now. Please browse the directory or try asking again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vvitu-chat-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm transition-opacity"
    >
      <div className="bg-white w-full sm:max-w-xl h-[88vh] sm:h-[680px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-black animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="bg-black text-white px-5 py-4 flex items-center justify-between border-b border-[#E67E6A]">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl shadow-md border border-neutral-200 shrink-0">
              <img
                src="/vvit-logo.jpg"
                alt="VVIT University Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <h2 id="vvitu-chat-title" className="font-extrabold text-base leading-tight">
                Ask VVIT AI
              </h2>
              <span className="text-[11px] text-[#E67E6A] font-bold">
                Grounded Campus Assistant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              type="button"
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Reset conversation"
              aria-label="New chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Close assistant"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verification Grounding Notice */}
        <div className="bg-neutral-100 border-b border-neutral-300 px-4 py-2 text-[11px] text-black font-medium flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-[#E67E6A] shrink-0" />
          <span>Answers are strictly grounded in VVIT verified records to prevent fictitious room numbers.</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-neutral-50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
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
                      : 'bg-white text-black border border-neutral-300 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Clarification Pills */}
                  {msg.clarificationOptions && (
                    <div className="mt-3 pt-2 border-t border-neutral-200 flex flex-wrap gap-1.5">
                      {msg.clarificationOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSendMessage(opt)}
                          className="text-xs bg-black text-white hover:bg-[#E67E6A] font-bold px-3 py-1.5 rounded-lg border border-neutral-700 transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Grounded Campus Directory Links */}
                  {msg.matchedFacilities && msg.matchedFacilities.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-200 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-black block">
                        Matching Directory Entries:
                      </span>
                      {msg.matchedFacilities.map((fac) => (
                        <Link
                          key={fac.id}
                          to={`/facility/${fac.id}`}
                          onClick={onClose}
                          className="flex items-center justify-between text-xs font-bold text-black hover:text-white bg-neutral-100 hover:bg-[#E67E6A] p-2.5 rounded-lg transition-colors border border-neutral-300 hover:border-[#E67E6A]"
                        >
                          <span className="truncate">{fac.canonicalName}</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Footer tools: copy button */}
                  {!isUser && (
                    <div className="mt-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopyText(msg.text, msg.id)}
                        className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 transition-colors font-medium"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#E67E6A]" />
                            <span className="text-[#E67E6A] font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
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

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-t border-neutral-200 bg-white">
            <span className="text-[11px] font-bold text-black block mb-1.5">
              Suggested Campus Questions:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="text-xs whitespace-nowrap bg-neutral-100 hover:bg-[#E67E6A] text-black hover:text-white px-3 py-1 rounded-full border border-neutral-300 transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-300">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              id="chat-user-input"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about blocks, labs, library, SAC room, mess..."
              aria-label="Ask VVIT AI a campus question"
              className="flex-1 bg-neutral-100 text-black placeholder:text-neutral-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E6A] border border-neutral-300 font-medium"
            />
            <button
              type="submit"
              id="chat-user-submit-btn"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 bg-[#E67E6A] hover:bg-[#d66c58] disabled:bg-neutral-200 text-white disabled:text-neutral-400 rounded-xl transition-all shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const FloatingChatTrigger: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      type="button"
      id="floating-ask-ai-button"
      aria-label="Open VVIT Campus AI Assistant"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#E67E6A] hover:bg-[#d66c58] text-white rounded-full shadow-2xl border-2 border-white hover:scale-105 active:scale-95 transition-all group focus:outline-none focus:ring-4 focus:ring-[#E67E6A]/50"
    >
      <Sparkles className="w-5 h-5 text-white animate-pulse" />
      <span className="font-bold text-sm tracking-tight hidden sm:inline">
        Ask VVIT AI
      </span>
    </button>
  );
};
