# CKEditor5 FE Color Plugin

A CKEditor 5 plugin for Drupal that provides customizable frontend color palettes, enabling content editors to use consistent brand colors across your site.

Inspired by [ucb_ckeditor_plugins](https://github.com/CuBoulder/ucb_ckeditor_plugins/tree/main).  
Thank you to the original authors!

---

## 🚀 Introduction

**CKEditor5 FE Color** extends Drupal’s CKEditor 5 integration with predefined, configurable color palettes.  
Content editors can easily apply branded colors, ensuring visual consistency for your organization.

---

## 📦 Requirements

- **CKEditor 5 (Core module)** must be enabled.

---

## ⚙️ Configuration

### 1. Enable the Plugin

- Install and enable this module.
- Ensure CKEditor 5 is set up for your desired text format.
- In Drupal’s text format configuration, drag the **FeColor** button into your CKEditor 5 toolbar.

### 2. Color Palette Configuration

- **Currently, all color settings are code-based** (no UI yet).
- Default palettes are set in `ckeditor5_fe_color.ckeditor5.yml` under the key  
  `ckeditor5_fe_color_fecolor.ckeditor5.config.fecolor.colors`.

<details>
<summary>Example YAML Color Configuration</summary>

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
</details>

---

### 3. Customizing Colors

**Best practice:**  
Override or extend palettes in a custom module, not in this module directly.

#### Hooks for Customization

Add your colors via Drupal hooks in your custom module:

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

#### Add Custom CSS

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

Example `css/ckeditor5.css` file:

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

---

## ✨ Usage

- When editing content, the CKEditor 5 color picker displays your custom palette.
- Ensure your theme provides corresponding CSS classes for colors.
- Use CSS variables (`--color-*`) for easy color management.

---

## 🛠️ Troubleshooting

- **Clear cache:** Run `drush cr` after installation or configuration changes.
- **Check text format:** Make sure CKEditor 5 is enabled for your text format.
- **Debug:** Inspect browser console for JS errors.

---

## 🛠️ Development

Requirements for JavaScript plugin development:

- NodeJS
- yarn

1. Install dependencies: `yarn install`
2. Development: `yarn watch` or `yarn w fecolor`
3. Build: `yarn build` or `yarn b fecolor`

---

## 📝 Notes

- UI configuration for colors is not available yet—contributions welcome!
- Site builders can extend color palettes and styles via custom modules.

---

## 📚 Resources

- [CKEditor 5 Documentation](https://ckeditor.com/docs/ckeditor5/latest/)
- [Drupal CKEditor 5 Guide](https://www.drupal.org/docs/core-modules-and-themes/core-modules/ckeditor5-module)
- [ucb_ckeditor_plugins inspiration](https://github.com/CuBoulder/ucb_ckeditor_plugins/tree/main)

---

**Enjoy consistent, branded editing with CKEditor5 FE Color!**
