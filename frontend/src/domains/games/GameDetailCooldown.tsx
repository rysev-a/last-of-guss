import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

interface GameDetailCooldownProps {
  userInGame: boolean;
  countdown: number;
  joinToGame: () => void;
}

export default function GameDetailCooldown(props: GameDetailCooldownProps) {
  return (
    <div className="cooldown-view">
      <div className="grid w-full max-w-xl items-start gap-4">
        {props.userInGame && (
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Success! You are in game!</AlertTitle>
            <AlertDescription>
              <p>
                Game start after{" "}
                <span className="font-bold">{props.countdown}</span> seconds
              </p>
            </AlertDescription>
          </Alert>
        )}

        {!props.userInGame && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Join to game!</AlertTitle>
            <AlertDescription>
              <p>
                Game start after{" "}
                <span className="font-bold">{props.countdown}</span> seconds
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {!props.userInGame && (
        <div className="py-10">
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={props.joinToGame}
          >
            Join to game
          </Button>
        </div>
      )}
    </div>
  );
}
