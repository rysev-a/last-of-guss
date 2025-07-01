import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import api from "@/core/api";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/core/queryClient";
import type { GameType } from "@/domains/types";
import { useNavigate } from "react-router";

const gameCreateFormSchema = z.object({
  title: z.string(),
});

export default function GameCreate() {
  const navigate = useNavigate();

  const gameCreateForm = useForm({
    resolver: zodResolver(gameCreateFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { title: string }) => api.createGame(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["games"], (data: { items: GameType[] }) => {
        return [...(data?.items || []), response.data];
      });
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof gameCreateFormSchema>) => {
      mutation
        .mutateAsync(values)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          if (error.response.data.title) {
            gameCreateForm.setError("title", {
              message: error.response.data.title,
            });
          }
        });
    },
    [navigate, gameCreateForm, mutation],
  );

  return (
    <Form {...gameCreateForm}>
      <form onSubmit={gameCreateForm.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField
            control={gameCreateForm.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Super game" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              Create
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
