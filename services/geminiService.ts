import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateTopicContent = async (topicTitle: string, topicDescription: string): Promise<string> => {
    try {
        const prompt = `
        أنت أستاذ متخصص في أصول الفقه الإسلامي.
        المطلوب: شرح درس بعنوان "${topicTitle}".
        الوصف: ${topicDescription}

        يرجى تقديم الشرح باللغة العربية الفصحى الأكاديمية والميسرة.
        
        الهيكلية المطلوبة للشرح:
        1. **مقدمة**: تعريف مبسط للمفهوم.
        2. **المحاور الرئيسية**: شرح النقاط الأساسية بالتفصيل مع أمثلة فقهية إن أمكن.
        3. **الخلاصة**: تلخيص لأهم النقاط.
        
        استخدم تنسيق Markdown بشكل جيد (عناوين، نقاط، خط عريض).
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });

        return response.text || "عذراً، لم أتمكن من توليد المحتوى حالياً.";
    } catch (error) {
        console.error("Error generating content:", error);
        return "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي.";
    }
};

export const generateQuizForTopic = async (topicTitle: string): Promise<QuizQuestion[]> => {
    try {
        const prompt = `
        أنشئ اختباراً قصيراً (Quiz) مكوناً من 3 أسئلة حول موضوع: "${topicTitle}" في علم أصول الفقه.
        الأسئلة يجب أن تكون دقيقة علمياً ومتنوعة الصعوبة.
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: "نص السؤال" },
                            options: { 
                                type: Type.ARRAY, 
                                items: { type: Type.STRING },
                                description: "4 خيارات للإجابة" 
                            },
                            correctAnswerIndex: { type: Type.INTEGER, description: "رقم الخيار الصحيح (0-3)" },
                            explanation: { type: Type.STRING, description: "شرح لماذا هذه الإجابة هي الصحيحة" }
                        },
                        required: ["question", "options", "correctAnswerIndex", "explanation"],
                    }
                }
            }
        });

        const jsonText = response.text;
        if (!jsonText) return [];
        return JSON.parse(jsonText) as QuizQuestion[];

    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
};

export const chatWithTutor = async (history: {role: 'user' | 'model', parts: [{text: string}]}[], message: string, currentTopic: string) => {
    try {
        const chat = ai.chats.create({
            model: MODEL_NAME,
            history: history,
            config: {
                systemInstruction: `
                أنت "الأصولي"، معلم ذكي متخصص في أصول الفقه.
                المستخدم يدرس حالياً موضوع: "${currentTopic}".
                
                دورك:
                1. الإجابة على أسئلة الطالب بدقة علمية.
                2. الاستدلال بالآيات والأحاديث والقواعد الأصولية.
                3. التلطف في الأسلوب وتشجيع الطالب.
                4. إذا سأل الطالب عن موضوع خارج أصول الفقه، وجهه بلطف للعودة للموضوع، إلا إذا كان له صلة وثيقة.
                `
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text || "";
    } catch (error) {
        console.error("Chat error:", error);
        return "عذراً، واجهت مشكلة في معالجة سؤالك.";
    }
};