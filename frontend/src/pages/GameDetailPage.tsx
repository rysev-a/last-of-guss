import GameDetail from "@/domains/games/GameDetail";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/core/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameType } from "@/domains/types";
import { useEffect } from "react";
import { ws } from "@/core/websocket";
import { queryClient } from "@/core/queryClient";

const GameDetailPage = () => {
  const params = useParams();

  const game = useQuery({
    queryKey: ["games", params.id],
    queryFn: async () => (await api.getGameDetail(params.id as string)).data,
  });

  useEffect(() => {
    ws.onmessage = (messageFromServer: MessageEvent) => {
      const { message } = JSON.parse(messageFromServer.data);
      const game = JSON.parse(message);

      if (game.id === params.id) {
        queryClient.setQueryData(["games", game.id], () => game);
      }
    };
  });

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

  return <GameDetail game={game.data as GameType} />;
};

export default GameDetailPage;
