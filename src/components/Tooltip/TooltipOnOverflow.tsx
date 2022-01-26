import { styled, Tooltip, TooltipProps } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

export interface TooltipOnOverflowProps
  extends Omit<TooltipProps, "children" | "title"> {
  children: ReactNode;
}

export default function TooltipOnOverflow({
  children,
  ...rest
}: TooltipOnOverflowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setEnable] = useState(false);

  const compareSize = () => {
    if (containerRef.current) {
      const isOverflow =
        containerRef.current.scrollWidth > containerRef.current.clientWidth;
      setEnable(isOverflow);
    }
  };
  useEffect(() => {
    compareSize();
    window.addEventListener("resize", compareSize);
    return () => {
      window.removeEventListener("resize", compareSize);
    };
  }, []);

  return (
    <Tooltip
      {...rest}
      title={<>{children}</>}
      disableHoverListener={!isEnabled}
    >
      <Value ref={containerRef}>{children}</Value>
    </Tooltip>
  );
}

const Value = styled("div")({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
});
