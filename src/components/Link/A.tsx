import { Link, LinkProps } from "@mui/material";
import { ReactNode } from "react";

export interface AProps extends LinkProps {
  href: string;
  children: ReactNode;
}

//Use A for external links. Use "Link" for internal links
export default function A({ href, children, ...rest }: AProps) {
  //security: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
  const protocolWhitelist = ["https:", "http:"];
  let protocol;

  try {
    protocol = new URL(href).protocol;
  } catch (err) {
    protocol = "";
  }

  const protocolOk = protocolWhitelist.includes(protocol);
  if (!protocolOk) {
    console.error(Error(`Invalid protocol "${protocol}"`));
  }

  return protocolOk ? (
    <Link
      {...{ ...rest }}
      href={protocolOk ? href : ""}
      target="_blank"
      //security: https://web.dev/external-anchors-use-rel-noopener/
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  ) : (
    <span data-error="Invalid href, anchor not rendered">{children}</span>
  );
}
