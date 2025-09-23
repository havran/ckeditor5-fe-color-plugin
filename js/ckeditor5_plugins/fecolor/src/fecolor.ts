import { Plugin } from 'ckeditor5/src/core';
import { FeColorUI } from './fecolorui';
import { FeColorEditing } from './fecolorediting';

export class FeColor extends Plugin {
  static get requires() {
    return [ FeColorEditing, FeColorUI ];
  }
  // Plugin name used in configuration
  static get pluginName() {
    return 'FeColor';
  }
}
