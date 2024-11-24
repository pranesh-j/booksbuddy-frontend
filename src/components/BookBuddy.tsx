'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Plus, ChevronLeft, ChevronRight, BookOpen, Sun, Moon, BookMarked, Settings } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import axios from 'axios';
import Sidebar from './Sidebar';
import { NameBookDialog } from './NameBookDialog';
import { getAllBooks, getBook, updateBookTitle, simplifyText, addPage, uploadImage } from '@/lib/api';
import type { Book, Page } from '@/types';

const BookBuddy = () => {
  // State definitions
  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [suggestedTitle, setSuggestedTitle] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  // Animation controls
  const controls = useAnimation();
  const pageTransition = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  // Load books on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  // Function definitions
  const loadBooks = async () => {
    try {
      const allBooks = await getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const handleBookSelect = async (bookId: number) => {
    try {
      const book = await getBook(bookId);
      setCurrentBookId(book.id);
      setPages(book.pages);
      setIsReading(true);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error loading book:', error);
      setError('Failed to load book');
    }
  };

  const handleNewBook = () => {
    setCurrentBookId(null);
    setPages([]);
    setText('');
    setIsReading(false);
  };

  const handleSaveTitle = async (title: string) => {
    try {
        if (currentBookId) {
            await updateBookTitle(currentBookId, title);
            await loadBooks();
        }
        setShowNameDialog(false);
        setIsReading(false);
    } catch (error) {
        console.error('Error updating book title:', error);
        setError('Failed to update book title');
    }
};

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsProcessing(true);
    setError(null);

    try {
        const extractedText = await uploadImage(formData);
        setText(extractedText.replace(/\[TextBlock\(text=|"\)]/g, '')
            .replace(/\\n/g, '\n')
            .trim());
    } catch (error) {
        setError('Failed to process image');
        console.error('Error uploading image:', error);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleSimplify = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setError(null);
    
    try {
        if (currentBookId) {
            // Add new page to existing book
            const response = await addPage(currentBookId, text);
            if (response && response.pages) {
                setPages(response.pages);
                setCurrentPage(response.pages.length - 1);
                setIsReading(true);
                setText('');
                await loadBooks();
            }
        } else {
            // Create new book
            const response = await simplifyText(text);
            if (response && response.pages) {
                setPages(response.pages);
                setIsReading(true);
                setCurrentBookId(response.id);
                setCurrentPage(0);
                setText('');
                await loadBooks();
            }
        }

        await controls.start({
            scale: [1, 0.95, 1],
            transition: { duration: 0.3 }
        });
    } catch (error) {
        console.error('Error:', error);
        if (axios.isAxiosError(error)) {
            setError(error.response?.data?.error || 'Failed to process text');
        } else {
            setError('An unexpected error occurred');
        }
    } finally {
        setIsProcessing(false);
    }
};

const handleToggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
};

return (
  <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-[#F4F1EA]'}`}>
    {/* Header */}
    <motion.nav 
      className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
        >
          <BookMarked className={`w-8 h-8 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          <h1 className={`text-2xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            BookBuddy
          </h1>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? 
              <Sun className="w-5 h-5 text-amber-400" /> : 
              <Moon className="w-5 h-5 text-gray-600" />
            }
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </motion.button>
        </div>
      </div>
    </motion.nav>

    {/* Sidebar Toggle Button */}
    {!isSidebarOpen && (
      <motion.button
        onClick={handleToggleSidebar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed left-4 top-20 p-2 rounded-lg z-20
                   ${isDarkMode ? 
                     'bg-gray-800 hover:bg-gray-700' : 
                     'bg-white hover:bg-gray-100'} 
                   shadow-lg transition-colors duration-200`}
      >
        <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
      </motion.button>
    )}

    <div className="flex">
      {/* Sidebar */}
      {isSidebarOpen && (
        <Sidebar
          isDarkMode={isDarkMode}
          currentBookId={currentBookId}
          books={books}
          onNewBook={handleNewBook}
          onBookSelect={handleBookSelect}
          onCloseSidebar={handleToggleSidebar}
        />
      )}
      
      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto p-8">
          <AnimatePresence mode="wait">
            {!isReading ? (
              // Input View
              <motion.div 
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <motion.div
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8`}
                  animate={controls}
                >
                  {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <textarea
                      value={text}
                      onChange={(e) => {
                        if (e.target.value.length <= 2000) {
                          setText(e.target.value);
                        }
                      }}
                      maxLength={2000}
                      className={`w-full h-48 p-6 rounded-lg resize-none text-lg
                              transition-colors duration-200 
                              ${isDarkMode ? 
                                'bg-gray-700 text-gray-100 placeholder-gray-400' : 
                                'bg-gray-50 text-gray-700 placeholder-gray-400'}
                              focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      placeholder="Paste your text here (maximum 2000 characters)..."
                    />
                    <div className="text-sm text-gray-500 mt-2">
                      {text.length}/2000 characters
                    </div>
                  </motion.div>

                  <div className="flex justify-between items-center">
                    <motion.label
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer
                                ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Camera className="w-5 h-5" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </motion.label>

                    <motion.button
                      onClick={handleSimplify}
                      disabled={!text.trim() || isProcessing}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-8 py-3 rounded-lg text-white font-medium
                                bg-gradient-to-r from-amber-500 to-amber-600
                                hover:from-amber-600 hover:to-amber-700
                                disabled:opacity-50 disabled:cursor-not-allowed
                                shadow-lg hover:shadow-xl transition-all duration-200`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <span>Simplify Text</span>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              // Book Reading View
              <motion.div
                key="reading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                {/* Book Display */}
                <motion.div 
                  className="max-w-4xl mx-auto mb-12"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <div className={`relative rounded-xl shadow-2xl overflow-hidden
                                  ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPage}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageTransition}
                        className="p-12"
                      >
                        {/* Progress Bar */}
                        <motion.div 
                          className="mb-8 flex items-center justify-between"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Page {currentPage + 1} of {pages?.length || 0}
                          </span>
                          <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-amber-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${((currentPage + 1) / (pages?.length || 1)) * 100}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </motion.div>

                        {/* Content */}
                        <div className={`font-serif text-xl leading-relaxed
                                      ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                          {pages[currentPage]?.content}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                      <motion.button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white'} 
                                  shadow-lg backdrop-blur-sm disabled:opacity-50`}
                      >
                        <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </motion.button>
                      <motion.button
                        onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                        disabled={currentPage === pages.length - 1}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white'} 
                                  shadow-lg backdrop-blur-sm disabled:opacity-50`}
                      >
                        <ChevronRight className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Page Previews */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-5xl mx-auto"
                >
                  <div className="flex items-center space-x-4 overflow-x-auto pb-4 px-4">
                    {Array.isArray(pages) && pages.map((page, index) => (
                      <motion.div
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-shrink-0 w-32 h-44 rounded-lg cursor-pointer
                                  transition-shadow duration-200
                                  ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
                                  ${currentPage === index ? 
                                    'ring-2 ring-amber-500 shadow-lg' : 
                                    'shadow-md hover:shadow-lg'}`}
                      >
                        <div className="p-3">
                          <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Page {page.page_number}
                          </div>
                          <div className={`text-xs line-clamp-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {page.content}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Add Page Button */}
                    <motion.button
                        onClick={() => {
                            if (currentBookId) {
                                if (pages.length === 1) {  // If this is the first page (about to add second)
                                    setSuggestedTitle('Untitled Book');
                                    setShowNameDialog(true);  // Show the title dialog
                                }
                                setIsReading(false);  // Go back to input mode
                                setText('');  // Clear existing text
                            } else {
                                // First time creating a book, don't show dialog yet
                                setIsReading(false);
                                setText('');
                            }
                        }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-shrink-0 w-32 h-44 rounded-lg border-2 border-dashed
                                    flex items-center justify-center transition-colors duration-200
                                    ${isDarkMode ? 
                                        'border-gray-700 hover:border-amber-500 bg-gray-800' : 
                                        'border-gray-300 hover:border-amber-500 bg-gray-50'}`}
                    >
                        <div className="text-center">
                            <Plus className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add Page</span>
                        </div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>

    {/* Name Book Dialog */}
    <NameBookDialog
        isOpen={showNameDialog}
        suggestedTitle={suggestedTitle}
        onClose={() => setShowNameDialog(false)}
        onSave={handleSaveTitle}
    />
  </div>
);
};

export default BookBuddy;