import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import BookingModal from '../components/BookingModal';
import SessionCard from '../components/SessionCard';
import { config } from '../config';
import { formatDay, groupByDay } from '../lib/format';
import type { Session } from '../types';

export default function BookPage() {
    const [selected, setSelected] = useState<Session | null>(null);

    const { data: sessions, isLoading, error } = useQuery({
        queryKey: ['sessions', 'available'],
        queryFn: () => api.listSessions(true),
    });

    const days = sessions ? groupByDay(sessions) : [];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="mx-auto max-w-2xl px-4 py-12">
                <header className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-widest text-lime-400">
                        {config.businessName}
                    </p>
                    <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Book a session</h1>
                    <p className="mt-3 text-zinc-400">{config.tagline}</p>
                </header>

                {isLoading && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-900" />
                        ))}
                    </div>
                )}

                {error && (
                    <p className="rounded-xl border border-red-900 bg-red-950/50 p-4 text-red-300">
                        Couldn't load sessions. Please try again in a moment.
                    </p>
                )}

                {sessions?.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
                        <div className="text-4xl">🗓️</div>
                        <p className="mt-3 font-medium">No open sessions right now</p>
                        <p className="mt-1 text-sm text-zinc-400">New times are added regularly, check back soon.</p>
                    </div>
                )}

                {days.map(([key, daySessions]) => (
                    <section key={key} className="mb-8">
                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                            {formatDay(daySessions[0].startsAt)}
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {daySessions.map((s) => (
                                <SessionCard key={s.id} session={s} onSelect={setSelected} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {selected && <BookingModal session={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}