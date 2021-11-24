import { useCallback, useState } from "react";
import { ActionButton } from "./components";

export default function App() {
  const [count, setCount] = useState(0);
  const updateCounter = useCallback(() => setCount((count) => count + 1), []);

  return <ActionButton onClick={updateCounter}>count is: {count}</ActionButton>;
}
