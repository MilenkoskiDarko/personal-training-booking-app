export type SessionType = 'ASSESSMENT' | 'TRAINING' | 'ONLINE';
export type Goal = 'STRENGTH' | 'WEIGHT_LOSS' | 'MOBILITY' | 'GENERAL';

export interface Booking {
    id: string;
    sessionId: string;
    name: string;
    email: string;
    goal: Goal;
    note: string | null;
    aiMessage: string | null;
    createdAt: string;
}

export interface Session {
    id: string;
    startsAt: string; // ISO string in UTC
    durationMin: number;
    type: SessionType;
    createdAt: string;
    booking: Booking | null;
}

export interface CreateSessionInput {
    startsAt: string;
    durationMin: number;
    type: SessionType;
}

export interface CreateBookingInput {
    name: string;
    email: string;
    goal: Goal;
    note?: string;
}