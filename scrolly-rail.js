class ScrollyRail extends HTMLElement {
  static register(tag = "scrolly-rail") {
    if ("customElements" in window) {
      customElements.define(tag, this);
    }
  }

  get items() {
    const els = [...this.children];
    let arr;

    /**
     * Check if direct child is a wrapper element that contains children.
     * Otherwise, return direct children.
     */
    if (els.length === 1 && els[0].children.length > 0) {
      arr = [...els[0].children];
    } else {
      arr = [...els];
    }

    return arr;
  }

  connectedCallback() {
    if (!this.items) return;

    const slot = document.createElement("slot");
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(slot);

    this.prevBtn = document.getElementById(this.dataset.controlPrevious);
    this.nextBtn = document.getElementById(this.dataset.controlNext);

    if (this.prevBtn) {
      this.observeScrollStart();
      this.handleClickPrevious = () => this.goToPrevious();
      this.prevBtn.addEventListener("click", this.handleClickPrevious);
    }

    if (this.nextBtn) {
      this.observeScrollEnd();
      this.handleClickNext = () => this.goToNext();
      this.nextBtn.addEventListener("click", this.handleClickNext);
    }

    this.init();
    this.resizeObserver = new ResizeObserver(() => this.init());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();

    if (this.prevBtn) {
      this.scrollStartObserver.disconnect();
      this.prevBtn.removeEventListener("click", this.handleClickPrevious);
    }
    if (this.nextBtn) {
      this.scrollEndObserver.disconnect();
      this.nextBtn.removeEventListener("click", this.handleClickNext);
    }
  }

  init() {
    this.bounds = this.getBounds();
    this.step = this.getVisibleItemCount();
  }

  getBounds() {
    const { left, right } = this.getBoundingClientRect();
    return { left, right };
  }

  getVisibleItemCount() {
    let count = 0;

    for (let i = 0; i < this.items.length; i++) {
      const { left, right } = this.items[i].getBoundingClientRect();

      if (right > this.bounds.right) break;
      if (left > this.bounds.left) count++;
    }

    return count;
  }

  handleScrollIntoView(item, sibling) {
    /*
     * If singular visible item is selected and overflows, navigate to a sibling item.
     */
    const target = this.step > 0 ? item : sibling;

    target?.scrollIntoView({
      block: "nearest",
      inline: "start",
    });
  }

  goToPrevious() {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const { left } = this.items[i].getBoundingClientRect();

      if (left < this.bounds.left) {
        /*
         * Find the target item to align at start position.
         * Prevent the item at current index from overflowing.
         * Ensure target item index is always 0 or greater.
         */
        const target = this.items[Math.max(i - this.step + 1, 0)];

        this.handleScrollIntoView(target, target.previousElementSibling);
        break;
      }
    }
  }

  goToNext() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const { right } = item.getBoundingClientRect();

      if (right > this.bounds.right) {
        this.handleScrollIntoView(item, item.nextElementSibling);
        break;
      }
    }
  }

  observeScrollStart() {
    const firstItem = this.items[0];
    this.scrollStartObserver = this.setupObserver(this.prevBtn, firstItem);
    this.scrollStartObserver.observe(firstItem);
  }

  observeScrollEnd() {
    const lastItem = this.items[this.items.length - 1];
    this.scrollEndObserver = this.setupObserver(this.nextBtn, lastItem);
    this.scrollEndObserver.observe(lastItem);
  }

  /*
   * Observe scroll bounds of first and/or last element.
   * Toggle attribute on a button control when its respective scroll bound is reached.
   */
  setupObserver(btn, item) {
    const callback = ([entry]) => {
      btn.toggleAttribute("data-bound", entry.target === item && entry.isIntersecting);
    };

    const options = {
      root: this,
      threshold: 1,
    };

    return new IntersectionObserver(callback, options);
  }
}

ScrollyRail.register();
