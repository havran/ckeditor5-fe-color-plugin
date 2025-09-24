# CKEditor5 FE Color

Provides custom color palettes and color configuration for CKEditor 5 in Drupal. Lot 
of inspiration, how to do things, is taken from repo https://github.com/CuBoulder/ucb_ckeditor_plugins/tree/main

Thank you!

## INTRODUCTION

The CKEditor5 FE Color module extends CKEditor 5 functionality by providing
predefined frontend color palettes. This allows content editors to use
consistent brand colors throughout the site.

## REQUIREMENTS

This module requires the following modules:

- `CKEditor 5 (Core)`

## CONFIGURATION

After module is enabled and CKEditor 5 is set up, the FeColor plugin should
be available in text formats configuration. Drag and drop the FeColor button
to the active toolbar.

Color configuration is now possible only from code. No UI is provided.

In current state some default colors are configured in the module itself,
in file `ckeditor5_fe_color.ckeditor5.yml` in key
`ckeditor5_fe_color_fecolor.ckeditor5.config.fecolor.colors`:

```yml
ckeditor5_fe_color_fecolor:
  ckeditor5:
    plugins:
      - fecolor.FeColor
    config:
      fecolor:
        colors:
          - label: Black
            color: '#000000'
            class: 'color-black'
          - label: White
            color: '#FFFFFF'
            class: 'color-white'
            options:
              hasBorder: true
  drupal:
    label: Fe Font Color
    library: ckeditor5_fe_color/ckeditor5.fecolor
    admin_library: ckeditor5_fe_color/admin.fecolor
    class: Drupal\ckeditor5_fe_color\Plugin\CKEditor5Plugin\FeColor
    toolbar_items:
      fecolor:
        label: Fe Font Color
    elements:
      - <span>
      - <span class="color-black color-white">
```

You can override them, but better to do it in a custom module. To add custom
colors or modify the existing palette, you can implement the following
hooks:

```php
<?php

use Drupal\ckeditor5\Plugin\CKEditor5PluginDefinition;

/**
 * Implements hook_library_info_alter().
 *
 * This add CKEditor 5 stylesheets CSS files to the editor. You can simply
 * add your custom CSS file(s) to your module and provide path(s) in
 * your `mymodule.info.yml` file in `ckeditor5-stylesheets` property.
 */
function mymodule_library_info_alter(&$libraries, $extension) {
  $module = 'mymodule';
  if ($extension === 'ckeditor5') {
    // Add paths to stylesheets specified by a modules's ckeditor5-stylesheets
    // config property.
    $module_path = \Drupal::service('extension.list.module')->getPath($module);
    $info = \Drupal::service('extension.list.module')->getExtensionInfo($module);
    if (isset($info['ckeditor5-stylesheets']) && $info['ckeditor5-stylesheets'] !== FALSE) {
      $css = $info['ckeditor5-stylesheets'];
      foreach ($css as $key => $url) {
        // CSS URL is external or relative to Drupal root.
        if (UrlHelper::isExternal($url) || $url[0] === '/') {
          $css[$key] = $url;
        }
        // CSS URL is relative to theme.
        else {
          $css[$key] = '/' . $module_path . '/' . $url;
        }
      }
    }
    $libraries['internal.drupal.ckeditor5.stylesheets'] = [
      'css' => [
        'theme' => array_fill_keys(array_values($css), []),
      ],
    ];
  }
}

/**
 * Implements hook_editor_js_settings_alter().
 */
function mymodule_editor_js_settings_alter(array &$settings) {
  // CKEditor 5 FeColor plugin colors configuration.
  // Add custom colors or modify existing ones for the 'basic_html' text format.
  $settings['editor']['formats']['basic_html']['editorSettings']['config']['fecolor']['colors'] = __mymodule_colors();
}

/**
 * Implements hook_ckeditor5_plugin_info_alter().
 */
function mymodule_ckeditor5_plugin_info_alter(array &$plugin_definitions): void {
  // Add all color classes to the CKEditor 5 FeColor plugin elements configuration.
  if (isset($plugin_definitions['ckeditor5_fe_color_fecolor'])) {
    assert($plugin_definitions['ckeditor5_fe_color_fecolor'] instanceof CKEditor5PluginDefinition);
    $fecolor_plugin_definition = $plugin_definitions['ckeditor5_fe_color_fecolor']->toArray();
    $fecolor_plugin_definition['drupal']['elements'][] = '<span class="' . join(' ', __mymodule_colors_classes()) . '">';
    $plugin_definitions['ckeditor5_fe_color_fecolor'] = new CKEditor5PluginDefinition($fecolor_plugin_definition);
  }
}

function __mymodule_colors(): array {
  return [
    [
      "label" => "Black (color-black)",
      "class" => "color-black",
      "color" => "var(--color-black)",        // #000000
    ],
    [
      "label" => "White (color-white)",
      "class" => "color-white",
      "color" => "var(--color-white)",        // #ffffff
      "options" => [
        "hasBorder" => TRUE
      ],
    ],
    // Add more custom colors here.
  ];
}

function __mymodule_colors_classes(): array {
  return array_column(__mymodule_colors(), 'class');
}
```
And in you `mymodule.info.yml` file provide CSS file(s):

```yml
name: My Module
type: module
description: 'Customization for CKEditor 5 font colors and CSS.'
package: My Theme
core_version_requirement: ^10 || ^11
ckeditor5-stylesheets:
  - css/icons/icons.css                                 # Optional, if you use Material Icons
  - css/ckeditor5.css                                   # Your custom styles for CKEditor 5
  - //fonts.googleapis.com/icon?family=Material+Icons   # Optional, if you use Material Icons
```

And example `css/ckeditor5.css` file:

```css
:root {
  --color-black: #fb9116;
  --color-white: #aaaaaa;
  /* Add more colors here. */
}

/* Example how provide CKEditor 5 content styles */
.ck-content h1 {
  padding-bottom: 16px;
}
```

## USAGE

- When editing content, the CKEditor 5 color picker will display the custom
  frontend color palette.
- Do not forget implement corresponding CSS classes in your theme to apply
  the colors in CKEditor. Recommended way is use to CSS variables for colors.
- Colors are defined in the module and can be extended by site builders.

## TROUBLESHOOTING

- Clear Drupal cache after installation: drush cr
- Ensure CKEditor 5 is properly configured for your text format
- Check browser console for JavaScript errors
