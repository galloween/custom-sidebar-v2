Before                     |           After           
:-------------------------:|:-------------------------:
<img src="https://raw.githubusercontent.com/Villhellm/README_images/master/sidebar-before-example.png" alt="alt text" width="60" height="800">  | <img src="https://raw.githubusercontent.com/Villhellm/README_images/master/sidebar-example.png" alt="alt text" width="60" height="800"> <td valign="top"> <h1 align="center">Custom Sidebar</h1> <p align="left"> Custom `Lovelace Plugin` that allows you to rearrange, hide, and add [Home Assistant](https://www.home-assistant.io) sidebar menu items.<br> <br>  TOC: <br> - [Installation](#installation) <br>  - [Configuration](#configuration) <br> — [Notes](#notes) <br> — [Exceptions](#exceptions) <br> — [Home Assistant built-in sidebar configuration options](#home-assistant-built-in-sidebar-configuration-options) <br> — [Combine with Iframe Panel to show external content inside Home Assitant](#combine-with-iframe-panel-to-show-external-content-inside-home-assitant) <br> - [Credits](#credits) <br>



# Installation

<details><summary><h3>HACS Installation</h3></summary>
<p>

Go to HACS / FrontEnd, add custom repository, then find it in the list and click Download. <br>
Custom Repo: https://github.com/xZetsubou/ha-custom-sidebar
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
    - /hacsfiles/ha-custom-sidebar/ha-custom-sidebar.js
```

</p>
</details> 



<details><summary><h3>Manual install</h3></summary>
<p>
  
<img src="https://user-images.githubusercontent.com/2077754/141674738-5ea08dea-a4aa-41d9-a246-feefde17bb45.png" width="700">

- put `custom-sidebar-v2.js` in `<config directory>/www/`
- add in `confgiguration.yaml`:
```
frontend:
  extra_module_url:
    - /local/custom-sidebar-v2.js
```

</p>
</details> 



<br>

# Configuration
Config File is now in `JSON` format (not yaml). You can convert yaml config into json [here](https://jsonformatter.org/yaml-to-json)<br>
Save it as `sidebar-order.json` and put it in `<config directory>/www/`. <br>
> Recomanded use the [example config](https://github.com/xZetsubou/custom-sidebar-v2/blob/main/sidebar-order.json) and edit it however you want
### Order

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| order | list([item](#item-options)) | **Required** | List of items you would like to rearrange.

### Item options
| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| item | string | **Required** | This is a string that will be checked for in the display name of the sidebar item. It can be a substring such as `developer` instead of `Developer Tools`. It is not case sensitive.
| name | string | **Optional** | Change the name of the existing item to this string.
| order | number | **Optional** | Set order number for the item no need to rearrange config.
| bottom | boolean | **Optional** | Setting this option to `true` will group the item with the bottom items (Configuration, Developer Tools, etc) instead of at the top.
| hide | boolean | **Optional** | Hide item in sidebar.
| exact | boolean | **Optional** | Specify whether the item string match will be exact match instead of substring.
| href | string | **Optional** | Define the href for the sidebar link.
| icon | string | **Optional** | Set the icon of the sidebar item.
| new_item | boolean | **Optional** | Set to true to create a new link in the sidebar. Using this option now makes `item`, `href`, and `icon` required.

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
      "order: 3
    }
  ]
 }
```

## Notes

<details><summary>Show Notes.</summary>
<p>

- all items in config.order should have unique "item" property <br>
- check out [this post](https://github.com/Villhellm/custom-sidebar/issues/40#issuecomment-982064937) on how to find the name of the menu item <br>
- items with "hide: true" are not considered in new order, <br>
- all other items will be ordered according to their (optional) "order" property **OR** in the order of appearance in config.order <br>
- if using "order" property, make sure either all items (except hidden) have this property, or none of them (otherwise order may be messed up). <br>
- any items present in Sidebar, but not in config.order, will be shown on the **bottom** of the top part of the list <br>
- when using **Exceptions**, pay attention to "base_order" property - if it's set to "false", the main config.order will be ignored, leaving you with default sidebar (which now should be modified with the exception's order) <br>
- if you seem to be **stuck with old config**, try clearing site data - [instruction here](https://github.com/Villhellm/custom-sidebar/issues/40#issuecomment-982944888) <br>

</p>
</details>

## Exceptions
You can define user-specific order using `exceptions` feature (see [details in original repo](https://github.com/Villhellm/custom-sidebar#exceptions))
Exceptions can be used if you would like to define an order for a specific user/device.

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| base_order | bool | **Optional** | If true this will run rearrangement for your base order configuration before running this exception. Default is false.
| user | string, list | **Optional** | Home Assistant user name you would like to display this order for.
| device | string, list | **Optional** | Type of device you would like to display this order for. ex: ipad, iphone, macintosh, windows, android
| not_user | string, list | **Optional** | Every Home Assistant user name *except* this user name.
| not_device | string, list | **Optional** | Every device *except* this device. ex: ipad, iphone, macintosh, windows, android
| order | [order](#order) | **Required** | Define and order. 
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
## Credits
[Villhellm](https://github.com/Villhellm/custom-sidebar) | Original creator of custom-sidebar <br>
[galloween](https://github.com/galloween) | maintaining the plugin `custom-sidebar-v2` <br>
