import React, { useEffect, useState } from 'react';
import { Topic } from '../types';
import { generateTopicContent } from '../services/geminiService';

interface TopicContentProps {
    topic: Topic;
}

export const TopicContent: React.FC<TopicContentProps> = ({ topic }) => {
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Cache mechanism could be implemented here using localStorage or Context
        const fetchContent = async () => {
            setLoading(true);
            setContent(null); // Clear previous content to show loading state
            
            // In a real app, we might check if we have static content first
            // For now, we generate everything dynamically for "wow" factor and depth
            const generatedText = await generateTopicContent(topic.title, topic.description);
            setContent(generatedText);
            setLoading(false);
        };

        fetchContent();
    }, [topic]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 animate-pulse">جاري تحضير الدرس...</p>
            </div>
        );
    }

    if (!content) {
        return <div className="text-red-500">فشل تحميل المحتوى</div>;
    }

    // Simple parser for basic markdown-like structure to React elements
    // We are not using a library to keep it simple as per instructions, but treating text carefully
    
    const formattedContent = content.split('\n').map((line, index) => {
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-bold text-emerald-700 mt-6 mb-3">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4 border-b border-emerald-100 pb-2">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
             return <strong key={index} className="block font-bold text-gray-900 my-2">{line.replace(/\*\*/g, '')}</strong>
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
                <div key={index} className="flex items-start gap-2 my-2 mr-4">
                    <span className="text-emerald-500 mt-2">•</span>
                    <p className="text-gray-700 leading-relaxed flex-1">{line.replace(/^[-*] /, '')}</p>
                </div>
            );
        }
        if (line.trim() === '') return <br key={index} />;
        
        // Bold replacement within paragraph
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <p key={index} className="text-gray-700 leading-loose text-lg mb-2 serif-text">
                {parts.map((part, i) => {
                     if (part.startsWith('**') && part.endsWith('**')) {
                         return <span key={i} className="font-bold text-gray-900 bg-emerald-50 px-1 rounded">{part.replace(/\*\*/g, '')}</span>
                     }
                     return part;
                })}
            </p>
        );
    });

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-emerald-50 max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-emerald-900 mb-2">{topic.title}</h1>
            <p className="text-gray-500 text-lg mb-8">{topic.description}</p>
            
            <div className="prose prose-lg prose-emerald max-w-none font-light">
                {formattedContent}
            </div>
        </div>
    );
};