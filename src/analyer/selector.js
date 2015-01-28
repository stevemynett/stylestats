import Base from 'base';

export default SelectorAnalyzer;

class SelectorAnalyzer extends Base {

  constructor(selectors = []) {
    super();
    this.selectors = selectors;
  }

  analyze() {
    return {
      idSelectors: this.getIDSelectors(),
      universalSelectors: this.getUniversalSelectors(),
      unqualifiedAttributeSelectors: this.getUnqualifiedAttributeSelectors(),
      javascriptSpecificSelectors: this.getJavaScriptSpecificSelectors(),
      identifiers: this.getIdentifiers()
    };
  }

  getIDSelectors() {

    let count = 0;

    for (let selector of this.selectors) {
      if (selector.indexOf('#') > -1) {
        count += 1;
      }
    }

    return count;
  }

  getUniversalSelectors() {

    let count = 0;

    for (let selector of this.selectors) {
      if (selector.indexOf('*') > -1) {
        count += 1;
      }
    }

    return count;
  }

  getUnqualifiedAttributeSelectors() {

    let count = 0;

    for (let selector of this.selectors) {
      if (selector.trim().match(/\[.+\]$/g)) {
        count += 1;
      }
    }

    return count;
  }

  getJavaScriptSpecificSelectors() {

    let count = 0;
    let regexp = new RegExp(this.options.javascriptSpecificSelectors, 'g');

    for (let selector of this.selectors) {
      if (regexp.test(selector.trim())) {
        count += 1;
      }
    }

    return count;
  }

  getIdentifiers() {

    let identifiers = [];

    for (let selector of this.selectors) {
      let trimmed = selector.replace(/\s?([\>|\+|\~])\s?/g, '$1');
      let count = trimmed.replace(/\s+/g, ' ').split(/\s|\>|\+|\~/).length;
      identifiers.push({
        selector: selector,
        count: count
      });
    }

    return identifiers.sort((a, b) => b.count - a.count);
  }
}
