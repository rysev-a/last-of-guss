import api from "@/core/api";
import { useStore } from "@tanstack/react-store";
import { accountStore, gameSettingsStore } from "@/core/store";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import type { GameType } from "@/domains/types";
import { queryClient } from "@/core/queryClient";
import { toast } from "sonner";
import GameDetailTap from "@/domains/games/GameDetailTap";
import { getGameStatus } from "@/domains/games/helpers";
import GameDetailCooldown from "@/domains/games/GameDetailCooldown";
import GameDetailStatistic from "@/domains/games/GameDetailStatistic";

export default function GameDetail({ game }: { game: GameType }) {
  const account = useStore(accountStore, (state) => state);
  const gameSettings = useStore(gameSettingsStore, (state) => state);

  const joinToGame = useCallback(() => {
    if (account.isLoaded) {
      api.joinToGame(game.id as string).then((response) => {
        queryClient.setQueryData(
          ["games", response.data.id],
          () => response.data,
        );
      });
    }
  }, [account, game]);

  const tap = useCallback(() => {
    if (account.isLoaded) {
      api
        .tap(game.id as string)
        .then((response) => {
          queryClient.setQueryData(
            ["games", response.data.id],
            () => response.data,
          );
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  }, [account, game]);

  const [countdown, setCountdown] = useState(
    dayjs(game.createdAt)
      .add(gameSettings.COOLDOWN_DURATION, "seconds")
      .unix() - dayjs().unix(),
  );

  const [status, setStatus] = useState(
    getGameStatus(game, dayjs(), gameSettings),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const calculatedCountdown =
        dayjs(game.createdAt)
          .add(gameSettings.COOLDOWN_DURATION, "seconds")
          .unix() - dayjs().unix();

      setCountdown(calculatedCountdown);

      if (calculatedCountdown > 0) {
        setStatus("Cooldown");
      } else {
        setStatus(
          calculatedCountdown + gameSettings.ROUND_DURATION > 0
            ? "Active"
            : "Completed",
        );
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [
    setCountdown,
    game.createdAt,
    gameSettings.COOLDOWN_DURATION,
    gameSettings.ROUND_DURATION,
  ]);

  const userInGame = Boolean(
    game.users.find((gameUser) => gameUser.userId === account.data.id),
  );

  if (status === "Cooldown") {
    return (
      <GameDetailCooldown
        joinToGame={joinToGame}
        userInGame={userInGame}
        countdown={countdown}
      />
    );
  }

  if (status === "Active") {
    return (
      <GameDetailTap
        gameSettings={gameSettings}
        countdown={countdown}
        userInGame={userInGame}
        tap={tap}
        game={game}
        account={account}
      />
    );
  }

  return <GameDetailStatistic game={game} account={account} />;
}
