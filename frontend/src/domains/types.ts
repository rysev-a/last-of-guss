export type GameStatusType = "Cooldown" | "Active" | "Completed";

export interface UserType {
  id: string;
  email: string;
  username: string;
}

export interface UserGameType {
  userId: string;
  gameId: string;
  user: UserType;
}

export interface GameType {
  id: string;
  title: string;
  users: UserGameType[];
  createdAt: string;
}
