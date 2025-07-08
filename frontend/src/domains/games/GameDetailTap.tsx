import { Button } from "@/components/ui/button";
import type { GameType } from "@/domains/types";
import { type AccountStore, type GameSettings } from "@/core/store";
import { Progress } from "@/components/ui/progress";
import ChartView from "@/domains/games/Chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { calculateUserScore } from "@/domains/games/helpers";

interface GameDetailTapProps {
  userInGame: boolean;
  tap: () => void;
  game: GameType;
  account: AccountStore;
  countdown: number;
  gameSettings: GameSettings;
}

export default function GameDetailTap(props: GameDetailTapProps) {
  const total = calculateUserScore(props.account.data.id as string, props.game);

  const progress =
    ((props.gameSettings.ROUND_DURATION + props.countdown) /
      props.gameSettings.ROUND_DURATION) *
    100;

  const [autoTap, setAutoTap] = useState(false);

  const { tap, game } = props;

  useEffect(() => {
    const timer = setInterval(() => {
      if (autoTap) {
        tap();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [autoTap, tap, game.taps]);

  return (
    <div className="game space-y-4 h-full ">
      <Alert variant="default">
        <AlertCircleIcon />
        <AlertTitle>Game in progess!</AlertTitle>
        <AlertDescription>
          <p>
            Game end after{" "}
            <span className="font-bold">
              {props.gameSettings.ROUND_DURATION + props.countdown}
            </span>{" "}
            seconds
          </p>
        </AlertDescription>
      </Alert>
      <Progress
        value={progress}
        className="w-full"
        indicatorColor={cn({
          "bg-green-700": progress > 50,
          "bg-yellow-700": progress < 50,
          "bg-red-700": progress < 10,
        })}
      />
      <div className="flex items-center">
        {props.userInGame && (
          <Button
            variant="outline"
            className="cursor-pointer w-full h-20 "
            onClick={props.tap}
          >
            Tap {total}
          </Button>
        )}
      </div>

      {props.account.data.isAdmin && (
        <Button
          variant={autoTap ? "destructive" : "default"}
          onClick={() => setAutoTap((state) => !state)}
        >
          Auto tap is: {autoTap ? "Enabled" : "Disabled"}
        </Button>
      )}

      <ChartView game={props.game} />
    </div>
  );
}
