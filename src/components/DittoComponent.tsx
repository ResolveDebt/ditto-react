import React, { useMemo } from "react";
import { useDittoComponent } from "../hooks/useDittoComponent";
import { DittoComponentLibraryProps } from "./Ditto";

export const DittoComponent = (props: DittoComponentLibraryProps) => {
  const { children, componentId, variables, count } = props;

  const value = useDittoComponent({
    componentId,
    // @ts-ignore
    alwaysReturnString: typeof children !== "function",
    variables: variables || {},
    count
  });

  const text = useMemo(
    // @ts-ignore
    () => (value !== null && typeof value === "object" ? value.text : value),
    [value]
  );

  return (
    <React.Fragment>
      {typeof children === "function" ? children(text) : text}
    </React.Fragment>
  );
};
