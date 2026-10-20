import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookPage from './pages/BookPage';
import TrainerPage from './pages/TrainerPage';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<BookPage />} />
                    <Route path="/trainer" element={<TrainerPage />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
);