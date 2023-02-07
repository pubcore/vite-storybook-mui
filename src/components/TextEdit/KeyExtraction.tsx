import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { decodeFromText } from "./decodeFromText";
import { TextEditContext } from "./i18nextPlugin";
import useMouse from "@react-hook/mouse-position";
import { debounce } from "lodash-es";

//track mouse and extract text-keys used in page "under" the pointer
export function KeyExtraction({
  children,
  selectTextkeys,
}: {
  children: ReactNode;
  selectTextkeys: (textKeys: string[]) => void;
}) {
  const { indexByTextkey } = useContext(TextEditContext);
  const ref = useRef(null);
  const { x, y } = useMouse(ref);
  const coords = useRef<[x: number, y: number]>([0, 0]);
  coords.current = [x ?? 0, y ?? 0];

  const handleOnKeyUp = useCallback<(e: KeyboardEvent) => void>(
    ({ code }) => {
      if (code !== "Space") {
        return;
      }
      selectTextkeys(
        decodeFromText(
          document.elementFromPoint(...coords.current)?.textContent ?? ""
        ).flatMap((i) => {
          const textkeyByIndex = Array.from(indexByTextkey).reduce(
            (acc, [key, index]) => acc.set(index, JSON.parse(key)),
            new Map<number, string>()
          );
          return textkeyByIndex.get(i) ? textkeyByIndex.get(i)! : [];
        })
      );
    },
    [indexByTextkey, selectTextkeys]
  );

  const hndleeOnKeyUpDebounced = useMemo(
    () => debounce((arg) => handleOnKeyUp(arg), 250),
    [handleOnKeyUp]
  );

  useEffect(() => {
    document.addEventListener("keyup", hndleeOnKeyUpDebounced);
    return () => {
      document.removeEventListener("keyup", hndleeOnKeyUpDebounced);
    };
  }, [hndleeOnKeyUpDebounced]);

  return <div {...{ ref }}>{children}</div>;
}
