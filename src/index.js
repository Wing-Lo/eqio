class Eqio {
  constructor(el) {
    if (!el || !('ResizeObserver' in window)) {
      return;
    }

    this.init(el);
  }

  init(el) {
    this.el = el;

    this.createStyles();
    this.createTriggers();
    this.createObservers();
  }

  createStyles() {
    if (!document.getElementById('eqio-req-css')) {
      const style = document.createElement('style');
      const css = `
        .eqio {
          position: relative;
        }

        .eqio__trigger {
          height: 1px;
          left: 0;
          pointer-events: none;
          position: absolute;
          top: 0;
          visibility: hidden;
          z-index: -1;
        }`;

      style.id = 'eqio-req-css';
      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));
      document.head.insertBefore(style, document.head.children[0]);
    }
  }

  createTriggers() {
    this.sizesArray = JSON.parse(this.el.attributes['data-eqio-sizes'].value);
  }

  createObservers() {
    const prefix = this.el.attributes['data-eqio-prefix'] ? `${this.el.attributes['data-eqio-prefix'].value}-` : '';
    const className = `${prefix}eqio-`;
    // eslint-disable-next-line no-undef
    this.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        this.sizesArray.forEach((size) => {
          if (size.indexOf('>') === 0 ){
            if(width > parseInt(size.substring(1, size.length))) {
              this.el.classList.add(`${className}${size}`);
            }
            else{
              this.el.classList.remove(`${className}${size}`);
            }
          }
          if (size.indexOf('<') === 0 ){
            if(width < parseInt(size.substring(1, size.length))) {
              this.el.classList.add(`${className}${size}`);
            }
            else{
              this.el.classList.remove(`${className}${size}`);
            }
          }
        });
      }
    });
    this.observer.observe(this.el);
  }

  stop() {
    this.el.removeAttribute('data-eqio-sizes');

    this.observer.unobserve(this.el);

    delete this.el;
    delete this.observer;
    delete this.sizesArray;
  }
}

module.exports = Eqio;
