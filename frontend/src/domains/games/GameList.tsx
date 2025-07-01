import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useStore } from "@tanstack/react-store";
import {
  accountStore,
  type GameSettings,
  gameSettingsStore,
} from "@/core/store.ts";
import { Link } from "react-router";
import api from "@/core/api";
import { useQuery } from "@tanstack/react-query";
import type { GameType } from "@/domains/types";

import dayjs from "dayjs";
import { getGameStatus } from "@/domains/games/helpers";
import { useEffect, useState } from "react";

const GameStatusView = (
  game: GameType,
  currentTime: dayjs.Dayjs,
  gameSettings: GameSettings,
  accountId: string,
) => {
  const gameStatus = getGameStatus(game, currentTime, gameSettings);

  const statusMap = {
    Cooldown: "destructive",
    Active: "default",
    Completed: "secondary",
  };

  const variant = statusMap[gameStatus] as
    | "default"
    | "destructive"
    | "secondary";

  return (
    <Link to={`/games/${game.id}`} className="space-x-2">
      <Badge variant={variant}>
        {gameStatus === "Cooldown"
          ? `click to play :${dayjs(game.createdAt).add(gameSettings.COOLDOWN_DURATION, "seconds").unix() - currentTime.unix()}`
          : gameStatus}
      </Badge>

      {Boolean(game.users.find((gameUser) => gameUser.userId === accountId)) &&
        gameStatus === "Active" && (
          <Badge variant="destructive">you are in game</Badge>
        )}
    </Link>
  );
};

export function GameList() {
  const account = useStore(accountStore, (state) => state);
  const gameSettings = useStore(gameSettingsStore, (state) => state);

  const games = useQuery({
    queryKey: ["games"],
    queryFn: async () => (await api.getGameList()).data,
  });

  const [currentTime, setCurrenTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrenTime(dayjs());
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="game-list">
      {currentTime.format("HH:mm:ss")}
      <Table>
        <TableCaption>A list of games.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
          </TableRow>
        </TableHeader>
        {games.isFetched && (
          <TableBody>
            {(games.data || []).map((game: GameType) => (
              <TableRow key={game.id}>
                <TableCell className="font-medium">{game.title}</TableCell>
                <TableCell>
                  {GameStatusView(
                    game,
                    currentTime,
                    gameSettings,
                    account.data.id as string,
                  )}
                </TableCell>
                <TableCell>---</TableCell>
                <TableCell>
                  {dayjs(game.createdAt)
                    .add(gameSettings.COOLDOWN_DURATION, "seconds")
                    .format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {dayjs(game.createdAt)
                    .add(
                      gameSettings.COOLDOWN_DURATION +
                        gameSettings.ROUND_DURATION,
                      "seconds",
                    )
                    .format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      {account.data.isAdmin && (
        <div className="buttons">
          <Button asChild>
            <Link to={"/games/new"}>Create game</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
