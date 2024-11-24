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
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`fixed left-0 top-0 h-full w-[240px] sm:w-[260px] md:w-[280px] z-50 shadow-xl
                        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <Menu className={`w-5 h-5 ${
                            isDarkMode ? 'text-amber-400' : 'text-amber-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
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
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNewBook}
                    className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg mb-4
                        ${isDarkMode ? 
                            'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 
                            'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        } transition-colors duration-200`}
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">New Book</span>
                </motion.button>

                {/* Book List */}
                <div className="overflow-auto max-h-[calc(100vh-140px)]">
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
                            <BookOpen className="w-5 h-5 flex-shrink-0" />
                            <span className={`font-medium truncate text-sm ${
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