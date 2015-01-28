import Base from 'base';

export default RuleAnalyzer;

class RuleAnalyzer extends Base {

  constructor(rules = []) {
    super();
    this.rules = rules;
  }

  analyze() {
    return {
      cssDeclarations: this.getCSSDeclarations()
    };
  }

  getCSSDeclarations() {

    let declarations = [];

    for (let rule of this.rules) {
      if (Array.isArray(rule.declarations)) {
        declarations.push({
          selector: rule.selectors,
          count: rule.declarations.length
        });
      }
    }

    declarations.sort((a, b) => b.count - a.count);
  }
}

