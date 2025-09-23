import { Plugin } from 'ckeditor5/src/core';
import { FeColorCommand } from "./fecolorcommand";
import {
  type FeColorConfig,
  getFeColorClasses,
  getFeColorMap
} from "./lib/Colors";
import { FECOLOR } from "./utils";

export class FeColorEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();
  }
  _defineSchema() {
    const schema = this.editor.model.schema;

    // Extend the text node's schema to accept the abbreviation attribute.
    schema.extend( '$text', { allowAttributes: FECOLOR } );
  }

  _defineConverters() {
    const conversion = this.editor.conversion;
    const config: FeColorConfig = this.editor.config.get(FECOLOR)! as FeColorConfig;
    const mapColorToClass = getFeColorMap(config);
    const classes = getFeColorClasses(config);

    // Conversion from a view element to a model attribute
    // Register one converter per class
    classes.forEach( classString => {
      conversion.for( 'upcast' ).elementToAttribute(
        {
          view: {
            name: 'span',
            classes: [ classString ]
          },
          model: {
            key: FECOLOR,
            value: mapColorToClass.getReverse(classString)
          },
          converterPriority: 'high'
        }
      )
    });

    // Conversion from a model attribute to a view element
    conversion.for( 'downcast' ).attributeToElement( {
      model: FECOLOR,
      // Callback function provides access to the model attribute value
      // and the DowncastWriter
      view: ( modelAttributeValue, { writer } ) => {
        return writer.createAttributeElement( 'span', { class: mapColorToClass.getForward(modelAttributeValue) ?? modelAttributeValue } );
      },
      converterPriority: 'high'
    } );

    this.editor.commands.add( FECOLOR, new FeColorCommand( this.editor ) );
  }
}
