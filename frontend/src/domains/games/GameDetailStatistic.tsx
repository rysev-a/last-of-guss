import ChartView from "@/domains/games/Chart";
import type { GameType } from "@/domains/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { calculateUserScore, getWinner } from "@/domains/games/helpers";
import type { AccountStore } from "@/core/store";

interface GameDetailStatisticProps {
  game: GameType;
  account: AccountStore;
}

export default function GameDetailStatistic(props: GameDetailStatisticProps) {
  return (
    <div className="space-y-5">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Success! Round complete!</AlertTitle>
        <AlertDescription>
          <p>
            You score is{" "}
            <span className="font-bold">
              {calculateUserScore(props.account.data.id as string, props.game)}
            </span>{" "}
          </p>
          <p>
            Winner <span className="font-bold"> {getWinner(props.game)}</span>
          </p>
        </AlertDescription>
      </Alert>
      <ChartView game={props.game} />
    </div>
  );
}
