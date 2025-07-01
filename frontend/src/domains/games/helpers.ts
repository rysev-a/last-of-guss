import type { GameType } from "@/domains/types";
import dayjs from "dayjs";
import type { GameSettings } from "@/core/store";

export type GameStatusType = "Cooldown" | "Active" | "Completed";

export const getGameStatus = (
  game: GameType,
  currentTime: dayjs.Dayjs,
  gameSettings: GameSettings,
): GameStatusType => {
  const gameStart = dayjs(game.createdAt).add(
    gameSettings.COOLDOWN_DURATION,
    "seconds",
  );

  const gameEnd = dayjs(game.createdAt).add(
    gameSettings.ROUND_DURATION + gameSettings.COOLDOWN_DURATION,
    "seconds",
  );

  if (currentTime < gameStart) {
    return "Cooldown";
  }

  if (currentTime < gameEnd) {
    return "Active";
  }

  return "Completed";
};
