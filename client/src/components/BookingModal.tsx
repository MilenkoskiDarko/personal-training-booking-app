import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../api/client';
import { config } from '../config';
import { formatDay, formatEndTime, formatTime } from '../lib/format';
import type { Goal, Session } from '../types';
import Confirmation from './Confirmation';

interface Props {
    session: Session;
    onClose: () => void;
}

const GOALS = Object.entries(config.goals) as [Goal, { label: string; emoji: string }][];

export default function BookingModal({ session, onClose }: Props) {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [goal, setGoal] = useState<Goal>('GENERAL');
    const [note, setNote] = useState('');

    const booking = useMutation({
        mutationFn: () =>
            api.bookSession(session.id, {
                name: name.trim(),
                email: email.trim(),
                goal,
                note: note.trim() || undefined,
            }),
        // Refresh the list either way: on success the session disappears,
        // on 409 we learn someone else took it.
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
    });

    const isConflict = booking.error instanceof ApiError && booking.error.status === 409;
    const type = config.sessionTypes[session.type];

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        booking.mutate();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {booking.data ? (
                    <Confirmation booking={booking.data} onClose={onClose} />
                ) : isConflict ? (
                    <div className="text-center">
                        <div className="text-5xl">😅</div>
                        <h2 className="mt-4 text-xl font-bold">Someone just grabbed this one</h2>
                        <p className="mt-2 text-zinc-400">Pick another time, there are more sessions available.</p>
                        <button
                            onClick={onClose}
                            className="mt-6 w-full rounded-xl bg-lime-400 py-3 font-semibold text-zinc-950 hover:bg-lime-300"
                        >
                            Choose another time
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p className="text-sm uppercase tracking-widest text-lime-400">
                            {type.emoji} {type.label}
                        </p>
                        <h2 className="mt-1 text-2xl font-bold">{formatDay(session.startsAt)}</h2>
                        <p className="text-zinc-400">
                            {formatTime(session.startsAt)} – {formatEndTime(session.startsAt, session.durationMin)}
                        </p>

                        <div className="mt-6 space-y-4">
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-lime-400"
                            />
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-lime-400"
                            />

                            <div>
                                <p className="mb-2 text-sm text-zinc-400">What's your main goal?</p>
                                <div className="flex flex-wrap gap-2">
                                    {GOALS.map(([value, g]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setGoal(value)}
                                            className={`rounded-full border px-4 py-2 text-sm transition ${
                                                goal === value
                                                    ? 'border-lime-400 bg-lime-400 text-zinc-950'
                                                    : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                                            }`}
                                        >
                                            {g.emoji} {g.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Anything your trainer should know? (optional)"
                                rows={3}
                                maxLength={500}
                                className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-lime-400"
                            />
                        </div>

                        {booking.error && !isConflict && (
                            <p className="mt-4 text-sm text-red-400">{booking.error.message}</p>
                        )}

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-xl border border-zinc-700 py-3 font-medium hover:border-zinc-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={booking.isPending}
                                className="flex-1 rounded-xl bg-lime-400 py-3 font-semibold text-zinc-950 transition hover:bg-lime-300 disabled:opacity-50"
                            >
                                {booking.isPending ? 'Booking…' : 'Confirm booking'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}