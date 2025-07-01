import { useQuery } from "@tanstack/react-query";
import api from "@/core/api";
import { useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@tanstack/react-store";
import { accountStore, gameSettingsStore } from "@/core/store";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { getGameStatus } from "@/domains/games/helpers";
import type { GameType } from "@/domains/types";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { queryClient } from "@/core/queryClient";

export default function GameDetail() {
  const params = useParams();
  const account = useStore(accountStore, (state) => state);
  const gameSettings = useStore(gameSettingsStore, (state) => state);

  const game = useQuery({
    queryKey: ["games", params.id],
    queryFn: async () => (await api.getGameDetail(params.id as string)).data,
  });

  const joinToGame = useCallback(() => {
    if (account.isLoaded && game.isFetched) {
      api.joinToGame(game.data?.id as string).then((response) => {
        queryClient.setQueryData(
          ["games", response.data.id],
          () => response.data,
        );
      });
    }
  }, [account, game]);

  const [currentTime, setCurrenTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrenTime(dayjs());
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (game.isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  const gameData = game.data as GameType;
  const status = getGameStatus(gameData, currentTime, gameSettings);

  const userInGame = game.data?.users.find(
    (gameUser) => gameUser.userId === account.data.id,
  );

  if (status === "Cooldown") {
    return (
      <div className="cooldown-view">
        <div className="grid w-full max-w-xl items-start gap-4">
          {userInGame && (
            <Alert>
              <CheckCircle2Icon />
              <AlertTitle>Success! You are in game!</AlertTitle>
              <AlertDescription>
                <p>
                  Game start after{" "}
                  <span className="font-bold">
                    {` ${dayjs(gameData.createdAt).add(gameSettings.COOLDOWN_DURATION, "seconds").unix() - currentTime.unix()}`}{" "}
                  </span>
                  seconds
                </p>
              </AlertDescription>
            </Alert>
          )}

          {!userInGame && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Join to game!</AlertTitle>
              <AlertDescription>
                <p>
                  Game start after{" "}
                  <span className="font-bold">
                    {` ${dayjs(gameData.createdAt).add(gameSettings.COOLDOWN_DURATION, "seconds").unix() - currentTime.unix()}`}{" "}
                  </span>
                  seconds
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {!userInGame && (
          <div className="py-10">
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={joinToGame}
            >
              Join to game
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (status === "Completed") {
    return <div>Show game statistic</div>;
  }

  if (!userInGame) {
    return <div>Show game statistic for active game</div>;
  }

  return (
    <div className="game">
      {userInGame && (
        <Button variant="default" className="cursor-pointer">
          Tap
        </Button>
      )}
    </div>
  );
}
