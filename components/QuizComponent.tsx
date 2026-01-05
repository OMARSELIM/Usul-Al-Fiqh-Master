import React, { useState, useEffect } from 'react';
import { QuizQuestion, Topic } from '../types';
import { generateQuizForTopic } from '../services/geminiService';
import { CheckCircleIcon, CloseIcon } from './Icons';

interface QuizComponentProps {
    topic: Topic;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ topic }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const loadQuiz = async () => {
            setLoading(true);
            setQuestions([]);
            setCurrentQuestionIndex(0);
            setScore(0);
            setShowResult(false);
            
            const q = await generateQuizForTopic(topic.title);
            setQuestions(q);
            setLoading(false);
        };
        loadQuiz();
    }, [topic]);

    const handleOptionSelect = (index: number) => {
        if (selectedOption !== null) return; // Prevent changing answer
        setSelectedOption(index);
        if (index === questions[currentQuestionIndex].correctAnswerIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-emerald-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                <p>جاري إعداد الاختبار...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div className="p-8 text-center text-gray-500">لم نتمكن من توليد أسئلة لهذا الموضوع حالياً. حاول مرة أخرى لاحقاً.</div>;
    }

    if (showResult) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center animate-fade-in">
                <div className="mb-6 inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600">
                   <CheckCircleIcon className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold mb-4">اكتمل الاختبار!</h2>
                <p className="text-lg text-gray-600 mb-6">نتيجتك هي: <span className="font-bold text-emerald-600">{score}</span> من {questions.length}</p>
                <button 
                    onClick={() => {
                        setLoading(true);
                        // Trigger reload via parent or internal logic re-fetch
                        generateQuizForTopic(topic.title).then(q => {
                            setQuestions(q);
                            setLoading(false);
                            setCurrentQuestionIndex(0);
                            setScore(0);
                            setShowResult(false);
                            setSelectedOption(null);
                        });
                    }}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    إعادة الاختبار
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-4 flex justify-between items-center text-sm text-gray-500">
                <span>السؤال {currentQuestionIndex + 1} من {questions.length}</span>
                <span>النقاط: {score}</span>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        let btnClass = "w-full text-right p-4 rounded-lg border-2 transition-all duration-200 ";
                        
                        if (selectedOption === null) {
                            btnClass += "border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700";
                        } else {
                            if (idx === currentQuestion.correctAnswerIndex) {
                                btnClass += "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium";
                            } else if (idx === selectedOption) {
                                btnClass += "border-red-500 bg-red-50 text-red-700";
                            } else {
                                btnClass += "border-gray-100 text-gray-400 opacity-50";
                            }
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                disabled={selectedOption !== null}
                                className={btnClass}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                {selectedOption !== null && (
                    <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm leading-relaxed">
                        <strong className="block mb-1">الشرح:</strong>
                        {currentQuestion.explanation}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        selectedOption === null 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                >
                    {currentQuestionIndex === questions.length - 1 ? 'إظهار النتائج' : 'السؤال التالي'}
                </button>
            </div>
        </div>
    );
};