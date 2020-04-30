import {SingleItem} from '@mikefeng110808/micro-util'

class InputItem extends SingleItem{
  constructor(params) {
    super(params)
    this.type = 'input'
    this.value = this.rawData.value || ''
    this.rawComponents = ['component-single-item-input']
  }
  render(createElement, vueTarget, context) {
    if (!this.getCanRender()) {
      return createElement()
    } else {
      return createElement(
        'component-single-item-input',   // 标签名称
        {
          data: this
        },
        [vueTarget.$slots.default]
      )
    }
  }
}
export {
  InputItem
}