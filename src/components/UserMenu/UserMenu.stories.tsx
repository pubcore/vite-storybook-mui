import { UserMenu } from "../";

export default {
  title: "User menu",
};

export const Default = () => (
  <UserMenu
    {...{
      logout: () => {
        null;
      },
    }}
  >
    <></>
  </UserMenu>
);
