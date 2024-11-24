// components/NameBookDialog.tsx
import React, { useState, useEffect } from 'react';

interface NameBookDialogProps {
    isOpen: boolean;
    suggestedTitle: string;
    onClose: () => void;
    onSave: (title: string) => void;
}

export function NameBookDialog({ isOpen, suggestedTitle, onClose, onSave }: NameBookDialogProps) {
    const [title, setTitle] = useState(suggestedTitle);

    useEffect(() => {
        setTitle(suggestedTitle);
    }, [suggestedTitle]);

    return isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4`}>
                <h2 className="text-xl font-bold mb-4 dark:text-white">Name Your Book</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter book title"
                    autoFocus
                />
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(title)}
                        className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}