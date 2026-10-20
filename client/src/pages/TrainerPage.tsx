import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import CreateSessionForm from '../components/CreateSessionForm';
import TrainerSessionRow from '../components/TrainerSessionRow';
import { config } from '../config';
import { formatDay, groupByDay } from '../lib/format';

export default function TrainerPage() {
    const { data: sessions, isLoading, error } = useQuery({
        queryKey: ['sessions', 'all'],
        queryFn: () => api.listSessions(false),
    });

    const booked = sessions?.filter((s) => s.booking).length ?? 0;
    const open = (sessions?.length ?? 0) - booked;
    const days = sessions ? groupByDay(sessions) : [];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="mx-auto max-w-5xl px-4 py-12">
                <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-lime-400">
                            {config.businessName}
                        </p>
                        <h1 className="mt-2 text-4xl font-bold">Trainer dashboard</h1>
                    </div>
                    <Link to="/" className="text-sm text-zinc-400 hover:text-lime-400">
                        View booking page →
                    </Link>
                </header>

                <div className="mb-8 grid grid-cols-2 gap-3 sm:max-w-sm">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                        <p className="text-3xl font-bold text-lime-400">{booked}</p>
                        <p className="text-sm text-zinc-400">Booked</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                        <p className="text-3xl font-bold">{open}</p>
                        <p className="text-sm text-zinc-400">Open</p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
                    <div className="lg:sticky lg:top-8 lg:self-start">
                        <CreateSessionForm />
                    </div>

                    <div>
                        {isLoading && (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-20 animate-pulse rounded-2xl bg-zinc-900" />
                                ))}
                            </div>
                        )}

                        {error && <p className="text-red-400">Couldn't load sessions.</p>}

                        {sessions?.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center text-zinc-400">
                                No upcoming sessions yet. Add your first one ←
                            </div>
                        )}

                        {days.map(([key, daySessions]) => (
                            <section key={key} className="mb-8">
                                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                                    {formatDay(daySessions[0].startsAt)}
                                </h2>
                                <div className="space-y-3">
                                    {daySessions.map((s) => (
                                        <TrainerSessionRow key={s.id} session={s} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}