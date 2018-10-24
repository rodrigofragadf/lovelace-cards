# Tiles Custom Card for [Home Assistant](https://home-assistant.io)

## Installation
1. Download the [tiles-card.js](https://github.com/rodrigofragadf/lovelace-cards/raw/master/tiles-card/tiles-card.js).
2. Save the file in the `config / www` directory or in a subdirectory within it.
3. Add the path file to `resources:` in the `ui-lovelace.yaml` file:

```yaml
resources:
  - url: /local/tiles-card.js?v=0.1
    type: js
```

## Setup
The card supports two configuration modes, legacy mode and default mode. In legacy mode you can use your tiles settings from `customize:` to use in lovelace tiles card. To do this, simply copy the contents of `config:` to your new config in `ui-lovelace.yaml` by changing the` config: `attribute to` legacy_config: `. See the example:

```yaml
homeassistant:
  customize:
    input_boolean.test_tiles:
      custom_ui_state_card: state-card-tiles
      config:
        color: green
        color_on: yellow
        color_off: red
        columns: 4
        column_width: 70px
        row_height: 35px
        gap: 5px
        entities:
          - entity: light.light_1
            label: Text
            column: 1
            column_span: 4
            row: 1
            row_span: 2
            icon: mdi:light
 ```

The only difference is the `title:` attribute that was created to add a title to your card, see the configuration in the `ui-lovelace.yaml` file:

 ```yaml
views:
  - title: Title View
    cards:
      - type: custom:tiles-card
        legacy_config:
          color: green
          color_on: yellow
          color_off: red
          columns: 4
          column_width: 70px
          row_height: 35px
          gap: 5px
          entities:
            - entity: light.light_1
              label: Text
              column: 1
              column_span: 4
              row: 1
              row_span: 2
              icon: mdi:light
 ```

This should work the same way as the previous tiles version. The new version will bring more functions and customizations,  how to use instructions will be released soon.