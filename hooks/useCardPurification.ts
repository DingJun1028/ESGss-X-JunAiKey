
import { useState, useCallback } from 'react';
import { EsgCard } from '../types';
import { useCompany } from '../components/providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';

export type PurificationStep = 'idle' | 'sealed_view' | 'reading' | 'quizzing' | 'success' | 'failed';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export const useCardPurification = (
    card: EsgCard, 
    isPurified: boolean,
    onClose?: () => void
) => {
    const { purifyCard, awardXp, updateCardMastery } = useCompany();
    const { addToast } = useToast();
    
    const [step, setStep] = useState<PurificationStep>('idle');
    const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
    const [loading, setLoading] = useState(false);

    // Mock AI Quiz Generation (In real app, call LLM)
    const generateQuiz = useCallback((c: EsgCard): QuizQuestion => {
        // Simple deterministic simulation based on card data
        const isTrue = Math.random() > 0.5;
        
        return {
            id: `qz-${Date.now()}`,
            question: `Identify the core purpose of "${c.term}".`,
            options: [
                c.definition, // Correct
                `A general term for ${c.attribute} management without specific metrics.`,
                `The opposite of ${c.category} in modern ESG frameworks.`,
                `A deprecated standard replaced by ISO 14001.`
            ].sort(() => Math.random() - 0.5), // Shuffle
            correctIndex: -1, // Will find after shuffle
            explanation: `Correct! ${c.term} specifically refers to: ${c.definition}`
        };
    }, []);

    const startPurification = () => {
        setStep('sealed_view');
    };

    const startReading = () => {
        setStep('reading');
    };

    const startQuiz = () => {
        setLoading(true);
        // Simulate AI Latency
        setTimeout(() => {
            const quiz = generateQuiz(card);
            // Find index of correct answer (the definition)
            const correctIdx = quiz.options.findIndex(o => o === card.definition);
            quiz.correctIndex = correctIdx;
            
            setCurrentQuiz(quiz);
            setLoading(false);
            setStep('quizzing');
        }, 1000);
    };

    const submitAnswer = (selectedIndex: number) => {
        if (!currentQuiz) return;

        if (selectedIndex === currentQuiz.correctIndex) {
            setStep('success');
            // Effect triggers in UI, data update happens here
            purifyCard(card.id);
            updateCardMastery(card.id, 'Novice');
            awardXp(200); // Bonus for purification
            addToast('reward', `Card Purified: ${card.title}`, 'Knowledge Integrated');
        } else {
            setStep('failed');
            addToast('error', 'Purification Failed. The knowledge was rejected.', 'Resonance Error');
        }
    };

    const resetProcess = () => {
        setStep('idle');
        setCurrentQuiz(null);
        onClose?.();
    };

    const retry = () => {
        setStep('reading'); // Go back to reading
    };

    return {
        step,
        currentQuiz,
        loading,
        startPurification,
        startReading,
        startQuiz,
        submitAnswer,
        resetProcess,
        retry
    };
};
