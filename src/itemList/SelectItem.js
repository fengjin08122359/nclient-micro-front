import {SingleItem} from '@mikefeng110808/micro-util'

class SelectItem extends SingleItem{
  constructor(params) {
    super(params)
    this.type = 'select'
    this.props.multiple = params.props.multiple || false
    this.value = this.rawData.value || (this.props.multiple ? [] : '')
    this.rawComponents = ['component-single-item-select']
  }
  save (value) {
    var oldValue = this.value
    if (this.props.multiple) {
      var values = [];
      value.forEach(target => {
        let selectValue = this.props.data.filter(item => item.key == target)
        if (this.props.data.length > 0 && selectValue.length > 0) {
          values.push(selectValue[0].key)
        }
      })
      this.value = values
    } else {
      let selectValue = this.props.data.filter(item => item.key == value)
      this.value = this.props.data.length ==0 ? value : selectValue.length > 0 ? selectValue[0].key : this.props.data[0].key
    }
    if (oldValue != this.value) {
      this.onChange({
        val:this.value,
        oldVal:oldValue
      })
    }
  }
  changeData (value) {
    var currentValue = ''
    if (this.props.multiple) {
      var values = [];
      value.forEach(target => {
        let selectValue = this.props.data.filter(item => item.value == target)
        if (this.props.data.length > 0 && selectValue.length > 0) {
          values.push(selectValue[0].key)
        }
      })
      currentValue = values
    } else {
      let selectValue = this.props.data.filter(item => item.value == value)
      currentValue = this.props.data.length ==0 ? value : selectValue.length > 0 ? selectValue[0].key : this.props.data[0].key
    }
    this.save(currentValue)
  }
  getValue() {
    if (this.props.multiple) { 
      return this.value.map(t => {
        var items = this.props.data.find(p => p.key == t);
        return items
      }).filter(i => i)
    }else {
      return this.props.data.filter(item => item.key == this.value).length > 0 ? this.props.data.filter(item => item.key == this.value)[0] : this.value
    }
  }
  hasInsert () {
    if (this.props.multiple) { 
      return this.getValue().length > 0 
    }else {
      return this.value != ''
    }
  }
  
  render(createElement, vueTarget, context) {
    if (!this.getCanRender()) {
      return createElement()
    } else {
      return createElement(
        'component-single-item-select',   // 标签名称
        {
          data: this
        },
        [vueTarget.$slots.default]
      )
    }
  }
}
export {
  SelectItem
}