import {SingleItem} from '@mikefeng110808/micro-util'
import {InputItem} from './InputItem'
import {SelectItem} from './SelectItem'

const template = [{
  key: "input",
  value: InputItem
},{
  key: "select",
  value: SelectItem
}]

class ItemList {
  constructor (list = [], options = {}) {
    this.options = options
    this.needValidHidden = this.options.needValidHidden || false
    this.rawList = list
    this.list = []
    this.templateList = template
    this.reset()
  }
  reset () {
    this.list = this.rawList.map(item => {
      var target = this.convert(item) // 需要根据类型判断使用的
      if (target.children) {
        target.children = new ItemList(target.children, this.options).list
      }
      return target
    }, [])
  }
  addTemplate ({key, value}) {
    var target = this.templateList.find(item => item.key == key);
    if (target) {
      target.value = value
    } else {
      this.templateList.push({
        key,
        value
      })
    }
  }
  convert (item) {
    var target = this.templateList.find(i => i.key == item.type);
    if (target && target.value) {
      return  new target.value(item)
    } else {
      return new SingleItem(item)
    }
  }
  getValid () { // 子节点查询
    var valid = this.getAllItems().filter(item => this.needValidHidden || item.show != false).map(item => item.getValid(), [])
    return new Promise(resolve => {
      Promise.all(valid)
        .then((res) => {
          var fails = res.filter(item => !item.success)
          resolve({
            success: fails.length == 0,
            errmsg: fails.length > 0 ? fails[0].message : '',
            type: fails.length > 0 ? fails[0].type : 'success'
          })
        })
    })
  }
  save (data) {// [{key:"",value:"", children: [{key:"",value:"", children:[]}]}]
    data.forEach(item => {
      var target = this.list.find(target => item.key == target.getKey())
      if (target) {
        target.setKeyValue(item)
      }
    })
  }
  getValue () { // [{key:"",value:"", children: [{key:"",value:"", children:[]}]}]
    return this.list.map(item => {
      return item.getKeyValue();
    })
  }
  getAllItems () {
    return this.list.reduce((total,item) => {
      total =  total.concat(item)
      return  total
    },[])
  }
  loadComponents () {
    return new Promise(resolve => {
      resolve()
    })
  }
  getNeedRender() {
    return Array.from(new Set(this.getAllItems().reduce((total,item) => {
      total =  total.concat(item.rawComponents)
      return  total
    },[])))
  }
  render () {
    this.loadComponents().then(() => {
      this.getAllItems().forEach(item => {
        item.canRender = true
      })
    })
  }
}
export {
  ItemList,
  InputItem,
  SelectItem
}