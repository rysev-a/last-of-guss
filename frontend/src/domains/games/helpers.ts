import type { GameType } from "@/domains/types";
import dayjs from "dayjs";
import type { GameSettings } from "@/core/store";

export type GameStatusType = "Cooldown" | "Active" | "Completed";

export const getGameStatus = (
  game: GameType,
  currentTime: dayjs.Dayjs,
  gameSettings: GameSettings,
): GameStatusType => {
  const calculatedCountdown =
    dayjs(game.createdAt)
      .add(gameSettings.COOLDOWN_DURATION, "seconds")
      .unix() - currentTime.unix();

  if (calculatedCountdown > 0) {
    return "Cooldown";
  }
  return calculatedCountdown + gameSettings.ROUND_DURATION > 0
    ? "Active"
    : "Completed";
};

export const calculateUserScore = (userId: string, game: GameType): number => {
  const total = game.taps
    .filter((tap) => tap.userId === userId)
    .reduce((result, tap, currentIndex) => {
      if ((currentIndex + 1) % 11 == 0) {
        return result + tap.value * 10;
      }
      return result + tap.value;
    }, 0);

  return total;
};

export const getWinner = (game: GameType) => {
  const winner = game.users.reduce(
    (winner, user) => {
      const userScore = calculateUserScore(user.userId, game);

      if (userScore > winner.total) {
        return {
          id: user.userId,
          total: userScore,
          username: user.user.username,
        };
      }

      return winner;
    },
    { id: "", total: 0, username: "game is empty" },
  );

  return winner.username;
};
