const DxfXform = require('../../style/dxf-xform');

class DxfExtXform extends DxfXform {
  get tag() {
    return 'x14:dxf';
  }
}

module.exports = DxfExtXform;
