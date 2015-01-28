import RuleAnalyzer from 'analyzer/rule';
import SelectorAnalyzer from 'analyzer/selector';
import DeclarationAnalyzer from 'analyzer/declaration';

export default Analyzer;

class Analyzer {

  constructor(rules, selectors, declarations, cssString, cssSize, options) {

    this.ruleAnalyzer = new RuleAnalyzer(rules);
    this.selectorAnalyzer = new SelectorAnalyzer(selectors);
    this.declarationAnalyzer = new DeclarationAnalyzer(declarations);

    this.cssString = cssString;
    this.cssSize = cssSize;
    this.options = options;
  }

  analyze() {

    let ruleAnalysis = this.ruleAnalyzer.analyze();
    let selectorAnalysis = this.selectorAnalyzer.analyze();
    let declarationAnalysis = this.declarationAnalyzer.analyze();

    let analysis = {};
    if (this.options.size) {
      analysis.size = this.cssSize;
    }
    if (this.options.dataUriSize) {
      analysis.dataUriSize = declarationAnalysis.dataUriSize;
    }
    if (this.options.dataUriSize && this.options.ratioOfDataUriSize && declarationAnalysis.dataUriSize !== 0) {
      analysis.ratioOfDataUriSize = declarationAnalysis.dataUriSize / this.cssSize;
    }
    if (this.options.gzippedSize) {
      analysis.gzippedSize = gzipSize.sync(this.cssString);
    }
    if (this.options.rules) {
      analysis.rules = this.rules.length;
    }
    if (this.options.selectors) {
      analysis.selectors = this.selectors.length;
    }
    if (this.options.rules && this.options.selectors && this.options.simplicity) {
      analysis.simplicity = analysis.rules / analysis.selectors;
    }
    // Most Identifier
    var mostIdentifier = selectorAnalysis.identifiers.shift();
    if (mostIdentifier && this.options.mostIdentifier) {
      analysis.mostIdentifier = mostIdentifier.count;
    }
    if (mostIdentifier && this.options.mostIdentifierSelector) {
      analysis.mostIdentifierSelector = mostIdentifier.selector;
    }
    var lowestDefinition = ruleAnalysis.cssDeclarations.shift();
    if (lowestDefinition && this.options.lowestCohesion) {
      analysis.lowestCohesion = lowestDefinition.count;
    }
    if (lowestDefinition && this.options.lowestCohesionSelector) {
      analysis.lowestCohesionSelector = lowestDefinition.selector;
    }
    if (this.options.totalUniqueFontSizes) {
      analysis.totalUniqueFontSizes = declarationAnalysis.uniqueFontSize.length;
    }
    if (this.options.uniqueFontSize) {
      analysis.uniqueFontSize = declarationAnalysis.uniqueFontSize;
    }
    if (this.options.totalUniqueFontFamilies) {
      analysis.totalUniqueFontFamilies = declarationAnalysis.uniqueFontFamily.length;
    }
    if (this.options.uniqueFontFamily) {
      analysis.uniqueFontFamily = declarationAnalysis.uniqueFontFamily;
    }
    if (this.options.totalUniqueColors) {
      analysis.totalUniqueColors = declarationAnalysis.uniqueColor.length;
    }
    if (this.options.uniqueColor) {
      analysis.uniqueColor = declarationAnalysis.uniqueColor;
    }
    if (this.options.idSelectors) {
      analysis.idSelectors = selectorAnalysis.idSelectors;
    }
    if (this.options.universalSelectors) {
      analysis.universalSelectors = selectorAnalysis.universalSelectors;
    }
    if (this.options.unqualifiedAttributeSelectors) {
      analysis.unqualifiedAttributeSelectors = selectorAnalysis.unqualifiedAttributeSelectors;
    }
    if (this.options.javascriptSpecificSelectors) {
      analysis.javascriptSpecificSelectors = selectorAnalysis.javascriptSpecificSelectors;
    }
    if (this.options.importantKeywords) {
      analysis.importantKeywords = declarationAnalysis.importantKeywords;
    }
    if (this.options.floatProperties) {
      analysis.floatProperties = declarationAnalysis.floatProperties;
    }
    if (this.options.propertiesCount) {
      analysis.propertiesCount = declarationAnalysis.properties.slice(0, this.options.propertiesCount);
    }
    return analysis;
  }
}
