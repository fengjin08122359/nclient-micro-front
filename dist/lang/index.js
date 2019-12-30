'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _microUtil = require('@mikefeng110808/micro-util');

var _ = require('../');

var defaultLang = 'zh_CN';

var langPackage = {
  lang: 'default',
  language: defaultLang,
  langs: {},
  modCode: 'visitorSdk',
  setDefaultLang: function setDefaultLang(lang) {
    defaultLang = lang || defaultLang;
  },
  load: function load() {
    var modCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'visitorSdk';

    this.modCode = modCode;
    this.loadLocal();
  },
  forceUpdate: function forceUpdate() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultLang;

    _microUtil.storage.clear('langPackage' + this.modCode + type);
    this.loadServer(type);
  },
  loadServer: function loadServer() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultLang;

    var that = this;
    var typelang = _microUtil.storage.get('langPackage' + this.modCode + type);
    if (typelang) {
      this.langs = typelang;
      that.reset();
    } else {
      this.getMulLangsConfigByLangCodeAndModCode(type, this.modCode);
    }
  },
  loadLocal: function loadLocal() {
    //获取当前语言包
    //当前无语言包使用中文(语言包)
    var lang = _microUtil.storage.get('langPackage' + this.modCode);
    if (lang) {
      this.langs = lang;
      this.language = lang.language || defaultLang;
      this.reset();
    } else {
      this.loadServer();
    }
    _.commonFrame.push('lang-init', this.language);
  },
  reset: function reset() {
    _microUtil.storage.set('langPackage' + this.modCode, this.langs);
    _.commonFrame.push('lang-reset', {
      langs: this.langs,
      modCode: this.language
    });
  },
  resolve: function resolve(data, type) {
    var sdkLang = {};
    data.forEach(function (item) {
      var itemArr = item.key.split('_');
      if (itemArr.length > 1) {
        var target = sdkLang;
        for (var i = 1, len = itemArr.length; i < len; i++) {
          var p = itemArr[i];
          if (typeof target[p] == 'undefined') {
            target[p] = {};
          }
          if (i == len - 1) {
            target[p] = item.value;
          }
          target = target[p];
        }
      }
    });
    this.langs = sdkLang;
    this.language = type || defaultLang;
    _microUtil.storage.set('langPackage' + this.modCode + type, this.langs);
    this.reset();
  },
  getMulLangsConfigByLangCodeAndModCode: function getMulLangsConfigByLangCodeAndModCode(langCode, modCode) {
    var that = this;
    (0, _microUtil.httplink)('getMulLangsConfigByLangCodeAndModCode', '/any800/multilingual.do', {
      langCode: langCode,
      modCode: modCode,
      method: 'getMulLangsConfigByLangCodeAndModCode'
    }, 'get', false).then(function (data) {
      if (data.res && data.res.data && data.res.data.length > 0) {
        that.resolve(data.res.data, data.data.langCode);
      } else {
        that.getFromFile(data.data.langCode || defaultLang);
      }
    }).catch(function (data) {
      that.getFromFile(data.langCode || defaultLang);
    });
  },
  getAllMulLangs: function getAllMulLangs() {
    (0, _microUtil.httplink)('getAllMulLangs', '/any800/echatManager.do', {
      method: 'getAllMulLangs'
    }, 'post', false).then(function (data) {
      var langList = [];
      if (data.res) {
        data.res.forEach(function (item) {
          langList.push({
            displayName: item.lang_name,
            name: item.lang_code
          });
        });
      }
      _.commonFrame.push('lang-get-langList', langList);
    });
  },
  getFromFile: function getFromFile(type) {
    _.commonFrame.push('lang-get-from-file', type || defaultLang);
  },
  setFromFile: function setFromFile(langs) {
    this.langs = langs;
    this.language = langs.language || defaultLang;
    this.reset();
  }
};

exports.default = langPackage;