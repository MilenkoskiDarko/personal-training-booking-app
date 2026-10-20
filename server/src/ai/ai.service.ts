import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const TIMEZONE = 'Europe/Skopje';
const TIMEOUT_MS = 45000;

const SESSION_LABELS: Record<string, string> = {
  ASSESSMENT: 'fitness assessment',
  TRAINING: '1-on-1 training session',
  ONLINE: 'online training session',
};

const GOAL_LABELS: Record<string, string> = {
  STRENGTH: 'building strength',
  WEIGHT_LOSS: 'weight loss',
  MOBILITY: 'mobility',
  GENERAL: 'general fitness',
};

interface ConfirmationInput {
  name: string;
  type: string;
  goal: string;
  startsAt: Date;
  durationMin: number;
  note?: string | null;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly model = process.env.GEMINI_MODEL;
  private readonly client = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;

  async bookingConfirmation(input: ConfirmationInput): Promise<string> {
    const when = input.startsAt.toLocaleString('en-GB', {
      timeZone: TIMEZONE,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
    const session = SESSION_LABELS[input.type] ?? 'session';
    const goal = GOAL_LABELS[input.goal] ?? 'fitness';

    const fallback = `Hi ${input.name}! Your ${session} on ${when} is confirmed. See you there! 💪`;

    if (!this.client || !this.model) return fallback;

    const prompt = `You are a friendly, energetic personal trainer.
Write a booking confirmation for a client in 2-3 short sentences.
- Client name: ${input.name}
- Session: ${session}, ${input.durationMin} minutes, on ${when}
- Client's goal: ${goal}
${input.note ? `- Client's note: "${input.note}"` : ''}
Confirm the date and time, then give ONE practical tip on how to prepare for this session based on their goal.
Plain text only, no markdown, at most one emoji.`;

    try {
      const response = await Promise.race([
        this.client.models.generateContent({
          model: this.model,
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            maxOutputTokens: 500,
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), TIMEOUT_MS),
        ),
      ]);
      const text = response.text?.trim();
      if (!text) {
        this.logger.warn(`Gemini returned empty text: ${JSON.stringify(response.candidates?.[0]?.finishReason)}`);
        return fallback;
      }
      return text;    } catch (e) {
      this.logger.warn(
        `Gemini failed, using fallback: ${(e as Error).message}`,
      );
      return fallback;
    }
  }
}
