import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { formatDay, formatTime } from '../lib/format';
import type { Booking, Session } from '../types';

interface Props {
    booking: Booking & { session: Session };
    onClose: () => void;
}

export default function Confirmation({ booking, onClose }: Props) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['confirmation', booking.id],
        queryFn: () => api.getConfirmation(booking.id),
        staleTime: Infinity, // the message never changes, no need to refetch
        retry: false,
    });

    return (
        <div className="text-center">
            <div className="text-5xl">✅</div>
            <h2 className="mt-4 text-2xl font-bold">You're booked!</h2>
            <p className="mt-1 text-zinc-400">
                {formatDay(booking.session.startsAt)} at {formatTime(booking.session.startsAt)}
            </p>

            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left">
                {isLoading && (
                    <p className="animate-pulse text-zinc-400">✍️ Your trainer is writing you a note…</p>
                )}
                {data && <p className="leading-relaxed">{data.message}</p>}
                {isError && <p>See you there, {booking.name}! 💪</p>}
            </div>

            <button
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-lime-400 py-3 font-semibold text-zinc-950 transition hover:bg-lime-300"
            >
                Done
            </button>
        </div>
    );
}