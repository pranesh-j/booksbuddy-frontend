'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Camera, Plus, ChevronLeft, ChevronRight, BookOpen, Sun, Moon, BookMarked, Settings, Menu } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import axios from 'axios';
import Sidebar from './Sidebar';
import { getAllBooks, getBook, updateBookTitle, simplifyText, addPage } from '@/lib/api';
import type { Book, Page } from '@/types';
import { NameBookDialog } from './NameBookDialog';
import { ShareButtons } from './ShareButtons';
import { FAQ } from './FAQ';

const BookBuddy = () => {
  // State definitions
  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [suggestedTitle, setSuggestedTitle] = useState<string>('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [userId, setUserId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('userId');
      if (!id) {
        const newId = `user_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('userId', newId);
        return newId;
      }
      return id;
    }
    return null;
  });

  // Animation controls
  const controls = useAnimation();
  const pageTransition = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  // Load books on component mount
  const loadBooks = useCallback(async () => {
    try {
      if (!userId) return;
      const allBooks = await getAllBooks(userId);
      setBooks(allBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
        loadBooks();
    }
  }, [userId, loadBooks]);

  // Function definitions
  const handleBookSelect = async (bookId: number) => {
    try {
        // If we're already on this book, don't reload it
        if (currentBookId === bookId) {
            return;
        }

        const book = await getBook(bookId);
        if (book && book.pages) {
            setCurrentBookId(book.id);
            setPages(book.pages);  // Make sure pages are properly set
            setIsReading(true);
            setCurrentPage(0);
            setText('');
            
            // Force a re-render of the pages
            await loadBooks();  // Refresh the books list to get latest data
        }
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
            setShowNameDialog(false);
        }
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
        const response = await axios.post('http://localhost:8000/api/upload-image/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data?.extracted_text) {
            // Clean up any remaining formatting
            const cleanText = response.data.extracted_text
                .replace(/\[TextBlock\(text=|"\)]/g, '')
                .replace(/\\n/g, '\n')
                .trim();
            
            setText(cleanText);
        } else {
            throw new Error('No text extracted from image');
        }
    } catch (err) {
        let errorMessage = 'Failed to process image';
        if (axios.isAxiosError(err) && err.response?.data?.error) {
            errorMessage = err.response.data.error;
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }
        setError(errorMessage);
        console.error('Error uploading image:', err);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleSimplify = async () => {
    if (!text.trim() || !userId) return;
    setIsProcessing(true);
    setError(null);
    
    try {
        await controls.start({
            scale: [1, 0.95, 1],
            transition: { duration: 0.3 }
        });

        let bookData;
        
        if (currentBookId) {
            // For adding a new page to existing book
            bookData = await addPage(currentBookId, text);
            if (!bookData || !bookData.pages) {
                throw new Error('Invalid response from server');
            }
            setPages(bookData.pages);
            setIsReading(true);
            setText('');
            setCurrentPage(bookData.pages.length - 1);
        } else {
            // For creating a new book
            bookData = await simplifyText(text, userId);
            if (!bookData || !bookData.pages) {
                throw new Error('Invalid response from server');
            }
            setCurrentBookId(bookData.id);
            setPages(bookData.pages);
            setIsReading(true);
            setText('');
            setCurrentPage(0);
        }
        
        await loadBooks(); // Refresh the books list
    } catch (error) {
        console.error('Full error details:', error);
        setError('Failed to process text');
    } finally {
        setIsProcessing(false);
    }
};

const handleToggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
};

const handleAddPageClick = () => {
    if (currentBookId) {
        const currentBook = books.find(book => book.id === currentBookId);
        console.log('Current book:', currentBook);
        
        // Check if this is the first page
        if (currentBook && currentBook.pages.length === 1) {
            console.log('Showing title dialog for second page');
            setSuggestedTitle(currentBook.title || 'Untitled Book');
            setShowNameDialog(true);
        }
        
        // Switch to input view
        setIsReading(false);
        setText('');
    }
};

return (
  <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-[#F4F1EA]'}`}>
    {/* Header */}
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-40 px-6 py-4 ${
        isDarkMode ? 'bg-[#0F172A]' : 'bg-white'
      } shadow-sm`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
        <div className="flex items-center">
          {!isSidebarOpen && (
            <motion.button
              onClick={handleToggleSidebar}
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <Menu className={`w-5 h-5 ${
                isDarkMode ? 'text-amber-400' : 'text-amber-600'
              }`} />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Library</span>
            </motion.button>
          )}
        </div>

        <motion.div 
          className="flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
        >
          <BookOpen className={`w-6 h-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          <h1 className={`text-xl font-semibold ml-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            BookBuddy
          </h1>
        </motion.div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const newMode = !isDarkMode;
              setIsDarkMode(newMode);
              localStorage.setItem('darkMode', JSON.stringify(newMode));
            }}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? 
              <Sun className="w-5 h-5 text-amber-400" /> : 
              <Moon className="w-5 h-5 text-gray-600" />
            }
          </motion.button>
        </div>
      </div>
    </motion.nav>

    {/* Main content area with proper scrolling */}
    <div className="flex-1 pt-20"> {/* Added pt-20 to account for fixed header */}
      <div className="flex h-full">
        <AnimatePresence>
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
        </AnimatePresence>
        
        {/* Main Content with overflow handling */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-8">
            <AnimatePresence mode="wait">
              {!isReading ? (
                // Input View
                <motion.div 
                  key="input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full"
                >
                  <motion.div
                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-10`}
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
                        className={`w-full h-64 p-8 rounded-lg resize-none text-lg
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

                  {/* Add ShareButtons here */}
                  
                </motion.div>
              ) : (
                <motion.div
                  key="reading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative max-w-4xl mx-auto"
                >
                  {/* Book Display */}
                  <motion.div 
                    className="mb-12"
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
                          onClick={handleAddPageClick}
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
          
          {!isReading && (
            <>
              <FAQ isDarkMode={isDarkMode} />
              <div className="max-w-3xl mx-auto p-8 border-t border-gray-700/20">
                <ShareButtons 
                  isDarkMode={isDarkMode}
                  currentPage={currentPage}
                  bookTitle={books.find(b => b.id === currentBookId)?.title || 'Untitled Book'}
                  pageContent={pages[currentPage]?.content || ''}
                  isFixed={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>

    <NameBookDialog 
        isOpen={showNameDialog}
        suggestedTitle={suggestedTitle}
        onClose={() => setShowNameDialog(false)}
        onSave={handleSaveTitle}
    />
    <ShareButtons 
        isDarkMode={isDarkMode}
        currentPage={currentPage}
        bookTitle={books.find(b => b.id === currentBookId)?.title || 'Untitled Book'}
        pageContent={pages[currentPage]?.content || ''}
    />
  </div>
);
};

export default BookBuddy;