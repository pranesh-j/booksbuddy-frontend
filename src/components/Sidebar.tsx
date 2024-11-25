// Sidebar.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, BookMarked } from 'lucide-react';
import type { Book } from '@/types';

interface SidebarProps {
  isDarkMode: boolean;
  currentBookId: number | null;
  books: Book[];
  onNewBook: () => void;
  onBookSelect: (bookId: number) => void;
  onCloseSidebar: () => void;
}

const Sidebar = ({ 
  isDarkMode, 
  currentBookId, 
  books, 
  onNewBook, 
  onBookSelect, 
  onCloseSidebar 
}: SidebarProps) => {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={`fixed inset-y-0 left-0 w-72 z-50 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } shadow-xl`}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className={`text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Library
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCloseSidebar}
          className={`p-2 rounded-full ${
            isDarkMode 
              ? 'hover:bg-gray-800 active:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* New Book Button */}
      <motion.button
        onClick={onNewBook}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full p-4 flex items-center space-x-3 ${
          isDarkMode 
            ? 'hover:bg-gray-800 active:bg-gray-700 text-amber-400' 
            : 'hover:bg-gray-50 text-amber-600'
        } transition-colors duration-200`}
      >
        <Plus className="w-5 h-5" />
        <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
          New Book
        </span>
      </motion.button>

      {/* Books List */}
      <div className="overflow-y-auto h-[calc(100vh-120px)]">
        <AnimatePresence>
          {books.map((book) => (
            <motion.button
              key={book.id}
              onClick={() => onBookSelect(book.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 flex items-start space-x-3 transition-all duration-200 ${
                currentBookId === book.id
                  ? isDarkMode
                    ? 'bg-gray-800 ring-1 ring-amber-500'
                    : 'bg-amber-50'
                  : isDarkMode
                    ? 'hover:bg-gray-800 active:bg-gray-700'
                    : 'hover:bg-gray-50'
              } relative group`}
            >
              {/* Active Indicator */}
              {currentBookId === book.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isDarkMode ? 'bg-amber-500' : 'bg-amber-600'
                  }`}
                />
              )}

              <BookMarked className={`w-5 h-5 flex-shrink-0 mt-1 ${
                currentBookId === book.id
                  ? isDarkMode
                    ? 'text-amber-400'
                    : 'text-amber-600'
                  : isDarkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`} />
              
              <div className="flex-1 text-left">
                <h3 className={`font-medium mb-1 ${
                  isDarkMode 
                    ? currentBookId === book.id
                      ? 'text-amber-400'
                      : 'text-gray-200'
                    : currentBookId === book.id
                      ? 'text-amber-800'
                      : 'text-gray-700'
                }`}>
                  {book.title}
                </h3>
                <p className={`text-sm ${
                  isDarkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}>
                  {book.pages.length} pages
                </p>
              </div>

              {/* Touch feedback overlay */}
              <div className={`absolute inset-0 pointer-events-none ${
                isDarkMode
                  ? 'active:bg-gray-700/50'
                  : 'active:bg-gray-100/50'
              } transition-colors duration-150`} />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;