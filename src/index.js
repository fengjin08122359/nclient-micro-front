
import {
  config,
  convertTree,
  faceIco,
  mobileInput,
  storeImg,
  validator,
  httplink,
  jsonplink,
  DataHandle,
  Handle,
  keyFrame,
  storage,
  logger,
  websocket,
  register,
  displayHandle,
  displayData,
  EventBus,
  rgData,
  rgHandle,
  websocketFrame,
  httpFrame,
  changeTitle,
  convertVuex,
  SingleItem
} from '@mikefeng110808/micro-util'
import langPackage from './lang'
import screenCapture from './screenCapture'
import {
  ItemList,
  InputItem,
  SelectItem
} from './itemList'

export const dataFrame = new EventBus('dataFrame')

export const stateFrame = new EventBus('stateFrame')

export const controlFrame = new EventBus('controlFrame')

export const commonFrame = new EventBus('commonFrame')

export {
  config,
  changeTitle,
  convertTree,
  faceIco,
  langPackage,
  mobileInput,
  screenCapture,
  storeImg,
  validator,
  httplink,
  jsonplink,
  DataHandle,
  Handle,
  keyFrame,
  websocketFrame,
  httpFrame,
  storage,
  logger,
  websocket,
  register,
  displayHandle,
  displayData,
  rgData,
  rgHandle,
  convertVuex,
  ItemList,
  SingleItem,
  InputItem,
  SelectItem
}