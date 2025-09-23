<?php

declare(strict_types=1);

namespace Drupal\ckeditor5_fe_color\Plugin\CKEditor5Plugin;

use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\editor\EditorInterface;

/**
 * Defines a simple CKEditor 5 plugin with no UI.
 */
class FeColor extends CKEditor5PluginDefault {

  /**
   * {@inheritdoc}
   */
  public function getDynamicPluginConfig(array $static_plugin_config, EditorInterface $editor): array {

    /**
     * Defines the available color options for the CKEditor 5 FeColor plugin.
     *
     * Each color option includes:
     * - label: Human-readable name and identifier.
     * - class: CSS class to apply.
     * - color: CSS color for the color value (you can use any allowed format).
     * - options (optional): Additional settings, e.g., hasBorder.
     *
     * Example:
     * @code
     * $static_plugin_config['fecolor']['colors'] = [
     *   [
     *     "label" => "Orange (fe-orange)",
     *     "class" => "fe-orange",
     *     "color" => "var(--color-fe-orange)", // #FB9116
     *   ],
     *   [
     *     "label" => "White (fe-white)",
     *     "class" => "fe-white",
     *     "color" => "var(--color-fe-white)", // #ffffff
     *     "options" => [
     *       "hasBorder" => TRUE
     *     ],
     *   ],
     *   // ... more color definitions ...
     * ];
     * @endcode
     *
     */

    // @ToDo: Now are colors defined in fe_theme.module in function
    //        fe_theme_editor_js_settings_alter(), per profile theme.
    //        Static config come from file ckeditor5_fe_color.plugin.yml.

    return $static_plugin_config;
  }

}
