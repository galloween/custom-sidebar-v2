# custom-sidebar-v2

this is a quick refactor of https://github.com/Villhellm/custom-sidebar
to make it work with recent versions of `Home Assistant`

## HACS Installation

## Manual install
- put `custom-sidebar-v2.js` in `<config directory>/www/`
- add in `confgiguration.yaml`:
```
frontend:
  extra_module_url:
    - /local/custom-sidebar-v2.js
```

## Configuration
config is now in `JSON` format (not yaml). <br>
Save it as `sidebar-order.json` and put it in `<config directory>/www/`.

For full example see this: https://raw.githubusercontent.com/galloween/custom-sidebar-v2/main/sidebar-order.json
Also check [original repo docs](https://github.com/Villhellm/custom-sidebar/blob/master/README.md) for explanations.

Short example:
```
  {
  "order": [
    {
      "new_item": true,
      "item": "Google",
      "href": "https://mrdoob.com/projects/chromeexperiments/google-gravity/",
      "icon": "mdi:earth",
      "target": "_blank"
    },
    {
      "item": "overview"
    },
    {
      "item": "supervisor"
    },
    {
      "new_item": true,
      "item": "Integrations",
      "href": "/config/integrations",
      "icon": "mdi:puzzle"
    }
  ]
 }
```

## Notes
- "Exceptions" (from Villhellm's original implementation) are not supported.
- all items in config.order should have unique "item" property.
- items with "hide: true" are not considered in new order,
  all other items will be ordered as listed in config.order
- any items present in Sidebar, but not in config.order, will be shown on top of the list

by @galloween
