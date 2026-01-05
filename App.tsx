import React, { useState } from 'react';
import { CURRICULUM } from './constants';
import { Topic, AppMode } from './types';
import { TopicContent } from './components/TopicContent';
import { ChatTutor } from './components/ChatTutor';
import { QuizComponent } from './components/QuizComponent';
import { 
    BookOpenIcon, 
    BrainIcon, 
    CheckCircleIcon, 
    ChevronDownIcon, 
    ChevronRightIcon, 
    MenuIcon,
    CloseIcon
} from './components/Icons';

function App() {
    const [currentTopic, setCurrentTopic] = useState<Topic>(CURRICULUM[0].children ? CURRICULUM[0].children[0] : CURRICULUM[0]);
    const [mode, setMode] = useState<AppMode>(AppMode.LEARN);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['intro']);

    const toggleCategory = (catId: string) => {
        setExpandedCategories(prev => 
            prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
        );
    };

    const handleTopicClick = (topic: Topic) => {
        setCurrentTopic(topic);
        setMode(AppMode.LEARN); // Reset to learn mode on topic change
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
            
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-20">
                <span className="font-bold text-xl text-emerald-800">أصول الفقه</span>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
                    {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </div>

            {/* Sidebar */}
            <aside 
                className={`
                    fixed inset-y-0 right-0 z-30 w-64 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen overflow-y-auto
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="p-6 border-b border-gray-100 hidden md:block">
                    <h1 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
                        <BookOpenIcon className="w-6 h-6" />
                        <span>أصول الفقه</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-2">رحلة في فهم استنباط الأحكام</p>
                </div>

                <div className="p-4 space-y-2">
                    {CURRICULUM.map(category => (
                        <div key={category.id} className="mb-2">
                            <button 
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between p-2 text-gray-700 hover:bg-slate-50 rounded-lg transition-colors font-bold"
                            >
                                <span className="text-sm">{category.title}</span>
                                {expandedCategories.includes(category.id) ? 
                                    <ChevronDownIcon className="w-4 h-4 text-gray-400" /> : 
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                                }
                            </button>
                            
                            {expandedCategories.includes(category.id) && category.children && (
                                <div className="mr-4 mt-1 border-r-2 border-slate-100 space-y-1">
                                    {category.children.map(topic => (
                                        <button
                                            key={topic.id}
                                            onClick={() => handleTopicClick(topic)}
                                            className={`
                                                w-full text-right py-2 px-4 text-sm rounded-l-lg transition-all
                                                ${currentTopic.id === topic.id 
                                                    ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500 font-medium' 
                                                    : 'text-gray-500 hover:text-emerald-600 hover:bg-slate-50 border-r-2 border-transparent'}
                                            `}
                                        >
                                            {topic.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-hidden flex flex-col">
                
                {/* Top Navigation Bar (Tabs) */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex-none">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="mb-2 md:mb-0">
                            <h2 className="text-xl font-bold text-gray-800">{currentTopic.title}</h2>
                            <p className="text-sm text-gray-400 truncate">{currentTopic.description}</p>
                        </div>
                        
                        <div className="flex p-1 bg-slate-100 rounded-lg self-start md:self-auto">
                            <button
                                onClick={() => setMode(AppMode.LEARN)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === AppMode.LEARN ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <BookOpenIcon className="w-4 h-4" />
                                <span>الدرس</span>
                            </button>
                            <button
                                onClick={() => setMode(AppMode.CHAT)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === AppMode.CHAT ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <BrainIcon className="w-4 h-4" />
                                <span>المساعد الذكي</span>
                            </button>
                            <button
                                onClick={() => setMode(AppMode.QUIZ)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === AppMode.QUIZ ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <CheckCircleIcon className="w-4 h-4" />
                                <span>اختبر نفسك</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {mode === AppMode.LEARN && <TopicContent topic={currentTopic} />}
                    
                    {mode === AppMode.CHAT && (
                        <div className="max-w-4xl mx-auto h-full">
                            <ChatTutor topic={currentTopic} />
                        </div>
                    )}
                    
                    {mode === AppMode.QUIZ && (
                         <div className="max-w-4xl mx-auto">
                            <QuizComponent topic={currentTopic} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;