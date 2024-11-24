import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItemProps {
    question: string;
    answer: string;
    isDarkMode: boolean;
    isOpen: boolean;
    onToggle: () => void;
}

const FAQItem = ({ question, answer, isDarkMode, isOpen, onToggle }: FAQItemProps) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-md`}
    >
        <button
            onClick={onToggle}
            className="w-full px-5 py-4 flex justify-between items-center"
        >
            <h3 className={`text-base font-medium text-left ${
                isDarkMode ? 'text-amber-400' : 'text-amber-600'
            }`}>
                {question}
            </h3>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <ChevronDown className={`w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
            </motion.div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <p className={`px-5 pb-4 text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        {answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

export const FAQ = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "What's BookBuddy? 🤔",
            answer: "BookBuddy helps you understand complex books by simplifying difficult text. No more constant googling of words or getting lost in complicated sentences - just upload your book page one by one or paste the content of the page and get a clear, simple version that's easy to understand! 🎉"
        },
        {
            question: "Why BookBuddy? 📚",
            answer: "Reading books like 'Meditations' or complex academic papers can be challenging. BookBuddy makes these texts more accessible by translating complicated language into something that's easier to grasp, while keeping the original meaning intact. 🧠"
        },
        {
            question: "What can I do with BookBuddy? 🚀",
            answer: "You can simplify any complex text, save it to your personal library for later, and even translate text from other languages into simple English. Perfect for philosophy texts, academic papers, or any reading that feels overwhelming. Plus, everything's organized and easy to find when you need it! ✨"
        },
        {
            question: "What kinds of texts work best? 📖",
            answer: "BookBuddy works great with philosophical works, academic papers, classic literature, and any text that uses complex language. It's especially helpful for books like 'Meditations' or research papers that might be hard to understand at first read. 📚"
        },
        {
            question: "Can it handle different languages? 🌎",
            answer: "Yes! BookBuddy can take text in various languages and convert it into simple English while preserving the original meaning. Whether it's Kannada, Hindi, French, Spanish, Japanese or any other language, we've got you covered! 🌐"
        }
    ];

    return (
        <section className="max-w-3xl mx-auto py-12 px-4">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`text-xl font-semibold text-center mb-8 ${
                    isDarkMode ? 'text-amber-400' : 'text-amber-600'
                }`}
            >
                Got Questions? We've Got Answers! 🎯
            </motion.h2>
            <div className="space-y-2">
                {faqs.map((faq, index) => (
                    <FAQItem 
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        isDarkMode={isDarkMode}
                        isOpen={openIndex === index}
                        onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                ))}
            </div>
        </section>
    );
}; 