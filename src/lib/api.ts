import axios from 'axios';
import type { Book } from '@/types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
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