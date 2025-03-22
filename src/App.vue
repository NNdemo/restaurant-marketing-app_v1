<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeTab = computed(() => {
  const path = route.path;
  if (path.includes('/home')) return 0;
  if (path.includes('/content')) return 1;
  if (path.includes('/social')) return 2;
  if (path.includes('/coupons')) return 3;
  if (path.includes('/profile')) {
    if (route.query.socialTab === 'true') return 2;
    return 4;
  }
  return 0;
});

// Universal publish functionality
const showPublishOptions = ref(false);
const isPublishing = ref(false);
const isGeneratingContent = ref(false);
const selectedStyle = ref('professional');
const selectedPlatforms = ref([]);
const userInputContent = ref('');
const aiGeneratedContent = ref('');

const enhanceOptions = ref({
  optimizeText: true,
  addHashtags: true,
  generateImage: false
});

// Content style options
const contentStyles = [
  { label: 'Professional', value: 'professional', icon: 'manager-o' },
  { label: 'Friendly', value: 'friendly', icon: 'smile-o' },
  { label: 'Promotional', value: 'promotional', icon: 'gift-o' },
  { label: 'Formal', value: 'formal', icon: 'certificate' }
];

// Available platforms for publishing
const platformOptions = [
  { text: 'Meituan', value: 'Meituan' },
  { text: 'Dianping', value: 'Dianping' },
  { text: 'Ele.me', value: 'Ele.me' },
  { text: 'All Platforms', value: 'All Platforms' }
];

// Watch for style changes to update AI content preview
watch(selectedStyle, (newStyle) => {
  if (aiGeneratedContent.value) {
    // Regenerate content when style changes
    generateAIContent();
  }
});

// Generate AI enhanced content based on user input and selected style
const generateAIContent = () => {
  if (!userInputContent.value.trim()) {
    showErrorToast('Please enter some content to enhance');
    return;
  }
  
  isGeneratingContent.value = true;
  
  // Simulate API call to AI service
  setTimeout(() => {
    const baseContent = userInputContent.value.trim();
    let enhancedContent = '';
    
    // Generate different content based on selected style
    if (selectedStyle.value === 'professional') {
      enhancedContent = `We are pleased to introduce our exclusive offer: ${baseContent}. This limited-time promotion provides exceptional value for our customers.`;
    } else if (selectedStyle.value === 'friendly') {
      enhancedContent = `Hey there! 😊 Check this out: ${baseContent}! We thought you'd love this special deal we've put together!`;
    } else if (selectedStyle.value === 'promotional') {
      enhancedContent = `🔥 SPECIAL OFFER ALERT! 🔥 ${baseContent.toUpperCase()}! LIMITED TIME ONLY - Act fast before this amazing deal expires!`;
    } else if (selectedStyle.value === 'formal') {
      enhancedContent = `We wish to inform our esteemed clients about our latest offering: ${baseContent}. We invite you to take advantage of this exclusive opportunity.`;
    }
    
    aiGeneratedContent.value = enhancedContent;
    isGeneratingContent.value = false;
  }, 1500);
};

// Universal publishing function
const universalPublish = () => {
  // Validate platform selection
  if (selectedPlatforms.value.length === 0) {
    showErrorToast('Please select at least one platform');
    return;
  }
  
  isPublishing.value = true;
  
  // Simulate API call to publish content to all selected platforms
  setTimeout(() => {
    isPublishing.value = false;
    showPublishOptions.value = false;
    
    // Show success message
    showSuccessToast(`Successfully published to ${selectedPlatforms.value.length} platforms with ${selectedStyle.value} style!`);
  }, 2000);
};

// Show success toast
const showSuccessToast = (message) => {
  import('vant').then(({ showToast }) => {
    showToast({
      message,
      position: 'bottom',
      duration: 2000
    });
  });
};

// Show error toast
const showErrorToast = (message) => {
  import('vant').then(({ showToast }) => {
    showToast({
      message,
      position: 'bottom',
      type: 'fail',
      duration: 2000
    });
  });
};
</script>

