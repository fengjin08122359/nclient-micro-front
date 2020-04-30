'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectItem = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _microUtil = require('@mikefeng110808/micro-util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectItem = function (_SingleItem) {
  _inherits(SelectItem, _SingleItem);

  function SelectItem(params) {
    _classCallCheck(this, SelectItem);

    var _this = _possibleConstructorReturn(this, (SelectItem.__proto__ || Object.getPrototypeOf(SelectItem)).call(this, params));

    _this.type = 'select';
    _this.props.multiple = params.props.multiple || false;
    _this.value = _this.rawData.value || (_this.props.multiple ? [] : '');
    _this.rawComponents = ['component-single-item-select'];
    return _this;
  }

  _createClass(SelectItem, [{
    key: 'save',
    value: function save(value) {
      var _this2 = this;

      var oldValue = this.value;
      if (this.props.multiple) {
        var values = [];
        value.forEach(function (target) {
          var selectValue = _this2.props.data.filter(function (item) {
            return item.key == target;
          });
          if (_this2.props.data.length > 0 && selectValue.length > 0) {
            values.push(selectValue[0].key);
          }
        });
        this.value = values;
      } else {
        var selectValue = this.props.data.filter(function (item) {
          return item.key == value;
        });
        this.value = this.props.data.length == 0 ? value : selectValue.length > 0 ? selectValue[0].key : this.props.data[0].key;
      }
      if (oldValue != this.value) {
        this.onChange({
          val: this.value,
          oldVal: oldValue
        });
      }
    }
  }, {
    key: 'changeData',
    value: function changeData(value) {
      var _this3 = this;

      var currentValue = '';
      if (this.props.multiple) {
        var values = [];
        value.forEach(function (target) {
          var selectValue = _this3.props.data.filter(function (item) {
            return item.value == target;
          });
          if (_this3.props.data.length > 0 && selectValue.length > 0) {
            values.push(selectValue[0].key);
          }
        });
        currentValue = values;
      } else {
        var selectValue = this.props.data.filter(function (item) {
          return item.value == value;
        });
        currentValue = this.props.data.length == 0 ? value : selectValue.length > 0 ? selectValue[0].key : this.props.data[0].key;
      }
      this.save(currentValue);
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      var _this4 = this;

      if (this.props.multiple) {
        return this.value.map(function (t) {
          var items = _this4.props.data.find(function (p) {
            return p.key == t;
          });
          return items;
        }).filter(function (i) {
          return i;
        });
      } else {
        return this.props.data.filter(function (item) {
          return item.key == _this4.value;
        }).length > 0 ? this.props.data.filter(function (item) {
          return item.key == _this4.value;
        })[0] : this.value;
      }
    }
  }, {
    key: 'hasInsert',
    value: function hasInsert() {
      if (this.props.multiple) {
        return this.getValue().length > 0;
      } else {
        return this.value != '';
      }
    }
  }, {
    key: 'render',
    value: function render(createElement, vueTarget, context) {
      if (!this.getCanRender()) {
        return createElement();
      } else {
        return createElement('component-single-item-select', // 标签名称
        {
          data: this
        }, [vueTarget.$slots.default]);
      }
    }
  }]);

  return SelectItem;
}(_microUtil.SingleItem);

exports.SelectItem = SelectItem;