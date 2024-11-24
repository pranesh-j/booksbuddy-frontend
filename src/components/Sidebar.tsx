import React from 'react';
import { Plus, X, BookOpen, Menu, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Book } from '@/types';

interface SidebarProps {
    isDarkMode: boolean;
    currentBookId: number | null;
    books: Book[];
    onNewBook: () => void;
    onBookSelect: (bookId: number) => void;
    onCloseSidebar: () => void;
}

const Sidebar = ({ isDarkMode, currentBookId, books, onNewBook, onBookSelect, onCloseSidebar }: SidebarProps) => {
    return (
        <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`fixed left-0 top-0 h-full w-72 z-50 shadow-xl
                        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <Menu className={`w-5 h-5 ${
                            isDarkMode ? 'text-amber-400' : 'text-amber-600'
                        }`} />
                        <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Library</span>
                    </div>
                    <motion.button
                        onClick={onCloseSidebar}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg ${
                            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                    >
                        <ChevronLeft className={`w-5 h-5 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                    </motion.button>
                </div>
                
                {/* New Book Button */}
                <div className="p-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onNewBook}
                        className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg
                            ${isDarkMode ? 
                                'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 
                                'bg-amber-50 text-amber-600 hover:bg-amber-100'
                            } transition-colors duration-200`}
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">New Book</span>
                    </motion.button>
                </div>

                {/* Book List */}
                <div className="flex-1 overflow-auto px-4 py-2">
                    {books.map((book) => (
                        <motion.button
                            key={book.id}
                            onClick={() => onBookSelect(book.id)}
                            whileHover={{ x: 4 }}
                            className={`w-full flex items-center space-x-2 px-4 py-3 mb-2 rounded-lg
                                ${isDarkMode ? 
                                    'hover:bg-gray-800/50' : 
                                    'hover:bg-gray-50'
                                } transition-colors duration-200
                                ${currentBookId === book.id ? 
                                    (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : 
                                    ''
                                }`}
                        >
                            <BookOpen className={`w-5 h-5 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={`font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                {book.title || "Untitled Book"}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;