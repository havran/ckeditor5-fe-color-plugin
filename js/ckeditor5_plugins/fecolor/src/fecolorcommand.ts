import { Command } from 'ckeditor5/src/core';
import { type Writer } from 'ckeditor5/src/engine';
import { FECOLOR } from "./utils";

/**
 * The base FeColor command.
 */
export class FeColorCommand extends Command {
  /**
   * When set, it reflects the {@link #attributeKey} value of the selection.
   *
   * @observable
   * @readonly
   */
  declare public value: string;

  /**
   * @inheritDoc
   */
  public override refresh(): void {
    const model = this.editor.model;
    const doc = model.document;

    this.value = doc.selection.getAttribute( FECOLOR ) as string;
    this.isEnabled = model.schema.checkAttributeInSelection( doc.selection, FECOLOR );
  }

  /**
   * Executes the command. Applies the `value` of the {@link #attributeKey} to the selection.
   * If no `value` is passed, it removes the attribute from the selection.
   *
   * @param options Options for the executed command.
   * @param options.value The value to apply.
   * @fires execute
   */
  public override execute( options: { value?: string; } = {} ): void {
    const model = this.editor.model;
    const document = model.document;
    const selection = document.selection;

    const value = options.value;

    const updateAttribute = ( writer: Writer ) => {
      if ( selection.isCollapsed ) {
        if ( value ) {
          writer.setSelectionAttribute( FECOLOR, value );
        } else {
          writer.removeSelectionAttribute( FECOLOR );
        }
      } else {
        const ranges = model.schema.getValidRanges( selection.getRanges(), FECOLOR );

        for ( const range of ranges ) {
          if ( value ) {
            writer.setAttribute( FECOLOR, value, range );
          } else {
            writer.removeAttribute( FECOLOR, range );
          }
        }
      }
    };

    model.change( writer => {
      updateAttribute( writer );
    } );
  }
}
