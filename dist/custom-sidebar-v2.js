/**
 * updated 30-12-17 23:59
 * ----------------------------------
 * Custom Sidebar for Home Assistant
 * ----------------------------------
 * README: https://github.com/galloween/custom-sidebar-v2/blob/main/README.md
 * ----------------------------------
 * by https://github.com/galloween
 */

(() => {
  //------------------
  // CONFIG

  // window.$customSidebarV2.orderConfig = { order: [...] };

  //------------------

  !window.$customSidebarV2 &&
    (window.$customSidebarV2 = { tryCounter: 0, Loaded: false });

  const ver = '301217_2359';

  let runInterval;

  const spacerOrder = 100,
    notProcessedOrder = 50;

  function asArray(valOrArr) {
    return !valOrArr || Array.isArray(valOrArr) ? valOrArr : [valOrArr];
  }

  function cloneObj(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {}
    return obj;
  }

  function getListAsArray(list) {
    if (Array.isArray(list)) {
      return list;
    }
    if (typeof list === 'string') {
      list = list.split(/\s*,\s*/);
    }
    return [].concat(list || []);
  }

  function log(how, what, ...stuff) {
    const style = {
      error: 'background:#8b0000; color:white; padding:2px; border-radius:2px',
      warn: 'background:#8b0000; color:white; padding:2px; border-radius:2px',
      log: 'background:#222; color:#bada55; padding:2px; border-radius:2px;',
    };
    if (how !== 'warn' && how !== 'error') {
      how = 'log';
    }
    console[how](
      '%cCustom sidebar (ver.' + ver + '): ' + what,
      style[how],
      ...(asArray(stuff) || ['']),
      window.$customSidebarV2
    );
  }

  function getHaobj() {
    return (
      window.$customSidebarV2.Haobj ||
      (() => {
        const haElement = document.querySelector('home-assistant');
        return (window.$customSidebarV2.Haobj = haElement && haElement.hass);
      })()
    );
  }

  function getCurrentUser() {
    const haObj = getHaobj();
    return (
      window.$customSidebarV2.currentUser ||
      (window.$customSidebarV2.currentUser =
        (haObj &&
          haObj.user &&
          haObj.user.name &&
          haObj.user.name.toLowerCase()) ||
        '')
    );
  }

  function getCurrentDevice() {
    return (
      window.$customSidebarV2.currentDevice ||
      (window.$customSidebarV2.currentDevice =
        navigator && navigator.userAgent
          ? navigator.userAgent.toLowerCase()
          : '')
    );
  }

  function getDrawerLayout() {
    if (window.$customSidebarV2.DrawerLayoutElement) {
      return window.$customSidebarV2.DrawerLayoutElement;
    }
    let root = document.querySelector('home-assistant');
    root = root && root.shadowRoot;
    root = root && root.querySelector('home-assistant-main');
    root = root && root.shadowRoot;
    const drawerLayout = root && root.querySelector('ha-drawer');
    !drawerLayout &&
      log(
        'warn',
        'Cannot find "home-assistant home-assistant-main ha-drawer" element'
      );

    return (window.$customSidebarV2.DrawerLayoutElement = drawerLayout);
  }

  function getSidebar() {
    if (window.$customSidebarV2.SideBarElement) {
      return window.$customSidebarV2.SideBarElement;
    }
    const drawerLayout = getDrawerLayout();
    let sidebar =
      drawerLayout && drawerLayout.querySelector('ha-drawer ha-sidebar');
    sidebar = sidebar && sidebar.shadowRoot;
    window.$customSidebarV2.TitleElement =
      sidebar && sidebar.querySelector('.title');
    sidebar = sidebar && sidebar.querySelector('paper-listbox');

    !sidebar &&
      log('warn', 'Cannot find "ha-drawer ha-sidebar paper-listbox" element');

    return (window.$customSidebarV2.SideBarElement = sidebar);
  }

  function getSidebarItem(root) {
    if (window.$customSidebarV2.SidebarItemElement) {
      return window.$customSidebarV2.SidebarItemElement;
    }
    if (!root || !root.children) {
      return;
    }
    return Array.from(root.children).find((element) => {
      return (
        element.tagName == 'A' && element.getAttribute('data-panel') == 'config'
      );
    });
  }

  function setTitle(title) {
    if (window.$customSidebarV2.TitleElement) {
      window.$customSidebarV2.TitleElement.innerHTML = title;
    }
  }

  function rearrange(order) {
    try {
      if (order && window.$customSidebarV2.SideBarElement) {
        window.$customSidebarV2.SideBarElement.style.display = 'flex';
        window.$customSidebarV2.SideBarElement.style.flexDirection = 'column';

        const spacerElement = Array.from(
          window.$customSidebarV2.SideBarElement.children
        ).find((element) => {
          return (
            element.tagName == 'DIV' && element.classList.contains('spacer')
          );
        });
        spacerElement.style.order = spacerOrder;
        spacerElement.style.flexGrow = 5;

        order.forEach((item, i) => {
          const shouldCreate = item.new_item && !item.created;
          const shouldMove = !item.new_item && !item.moved;

          if (shouldCreate || shouldMove) {
            const existingItem = findItem(
              window.$customSidebarV2.SideBarElement,
              item
            );
            if (existingItem) {
              item.itemElement = existingItem;
              shouldCreate && (item.created = true);
              moveItem(window.$customSidebarV2.SideBarElement, item, i);
            } else {
              shouldMove && (item.moved = true);
              item.href &&
                createItem(window.$customSidebarV2.SideBarElement, item, i);
            }
          }
        });

        Array.from(
          window.$customSidebarV2.SideBarElement.querySelectorAll(
            'a[aria-role="option"]:not([data-custom-sidebar-processed]'
          )
        ).forEach((element, index) => {
          element.style.order = notProcessedOrder + index;
          element.setAttribute('data-custom-sidebar-processed', 'leftover');
        });
      }
    } catch (e) {
      log('warn', 'Error rearranging order', e);
      return false;
    }
    return true;
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
      log('warn', 'Error updating icon', e);
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
      log('warn', 'Error updating text', e);
    }
  }

  function findItem(elements, config_entry) {
    try {
      const item = Array.from(elements.children).find((element) => {
        if (element.tagName !== 'A') {
          return false;
        }
        const currentName = findNameElement(element).innerText.trim();
        const currentPanel = element.getAttribute('data-panel');

        return config_entry.exact
          ? currentName == config_entry.item
          : currentName
              .toLowerCase()
              .includes(config_entry.item.toLowerCase()) ||
              currentPanel === config_entry.item.toLowerCase();
      });
      return item;
    } catch (e) {
      log('warn', 'Error finding item', e);
      return null;
    }
  }

  function setOrder(element, config_entry, index) {
    config_entry.order &&
      (config_entry.order = parseInt(config_entry.order) || null);

    element &&
      (element.style.order = config_entry.bottom
        ? (config_entry.order || index + 1) + spacerOrder
        : config_entry.order || index + 1);
  }

  function createItem(elements, config_entry, index) {
    try {
      const cln =
        config_entry.itemElement || getSidebarItem(elements).cloneNode(true);
      if (cln) {
        //
        updateIcon(cln, config_entry.icon);
        updateName(cln, config_entry.name || config_entry.item);

        cln.href = config_entry.href;
        cln.target = config_entry.target || '';

        cln.setAttribute(
          'data-panel',
          config_entry.item.toLowerCase().replace(/\s/, '_')
        );

        if (config_entry.hide == true) {
          cln.style.display = 'none';
          cln.setAttribute('data-custom-sidebar-processed', 'hide');
          config_entry.hidden = true;
          //
        } else {
          //
          cln.style.display = 'block';
          cln.setAttribute('data-custom-sidebar-processed', 'create');
          setOrder(cln, config_entry, index);
        }

        cln.setAttribute('aria-selected', 'false');
        cln.className = '';

        elements.insertBefore(cln, elements.children[0]);

        config_entry.created = true;
        config_entry.itemElement = cln;
      }
    } catch (e) {
      log('warn', 'Error creating item', e);
    }
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
          config_entry.hidden = true;
          //
        } else {
          //
          elementToMove.style.display = 'block';
          setOrder(elementToMove, config_entry, index);
          elementToMove.setAttribute('data-custom-sidebar-processed', 'move');
        }

        elementToMove.setAttribute('aria-selected', 'false');
        elementToMove.className = '';

        config_entry.moved = true;
        config_entry.itemElement = elementToMove;
      } else {
        log('warn', 'Element to move not found', config_entry);
      }
    } catch (e) {
      log('warn', 'Error moving item', e);
    }
  }

  function getOrderWithExceptions(order, exceptions) {
    try {
      if (Array.isArray(exceptions)) {
        const currentUser = getCurrentUser(),
          currentDevice = getCurrentDevice();

        exceptions = exceptions.filter((exc) => {
          exc.user = getListAsArray(exc.user).map((u) => u.toLowerCase());
          exc.not_user = getListAsArray(exc.not_user).map((u) =>
            u.toLowerCase()
          );

          return (
            exc &&
            Array.isArray(exc.order) &&
            (exc.user.includes(currentUser) ||
              exc.not_user.includes(currentUser) ||
              (exc.device &&
                getListAsArray(exc.device).some((d) =>
                  currentDevice.includes(d)
                )))
          );
        });
        if (exceptions.some((e) => e.base_order === false)) {
          order.length = 0;
        }
        exceptions.forEach((e) => order.push(...e.order));
      }
    } catch (e) {
      log('warn', 'Error processing exceptions', e);
    }
    return order;
  }

  function process(config) {
    if (!config || !Array.isArray(config.order)) {
      finish(false, ['No config found or it does not have "order"', config]);
      return;
    }
    if (config.title) {
      setTitle(config.title);
    }
    if (Array.isArray(config.exceptions) && config.exceptions.length) {
      window.$customSidebarV2.orderConfig.base_order = cloneObj(config.order);
      config.order = getOrderWithExceptions(config.order, config.exceptions);
    }
    finish(rearrange(config.order));
  }

  function finish(success, error) {
    clearInterval(runInterval);
    if (!success || error || window.$customSidebarV2.tryCounter > 10) {
      window.$customSidebarV2.Loaded = 'error';
      log('warn', 'Failed', error || '');
    } else if (success) {
      window.$customSidebarV2.Loaded = 'success';
      log('log', 'Loaded successfully!');
    }
  }

  function run() {
    try {
      window.$customSidebarV2.DrawerLayoutElement = getDrawerLayout();
      window.$customSidebarV2.SideBarElement = getSidebar();
      window.$customSidebarV2.SidebarItemElement =
        window.$customSidebarV2.SideBarElement &&
        getSidebarItem(window.$customSidebarV2.SideBarElement);

      if (
        window.$customSidebarV2.SideBarElement &&
        window.$customSidebarV2.SidebarItemElement &&
        !window.$customSidebarV2.Loaded
      ) {
        window.$customSidebarV2.Loaded = true;

        if (window.$customSidebarV2.orderConfig) {
          process(window.$customSidebarV2.orderConfig);
        } else {
          fetch(
            '/local/sidebar-order.json' +
              '?' +
              Math.random().toString(16).substr(2, 5)
          ).then(
            (resp) => {
              if (!resp.ok || resp.status == 404) {
                finish(
                  false,
                  'JSON config file not found.\nMake sure you have valid config in /config/www/sidebar-order.json file.'
                );
                return;
              }
              resp.json().then(
                (config) => {
                  if (config.id && config.id.includes('example_json')) {
                    log(
                      'log',
                      'You seem to be using example configuration.\nMake sure you have valid config in /config/www/sidebar-order.json file.'
                    );
                  }
                  process((window.$customSidebarV2.orderConfig = config));
                },
                (err) => {
                  finish(false, ['Error loading JSON config', err]);
                }
              );
            },
            (err) => {
              finish(false, ['Error loading JSON config', err]);
            }
          );
        }
      } else {
        if (window.$customSidebarV2.Loaded) {
          finish('Custom Sidebar already loaded');
        }
        if (
          ++window.$customSidebarV2.tryCounter > 10 &&
          !window.$customSidebarV2.Loaded
        ) {
          finish(false, 'Tried 10 times and gave up');
        }
      }
    } catch (e) {
      finish(false, e);
    }
  }

  if (!window.$customSidebarV2.Loaded) {
    runInterval = setInterval(run, 1000);
  } else {
    finish('Already loaded');
  }
})();
