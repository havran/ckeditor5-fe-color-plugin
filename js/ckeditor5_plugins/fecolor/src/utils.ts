import {
  ColorSelectorView,
  type ColorDefinition,
  type ColorPickerViewConfig,
  type DropdownView
} from "ckeditor5/src/ui";

export const FECOLOR = 'fecolor';

export type FontColorSelectorDropdownView = DropdownView & {
  colorSelectorView?: ColorSelectorView;
};

/**
 * A helper that adds {@link module:ui/colorselector/colorselectorview~ColorSelectorView} to the color dropdown with proper initial values.
 *
 * @param options Configuration options
 * @param options.dropdownView The dropdown view to which a {@link module:ui/colorselector/colorselectorview~ColorSelectorView}
 * will be added.
 * @param options.colors An array with definitions representing colors to be displayed in the color selector.
 * @param options.columns The number of columns in the color grid.
 * @param options.removeButtonLabel The label for the button responsible for removing the color.
 * @param options.colorPickerLabel The label for the color picker button.
 * @param options.documentColorsLabel The label for the section with document colors.
 * @param options.documentColorsCount The number of document colors inside the dropdown.
 * @param options.colorPickerViewConfig Configuration of the color picker view.
 * @returns The new color selector view.
 * @internal
 */
export function addColorSelectorToDropdown(
  {
    dropdownView, colors, columns, removeButtonLabel, colorPickerLabel,
    documentColorsLabel, documentColorsCount, colorPickerViewConfig
  }: {
    dropdownView: FontColorSelectorDropdownView;
    colors: Array<ColorDefinition>;
    columns: number;
    removeButtonLabel: string;
    colorPickerLabel: string;
    documentColorsLabel?: string;
    documentColorsCount?: number;
    colorPickerViewConfig: ColorPickerViewConfig | false;
  }
): ColorSelectorView {
  const locale = dropdownView.locale!;
  const colorSelectorView = new ColorSelectorView( locale, {
    colors,
    columns,
    removeButtonLabel,
    colorPickerLabel,
    documentColorsLabel,
    documentColorsCount,
    colorPickerViewConfig
  } );

  dropdownView.colorSelectorView = colorSelectorView;
  dropdownView.panelView.children.add( colorSelectorView );

  return colorSelectorView;
}
