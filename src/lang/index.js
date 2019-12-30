import {storage, httplink} from '@mikefeng110808/micro-util'
import {commonFrame} from '../'

let defaultLang = 'zh_CN'

let langPackage =  {
  lang: 'default',
  language: defaultLang,
  langs: {},
  modCode: 'visitorSdk',
  setDefaultLang (lang) {
    defaultLang = lang || defaultLang
  },
  load (modCode = 'visitorSdk') {
    this.modCode = modCode
    this.loadLocal();
  },
  forceUpdate(type = defaultLang) {
    storage.clear('langPackage'+ this.modCode + type)
    this.loadServer(type)
  },
  loadServer (type = defaultLang) {
    var that = this;
    var typelang = storage.get('langPackage'+ this.modCode + type)
    if (typelang) {
      this.langs = typelang;
      that.reset();
    } else {
      this.getMulLangsConfigByLangCodeAndModCode(type, this.modCode)
    }
  },
  loadLocal () {
    //获取当前语言包
    //当前无语言包使用中文(语言包)
    var lang = storage.get('langPackage'+ this.modCode);
    if (lang) {
      this.langs = lang;
      this.language = lang.language || defaultLang
      this.reset()
    } else {
      this.loadServer();
    }
    commonFrame.push('lang-init', this.language);
  },
  reset () {
    storage.set('langPackage'+ this.modCode, this.langs)
    commonFrame.push('lang-reset',{
      langs: this.langs,
      modCode: this.language
    });
  },
  resolve (data, type) {
    var sdkLang = {}
    data.forEach(item => {
      var itemArr = item.key.split('_');
      if (itemArr.length > 1) {
        var target = sdkLang;
        for (var i = 1,len = itemArr.length;i<len;i++) {
          var p = itemArr[i];
          if (typeof target[p] == 'undefined') {
            target[p] = {}
          }
          if (i == len-1) {
            target[p] = item.value
          }
          target = target[p]
        }
      }
    })
    this.langs = sdkLang
    this.language = type || defaultLang
    storage.set('langPackage'+ this.modCode + type, this.langs)
    this.reset()
  },
  getMulLangsConfigByLangCodeAndModCode (langCode, modCode) {
    var that = this
    httplink('getMulLangsConfigByLangCodeAndModCode', `/any800/multilingual.do`,{
      langCode,
      modCode,
      method: 'getMulLangsConfigByLangCodeAndModCode',
    }, 'get', false)
    .then(data => {
      if (data.res && data.res.data && data.res.data.length > 0) {
        that.resolve(data.res.data, data.data.langCode);
      } else {
        that.getFromFile(data.data.langCode || defaultLang)
      }
    })
    .catch(data => {
      that.getFromFile(data.langCode || defaultLang)
    })
  },
  getAllMulLangs () {
    httplink('getAllMulLangs', `/any800/echatManager.do`,{
      method: 'getAllMulLangs',
    }, 'post', false)
    .then((data) => {
      var langList = []
      if (data.res) {
        data.res.forEach(item => {
          langList.push({
            displayName: item.lang_name ,
            name: item.lang_code,
          });
        })
      }
      commonFrame.push('lang-get-langList', langList);
    })
  },
  getFromFile(type) {
    commonFrame.push('lang-get-from-file', type || defaultLang);
  },
  setFromFile (langs) {
    this.langs = langs;
    this.language = langs.language || defaultLang
    this.reset()
  }
}

export default langPackage;