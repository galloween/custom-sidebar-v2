// updated 15-11-21 15:51
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
// config is now in JSON format (not yaml) and can be included right here
//  (see window.$customSidebarV2_orderConfig below).
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

  // window.$customSidebarV2_orderConfig = { order: [...] };

  //------------------

  !window.$customSidebarV2_tryCounter &&
    (window.$customSidebarV2_tryCounter = 0);
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

        const spacerElement = Array.from(SideBarElement.children).find(
          (element) => {
            return (
              element.tagName == 'DIV' && element.classList.contains('spacer')
            );
          }
        );
        spacerElement.style.order = 100;
        spacerElement.style.flexGrow = 5;

        order.forEach((item, i) => {
          const shouldCreate = item.new_item && !item.created;
          const shouldMove = !item.new_item && !item.moved;

          if (shouldCreate || shouldMove) {
            const existingItem = findItem(SideBarElement, item);
            if (existingItem) {
              item.itemElement = existingItem;
              shouldCreate && (item.created = true);
              moveItem(SideBarElement, item, i);
            } else {
              shouldMove && (item.moved = true);
              item.href && createItem(SideBarElement, item, i);
            }
          }
        });
      }
    } catch (e) {
      console.warn('Custom sidebar: Error rearranging order', e);
    }
  }

  function updateIcon(element, icon) {
    try {
      const icon_item = element.querySelector('paper-icon-item');
      let icn = icon_item.querySelector('ha-icon');
      const svgIcn = icon_item.querySelector('ha-svg-icon');

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
    let txtEl = element.querySelector('paper-icon-item');
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
      const cln =
        config_entry.itemElement || getSidebarItem(elements).cloneNode(true);
      if (cln) {
        //
        updateIcon(cln, config_entry.icon);
        updateName(cln, config_entry.item);

        cln.href = config_entry.href;
        cln.target = config_entry.target || '';

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
        config_entry.itemElement = cln;
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
      const elementToMove =
        config_entry.itemElement || findItem(root, config_entry);

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
        elementToMove.className = '';

        config_entry.moved = true;
        config_entry.itemElement = elementToMove;
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

    if (
      SideBarElement &&
      SidebarItemElement &&
      !window.$customSidebarV2_Loaded
    ) {
      window.$customSidebarV2_Loaded = true;

      if (window.$customSidebarV2_orderConfig) {
        process(window.$customSidebarV2_orderConfig);
      } else {
        fetch('/local/sidebar-order.json').then(
          (resp) => {
            resp.json().then(
              (config) => {
                process((window.$customSidebarV2_orderConfig = config));
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
    } else if (++window.$customSidebarV2_tryCounter > 10) {
      finish(false, 'Tried 10 times and gave up');
    }
  }

  const runInterval = setInterval(run, 1000);
})();
