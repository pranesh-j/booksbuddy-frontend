import React from 'react';
import { Plus, History, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Book } from '@/types';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    isDarkMode: boolean;
}

const Sidebar = ({ isOpen, onClose, children, isDarkMode }: SidebarProps) => {
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
                    
                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                        className={`fixed left-0 top-0 h-full w-64 md:w-72 
                                   ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
                                   shadow-xl z-50 md:relative md:shadow-none`}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;