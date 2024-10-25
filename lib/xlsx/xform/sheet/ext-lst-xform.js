/* eslint-disable max-classes-per-file */
const CompositeXform = require('../composite-xform');

const ConditionalFormattingsExt = require('./cf-ext/conditional-formattings-ext-xform');
const DataValidationsExt = require('./data-validations-ext-xform');

class ExtXform extends CompositeXform {
  constructor() {
    super();
    this.map = {
      'x14:conditionalFormattings': (this.conditionalFormattings = new ConditionalFormattingsExt()),
      'x14:dataValidations': (this.dataValidations = new DataValidationsExt()),
    };
  }

  get tag() {
    return 'ext';
  }

  hasContent(model) {
    return (
      this.conditionalFormattings.hasContent(model.conditionalFormattings) ||
      this.dataValidations.hasContent(model.dataValidations)
    );
  }

  prepare(model, options) {
    this.conditionalFormattings.prepare(model.conditionalFormattings, options);
  }

  render(xmlStream, model) {
    if (this.conditionalFormattings.hasContent(model.conditionalFormattings)) {
      xmlStream.openNode(this.tag, {
        uri: '{78C0D931-6437-407d-A8EE-F0AAD7539E65}',
        'xmlns:x14': 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main',
      });
      this.conditionalFormattings.render(xmlStream, model.conditionalFormattings);
      xmlStream.closeNode();
    }
    if (this.dataValidations.hasContent(model.dataValidations)) {
      xmlStream.openNode(
        this.tag,
        {
          uri: '{CCE6A557-97BC-4b89-ADB6-D9C93CAAB3DF}',
          'xmlns:x14': 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main',
        },
        true,
      );
      this.dataValidations.render(xmlStream, model.dataValidations);
      xmlStream.closeNode();
    }
  }

  createNewModel() {
    return {};
  }

  onParserClose(name, parser) {
    this.model[name] = parser.model;
  }
}

class ExtLstXform extends CompositeXform {
  constructor() {
    super();

    this.map = {
      ext: (this.ext = new ExtXform()),
    };
  }

  get tag() {
    return 'extLst';
  }

  prepare(model, options) {
    this.ext.prepare(model, options);
  }

  hasContent(model) {
    return this.ext.hasContent(model);
  }

  render(xmlStream, model) {
    if (!this.hasContent(model)) {
      return;
    }

    xmlStream.openNode('extLst');
    this.ext.render(xmlStream, model);
    xmlStream.closeNode();
  }

  createNewModel() {
    return {};
  }

  onParserClose(name, parser) {
    Object.assign(this.model, parser.model);
  }
}

module.exports = ExtLstXform;
