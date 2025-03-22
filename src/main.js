import { createApp } from 'vue'
import router from './router'
import { 
  Tabbar, TabbarItem, Button, Cell, CellGroup, Icon, 
  NavBar, Field, Form, Empty, Loading, Toast, 
  Uploader, Image as VanImage, Dialog, Lazyload,
  Checkbox, CheckboxGroup, Popup, Picker, Switch
} from 'vant'

// Import Vant styles
import 'vant/lib/index.css'
// Import custom styles
import './style.css'
import App from './App.vue'

// Mobile adaptation
import 'amfe-flexible/index.js'
import { preventZoom, getDeviceType } from './utils/helpers'

const app = createApp(App)

// Register Vant components
app.use(Tabbar)
  .use(TabbarItem)
  .use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(Icon)
  .use(NavBar)
  .use(Field)
  .use(Form)
  .use(Empty)
  .use(Loading)
  .use(Toast)
  .use(Uploader)
  .use(VanImage)
  .use(Dialog)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Popup)
  .use(Picker)
  .use(Switch)
  .use(Lazyload, {
    lazyComponent: true,
    loading: 'https://placehold.co/200x200/f5f5f5/ccc?text=Loading'
  })

// Register router
app.use(router)

// Mount app
app.mount('#app')

// 移动端兼容性优化
// 设置安全区域变量
function setSafeAreaVariables() {
  document.documentElement.style.setProperty(
    '--sat', `${Math.max(0, window.screen.height - document.documentElement.clientHeight)}px`
  );
  document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom, 0px)');
  document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left, 0px)');
  document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right, 0px)');
}

// 移动端页面初始化
if (getDeviceType().isMobile) {
  // 禁止页面缩放
  preventZoom();
  
  // 设置安全区域变量
  setSafeAreaVariables();
  window.addEventListener('resize', setSafeAreaVariables);
  
  // 修复iOS点击延迟300ms问题
  const touchstartHandler = function(e) {
    if (e.touches.length > 1) return;
    const target = e.target;
    const touch = e.touches[0];
    target.touchStartX = touch.clientX;
    target.touchStartY = touch.clientY;
  };

  const touchendHandler = function(e) {
    const target = e.target;
    if (e.changedTouches.length > 1) return;
    if (typeof target.touchStartX !== 'number') return;
    
    const touch = e.changedTouches[0];
    const distanceX = Math.abs(touch.clientX - target.touchStartX);
    const distanceY = Math.abs(touch.clientY - target.touchStartY);
    
    if (distanceX < 10 && distanceY < 10) {
      e.preventDefault();
      target.click();
    }
    
    delete target.touchStartX;
    delete target.touchStartY;
  };

  // 仅在iOS上应用修复
  if (getDeviceType().isIOS) {
    document.addEventListener('touchstart', touchstartHandler, false);
    document.addEventListener('touchend', touchendHandler, false);
  }

  // 添加active状态效果
  document.addEventListener('touchstart', () => {}, false);
}
