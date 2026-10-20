import type { Booking, CreateBookingInput, CreateSessionInput, Session } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = Array.isArray(body?.message)
            ? body.message.join(', ')
            : (body?.message ?? 'Something went wrong');
        throw new ApiError(res.status, message);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
}

export const api = {
    listSessions: (availableOnly = false) =>
        request<Session[]>(`/sessions${availableOnly ? '?available=true' : ''}`),

    createSession: (input: CreateSessionInput) =>
        request<Session>('/sessions', { method: 'POST', body: JSON.stringify(input) }),

    deleteSession: (id: string) =>
        request<void>(`/sessions/${id}`, { method: 'DELETE' }),

    bookSession: (sessionId: string, input: CreateBookingInput) =>
        request<Booking & { session: Session }>(`/sessions/${sessionId}/book`, {
            method: 'POST',
            body: JSON.stringify(input),
        }),

    getConfirmation: (bookingId: string) =>
        request<{ message: string }>(`/bookings/${bookingId}/confirmation`, { method: 'POST' }),
};