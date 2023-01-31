import { createContext } from "react";

export const initial = {
  pageSize: 3,
  topBarHeight: 65,
  bottomBarHeight: 45,
};

export const ContainerContext = createContext(initial);
