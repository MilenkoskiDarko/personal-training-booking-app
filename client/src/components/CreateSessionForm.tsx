
import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { config } from '../config';
import type { SessionType } from '../types';

const TYPES = Object.entries(config.sessionTypes) as [
    SessionType,
    { label: string; emoji: string; defaultDuration: number },
][];

const today = () => new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD"
const pad = (n: number) => String(n).padStart(2, '0');

export default function CreateSessionForm() {
    const queryClient = useQueryClient();
    const [date, setDate] = useState(today());
    const [time, setTime] = useState('09:00');
    const [type, setType] = useState<SessionType>('TRAINING');
    const [duration, setDuration] = useState(config.sessionTypes.TRAINING.defaultDuration);

    const create = useMutation({
        mutationFn: () =>
            api.createSession({
                // Browser interprets date + time in the trainer's local timezone,
                // toISOString() converts it to UTC for the backend.
                startsAt: new Date(`${date}T${time}`).toISOString(),
                durationMin: duration,
                type,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            // Jump to the end of this session, so back-to-back slots are quick to add
            const [h, m] = time.split(':').map(Number);
            const end = h * 60 + m + duration;
            if (end < 24 * 60) setTime(`${pad(Math.floor(end / 60))}:${pad(end % 60)}`);
        },
    });

    function selectType(t: SessionType) {
        setType(t);
        setDuration(config.sessionTypes[t].defaultDuration);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        create.mutate();
    }

    const inputClass =
        'w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-lime-400';

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">Add a session</h2>

            <div className="mt-4 space-y-4">
                <div>
                    <p className="mb-2 text-sm text-zinc-400">Type</p>
                    <div className="grid gap-2">
                        {TYPES.map(([value, t]) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => selectType(value)}
                                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                                    type === value
                                        ? 'border-lime-400 bg-lime-400/10 text-white'
                                        : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                                }`}
                            >
                                {t.emoji} {t.label}
                                <span className="float-right text-zinc-500">{t.defaultDuration} min</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                        <span className="mb-2 block text-sm text-zinc-400">Date</span>
                        <input
                            type="date"
                            required
                            min={today()}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className="mb-2 block text-sm text-zinc-400">Start time</span>
                        <input
                            type="time"
                            required
                            step={900}
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={inputClass}
                        />
                    </label>
                </div>

                <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">Duration (minutes)</span>
                    <input
                        type="number"
                        required
                        min={15}
                        max={180}
                        step={15}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className={inputClass}
                    />
                </label>
            </div>

            {create.error && <p className="mt-4 text-sm text-red-400">{create.error.message}</p>}
            {create.isSuccess && !create.isPending && (
                <p className="mt-4 text-sm text-lime-400">✓ Session added</p>
            )}

            <button
                type="submit"
                disabled={create.isPending}
                className="mt-6 w-full rounded-xl bg-lime-400 py-3 font-semibold text-zinc-950 transition hover:bg-lime-300 disabled:opacity-50"
            >
                {create.isPending ? 'Adding…' : 'Add session'}
            </button>
        </form>
    );
}