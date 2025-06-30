import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ws } from "@/core/websocket";

function App() {
  const [message, setMessage] = useState("message from client");

  useEffect(() => {
    ws.onmessage = (messageFromServer: MessageEvent) => {
      const { message } = JSON.parse(messageFromServer.data);
      toast("Event has been received", {
        description: message,
        action: {
          label: "ok",
          onClick: () => console.log("success"),
        },
      });
    };
  });

  const sendMessage = useCallback(() => {
    ws.send(JSON.stringify({ message }));
  }, [message]);

  return (
    <div className="space-y-4">
      <Input
        value={message}
        onInput={(e) => {
          setMessage(e.currentTarget.value);
        }}
      />
      <Button onClick={sendMessage}>send message</Button>
    </div>
  );
}

export default App;
