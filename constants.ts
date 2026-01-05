import { Topic } from './types';

export const CURRICULUM: Topic[] = [
    {
        id: 'intro',
        title: 'مقدمة في أصول الفقه',
        description: 'التعريف بالعلم، نشأته، وتطوره عبر العصور.',
        category: 'intro',
        children: [
            { id: 'def', title: 'تعريف أصول الفقه', description: 'التعريف اللغوي والاصطلاحي.', category: 'intro' },
            { id: 'history', title: 'نشأة العلم وتدوينه', description: 'لمحة تاريخية عن بداية التدوين وأهم الكتب.', category: 'intro' },
            { id: 'importance', title: 'أهمية وفائدة العلم', description: 'لماذا ندرس أصول الفقه؟', category: 'intro' },
        ]
    },
    {
        id: 'sources',
        title: 'الأدلة الشرعية',
        description: 'المصادر التي يُستنبط منها الحكم الشرعي.',
        category: 'sources',
        children: [
            { id: 'quran', title: 'القرآن الكريم', description: 'حجيته ودلالته.', category: 'sources' },
            { id: 'sunnah', title: 'السنة النبوية', description: 'أقسامها وحجيتها.', category: 'sources' },
            { id: 'ijma', title: 'الإجماع', description: 'تعريفه، أنواعه، وحجيته.', category: 'sources' },
            { id: 'qiyas', title: 'القياس', description: 'أركانه وشروطه.', category: 'sources' },
            { id: 'secondary', title: 'الأدلة التبعية', description: 'الاستحسان، المصالح المرسلة، سد الذرائع.', category: 'sources' },
        ]
    },
    {
        id: 'rules',
        title: 'دلالات الألفاظ',
        description: 'قواعد تفسير النصوص.',
        category: 'rules',
        children: [
            { id: 'am_khas', title: 'العام والخاص', description: 'الفرق بينهما وأحكامهما.', category: 'rules' },
            { id: 'mutlaq_muqayyad', title: 'المطلق والمقيد', description: 'حمل المطلق على المقيد.', category: 'rules' },
            { id: 'amr_nahy', title: 'الأمر والنهي', description: 'صيغهما ودلالتهما.', category: 'rules' },
            { id: 'mantuq_mafhum', title: 'المنطوق والمفهوم', description: 'دلالة اللفظ في محل النطق وفي غيره.', category: 'rules' },
        ]
    },
    {
        id: 'ijtihad',
        title: 'الاجتهاد والتقليد',
        description: 'أحكام المجتهد والمقلد.',
        category: 'ijtihad',
        children: [
            { id: 'ijtihad_def', title: 'حقيقة الاجتهاد', description: 'شروط المجتهد ومجالات الاجتهاد.', category: 'ijtihad' },
            { id: 'taqlid', title: 'التقليد', description: 'حكمه ومتى يجب.', category: 'ijtihad' },
            { id: 'taarud', title: 'التعارض والترجيح', description: 'ماذا نفعل عند تعارض الأدلة.', category: 'ijtihad' },
        ]
    }
];