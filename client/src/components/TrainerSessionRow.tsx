import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { config } from '../config';
import { formatEndTime, formatTime } from '../lib/format';
import type { Session } from '../types';

export default function TrainerSessionRow({ session }: { session: Session }) {
    const queryClient = useQueryClient();
    const remove = useMutation({
        mutationFn: () => api.deleteSession(session.id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
    });

    const type = config.sessionTypes[session.type];
    const booking = session.booking;

    return (
        <div
            className={`rounded-2xl border p-4 ${
                booking ? 'border-lime-400/40 bg-lime-400/5' : 'border-zinc-800 bg-zinc-900'
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-semibold">
                        {formatTime(session.startsAt)} – {formatEndTime(session.startsAt, session.durationMin)}
                    </p>
                    <p className="text-sm text-zinc-400">
                        {type.emoji} {type.label} · {session.durationMin} min
                    </p>
                </div>

                {booking ? (
                    <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-semibold text-zinc-950">
            Booked
          </span>
                ) : (
                    <button
                        onClick={() => confirm('Delete this open session?') && remove.mutate()}
                        disabled={remove.isPending}
                        className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400 transition hover:border-red-500 hover:text-red-400 disabled:opacity-50"
                    >
                        {remove.isPending ? 'Deleting…' : 'Delete'}
                    </button>
                )}
            </div>

            {booking && (
                <div className="mt-3 border-t border-zinc-800 pt-3 text-sm">
                    <p className="font-medium">{booking.name}</p>
                    <a href={`mailto:${booking.email}`} className="text-zinc-400 hover:text-lime-400">
                        {booking.email}
                    </a>
                    <p className="mt-2">
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">
              {config.goals[booking.goal].emoji} {config.goals[booking.goal].label}
            </span>
                    </p>
                    {booking.note && <p className="mt-2 italic text-zinc-400">"{booking.note}"</p>}
                </div>
            )}
        </div>
    );
}