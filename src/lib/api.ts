import axios from 'axios';
import type { Book } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// api.ts
export const simplifyText = async (text: string, userId: string): Promise<Book> => {
  try {
    const response = await api.post('/process/', { text, userId });
    return response.data;
  } catch (error) {
    console.error('Error simplifying text:', error);
    throw error;
  }
};

export const getBook = async (bookId: number): Promise<Book> => {
  const response = await api.get(`/books/${bookId}/`);
  return response.data;
};

export const getAllBooks = async (userId: string): Promise<Book[]> => {
  const response = await axios.get(`${API_URL}/books`, {
    params: { userId }
  });
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