<template>
  <div class="app-container">
    <!-- Main content area with router view -->
    <div class="content-area">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <keep-alive>
            <component :is="Component" v-if="route.meta.keepAlive" />
          </keep-alive>
        </transition>
        
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <component :is="Component" v-if="!route.meta.keepAlive" />
        </transition>
      </router-view>
    </div>
    
    <!-- Floating Universal Publish Button -->
    <div class="universal-publish-button" @click="showPublishOptions = true">
      <van-icon name="share-o" />
    </div>

    <!-- Bottom navigation bar -->
    <van-tabbar v-model="activeTab" route fixed safe-area-inset-bottom>
      <van-tabbar-item to="/home" icon="home-o">Home</van-tabbar-item>
      <van-tabbar-item to="/content" icon="edit">Content</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="friends-o">Social</van-tabbar-item>
      <van-tabbar-item to="/coupons" icon="coupon-o">Coupons</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="manager-o">Profile</van-tabbar-item>
    </van-tabbar>
    
    <!-- Universal publish options popup -->
    <van-popup
      v-model:show="showPublishOptions"
      position="bottom"
      round
      closeable
      class="publish-options-popup"
      safe-area-inset-bottom
    >
      <div class="popup-header">
        <h2>Universal Publishing</h2>
        <van-icon name="cross" @click="showPublishOptions = false" />
      </div>

      <div class="publish-options-content">
        <h3 class="section-title">AI Enhancement Options</h3>
        
        <div class="option-section user-input-section">
          <h4>Your Content</h4>
          <div class="content-input-container">
            <van-field
              v-model="userInputContent"
              type="textarea"
              rows="4"
              placeholder="Enter your promotion or content here..."
              class="content-textarea"
            />
            <van-button 
              type="primary" 
              size="small" 
              class="generate-btn" 
              @click="generateAIContent"
              :loading="isGeneratingContent"
            >
              {{ isGeneratingContent ? 'Generating...' : 'Enhance with AI' }}
            </van-button>
          </div>
        </div>
        
        <div class="option-section">
          <h4>Content Style</h4>
          <div class="style-options">
            <div 
              v-for="(style, index) in contentStyles" 
              :key="index"
              :class="['style-option', { active: selectedStyle === style.value }]"
              @click="selectedStyle = style.value"
            >
              <van-icon :name="style.icon" />
              <span>{{ style.label }}</span>
            </div>
          </div>
        </div>

        <div class="option-section">
          <h4>Target Platforms</h4>
          <van-checkbox-group v-model="selectedPlatforms">
            <van-checkbox 
              v-for="platform in platformOptions"
              :key="platform.value"
              :name="platform.value"
              checked-color="var(--primary-color)"
            >
              {{ platform.text }}
            </van-checkbox>
          </van-checkbox-group>
        </div>

        <div class="option-section">
          <h4>AI Content Enhancement</h4>
          <van-cell-group inset class="enhancement-options">
            <van-cell center title="Auto-optimize text">
              <template #right-icon>
                <van-switch v-model="enhanceOptions.optimizeText" size="24" active-color="var(--primary-color)" />
              </template>
            </van-cell>
            <van-cell center title="Add relevant hashtags">
              <template #right-icon>
                <van-switch v-model="enhanceOptions.addHashtags" size="24" active-color="var(--primary-color)" />
              </template>
            </van-cell>
            <van-cell center title="Generate matching image">
              <template #right-icon>
                <van-switch v-model="enhanceOptions.generateImage" size="24" active-color="var(--primary-color)" />
              </template>
            </van-cell>
          </van-cell-group>
        </div>

        <div class="option-section preview-section">
          <h4>AI Enhanced Preview</h4>
          <div class="preview-container">
            <div class="preview-card">
              <div class="preview-header">
                <div class="preview-style-tag">{{ selectedStyle }}</div>
                <van-icon name="like-o" class="preview-action-icon" />
              </div>
              <div class="preview-content">
                <p v-if="aiGeneratedContent">{{ aiGeneratedContent }}</p>
                <p v-else-if="selectedStyle === 'professional'">Introducing our latest exclusive offer designed specifically for valued customers like you.</p>
                <p v-else-if="selectedStyle === 'friendly'">Hey there! Check out this amazing deal we've put together just for you! 😊</p>
                <p v-else-if="selectedStyle === 'promotional'">LIMITED TIME OFFER! Don't miss this incredible chance to save big!</p>
                <p v-else-if="selectedStyle === 'formal'">We are pleased to announce a special promotion exclusively available to our esteemed clientele.</p>
              </div>
              <div v-if="enhanceOptions.addHashtags" class="preview-hashtags">
                <span>#specialoffer</span>
                <span>#limitedtime</span>
                <span>#exclusive</span>
              </div>
              <div v-if="enhanceOptions.generateImage" class="preview-image">
                <img src="https://placehold.co/600x400/e8f4fc/0077cc?text=AI+Generated+Image" alt="Promotional image" />
              </div>
            </div>
          </div>
        </div>

        <div class="publish-actions">
          <van-button
            type="primary"
            block
            round
            size="large"
            icon="share-o"
            :loading="isPublishing"
            @click="universalPublish"
          >
            {{ isPublishing ? 'Publishing...' : 'Publish to All Platforms' }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background-color: #f5f5f5;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}

.content-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(50px + constant(safe-area-inset-bottom));
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
}

/* Custom theme colors */
:root {
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --text-color: #333;
  --light-bg: #f9f9f9;
  --border-color: #eaeaea;
  --blue-color: #1989fa;
}

/* 修复iOS输入框内阴影 */
input, textarea {
  -webkit-appearance: none;
  appearance: none;
}

/* 修复Safari圆角问题 */
.van-button {
  overflow: hidden;
}

