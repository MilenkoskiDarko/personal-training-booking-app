import { config } from '../config';
import { formatEndTime, formatTime } from '../lib/format';
import type { Session } from '../types';

interface Props {
    session: Session;
    onSelect: (session: Session) => void;
}

export default function SessionCard({ session, onSelect }: Props) {
    const type = config.sessionTypes[session.type];

    return (
        <button
            onClick={() => onSelect(session)}
            className="group w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-lime-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
        >
            <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">
          {formatTime(session.startsAt)} – {formatEndTime(session.startsAt, session.durationMin)}
        </span>
                <span className="text-sm text-zinc-400">{session.durationMin} min</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
        <span className="text-zinc-300">
          {type.emoji} {type.label}
        </span>
                <span className="text-sm font-medium text-lime-400 transition sm:opacity-0 sm:group-hover:opacity-100">
          Book →
        </span>
            </div>
        </button>
    );
}