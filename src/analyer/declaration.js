let _ = require('underscore');

import Base from 'base';

export default DeclarationAnalyzer;

class DeclarationAnalyzer extends Base {

  constructor(declarations = []) {
    super();
    this.declarations = declarations;
  }

  analyze() {
    return {
      dataUriSize: this.getDataUriSize(),
      importantKeywords: this.getImportantKeywords(),
      floatProperties: this.getFloatProperties(),
      uniqueFontSize: this.getUniqueFontSize(),
      uniqueFontFamily: this.getUniqueFontFamily(),
      uniqueColor: this.getUniqueColors(),
      properties: this.getPropertiesCount()
    };
  }

  getDataUriSize() {

    let size = '';
    for (let declaration of this.declarations) {
      if (declaration.value.indexOf('data:image') > -1) {
        size += declaration.value.match(/data\:image\/[A-Za-z0-9;,\+\=\/]+/);
      }
    }

    return Buffer.byteLength(size, 'utf8');
  }

  getImportantKeywords() {

    let importantCount = 0;
    for (let declaration of this.declarations) {
      if (declaration.value.indexOf('!important') > -1) {
        importantCount += 1;
      }
    }

    return importantCount;
  }

  getFloatProperties() {

    let floatCount = 0;
    for (let declaration of this.declarations) {
      if (declaration.value.indexOf('float') > -1) {
        floatCount += 1;
      }
    }

    return floatCount;
  }

  getUniqueFontSize() {

    let sizes = [];
    for (let declaration of this.declarations) {
      if (declaration.property.indexOf('font-size') > -1) {
        sizes.push(declaration.value.replace(/\!important/, '').trim());
      }
    }

    return _.sortBy(_.uniq(sizes).slice(), (item) => {
      return item.replace(/[^0-9\.]/g, '') - 0;
    });
  }

  getUniqueFontFamily() {

    let fonts = [];
    for (let declaration of this.declarations) {
      if (declaration.property.indexOf('font-family') > -1) {
        fonts.push(declaration.value.replace(/(\!important)/g, '').trim());
      }
    }

    return _.sortBy(_.uniq(fonts));
  }

  getUniqueColors() {

    let colors = [];
    for (let declaration of this.declarations) {
      if (declaration.property.match(/^color$/)) {
        let color = declaration.value.replace(/\!important/, '');
        color = color.toUpperCase().trim();
        colors.push(color);
      }
    }

    // Sort `color` property.
    let trimmed = _.without(colors, 'TRANSPARENT', 'INHERIT');
    let formatted = trimmed.map((color) => {
      if (/^#([0-9A-F]){3}$/.test(color)) {
        return color.replace(/^#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3');
      } else {
        return color;
      }
    });

    return _.sortBy(_.uniq(formatted));
  }

  getPropertiesCount() {

    let properties = {};
    for (let declaration of this.declarations) {
      if (properties[declaration.property]) {
        properties[declaration.property] += 1;
      } else {
        properties[declaration.property] = 1;
      }
    }

    let counts = [];
    Object.keys(properties).forEach((key) => {
      counts.push({
        property: key,
        count: properties[key]
      });
    });

    return counts.sort((a, b) => b.count - a.count);
  }
}
