import type { Goal, SessionType } from './types';

export const config = {
    businessName: 'Coach Darko',
    tagline: 'Book your next session in seconds.',
    timezone: 'Europe/Skopje',

    sessionTypes: {
        ASSESSMENT: { label: 'Assessment', emoji: '📋', defaultDuration: 30 },
        TRAINING: { label: '1-on-1 Training', emoji: '🏋️', defaultDuration: 60 },
        ONLINE: { label: 'Online Session', emoji: '💻', defaultDuration: 45 },
    } satisfies Record<SessionType, { label: string; emoji: string; defaultDuration: number }>,

    goals: {
        STRENGTH: { label: 'Strength', emoji: '💪' },
        WEIGHT_LOSS: { label: 'Weight loss', emoji: '🔥' },
        MOBILITY: { label: 'Mobility', emoji: '🧘' },
        GENERAL: { label: 'General fitness', emoji: '⚡' },
    } satisfies Record<Goal, { label: string; emoji: string }>,
};