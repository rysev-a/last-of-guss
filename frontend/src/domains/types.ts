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

export interface TapType {
  value: number;
  tapNumber: number;
  userId: string;
  gameId: string;
}

export interface GameType {
  id: string;
  title: string;
  users: UserGameType[];
  taps: TapType[];
  createdAt: string;
}
