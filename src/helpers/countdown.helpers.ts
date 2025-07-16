/**
 * Determines ping/pong state based on time remaining
 * Handles null/undefined cases properly
 */
export function calculatePingPongState(secondsRemaining?: number | null): {
  canPing: boolean;
  canPong: boolean;
  timeRemaining?: number;
} {
  switch (secondsRemaining) {
    case undefined:
    case null:
      return {
        canPing: true,
        canPong: false,
      };
    case 0:
      return {
        timeRemaining: 0,
        canPing: false,
        canPong: true,
      };
    default: {
      return {
        timeRemaining: secondsRemaining,
        canPing: false,
        canPong: false,
      };
    }
  }
}

/**
 * Formats seconds into MM:SS format
 */
export function formatTimeRemaining(seconds: number | null): string {
  if (!seconds || seconds <= 0) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}
