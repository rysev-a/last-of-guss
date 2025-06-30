import { Store } from "@tanstack/react-store";

export interface AccountStore {
  isLoaded: boolean;
  isAuth: boolean;
  data: {
    email: string | null;
    username: string | null;
  };
}

export const accountStore = new Store<AccountStore>({
  isLoaded: false,
  isAuth: false,
  data: {
    email: null,
    username: null,
  },
});

export const loadAccount = ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => {
  accountStore.setState((state) => {
    return {
      ...state,
      data: { email, username },
    };
  });
};