/* Universal Publish Button Styles */
.universal-publish-button {
  position: fixed;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  background-color: var(--blue-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(25, 137, 250, 0.4);
  z-index: 999;
  transition: transform 0.2s, box-shadow 0.2s;
}

.universal-publish-button:active {
  transform: translateX(-50%) scale(0.92);
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
}

.universal-publish-button .van-icon {
  font-size: 24px;
  color: white;
}

/* 确保按钮在iOS底部安全区域也能正确显示 */
@supports (padding: max(0px)) {
  .universal-publish-button {
    bottom: calc(25px + env(safe-area-inset-bottom) / 2);
  }
}

/* 调整tabbar样式，确保按钮能正确覆盖在上方 */
.van-tabbar {
  height: 50px;
  z-index: 99;
}

/* 确保tabbar里的内容能围绕中间的按钮 */
.van-tabbar-item:nth-child(3) {
  visibility: hidden;
}

/* 调整间距在不同屏幕尺寸下的适配 */
@media screen and (max-height: 700px) {
  .universal-publish-button {
    bottom: 22px;
    width: 52px;
    height: 52px;
  }
}

/* Publish Options Popup Styles */
.publish-options-popup {
  height: 90%;
  max-height: 650px;
  overflow-y: auto;
}

.publish-options-popup .popup-header {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.publish-options-popup .popup-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.publish-options-popup .popup-header .van-icon {
  font-size: 20px;
  color: #999;
}

.publish-options-popup .publish-options-content {
  padding: 16px;
}

.publish-options-popup .section-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 20px;
  color: var(--text-color);
}

.publish-options-popup .option-section {
  margin-bottom: 28px;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
}

.publish-options-popup .option-section h4 {
  font-size: 16px;
  margin: 0 0 16px 0;
  color: var(--text-color);
  display: flex;
  align-items: center;
}

.publish-options-popup .option-section h4::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 16px;
  background-color: var(--blue-color);
  margin-right: 8px;
  border-radius: 2px;
}

.publish-options-popup .style-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 12px;
}

.publish-options-popup .style-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 12px 8px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.publish-options-popup .style-option .van-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.publish-options-popup .style-option.active {
  color: var(--blue-color);
  background-color: rgba(25, 137, 250, 0.1);
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
  transform: translateY(-2px);
}

.publish-options-popup .style-option span {
  font-size: 12px;
  text-align: center;
}

.publish-options-popup .van-checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.publish-options-popup .van-checkbox {
  margin-bottom: 0;
}

.publish-options-popup .publish-actions {
  position: sticky;
  bottom: 0;
  background-color: #fff;
  padding: 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  margin: 0 -16px -16px -16px;
  z-index: 1;
}

.publish-options-popup .publish-actions .van-button {
  height: 44px;
  border-radius: 22px;
  font-weight: bold;
}

/* User input section styles */
.user-input-section {
  margin-bottom: 24px;
}

.content-input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-textarea {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
}

.generate-btn {
  align-self: flex-end;
  border-radius: 20px;
  padding: 0 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
  transition: all 0.2s ease;
}

.generate-btn:active {
  transform: scale(0.97);
}

.publish-options-popup .enhancement-options {
  border-radius: 12px;
  overflow: hidden;
}

.preview-section {
  border: none;
  background-color: transparent;
  padding: 0;
}

.preview-container {
  margin-top: 0;
  padding: 0;
  background-color: transparent;
  box-shadow: none;
}

.preview-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  border: 1px solid #eee;
}

.preview-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: var(--blue-color);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-style-tag {
  padding: 4px 10px;
  background-color: var(--blue-color);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  text-transform: capitalize;
  letter-spacing: 0.5px;
}

.preview-action-icon {
  font-size: 18px;
  color: #888;
}

.preview-content {
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.preview-hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: var(--blue-color);
}

.preview-hashtags span {
  background-color: rgba(25, 137, 250, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}

.preview-image {
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* Ensure good spacing at bottom for iOS safe area */
@supports (padding: max(0px)) {
  .publish-options-popup {
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
  
  .publish-options-popup .publish-actions {
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
}

/* Additional mobile optimizations */
@media (max-width: 480px) {
  .publish-options-popup .option-section {
    padding: 12px;
  }
  
  .preview-card {
    border-radius: 8px;
  }
  
  .content-input-container {
    gap: 8px;
  }
  
  .generate-btn {
    font-size: 12px;
    padding: 0 12px;
  }
}

/* 全局响应式调整 */
@media screen and (max-width: 320px) {
  .content-area {
    font-size: 14px;
  }
}

@media screen and (min-width: 375px) {
  .content-area {
    max-width: 480px;
    margin: 0 auto;
  }
}

/* 适配横屏 */
@media screen and (orientation: landscape) {
  .app-container {
    max-width: 480px;
    margin: 0 auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}
</style>

<script>
// 修复移动端100vh问题
document.addEventListener('DOMContentLoaded', () => {
  const setVhVariable = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVhVariable();
  window.addEventListener('resize', setVhVariable);
  window.addEventListener('orientationchange', setVhVariable);
});
</script>
