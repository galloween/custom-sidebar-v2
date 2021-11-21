# custom-sidebar-v2

This is a refactor of the original [Custom Sidebar plugin](https://github.com/Villhellm/custom-sidebar) by [@Villhellm](https://github.com/Villhellm)  <br>
to make it work with recent versions of `Home Assistant`.

[Villhellm](https://github.com/Villhellm)'s code was refactored with simplicity and performance in mind. <br>
The YAML parser that was part of the original code has been removed and so the config should now be provided as JSON.

## HACS Installation
Go to HACS / FrontEnd, add custom repository, then find it in the list and click Download.
<table><tr><td>
<img src="https://user-images.githubusercontent.com/2077754/141781008-96a47c6c-bba0-4f1e-aff5-b8cefb054edb.png">
</td><td>
<img src="https://user-images.githubusercontent.com/2077754/141780946-7fa632a8-6b3b-462c-83de-b110293d0d23.png">
</td><td>
<img src="https://user-images.githubusercontent.com/2077754/141781150-94b5331f-a5dc-4a6e-855b-7685067e588e.png">
</td></tr></table>

- add in `confgiguration.yaml` (unless you use [browser_mod](https://github.com/thomasloven/hass-browser_mod)):
```
frontend:
  extra_module_url:
    - /hacsfiles/custom-sidebar-v2/custom-sidebar-v2.js
```


## Manual install
<img src="https://user-images.githubusercontent.com/2077754/141674738-5ea08dea-a4aa-41d9-a246-feefde17bb45.png" width="700">

- put `custom-sidebar-v2.js` in `<config directory>/www/`
- add in `confgiguration.yaml`:
```
frontend:
  extra_module_url:
    - /local/custom-sidebar-v2.js
```

## Configuration
config is now in `JSON` format (not yaml). <br>
Save it as `sidebar-order.json` and put it in `<config directory>/www/`. <br>
If using manuall install, you can include the config object directly in the .js file (follow comments there).

For full example see this: https://raw.githubusercontent.com/galloween/custom-sidebar-v2/main/sidebar-order.json <br>
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
- all items in config.order should have unique "item" property.
- items with "hide: true" are not considered in new order,
  all other items will be ordered as listed in config.order
- any items present in Sidebar, but not in config.order, will be shown on top of the list

## Combining with Iframe Panel to show external content inside Home Assitant
If you use [Home Assistant's Iframe Panel feature](https://www.home-assistant.io/integrations/panel_iframe/) and have some iframe_panel links configured in `configuration.yaml`
```
panel_iframe:
  router:
    title: "Router"
    url: "http://192.168.1.1"
    icon: mdi:router-wireless
  fridge:
    title: "Fridge"
    url: "http://192.168.1.5"
    icon: mdi:fridge
```
then you can reorder iframe links, same as regular ones, in `sidebar-order.json`:
```
{ order: [
  { "item": "fridge" },
  { "item": "overview" },
  { "item": "router" }
  ... 
]}
```
<img src="https://user-images.githubusercontent.com/2077754/142756355-21c96b37-130c-4af3-8a81-2de97261d1ff.png">

-----------------------
by @galloween
