import type { PostProcessorModule } from "i18next";
import { createContext } from "react";
import { encodeNumber } from "./encodeNumber";

export const indexByTextkey: TextEditContextValue["indexByTextkey"] = new Map();
export let isEnabled = !!new URLSearchParams(
  (parent.location ?? document.location).search
).get("textedit");

//i18next plugin
export default {
  type: "postProcessor",
  name: "i18nextTextEditPlugin",
  process(value: string, key) {
    if (!isEnabled) {
      return value;
    }
    const keyHash = JSON.stringify(key);
    /* return manipulated value */
    if (indexByTextkey.get(keyHash) === undefined) {
      indexByTextkey.set(keyHash, indexByTextkey.size + 1);
    }
    const keyIndex = indexByTextkey.get(keyHash);
    const invisibleKeyChars =
      keyIndex === undefined ? "" : encodeNumber(keyIndex);
    return value + invisibleKeyChars;
  },
} as PostProcessorModule;

const initialContextValue: TextEditContextValue = {
  loadText: () => ({}),
  indexByTextkey,
};
export const TextEditContext = createContext(initialContextValue);

type Text = Record<string, string>;
type TextEditContextValue = {
  loadText: () => Promise<Text> | Text;
  indexByTextkey: Map<string, number>;
};
