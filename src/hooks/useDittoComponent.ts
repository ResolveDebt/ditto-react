import { useContext } from "react";
import { DittoContext, SourceDetector, VariablesInput } from "../lib/context";
import { nullError, interpolateVariableText } from "../lib/utils";

interface Args {
  componentId: string;
  variables?: VariablesInput;
  count?: number;
}

export const useDittoComponent = (props: Args): string | null => {
  const { componentId, variables, count } = props;
  const { source, variant } = useContext(DittoContext);
  if (!("ditto_component_library" in source)) {
    throw new Error(
      "An export file for the Component Library couldn't be found."
    );
  }

  if (variant) {
    const data = source?.ditto_component_library?.[variant];
    if (data && data[componentId]) {
      if (SourceDetector.isStructured(data)) {
        return interpolateVariableText(data[componentId], variables || {}, count)
          .text;
      } else if (SourceDetector.isFlat(data)) {
        return data[componentId];
      }
    }
  }

  const data = source?.ditto_component_library?.base;
  if (!data) {
    return nullError("Base text not found in component library");
  }

  if (data && !data[componentId]) {
    return nullError(`Text not found for component "${componentId}"`);
  }

  if (SourceDetector.isStructured(data)) {
    return interpolateVariableText(data[componentId], variables || {}, count).text;
  }

  if (SourceDetector.isFlat(data)) {
    return data[componentId];
  }

  return nullError(`Invalid format for component ${componentId}`);
};
