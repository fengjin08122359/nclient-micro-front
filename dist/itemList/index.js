'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectItem = exports.InputItem = exports.ItemList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _microUtil = require('@mikefeng110808/micro-util');

var _InputItem = require('./InputItem');

var _SelectItem = require('./SelectItem');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var template = [{
  key: "input",
  value: _InputItem.InputItem
}, {
  key: "select",
  value: _SelectItem.SelectItem
}];

var ItemList = function () {
  function ItemList() {
    var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ItemList);

    this.options = options;
    this.needValidHidden = this.options.needValidHidden || false;
    this.rawList = list;
    this.list = [];
    this.templateList = template;
    this.reset();
  }

  _createClass(ItemList, [{
    key: 'reset',
    value: function reset() {
      var _this = this;

      this.list = this.rawList.map(function (item) {
        var target = _this.convert(item); // 需要根据类型判断使用的
        if (target.children) {
          target.children = new ItemList(target.children, _this.options).list;
        }
        return target;
      }, []);
    }
  }, {
    key: 'addTemplate',
    value: function addTemplate(_ref) {
      var key = _ref.key,
          value = _ref.value;

      var target = this.templateList.find(function (item) {
        return item.key == key;
      });
      if (target) {
        target.value = value;
      } else {
        this.templateList.push({
          key: key,
          value: value
        });
      }
    }
  }, {
    key: 'convert',
    value: function convert(item) {
      var target = this.templateList.find(function (i) {
        return i.key == item.type;
      });
      if (target && target.value) {
        return new target.value(item);
      } else {
        return new _microUtil.SingleItem(item);
      }
    }
  }, {
    key: 'getValid',
    value: function getValid() {
      var _this2 = this;

      // 子节点查询
      var valid = this.getAllItems().filter(function (item) {
        return _this2.needValidHidden || item.show != false;
      }).map(function (item) {
        return item.getValid();
      }, []);
      return new Promise(function (resolve) {
        Promise.all(valid).then(function (res) {
          var fails = res.filter(function (item) {
            return !item.success;
          });
          resolve({
            success: fails.length == 0,
            errmsg: fails.length > 0 ? fails[0].message : '',
            type: fails.length > 0 ? fails[0].type : 'success'
          });
        });
      });
    }
  }, {
    key: 'save',
    value: function save(data) {
      var _this3 = this;

      // [{key:"",value:"", children: [{key:"",value:"", children:[]}]}]
      data.forEach(function (item) {
        var target = _this3.list.find(function (target) {
          return item.key == target.getKey();
        });
        if (target) {
          target.setKeyValue(item);
        }
      });
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      // [{key:"",value:"", children: [{key:"",value:"", children:[]}]}]
      return this.list.map(function (item) {
        return item.getKeyValue();
      });
    }
  }, {
    key: 'getAllItems',
    value: function getAllItems() {
      return this.list.reduce(function (total, item) {
        total = total.concat(item);
        return total;
      }, []);
    }
  }, {
    key: 'loadComponents',
    value: function loadComponents() {
      return new Promise(function (resolve) {
        resolve();
      });
    }
  }, {
    key: 'getNeedRender',
    value: function getNeedRender() {
      return Array.from(new Set(this.getAllItems().reduce(function (total, item) {
        total = total.concat(item.rawComponents);
        return total;
      }, [])));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      this.loadComponents().then(function () {
        _this4.getAllItems().forEach(function (item) {
          item.canRender = true;
        });
      });
    }
  }]);

  return ItemList;
}();

exports.ItemList = ItemList;
exports.InputItem = _InputItem.InputItem;
exports.SelectItem = _SelectItem.SelectItem;