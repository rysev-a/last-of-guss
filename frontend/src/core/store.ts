import { Store } from "@tanstack/react-store";

export interface AccountStore {
  isLoaded: boolean;
  isAuth: boolean;
  data: {
    email: string | null;
    username: string | null;
  };
}

const defaultAccountState = () => ({
  isLoaded: false,
  isAuth: false,
  data: {
    email: null,
    username: null,
  },
});

export const accountStore = new Store<AccountStore>(defaultAccountState());

export const loadAccount = ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => {
  accountStore.setState(() => {
    return {
      isLoaded: true,
      isAuth: true,
      data: { email, username },
    };
  });
};

export const logoutAccount = () => {
  accountStore.setState(() => ({
    ...defaultAccountState(),
    isLoaded: true,
  }));
};
