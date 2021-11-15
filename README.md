# custom-sidebar-v2

this is a quick refactor of https://github.com/Villhellm/custom-sidebar
to make it work with recent versions of Home Assistant

for config please refer to original repo

## Manual install
- put custom-sidebar-v2.js in <config directory>/www/
- add in confgiguration.yaml:
```
frontend:
  extra_module_url:
    - /local/custom-sidebar-v2.js
```

## Configuration
config is now in JSON format (not yaml).
You need to put sidebar-order.json in <config directory>/www/

## Notes
- "Exceptions" (from Villhellm's original implementation) are not supported.
- all items in config.order should have unique "item" property.
- items with "hide: true" are not considered in new order,
  all other items will be ordered as listed in config.order
- any items present in Sidebar, but not in config.order, will be shown on top of the list

by @galloween
