(function () {
  const tabList = document.querySelector("#menuTabs");
  const panelWrap = document.querySelector("#menuPanels");
  if (!tabList || !panelWrap || typeof MENU_CATEGORIES === "undefined") return;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // The shekel sign falls back to a different font than the digits, so it gets its own span
  function price(tag, className, value) {
    const node = el(tag, className);
    node.append(el("span", "currency", MENU_CURRENCY), el("span", "amount", String(value)));
    return node;
  }

  function arabic(tag, className, text) {
    const node = el(tag, className, text);
    node.lang = "ar";
    node.dir = "rtl";
    return node;
  }

  function buildPrices(item, category) {
    const prices = item.prices || (category.flatPrice ? [category.flatPrice] : []);
    if (!prices.length) return null;

    if (prices.length === 1 && !item.sizes) {
      return price("p", "price-single", prices[0]);
    }

    const list = el("ul", "price-list");
    prices.forEach((value, index) => {
      const row = el("li", "price-row");
      row.append(
        arabic("span", "price-size", (item.sizes && item.sizes[index]) || "—"),
        price("span", "price-value", value)
      );
      list.append(row);
    });
    return list;
  }

  function buildCard(item, category) {
    const card = el("article", "item-card");
    const head = el("div", "item-head");
    head.append(arabic("h3", "item-name", item.ar), el("p", "item-name-en", item.en));
    card.append(head);

    if (item.note) card.append(arabic("p", "item-note", item.note));

    const prices = buildPrices(item, category);
    if (prices) card.append(prices);

    return card;
  }

  function buildPanel(category, index) {
    const panel = el("section", "menu-panel");
    panel.id = `menu-panel-${category.id}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `menu-tab-${category.id}`);
    panel.tabIndex = 0;
    panel.hidden = index !== 0;

    if (category.note) panel.append(arabic("p", "menu-note", category.note));

    if (category.bases) {
      const bases = el("div", "base-row");
      bases.append(el("span", "base-label", "Base"));
      category.bases.forEach((base) => bases.append(arabic("span", "base-chip", base)));
      panel.append(bases);
    }

    const grid = el("div", "item-grid");
    category.items.forEach((item) => grid.append(buildCard(item, category)));
    panel.append(grid);

    return panel;
  }

  function buildTab(category, index) {
    const tab = el("button", "menu-tab");
    tab.type = "button";
    tab.id = `menu-tab-${category.id}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `menu-panel-${category.id}`);
    tab.setAttribute("aria-selected", String(index === 0));
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.append(arabic("span", "menu-tab-ar", category.ar), el("span", "menu-tab-en", category.en));
    return tab;
  }

  const tabs = MENU_CATEGORIES.map(buildTab);
  const panels = MENU_CATEGORIES.map(buildPanel);
  tabList.append(...tabs);
  panelWrap.append(...panels);

  // Scroll the strip itself rather than scrollIntoView, which would also drag the page sideways
  function keepTabVisible(tab) {
    const strip = tabList.getBoundingClientRect();
    const box = tab.getBoundingClientRect();
    const margin = 12;

    if (box.left < strip.left) tabList.scrollLeft -= strip.left - box.left + margin;
    else if (box.right > strip.right) tabList.scrollLeft += box.right - strip.right + margin;
  }

  function select(index, { focus = false } = {}) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus({ preventScroll: true });
    keepTabVisible(tabs[index]);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      select(index);
      try {
        // replaceState keeps the link shareable without jumping the page,
        // but it is rejected when the page is opened straight from disk
        history.replaceState(null, "", `#menu-${MENU_CATEGORIES[index].id}`);
      } catch {}
    });
    tab.addEventListener("keydown", (event) => {
      const steps = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 };
      let target = null;

      if (event.key === "Home") target = 0;
      else if (event.key === "End") target = tabs.length - 1;
      else if (steps[event.key]) target = (index + steps[event.key] + tabs.length) % tabs.length;

      if (target === null) return;
      event.preventDefault();
      select(target, { focus: true });
    });
  });

  const linked = MENU_CATEGORIES.findIndex((category) => location.hash === `#menu-${category.id}`);
  if (linked > 0) {
    select(linked);
    document.querySelector("#menu")?.scrollIntoView();
  }
})();
