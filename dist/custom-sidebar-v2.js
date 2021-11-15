// updated 15-11-21 13:13
// -----------------------
// Custom Sidebar for Home Assistant
//
// quick refactor of
// https://github.com/Villhellm/custom-sidebar
//
// INSTALL:
// manually put this code as custom-sidebar.js in <config directory>/www/
// add in confgiguration.yaml:
//      frontend:
//        extra_module_url:
//          - /local/custom-sidebar.js
//
// CONFIG:
// config is now in JSON format (not yaml) and is included right here
//  (see orderConfig below).
// alternatively, you can put the config object ({...}) in sidebar-order.json
// in <config directory>/www/

// NOTES:
// - "Exceptions" (from Villhellm's original implementation) are not supported.
// - all items in config.order should have unique "item" property.
// - items with "hide: true" are not considered in new order,
//   all other items will be ordered as listed in config.order
// - any items present in Sidebar, but not in config.order, will be shown on top of the list
//
// by @galloween
//
(() => {
  //------------------
  // CONFIG

  const orderConfig = {
    order: [
      {
        new_item: true,
        item: 'Google',
        href: 'https://mrdoob.com/projects/chromeexperiments/google-gravity/',
        icon: 'mdi:earth',
        target: '_blank'
      },
      {
        item: 'overview',
      },
      {
        item: 'supervisor',
      },
      {
        new_item: true,
        item: 'Integrations',
        href: '/config/integrations',
        icon: 'mdi:puzzle',
      },
      {
        new_item: true,
        item: 'Entities',
        href: '/config/entities',
        icon: 'mdi:hexagon-multiple',
      },
      {
        new_item: true,
        item: 'Automations',
        href: '/config/automation/dashboard',
        icon: 'mdi:robot',
      },
      {
        item: 'file editor',
      },
      {
        item: 'terminal',
      },
      {
        item: 'hacs',
      },
      {
        item: 'configuration',
        bottom: true,
      },
      {
        new_item: true,
        item: 'Server Controls',
        href: '/config/server_control',
        icon: 'mdi:server',
        bottom: true,
      },
      {
        item: 'history',
        bottom: true,
      },
      {
        item: 'logbook',
        bottom: true,
      },
      {
        new_item: true,
        item: 'Logs',
        bottom: true,
        href: '/config/logs',
        icon: 'mdi:math-log',
      },
      {
        item: 'developer tools',
        bottom: true,
      },
      {
        item: 'snapshots',
        bottom: true,
      },
      {
        item: 'backups',
        bottom: true,
      },
      {
        item: 'map',
        hide: true,
      },
      {
        item: 'energy',
        hide: true,
      },
      {
        item: 'media browser',
        hide: true,
      },
    ],
  };

  //------------------

  let tryCounter = 0;
  let Loaded = false;
  let SideBarElement = null;
  let DrawerLayoutElement = null;
  let TitleElement = null;
  let SidebarItemElement = null;

  function getDrawerLayout() {
    if (DrawerLayoutElement) {
      return DrawerLayoutElement;
    }
    let root = document.querySelector('home-assistant');
    root = root && root.shadowRoot;
    root = root && root.querySelector('home-assistant-main');
    root = root && root.shadowRoot;
    const drawerLayout = root && root.querySelector('app-drawer-layout');
    return (DrawerLayoutElement = drawerLayout);
  }

  function getSidebar() {
    if (SideBarElement) {
      return SideBarElement;
    }
    const drawerLayout = getDrawerLayout();
    let sidebar =
      drawerLayout && drawerLayout.querySelector('app-drawer ha-sidebar');
    sidebar = sidebar && sidebar.shadowRoot;
    TitleElement = sidebar && sidebar.querySelector('.title');
    sidebar = sidebar && sidebar.querySelector('paper-listbox');
    return (SideBarElement = sidebar);
  }

  function getSidebarItem(root) {
    if (SidebarItemElement) {
      return SidebarItemElement;
    }
    if (!root || !root.children) {
      return null;
    }
    return Array.from(root.children).find((element) => {
      return (
        element.tagName == 'A' && element.getAttribute('data-panel') == 'config'
      );
    });
  }

  function setTitle(title) {
    if (TitleElement) {
      TitleElement.innerHTML = title;
    }
  }

  function rearrange(order) {
    try {
      if (order && SideBarElement) {
        SideBarElement.style.display = 'flex';
        SideBarElement.style.flexDirection = 'column';

        var spacerElement = Array.from(SideBarElement.children).find(
          (element) => {
            return (
              element.tagName == 'DIV' && element.classList.contains('spacer')
            );
          }
        );
        spacerElement.style.order = 100;
        spacerElement.style.flexGrow = 5;

        order.forEach((item, i) => {
          if (item.new_item === true && !item.created) {
            createItem(SideBarElement, item, i);
          }
          if (!item.new_item && !item.moved) {
            moveItem(SideBarElement, item, i);
          }
        });
      }
    } catch (e) {
      console.warn('Custom sidebar: Error rearranging order', e);
    }
  }

  function updateIcon(element, icon) {
    try {
      var icon_item = element.querySelector('paper-icon-item');
      var icn = icon_item.querySelector('ha-icon');
      var svgIcn = icon_item.querySelector('ha-svg-icon');

      if (icon_item && !icn) {
        if (svgIcn) {
          icon_item.removeChild(svgIcn);
        }
        icn = document.createElement('ha-icon');
        icn.setAttribute('slot', 'item-icon');
        icn.setAttribute('data-custom-sidebar-processed', 'create');
        icon_item.prepend(icn);
      }
      icn.setAttribute('icon', icon);
    } catch (e) {
      console.warn('Custom sidebar: Error updating icon', e);
    }
  }

  function findNameElement(element) {
    var txtEl = element.querySelector('paper-icon-item');
    txtEl = (txtEl && txtEl.querySelector('.item-text')) || {};
    return txtEl;
  }

  function updateName(element, name) {
    try {
      findNameElement(element).innerHTML = name;
    } catch (e) {
      console.warn('Custom sidebar: Error updating text', e);
    }
  }

  function createItem(elements, config_entry, index) {
    try {
      var cln = getSidebarItem(elements).cloneNode(true);
      if (cln) {
        //
        updateIcon(cln, config_entry.icon);
        updateName(cln, config_entry.item);

        cln.href = config_entry.href;
        cln.target = config_entry.target||'';

        cln.setAttribute(
          'data-panel',
          config_entry.item.toLowerCase().replace(/\s/, '_')
        );
        cln.setAttribute('data-custom-sidebar-processed', 'create');
        cln.setAttribute('aria-selected', 'false');
        cln.className = '';
        cln.style.order = config_entry.bottom ? index + 100 : index + 1;

        elements.insertBefore(cln, elements.children[0]);

        config_entry.created = true;
      }
    } catch (e) {
      console.warn('Custom sidebar: Error creating item', e);
    }
  }

  function findItem(elements, config_entry) {
    const item = Array.from(elements.children).find((element) => {
      if (element.tagName !== 'A') {
        return false;
      }
      const currentName = findNameElement(element)
        .innerHTML.replace(/<\!--.+-->/g, '')
        .trim();
      return config_entry.exact
        ? currentName == config_entry.item
        : currentName.toLowerCase().includes(config_entry.item.toLowerCase());
    });
    return item;
  }

  function moveItem(root, config_entry, index) {
    if (!root || !config_entry) {
      return;
    }
    try {
      const elementToMove = findItem(root, config_entry);

      if (elementToMove) {
        if (config_entry.href) {
          elementToMove.href = config_entry.href;
        }
        if (config_entry.target) {
          elementToMove.target = config_entry.target;
        }
        if (config_entry.name) {
          updateName(elementToMove, config_entry.name);
        }
        if (config_entry.icon) {
          updateIcon(elementToMove, config_entry.icon);
        }
        if (config_entry.hide == true) {
          elementToMove.style.display = 'none';
          elementToMove.setAttribute('data-custom-sidebar-processed', 'hide');
          //
        } else {
          elementToMove.style.display = 'block';
          elementToMove.style.order = config_entry.bottom
            ? index + 100
            : index + 1;
          elementToMove.setAttribute('data-custom-sidebar-processed', 'move');
        }
        elementToMove.setAttribute('aria-selected', 'false');
        cln.className = '';
        config_entry.moved = true;
      } else {
        console.warn('Custom sidebar: element to move not found', config_entry);
      }
    } catch (e) {
      console.warn('Custom sidebar: Error moving item', e);
    }
  }

  function process(config) {
    if (!config || !config.order) {
      finish(false, 'No config found');
      return;
    }
    if (config.title) {
      setTitle(config.title);
    }
    rearrange(config.order);
    finish(true);
  }

  function finish(success, error) {
    clearInterval(runInterval);
    !success && console.warn('Custom Sidebar failed.', error);
    success && console.log('Custom Sidebar loaded successfully.');
  }

  function run() {
    DrawerLayoutElement = getDrawerLayout();
    SideBarElement = getSidebar();
    SidebarItemElement = SideBarElement && getSidebarItem(SideBarElement);

    if (SideBarElement && SidebarItemElement && !Loaded) {
      Loaded = true;

      if (orderConfig) {
        process(orderConfig);
      } else {
        fetch('/local/sidebar-order.json').then(
          (resp) => {
            resp.json().then(
              (config) => {
                process((orderConfig = config));
              },
              (err) => {
                finish(false, err);
              }
            );
          },
          (err) => {
            finish(false, err);
          }
        );
      }
    } else if (++tryCounter > 10) {
      finish(false, 'Tried 10 times and gave up');
    }
  }

  var runInterval = setInterval(run, 1000);
})();
