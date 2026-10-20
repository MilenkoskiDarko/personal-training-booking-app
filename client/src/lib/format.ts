import { config } from '../config';
import type { Session } from '../types';

const tz = config.timezone;

export const formatDay = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
        timeZone: tz,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

export const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
    });

export const formatEndTime = (iso: string, durationMin: number) =>
    formatTime(new Date(new Date(iso).getTime() + durationMin * 60_000).toISOString());

// "2026-11-02" in the trainer's timezone, used to group sessions by day
const dayKey = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: tz });

export function groupByDay(sessions: Session[]): [string, Session[]][] {
    const groups = new Map<string, Session[]>();
    for (const s of sessions) {
        const key = dayKey(s.startsAt);
        groups.set(key, [...(groups.get(key) ?? []), s]);
    }
    return [...groups.entries()];
}