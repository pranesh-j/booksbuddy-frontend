import { Facebook, Twitter, Instagram, Share2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ShareButtonsProps {
    isDarkMode: boolean;
    currentPage: number;
    bookTitle: string;
    pageContent: string;
    isFixed?: boolean;
}

export const ShareButtons = ({ isDarkMode, currentPage, bookTitle, pageContent, isFixed = true }: ShareButtonsProps) => {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    
    const handleShare = (platform: 'whatsapp' | 'twitter' | 'facebook' | 'instagram') => {
        const projectUrl = window.location.href;
        const text = "Check out BookBuddy - A tool for simplifying and managing text content!";
        
        switch (platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + projectUrl)}`);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(projectUrl)}&text=${encodeURIComponent(text)}`);
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`);
                break;
            case 'instagram':
                alert('Copy this link to share on Instagram:\n\n' + projectUrl);
                break;
        }
    };

    return (
        <motion.div 
            style={isFixed ? { opacity } : undefined}
            className={`${
                isFixed 
                    ? 'fixed top-32 right-12 hidden lg:flex flex-col space-y-3' 
                    : 'flex justify-center space-x-4'
            } z-40`}
        >
            <ShareButton platform="whatsapp" isDarkMode={isDarkMode} onShare={handleShare} />
            <ShareButton platform="twitter" isDarkMode={isDarkMode} onShare={handleShare} />
            <ShareButton platform="facebook" isDarkMode={isDarkMode} onShare={handleShare} />
            <ShareButton platform="instagram" isDarkMode={isDarkMode} onShare={handleShare} />
        </motion.div>
    );
};

const ShareButton = ({ platform, isDarkMode, onShare }: { 
    platform: 'whatsapp' | 'twitter' | 'facebook' | 'instagram',
    isDarkMode: boolean,
    onShare: (platform: 'whatsapp' | 'twitter' | 'facebook' | 'instagram') => void
}) => {
    const icons = {
        whatsapp: <Share2 className="w-5 h-5 text-green-500" />,
        twitter: <Twitter className="w-5 h-5 text-blue-400" />,
        facebook: <Facebook className="w-5 h-5 text-blue-600" />,
        instagram: <Instagram className="w-5 h-5 text-pink-600" />
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onShare(platform)}
            className={`p-3 rounded-full ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            } shadow-lg`}
        >
            {icons[platform]}
        </motion.button>
    );
}; 