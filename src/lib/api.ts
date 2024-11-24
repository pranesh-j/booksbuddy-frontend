import axios from 'axios';
import type { Book } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://booksbuddy-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// api.ts
export const simplifyText = async (text: string): Promise<Book> => {
  try {
    const response = await api.post('/process/', { text });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getBook = async (bookId: number): Promise<Book> => {
  const response = await api.get(`/books/${bookId}/`);
  return response.data;
};

export const getAllBooks = async (): Promise<Book[]> => {
  const response = await api.get('/books/');
  return response.data;
};

export const updateBookTitle = async (bookId: number, title: string): Promise<Book> => {
  try {
    const response = await api.patch(`/books/${bookId}/update/`, { title });
    return response.data;
  } catch (error) {
    console.error('Error updating book title:', error);
    throw error;
  }
};

export const addPage = async (bookId: number, text: string): Promise<Book> => {
  try {
    const response = await api.post(`/books/${bookId}/add-page/`, { text });
    return response.data;
  } catch (error) {
    console.error('Error adding page:', error);
    throw error;
  }
};

export const uploadImage = async (formData: FormData): Promise<string> => {
  try {
    const response = await api.post('/upload-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.extracted_text;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};