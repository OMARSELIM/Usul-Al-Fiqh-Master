import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Topic } from '../types';
import { chatWithTutor } from '../services/geminiService';
import { SendIcon, BrainIcon } from './Icons';

interface ChatTutorProps {
    topic: Topic;
}

export const ChatTutor: React.FC<ChatTutorProps> = ({ topic }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'init',
            role: 'model',
            text: `أهلاً بك يا طالب العلم. أنا مساعدك الذكي في درس "${topic.title}". اسألني عما أشكل عليك في هذا الموضوع.`,
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Reset chat when topic changes
    useEffect(() => {
        setMessages([{
            id: `init-${topic.id}`,
            role: 'model',
            text: `أهلاً بك يا طالب العلم. أنا مساعدك الذكي في درس "${topic.title}". اسألني عما أشكل عليك في هذا الموضوع.`,
            timestamp: Date.now()
        }]);
    }, [topic]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input.trim(),
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Construct history for Gemini
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const responseText = await chatWithTutor(history, userMsg.text, topic.title);

        const modelMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, modelMsg]);
        setLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
            {/* Header */}
            <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center gap-2">
                <BrainIcon className="text-emerald-600 w-5 h-5" />
                <h3 className="font-bold text-emerald-800">المساعد الأصولي</h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl shadow-sm leading-relaxed ${
                                msg.role === 'user'
                                    ? 'bg-emerald-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                            }`}
                        >
                            <p className="whitespace-pre-wrap text-sm md:text-base">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-end">
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-200">
                            <div className="flex space-x-1 space-x-reverse">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="اكتب سؤالك هنا..."
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                        dir="rtl"
                    />
                </div>
            </div>
        </div>
    );
};