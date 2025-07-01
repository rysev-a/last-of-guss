import { Store } from "@tanstack/react-store";

export interface AccountStore {
  isLoaded: boolean;
  isAuth: boolean;
  data: {
    id: string | null;
    email: string | null;
    username: string | null;
    isAdmin: boolean;
  };
}

export interface GameSettings {
  ROUND_DURATION: number;
  COOLDOWN_DURATION: number;
}

export interface UserRole {
  role: {
    name: string;
  };
}

const defaultAccountState = () => ({
  isLoaded: false,
  isAuth: false,
  data: {
    id: null,
    email: null,
    username: null,
    isAdmin: false,
  },
});

export const accountStore = new Store<AccountStore>(defaultAccountState());

export const loadAccount = ({
  id,
  email,
  username,
  roles,
}: {
  id: string;
  email: string;
  username: string;
  roles: UserRole[];
}) => {
  accountStore.setState(() => {
    return {
      isLoaded: true,
      isAuth: true,
      data: {
        id,
        email,
        username,
        isAdmin: Boolean(
          roles.find((role: UserRole) => role.role.name === "admin"),
        ),
      },
    };
  });
};

export const logoutAccount = () => {
  accountStore.setState(() => ({
    ...defaultAccountState(),
    isLoaded: true,
  }));
};

export const gameSettingsStore = new Store<GameSettings>({
  ROUND_DURATION: 60,
  COOLDOWN_DURATION: 30,
});

export const loadGameSettings = ({
  ROUND_DURATION,
  COOLDOWN_DURATION,
}: GameSettings) => {
  gameSettingsStore.setState({ ROUND_DURATION, COOLDOWN_DURATION });
};
