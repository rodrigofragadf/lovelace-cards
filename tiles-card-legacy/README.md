# Tiles Card Legacy Version for [Lovelace](https://www.home-assistant.io/lovelace/)

## Installation
1. Download the [tiles-card-legacy.js](https://github.com/rodrigofragadf/lovelace-cards/raw/master/tiles-card-legacy/tiles-card-legacy.js).
2. Save the file in the `config/www` directory or in a subdirectory within it.
3. Add the path file to `resources:` in the `ui-lovelace.yaml` file:

```yaml
resources:
  - url: /local/tiles-card-legacy.js?v=0.1
    type: js
```
## Setup
To use the card simply copy your old config tiles from `customize:` to your new config in `ui-lovelace.yaml`. See the example:

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

The only difference is the `title:` attribute that was created to add a title to your card. See the example in the `ui-lovelace.yaml` file:

 ```yaml
views:
  - title: Title View
    cards:
      - type: custom:tiles-card-legacy
        config:
          title: Title Card
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

This should work the same way as the previous tiles version.