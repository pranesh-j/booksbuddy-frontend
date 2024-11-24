import React from 'react';
import { Plus, History, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Book } from '@/types';

interface SidebarProps {
    isOpen: boolean;
    isDarkMode: boolean;
    currentBookId: number | null;
    books: Book[];
    onNewBook: () => void;
    onBookSelect: (bookId: number) => Promise<void>;
    onClose: () => void;
}

const Sidebar = ({ 
    isOpen, 
    isDarkMode,
    currentBookId,
    books,
    onNewBook,
    onBookSelect,
    onClose 
}: SidebarProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black md:hidden"
                        onClick={onClose}
                    />
                    
                    {/* Sidebar Content */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                        className={`fixed left-0 top-0 h-full w-64 md:w-72 
                                   ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
                                   shadow-xl z-50 md:relative md:shadow-none
                                   overflow-y-auto`}
                    >
                        <div className="p-4">
                            <button
                                onClick={onNewBook}
                                className={`w-full flex items-center space-x-2 p-3 rounded-lg
                                          ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                                          transition-colors duration-200`}
                            >
                                <Plus className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>New Book</span>
                            </button>
                            
                            <div className="mt-6">
                                {books.map((book) => (
                                    <button
                                        key={book.id}
                                        onClick={() => onBookSelect(book.id)}
                                        className={`w-full flex items-center space-x-2 p-3 rounded-lg
                                                  ${book.id === currentBookId ? 
                                                    (isDarkMode ? 'bg-gray-700' : 'bg-amber-50') : 
                                                    (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}
                                                  transition-colors duration-200`}
                                    >
                                        <BookOpen className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                            {book.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;