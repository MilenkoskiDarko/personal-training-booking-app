import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export default function BookPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['sessions', 'available'],
        queryFn: () => api.listSessions(true),
    });

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <h1 className="text-3xl font-bold text-lime-400">Book a session</h1>
            {isLoading && <p>Loading…</p>}
            {error && <p className="text-red-400">{error.message}</p>}
            {data && <p className="mt-4">Found {data.length} available sessions</p>}
        </div>
    );
}