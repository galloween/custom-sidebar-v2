**Note**: some useful insights for troubleshooting in [this thread](https://github.com/Villhellm/custom-sidebar/issues/40#issuecomment-968252152). Also see [these notes](https://github.com/galloween/custom-sidebar-v2#notes).

# Home Assistant Custom Sidebar v2
Custom [HACS](https://hacs.xyz) `Lovelace Plugin` that allows you to rearrange, hide, and add [Home Assistant](https://www.home-assistant.io) sidebar menu items.

This is a refactor of the original [Custom Sidebar plugin](https://github.com/Villhellm/custom-sidebar) by [@Villhellm](https://github.com/Villhellm) <br>
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
      "target": "_blank",
      "order": 4
    },
    {
      "item": "overview",
      "order": 2
    },
    {
      "item": "supervisor",
      "order": 1
    },
    {
      "new_item": true,
      "item": "Integrations",
      "href": "/config/integrations",
      "icon": "mdi:puzzle",
      "order": 3
    },
    {
      "item": "automations",
      "bottom": true
    },
    {
      "item": "settings",
      "bottom": true
    }
  ]
 }
```

## Notes
- all items in config.order should have unique "item" property
- check out [this post](https://github.com/Villhellm/custom-sidebar/issues/40#issuecomment-982064937) on how to find the name of the menu item
- items with "hide: true" are not considered in new order,
- all other items will be ordered according to their (optional) "order" property **OR** in the order of appearance in config.order
- if using "order" property, make sure either all items (except hidden) have this property, or none of them (otherwise order may be messed up).
- any items present in Sidebar, but not in config.order, will be shown on the **bottom** of the top part of the list
- when using **Exceptions**, pay attention to "base_order" property - if it's set to "false", the main config.order will be ignored, leaving you with default sidebar (which now should be modified with the exception's order)
- if you seem to be **stuck with old config**, try clearing site data - [instruction here](https://github.com/Villhellm/custom-sidebar/issues/40#issuecomment-982944888)

## Exceptions
You can define user-specific order using `exceptions` feature (see [details in original repo](https://github.com/Villhellm/custom-sidebar#exceptions))
```
{
  "exceptions": [
    {
      "user": ["Jim Hawkins", "Long John Silver"],
      "order": [
          ...
      ]
    }
  ]
}
```

## Home Assistant built-in sidebar configuration options
Check out Home Assistant's "native" sidebar tools - quite possibly, it will be enough for your needs.
- You can use HA's `panel_custom` integration to add internal links to the sidebar. Take a look at [this tutorial](https://home-assistant-guide.com/2021/12/08/how-to-add-internal-links-to-the-home-assistant-sidebar/). Official [docs](https://www.home-assistant.io/integrations/panel_custom/).
- You can use HA's `panel_iframe` integration to add external links. [See below](https://github.com/galloween/custom-sidebar-v2#combining-with-iframe-panel-to-show-external-content-inside-home-assitant). Official [docs](https://www.home-assistant.io/integrations/panel_iframe/).
- You can click and hold the Home Assistant header on top of the sidebar and then it will allow you to add/remove and re-order some of the items (but not add new custom ones):
<table><tr><td>
<img src="https://user-images.githubusercontent.com/2077754/144053778-af097557-2bf6-4c74-b934-da7a78160458.png">
</td><td>
<img src="https://user-images.githubusercontent.com/2077754/144053817-627d00c5-44c5-4ede-9578-c4a9a2ba0ac4.png">
</td></tr></table>
This feature is also accessible from your profile settings (if you click on your name in the bottom left corner):
<img src="https://user-images.githubusercontent.com/2077754/144054143-bd025124-211b-4f64-be09-e2e99d4f6ee2.png">


## Combine with Iframe Panel to show external content inside Home Assitant
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
by [@galloween](https://github.com/galloween)
