export enum AppMode {
    LEARN = 'LEARN',
    CHAT = 'CHAT',
    QUIZ = 'QUIZ'
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    category: 'intro' | 'sources' | 'rules' | 'ijtihad';
    children?: Topic[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export interface GeneratedContent {
    content: string;
    summary: string;
}