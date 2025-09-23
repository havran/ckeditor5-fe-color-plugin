import { Plugin } from 'ckeditor5/src/core';
import {
  type ColorSelectorExecuteEvent,
  type ColorDefinition,
  createDropdown
} from 'ckeditor5/src/ui';

import type { FeColorCommand } from "./fecolorcommand";
import type { FeColor, FeColorConfig } from "./lib/Colors";

import {
  type FontColorSelectorDropdownView,
  addColorSelectorToDropdown,
  FECOLOR,
} from "./utils";

import fontColor from '../theme/icons/font-color.svg';

export class FeColorUI extends Plugin {
  init() {
    const editor = this.editor;
    const locale = editor.locale;
    const command: FeColorCommand = editor.commands.get( FECOLOR )! as FeColorCommand;
    const config: FeColorConfig = editor.config.get(FECOLOR)! as FeColorConfig;
    // Normalize the colors from the configuration to the format required by the ColorSelectorView.
    const colorDefinitions: ColorDefinition[] = config.colors.map( ( feColor: FeColor ) => ( {
      color: feColor.color,
      label: feColor.label,
      options: {
        hasBorder: feColor.options?.hasBorder || false
      }
    } ) );

    // Register the button in the editor's UI component factory.
    editor.ui.componentFactory.add( FECOLOR, locale => {
      const dropdownView: FontColorSelectorDropdownView = createDropdown( locale );
      // Font color dropdown rendering is deferred once it gets open to improve performance (#6192).
      let dropdownContentRendered = false;

      const colorSelectorView = addColorSelectorToDropdown( {
        dropdownView,
        colors: colorDefinitions,
        columns: 5,
        removeButtonLabel: 'Remove color',
        colorPickerLabel: 'Color picker',
        documentColorsLabel: 'Document colors',
        documentColorsCount: 4,
        colorPickerViewConfig: false
      } );

      colorSelectorView.bind( 'selectedColor' ).to( command, 'value' );

      dropdownView.buttonView.set( {
        label: 'Select color',
        icon: fontColor,
        tooltip: true
      } );

      dropdownView.extendTemplate( {
        attributes: {
          class: 'ck-color-ui-dropdown'
        }
      } );

      dropdownView.bind( 'isEnabled' ).to( command );

      dropdownView.on( 'change:isOpen', ( evt, name, isVisible ) => {
        if ( !dropdownContentRendered ) {
          dropdownContentRendered = true;
          dropdownView.colorSelectorView!.appendUI();
        }

        if ( isVisible ) {
          colorSelectorView!.updateSelectedColors();
          colorSelectorView!.showColorGridsFragment();
        }
      } );

      dropdownView.colorSelectorView!.on<ColorSelectorExecuteEvent>( 'execute', ( evt, data ) => {
        if ( dropdownView.isOpen ) {
          editor.execute( FECOLOR, {
            value: data.value
          } );
        }

        if ( data.source !== 'colorPicker' ) {
          editor.editing.view.focus();
        }
      } );

      return dropdownView;
    } );
  }
}
