import React from 'react';
import { Plus, History, X, BookOpen } from 'lucide-react';
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
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`w-64 h-screen fixed left-0 ${
                isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
            } shadow-lg flex flex-col`}
        >
            {/* Close Button */}
            <div className="p-4 flex justify-between items-center border-b border-gray-700/10">
                <div className="flex items-center space-x-3">
                    <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        Close sidebar
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCloseSidebar}
                    className={`p-1 rounded-lg ${isDarkMode ? 
                        'hover:bg-gray-700' : 
                        'hover:bg-gray-100'}`}
                >
                    <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </motion.button>
            </div>

            {/* New Book Button */}
            <div className="p-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNewBook}
                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg
                        ${isDarkMode ? 
                            'bg-gray-700 hover:bg-gray-600' : 
                            'bg-amber-50 hover:bg-amber-100'
                        } transition-colors duration-200`}
                >
                    <Plus className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className="font-medium">New Book</span>
                </motion.button>
            </div>

            {/* History Section */}
            <div className="flex-1 overflow-auto p-4">
                <div className="flex items-center space-x-2 mb-4">
                    <History className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        History
                    </span>
                </div>

                {/* Book List */}
                <div className="space-y-2">
                    {books.map((book) => (
                        <motion.button
                            key={book.id}
                            onClick={() => onBookSelect(book.id)}
                            whileHover={{ x: 4 }}
                            className={`w-full text-left p-3 rounded-lg text-sm
                                ${isDarkMode ? 
                                    'hover:bg-gray-700/50' : 
                                    'hover:bg-gray-50'
                                } transition-colors duration-200
                                ${currentBookId === book.id ? 
                                    (isDarkMode ? 'bg-gray-700' : 'bg-amber-50') : 
                                    ''
                                }`}
                        >
                            <div className="font-medium mb-1">
                                {book.title || "(Untitled Book)"}
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {book.total_pages} {book.total_pages === 1 ? 'page' : 'pages'} • 
                                Last edited {new Date(book.last_edited).toLocaleDateString()}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;