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

export const getFeColorClasses = (config: FeColorConfig): string[] => {
  const classes: string[] = [];
  config.colors.forEach((color) => {
    classes.push(color.class);
  });
  return classes;
}

export const getFeColorMap = (config: FeColorConfig): TwoWayMap<string, string> => {
  const map = new TwoWayMap<string, string>();
  config.colors.forEach((color) => {
    map.set(color.color, color.class);
  });
  return map;
}
