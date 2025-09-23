import TwoWayMap from "./TwoWayMap";

export type FeColor = {
  label: string;
  class: string;
  color: string;
  options?: {
    hasBorder?: boolean;
  }
};
export type FeColorConfig = {
  colors: Array<FeColor>;
}

// Get array of color classes from configuration.
export const getFeColorClasses = (config: FeColorConfig): string[] => {
  const classes: string[] = [];
  config.colors.forEach((color) => {
    classes.push(color.class);
  });
  return classes;
}

// Get two-way map of color values and classes from configuration.
export const getFeColorMap = (config: FeColorConfig): TwoWayMap<string, string> => {
  const map = new TwoWayMap<string, string>();
  config.colors.forEach((color) => {
    map.set(color.color, color.class);
  });
  return map;
}
