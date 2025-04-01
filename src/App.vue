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

// 媒体上传相关的状态变量
const imageFileList = ref([]);
const videoFileList = ref([]);
const uploadingMedia = ref(false);
const activeMediaTab = ref('image'); // 'image' 或 'video'

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
  { text: 'Facebook', value: 'Facebook' },
  { text: 'Instagram', value: 'Instagram' },
  { text: 'Twitter', value: 'Twitter' },
  { text: 'TikTok', value: 'TikTok' },
  { text: 'Google Business', value: 'GoogleBusiness' },
  { text: 'LinkedIn', value: 'LinkedIn' },
  { text: 'All Platforms', value: 'AllPlatforms' }
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
    showErrorToast('Please enter content to enhance');
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

// 处理图片上传
const onImageUploaded = (file) => {
  // 这里通常会上传到服务器
  // 在演示中，我们只是在本地处理
  if (file.file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = () => {
      file.content = reader.result;
      imageFileList.value.push(file);
      
      // 如果AI生成图片选项打开，关闭该选项
      if (enhanceOptions.value.generateImage) {
        enhanceOptions.value.generateImage = false;
      }
    };
  } else {
    showErrorToast('Please upload an image file');
    return false; // 阻止文件添加到列表
  }
};

// 处理视频上传
const onVideoUploaded = (file) => {
  // 验证视频文件
  if (file.file.type.startsWith('video/')) {
    // 检查文件大小，限制为100MB
    if (file.file.size > 100 * 1024 * 1024) {
      showErrorToast('Video size cannot exceed 100MB');
      return false;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = () => {
      file.content = reader.result;
      videoFileList.value.push(file);
    };
  } else {
    showErrorToast('Please upload a video file');
    return false; // 阻止文件添加到列表
  }
};

// 删除已上传的媒体文件
const removeMedia = (file, fileList, type) => {
  const index = fileList.findIndex(item => item.uid === file.uid);
  if (index !== -1) {
    fileList.splice(index, 1);
  }
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
    
    // 准备发布信息
    let mediaInfo = '';
    if (imageFileList.value.length > 0) {
      mediaInfo += ` including ${imageFileList.value.length} image${imageFileList.value.length > 1 ? 's' : ''}`;
    }
    if (videoFileList.value.length > 0) {
      mediaInfo += ` including ${videoFileList.value.length} video${videoFileList.value.length > 1 ? 's' : ''}`;
    }
    
    // Show success message
    showSuccessToast(`Successfully published to ${selectedPlatforms.value.length} platform${selectedPlatforms.value.length > 1 ? 's' : ''} with ${selectedStyle.value} style${mediaInfo}!`);
    
    // 重置媒体上传状态
    imageFileList.value = [];
    videoFileList.value = [];
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
        <h2>One-Click Publish</h2>
        <van-icon name="cross" @click="showPublishOptions = false" />
      </div>

      <div class="publish-options-content">
        <h3 class="section-title">Content Editing Options</h3>
        
        <div class="option-section user-input-section">
          <h4>Your Content</h4>
          <div class="content-input-container">
            <van-field
              v-model="userInputContent"
              type="textarea"
              rows="4"
              placeholder="Enter your promotion or content to publish..."
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
        
        <!-- 新增媒体上传部分 -->
        <div class="option-section media-upload-section">
          <h4>Upload Media</h4>
          <div class="media-tabs">
            <div 
              :class="['media-tab', { active: activeMediaTab === 'image' }]" 
              @click="activeMediaTab = 'image'"
            >
              <van-icon name="photo-o" />
              <span>Images</span>
            </div>
            <div 
              :class="['media-tab', { active: activeMediaTab === 'video' }]" 
              @click="activeMediaTab = 'video'"
            >
              <van-icon name="video-o" />
              <span>Videos</span>
            </div>
          </div>
          
          <div class="media-content">
            <div v-show="activeMediaTab === 'image'" class="image-uploader">
              <van-uploader
                v-model:file-list="imageFileList"
                multiple
                :max-count="9"
                :after-read="onImageUploaded"
                :before-delete="(file) => removeMedia(file, imageFileList, 'image')"
                preview-size="80px"
                upload-text="Upload Images"
                accept="image/*"
              >
                <template #upload>
                  <div class="upload-trigger">
                    <van-icon name="photograph" />
                    <span>Upload Images</span>
                  </div>
                </template>
              </van-uploader>
              <div class="upload-tips" v-if="imageFileList.length > 0">
                {{ imageFileList.length }} image{{ imageFileList.length > 1 ? 's' : '' }} selected
              </div>
            </div>
            
            <div v-show="activeMediaTab === 'video'" class="video-uploader">
              <van-uploader
                v-model:file-list="videoFileList"
                multiple
                :max-count="3"
                :after-read="onVideoUploaded"
                :before-delete="(file) => removeMedia(file, videoFileList, 'video')"
                preview-size="120px"
                upload-text="Upload Videos"
                accept="video/*"
              >
                <template #upload>
                  <div class="upload-trigger video-trigger">
                    <van-icon name="video-o" />
                    <span>Upload Videos</span>
                    <div class="upload-tip">Supports mp4, mov formats, max 100MB</div>
                  </div>
                </template>
              </van-uploader>
              <div class="upload-tips" v-if="videoFileList.length > 0">
                {{ videoFileList.length }} video{{ videoFileList.length > 1 ? 's' : '' }} selected
              </div>
            </div>
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
          <van-checkbox-group v-model="selectedPlatforms" class="platform-checkbox-group">
            <van-checkbox 
              v-for="platform in platformOptions"
              :key="platform.value"
              :name="platform.value"
              checked-color="var(--primary-color)"
              class="platform-checkbox"
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
            <van-cell center title="Generate matching image" :disabled="imageFileList.length > 0">
              <template #right-icon>
                <van-switch 
                  v-model="enhanceOptions.generateImage" 
                  size="24" 
                  active-color="var(--primary-color)"
                  :disabled="imageFileList.length > 0"
                />
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
              
              <!-- 显示已上传图片的预览 -->
              <div v-if="imageFileList.length > 0" class="preview-uploaded-images">
                <div class="media-preview-label">Uploaded Images:</div>
                <div class="image-preview-grid">
                  <div v-for="(image, index) in imageFileList" :key="index" class="image-preview-item">
                    <van-image 
                      :src="image.content || image.url" 
                      fit="cover"
                      width="60" 
                      height="60"
                    />
                  </div>
                </div>
              </div>
              
              <!-- 显示已上传视频的预览 -->
              <div v-if="videoFileList.length > 0" class="preview-uploaded-videos">
                <div class="media-preview-label">Uploaded Videos:</div>
                <div class="video-preview-list">
                  <div v-for="(video, index) in videoFileList" :key="index" class="video-preview-item">
                    <div class="video-placeholder">
                      <van-icon name="video-o" size="24" />
                      <span>Video {{ index + 1 }}</span>
                    </div>
                  </div>
                </div>
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

.style-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 8px;
  padding: 12px 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.style-option .van-icon {
  font-size: 24px;
  margin-bottom: 6px;
  color: #888;
}

.style-option span {
  font-size: 14px;
  color: #666;
}

.style-option.active {
  background-color: rgba(var(--primary-color-rgb, 255, 107, 107), 0.1);
  border: 1px solid var(--primary-color);
}

.style-option.active .van-icon,
.style-option.active span {
  color: var(--primary-color);
}

.content-input-container {
  display: flex;
  flex-direction: column;
}

.content-textarea {
  background-color: white;
  border-radius: 8px;
  margin-bottom: 12px;
}

.generate-btn {
  align-self: flex-end;
}

.enhancement-options {
  background-color: white;
  border-radius: 8px;
}

.preview-container {
  margin-top: 16px;
}

.preview-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.preview-style-tag {
  font-size: 14px;
  color: var(--blue-color);
  font-weight: 500;
  text-transform: capitalize;
}

.preview-action-icon {
  font-size: 20px;
  color: #999;
}

.preview-content {
  padding: 16px;
  color: var(--text-color);
  line-height: 1.5;
  font-size: 15px;
}

.preview-hashtags {
  padding: 0 16px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-hashtags span {
  background-color: rgba(var(--blue-color-rgb, 25, 137, 250), 0.1);
  color: var(--blue-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.preview-image {
  width: 100%;
  height: auto;
}

.preview-image img {
  width: 100%;
  display: block;
}

.publish-actions {
  margin-top: 24px;
}

/* 媒体上传相关样式 */
.media-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.media-tab {
  padding: 8px 16px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}

.media-tab .van-icon {
  font-size: 18px;
  margin-right: 4px;
  color: #999;
}

.media-tab span {
  font-size: 14px;
  color: #666;
}

.media-tab.active {
  border-bottom-color: var(--primary-color);
}

.media-tab.active .van-icon,
.media-tab.active span {
  color: var(--primary-color);
}

.upload-trigger {
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px dashed #ddd;
  border-radius: 8px;
}

.upload-trigger.video-trigger {
  width: 120px;
  height: 120px;
}

.upload-trigger .van-icon {
  font-size: 24px;
  color: #999;
  margin-bottom: 4px;
}

.upload-trigger span {
  font-size: 12px;
  color: #999;
}

.upload-tip {
  font-size: 10px;
  color: #999;
  margin-top: 4px;
  text-align: center;
}

.upload-tips {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.video-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.video-placeholder {
  width: 100px;
  height: 60px;
  background-color: #f0f0f0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.video-placeholder .van-icon {
  color: #999;
  margin-bottom: 4px;
}

.video-placeholder span {
  font-size: 12px;
  color: #666;
}

.media-preview-label {
  font-size: 13px;
  color: #666;
  margin-top: 12px;
  margin-bottom: 4px;
}

.preview-uploaded-images,
.preview-uploaded-videos {
  padding: 0 16px;
}

/* Platform styling */
.platform-checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.platform-checkbox {
  margin-bottom: 0;
  font-size: 14px;
}

.platform-checkbox .van-checkbox__label {
  font-size: 14px;
  color: var(--text-color);
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
