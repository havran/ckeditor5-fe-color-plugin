import { Plugin } from 'ckeditor5/src/core';
import { FeColorCommand } from "./fecolorcommand";
import {
  type FeColorConfig,
  getFeColorClasses,
  getFeColorMap
} from "./lib/Colors";
import { FECOLOR } from "./utils";
import {forEach} from "es-toolkit/compat";

export class FeColorEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();
  }
  _defineSchema() {
    const schema = this.editor.model.schema;

    // Extend the text node's schema to accept the abbreviation attribute.
    schema.extend( '$text', { allowAttributes: FECOLOR } );

    // Define the model element in the schema
    schema.register(FECOLOR, {
      inheritAllFrom: '$text', // Inherit from text to allow text inside.
      isInline: true,
      allowContentOf: '$block'
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;
    const config: FeColorConfig = this.editor.config.get(FECOLOR)! as FeColorConfig;
    const mapColorToClass = getFeColorMap(config);
    const classes = getFeColorClasses(config);

    // Conversion from a model attribute to a view element
    conversion.for( 'downcast' ).attributeToElement( {
      model: FECOLOR,
      // Callback function provides access to the model attribute value
      // and the DowncastWriter
      view: ( modelAttributeValue, { writer } ) => {
        if ( !modelAttributeValue ) {
          return;
        }

        console.log('>>> model > view', modelAttributeValue, '> mapped >', mapColorToClass.getForward(modelAttributeValue));
        return writer.createAttributeElement( 'span', { class: mapColorToClass.getForward(modelAttributeValue) ?? modelAttributeValue } );
      },
      converterPriority: 'high'
    } );

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
            value: viewElement => {
              return mapColorToClass.getReverse(viewElement.getAttribute( 'class' )) ?? viewElement.getAttribute( 'class' );
            }
          },
          converterPriority: 'high'
        }
      )
    });

    // conversion.for( 'upcast' ).elementToAttribute(
    //   {
    //     view: {
    //       name: 'span',
    //       classes: [ /.*/ ]
    //     },
    //     model: {
    //       key: FECOLOR,
    //       value: viewElement => {
    //         return mapColorToClass.getReverse(viewElement.getAttribute( 'class' )) ?? viewElement.getAttribute( 'class' );
    //       }
    //     },
    //     converterPriority: 'high'
    //   }
    // )

    this.editor.commands.add( FECOLOR, new FeColorCommand( this.editor ) );
  }
}
