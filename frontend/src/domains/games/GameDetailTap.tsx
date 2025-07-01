import { Button } from "@/components/ui/button";
import type { GameType } from "@/domains/types";
import type { AccountStore, GameSettings } from "@/core/store";
import { Progress } from "@/components/ui/progress";
import ChartView from "@/domains/games/Chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface GameDetailTapProps {
  userInGame: boolean;
  tap: () => void;
  game: GameType;
  account: AccountStore;
  countdown: number;
  gameSettings: GameSettings;
}

export default function GameDetailTap(props: GameDetailTapProps) {
  const total = props.game.taps
    .filter((tap) => tap.userId === props.account.data.id)
    .reduce((result, tap) => {
      return result + tap.value;
    }, 0);

  return (
    <div className="game space-y-4 h-full ">
      <Alert variant="default">
        <AlertCircleIcon />
        <AlertTitle>Game in progess!</AlertTitle>
        <AlertDescription>
          <p>
            Game end after{" "}
            <span className="font-bold">
              {props.gameSettings.ROUND_DURATION - props.countdown}
            </span>{" "}
            seconds
          </p>
        </AlertDescription>
      </Alert>

      <Progress value={(total / 1000) * 100} className="w-full" />
      <div className="flex items-center">
        {props.userInGame && (
          <Button
            variant="outline"
            className="cursor-pointer w-full h-20"
            onClick={props.tap}
          >
            Tap {total}
          </Button>
        )}
      </div>

      <ChartView game={props.game} />
    </div>
  );
}
