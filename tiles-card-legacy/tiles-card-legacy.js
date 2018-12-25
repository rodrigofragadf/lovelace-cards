class TilesCardLegacy extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._DOMAIN_SCRIPT = ["script", "python_script"];
    this._DOMAIN_SENSOR = ["sensor", "binary_sensor", "device_tracker"];
    this._DOMAIN_NO_ONOFF = this._DOMAIN_SCRIPT.concat("sensor", "scene", "weblink");
    this._ON_STATES = ["on", "open", "locked", "home"];
  }

  setConfig(config) {

    if(!config.config.entities) {
        throw new Error('Please define your entities');
    }

    const root = this.shadowRoot;
    if(root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);

    const card = document.createElement('ha-card');
    card.header = cardConfig.config.title;

    var cardStyle = document.createElement('style');
    cardStyle.id = "cardStyle";
    cardStyle.textContent += this._getCardStyle();
    root.appendChild(cardStyle);

    var entitiesStyleValues = document.createElement('style');
    entitiesStyleValues.id = "entitiesStyleValues";
    entitiesStyleValues.textContent = this._getGlobalStyles(cardConfig.config);
    card.appendChild(entitiesStyleValues);

    var content = this._createContentCard(cardConfig.config, entitiesStyleValues);

    card.appendChild(content);
    root.appendChild(card);
    this._config = cardConfig.config;
  }

  set hass(hass) {
    this.myHass = hass;
    var card = this.shadowRoot.lastChild;
    var entitiesTiles = this._config.entities;

    this._updateContentCard(entitiesTiles, card);
 }

  _createContentCard(config) {
    var entitiesTiles = config.entities;
    const content = document.createElement('div');
    content.className = "grid";
    content.id = "div-tiles";

    entitiesTiles.forEach((entity, index) => {

      var paperComponent;
      entity.id = "component_"+index;

      paperComponent = this._createPaperButtonLegacy(entity);
      paperComponent.setAttribute("style", this._getStylesEntity(entity));

      paperComponent.id = entity.id;
      content.appendChild(paperComponent);
    });

    return content;
  }

  _updateContentCard(entitiesTiles, card) {
    var content = card.children.namedItem("div-tiles");

    entitiesTiles.forEach((entity, index) => {

      var paperComponent = content.children["component_"+index]
      paperComponent.style.textContent += this._computeStyleTemplate(entity);
      paperComponent.className = this._getClassPaperButton(entity);

      if(this._hasIcon(entity)) {
        var ironIcon = paperComponent.getElementsByTagName('iron-icon').item(0);
        var icon = this._getIconValue(entity);
        ironIcon.setAttribute("icon", icon);
      }
      
      var label = this._computeLabel(entity);
      var labelSec = this._hasLabelSec(entity) ? this._computeLabelSec(entity) : "";

      if(label) paperComponent.getElementsByTagName('icon-label')[0].innerHTML = (ironIcon ? ironIcon.outerHTML : "")+label;
      if(labelSec) paperComponent.getElementsByClassName('secondary')[0].innerHTML = labelSec;

    });
  }

  _createPaperButtonLegacy(entity) {
    var paperButton = document.createElement('paper-button');
    var divIconLabel = document.createElement('icon-label');
    divIconLabel.style.width = "100%";
    paperButton.appendChild(divIconLabel);
    paperButton.raised = true;
    paperButton.animate = true;
    paperButton.tabIndex = 0;

    if(this._hasIcon(entity)){
      var ironIcon = document.createElement('iron-icon');
      divIconLabel.appendChild(ironIcon);
    }

    if(this._hasLabelSec(entity)){
      var div = document.createElement('div');
      div.className = "secondary";
      div.style.width = "100%";
      paperButton.appendChild(div);
    }

    paperButton.addEventListener('click', event => { this._onClick(entity) });

    return paperButton;
  }

  _getGlobalStyles(config) {
    let style = 'ha-card{';
    if (config.columns != null) style += ` --tiles-columns: ${config.columns};`;
    if (config.column_width != null) style += ` --tiles-column-width: ${config.column_width};`;
    if (config.row_height != null) style += ` --tiles-row-height: ${config.row_height};`;
    if (config.gap != null) style += ` --tiles-gap: ${config.gap};`;
    if (config.color != null) style += ` --tiles-color: ${config.color};`;
    if (config.color_on != null) style += ` --tiles-color-on: ${config.color_on};`;
    if (config.color_off != null) style += ` --tiles-color-off: ${config.color_off};`;
    if (config.text_color != null) style += ` --tiles-text-color: ${config.text_color};`;
    if (config.text_color_on != null) style += ` --tiles-text-color-on: ${config.text_color_on};`;
    if (config.text_color_off != null) style += ` --tiles-text-color-off: ${config.text_color_off};`;
    if (config.text_size != null) style += ` --tiles-text-size: ${config.text_size};`;
    if (config.text_uppercase != null) style += ` --tiles-text-transform: ${config.text_uppercase ? 'uppercase' : 'none'};`;
    if (config.text_sec_color != null) style += ` --tiles-text-sec-color: ${config.text_sec_color};`;
    if (config.text_sec_color_on != null) style += ` --tiles-text-sec-color-on: ${config.text_sec_color_on};`;
    if (config.text_sec_color_off != null) style += ` --tiles-text-sec-color-off: ${config.text_sec_color_off};`;
    if (config.text_sec_size != null) style += ` --tiles-text-sec-size: ${config.text_sec_size};`;
    if (config.text_align != null) style += ` --tiles-text-align: ${config.text_align};`;
    if (config.icon_size != null) style += ` --tiles-icon-size: ${config.icon_size};`;
    style += "}";

    return style;
  }

  _getStylesEntity (entity) {
    const c = entity.column ? entity.column : 'auto';
    const cs = entity.column_span ? entity.column_span : 1;
    const r = entity.row ? entity.row : 'auto';
    const rs = entity.row_span ? entity.row_span : 1;
    let style = '';
    if (entity.color != null) style += ` --tiles-color: ${entity.color};`;
    if (entity.color_on != null) style += ` --tiles-color-on: ${entity.color_on};`;
    if (entity.color_off != null) style += ` --tiles-color-off: ${entity.color_off};`;
    if (entity.text_color != null) style += ` --tiles-text-color: ${entity.text_color};`;
    if (entity.text_color_on != null) style += ` --tiles-text-color-on: ${entity.text_color_on};`;
    if (entity.text_color_off != null) style += ` --tiles-text-color-off: ${entity.text_color_off};`;
    if (entity.text_size != null) style += ` --tiles-text-size: ${entity.text_size};`;
    if (entity.text_uppercase != null) style += ` --tiles-text-transform: ${entity.text_uppercase ? 'uppercase' : 'none'};`;
    if (entity.text_sec_color != null) style += ` --tiles-text-sec-color: ${entity.text_sec_color};`;
    if (entity.text_sec_color_on != null) style += ` --tiles-text-sec-color-on: ${entity.text_sec_color_on};`;
    if (entity.text_sec_color_off != null) style += ` --tiles-text-sec-color-off: ${entity.text_sec_color_off};`;
    if (entity.text_sec_size != null) style += ` --tiles-text-sec-size: ${entity.text_sec_size};`;
    if (entity.text_align != null) style += ` --tiles-text-align: ${entity.text_align};`;
    if (entity.icon_size != null) style += ` --tiles-icon-size: ${entity.icon_size};`;
    if (entity.image != null) style += ` background-image: url("${entity.image}");`;
    return `grid-column: ${c} / span ${cs}; grid-row: ${r} / span ${rs}; ${style}`;
  }

  _hasIcon(entity) {
    return entity.icon || entity.icon_template;
  }

  _computeLabel(entity) {
    if (entity.label) {
      return entity.label;
    } else if (entity.label_template) {
      return this._computeFromTemplate(entity, 'label_template');
    } else if (entity.label_state || this._DOMAIN_SENSOR.includes(entity.entity.split('.')[0])) {
      const stateObj = this.myHass.states[entity.label_state];
      if (stateObj) {
        return stateObj.attributes && stateObj.attributes.unit_of_measurement ? `${stateObj.state} ${stateObj.attributes.unit_of_measurement}` : stateObj.state;
      }
    }
    return '';
  }

  _hasLabel(entity) {
    return entity.label || entity.label_state || entity.label_template;
  }

  _hasLabelSec(entity) {
    return entity.label_sec || entity.label_sec_state || entity.label_sec_template;
  }

  _computeLabelSec(entity) {
    return this._computeLabel({
      label_template: entity.label_sec_template,
      label_state: entity.label_sec_state,
      label: entity.label_sec,
      entity: entity.entity });
  }

  _getIconValue(entity) {
    var iconValue = entity.oldIcon;
    if(entity.icon) iconValue = entity.icon;
    if(entity.icon_template) iconValue = this._computeFromTemplate(entity, "icon_template");

    return iconValue;
  }
  
  _getClassPaperButton(entity) {
    var entityId = entity.entity;
    if(!entityId || this._DOMAIN_NO_ONOFF.includes(entityId.split('.')[0])) {
      return '';
    } else {
      return this.myHass.states[entityId] && this._ON_STATES.includes(this.myHass.states[entityId].state) ? 'on' : 'off';
    }
  }

  _computeStyleTemplate(entity) {
    return entity.style_template ? this._computeFromTemplate(entity, 'style_template') : '';
  }

  _computeFromTemplate(entity, template) {
    const state = this.myHass.states[entity.entity] && this.myHass.states[entity.entity].state || null;
    const attributes = this.myHass.states[entity.entity] && this.myHass.states[entity.entity].attributes || null;
    const entities = this.myHass.states;
    return Function('state', 'attributes', 'entities', entity[template])(state, attributes, entities);
  }

  _onClick(entity) {
    const entity_id = entity.entity;
    const stateDomain = entity_id ? entity_id.split('.')[0] : "";
    if(stateDomain === 'weblink') {
      window.open(this.myHass.states[entity_id].state, '_blank');
    } else if(this._DOMAIN_SENSOR.includes(stateDomain) || entity.more_info) {
      this._fire('hass-more-info', { entityId: entity.more_info || entity_id });
    } else {
      let serviceDomain, service;
      const data = entity.data || { entity_id: entity_id };
      if(entity.service) {
        serviceDomain = entity.service.split('.')[0];
        service = entity.service.split('.')[1];
      } else if(this._DOMAIN_SCRIPT.includes(stateDomain)) {
        serviceDomain = stateDomain;
        service = entity_id.split('.')[1];
      } else {
        const isOn = this._ON_STATES.includes(this.myHass.states[entity_id].state);
        switch (stateDomain) {
          case 'lock':
            serviceDomain = 'lock';
            service = isOn ? 'unlock' : 'lock';
            break;
          case 'cover':
            serviceDomain = 'cover';
            service = isOn ? 'close' : 'open';
            break;
          case 'scene':
            serviceDomain = 'scene';
            service = 'turn_on';
            break;
          default:
            serviceDomain = 'homeassistant';
            service = isOn ? 'turn_off' : 'turn_on';
        }
      }
      this.myHass.callService(serviceDomain, service, data);
    }
  }

  _fire(type, detail, options) {
    options = options || {};
    detail = (detail === null || detail === undefined) ? {} : detail;
    const event = new Event(type, {
      bubbles: options.bubbles === undefined ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === undefined ? true : options.composed
    });
    event.detail = detail;
    const node = options.node || this;
    node.dispatchEvent(event);
    return event;
  }

  getCardSize() {
    var size = (this._config.entities.length / this._config.columns);
    if(this._config.title) size++;
    return size;
  }

  _getCardStyle() {
    return `
    .grid {
        display: grid;
        grid-template-columns: repeat(var(--tiles-columns, 3), var(--tiles-column-width, 1fr));
        grid-auto-rows: var(--tiles-row-height, 100px);
        grid-gap: var(--tiles-gap, 4px);
    }
    
    paper-button {
        box-shadow: none !important;
        margin: 0 !important;
        min-width: 30px;
        min-height: 30px;
        background-color: var(--tiles-color, var(--primary-color));
        color: var(--tiles-text-color, #FFF);
        font-size: var(--tiles-text-size, 1em);
        text-transform: var(--tiles-text-transform, uppercase);
        background-repeat: no-repeat;
        background-position: 50% 50%;
        flex-direction: column;
        text-align: var(--tiles-text-align, center);
    }
    
    paper-button.on {
        background-color: var(--tiles-color-on, var(--google-green-500));
        color: var(--tiles-text-color-on, var(--tiles-text-color, #FFF));
    }
    
    paper-button.off {
        background-color: var(--tiles-color-off, var(--google-red-500));
        color: var(--tiles-text-color-off, var(--tiles-text-color, #FFF));
    }
    
    paper-button div.secondary {
        color: var(--tiles-text-sec-color, var(--tiles-text-color, #FFF));
        font-size: var(--tiles-text-sec-size, 1em);
    }
    
    paper-button.on div.secondary {
        color: var(--tiles-text-sec-color-on, var(--tiles-text-sec-color, var(--tiles-text-color-on, var(--tiles-text-color, #FFF))));
    }
    
    paper-button.off div.secondary {
        color: var(--tiles-text-sec-color-off, var(--tiles-text-sec-color, var(--tiles-text-color-off, var(--tiles-text-color, #FFF))));
    }
    
    paper-button iron-icon {
        --iron-icon-height: var(--tiles-icon-size, 24px);
        --iron-icon-width: var(--tiles-icon-size, 24px);
    }
  `;
  }

}
  
customElements.define('tiles-card-legacy', TilesCardLegacy);