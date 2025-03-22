<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { couponsData } from '@/mock/data';
import { formatReadableDate, generateId, getToday, addDays, isCouponValid } from '@/utils/helpers';

const coupons = ref([]);
const loading = ref(true);
const showNewCouponForm = ref(false);
const showPlatformPicker = ref(false);
const showPublishOptions = ref(false);
const isCreating = ref(false);
const isPublishing = ref(false);
const selectedStyle = ref('professional');
const selectedPlatforms = ref([]);
const enhanceOptions = ref({
  optimizeText: true,
  addHashtags: true,
  generateImage: false
});

const userInputContent = ref('');
const aiGeneratedContent = ref('');
const isGeneratingContent = ref(false);

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

// Content style options
const contentStyles = [
  { label: 'Professional', value: 'professional', icon: 'manager-o' },
  { label: 'Friendly', value: 'friendly', icon: 'smile-o' },
  { label: 'Promotional', value: 'promotional', icon: 'gift-o' },
  { label: 'Formal', value: 'formal', icon: 'certificate' }
];

const newCoupon = ref({
  title: '',
  description: '',
  platform: '',
  validFrom: getToday(),
  validTo: addDays(getToday(), 30),
  code: '',
  discount: '',
  published: false
});

// Fetch coupons data
onMounted(() => {
  setTimeout(() => {
    coupons.value = couponsData;
    loading.value = false;
    
    // Pre-select all platforms by default
    selectedPlatforms.value = platformOptions.map(platform => platform.value);
  }, 800);
});

// Available platforms for coupons
const platformOptions = [
  { text: 'Meituan', value: 'Meituan' },
  { text: 'Dianping', value: 'Dianping' },
  { text: 'Ele.me', value: 'Ele.me' },
  { text: 'All Platforms', value: 'All Platforms' }
];

// Configure picker columns
const platforms = [{
  values: platformOptions
}];

// Active coupons
const activeCoupons = computed(() => {
  return coupons.value.filter(coupon => isCouponValid(coupon) && coupon.published);
});

// Inactive coupons (expired or not published)
const inactiveCoupons = computed(() => {
  return coupons.value.filter(coupon => !isCouponValid(coupon) || !coupon.published);
});

// Format date for display
const formatDate = (date) => {
  return formatReadableDate(date);
};

// Handle coupon creation
const createCoupon = () => {
  if (!validateCoupon()) {
    return;
  }
  
  isCreating.value = true;
  
  // Simulate API call
  setTimeout(() => {
    const couponToAdd = {
      ...newCoupon.value,
      id: generateId()
    };
    
    coupons.value.push(couponToAdd);
    
    // Reset form
    resetForm();
    
    isCreating.value = false;
    showNewCouponForm.value = false;
    
    // Show success message
    showSuccessToast('Coupon created successfully!');
  }, 1500);
};

// Validate coupon before creation
const validateCoupon = () => {
  if (!newCoupon.value.title) {
    showErrorToast('Please enter a coupon title');
    return false;
  }
  
  if (!newCoupon.value.description) {
    showErrorToast('Please enter a coupon description');
    return false;
  }
  
  if (!newCoupon.value.platform) {
    showErrorToast('Please select a platform');
    return false;
  }
  
  if (!newCoupon.value.discount) {
    showErrorToast('Please enter a discount value');
    return false;
  }
  
  if (!newCoupon.value.code) {
    showErrorToast('Please enter a coupon code');
    return false;
  }
  
  return true;
};

// Reset form fields
const resetForm = () => {
  newCoupon.value = {
    title: '',
    description: '',
    platform: '',
    validFrom: getToday(),
    validTo: addDays(getToday(), 30),
    code: '',
    discount: '',
    published: false
  };
};

// Toggle coupon publish status
const togglePublishStatus = (coupon) => {
  const index = coupons.value.findIndex(c => c.id === coupon.id);
  if (index !== -1) {
    coupons.value[index].published = !coupons.value[index].published;
    
    // Show success message
    showSuccessToast(`Coupon ${coupons.value[index].published ? 'published' : 'unpublished'} successfully!`);
  }
};

// Delete a coupon
const deleteCoupon = (coupon) => {
  import('vant').then(({ showDialog }) => {
    showDialog({
      title: 'Delete Coupon',
      message: 'Are you sure you want to delete this coupon?',
      showCancelButton: true,
    }).then(() => {
      const index = coupons.value.findIndex(c => c.id === coupon.id);
      if (index !== -1) {
        coupons.value.splice(index, 1);
        
        // Show success message
        showSuccessToast('Coupon deleted successfully!');
      }
    }).catch(() => {
      // User canceled
    });
  });
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

// 处理平台选择
const onConfirmPlatform = (values) => {
  // The values parameter contains selected values for each column
  // Since we have only one column, we access the first item
  const selectedPlatform = values[0];
  newCoupon.value.platform = selectedPlatform.value || selectedPlatform;
  showPlatformPicker.value = false;
};

const onCancelPlatform = () => {
  showPlatformPicker.value = false;
};

// Show platform picker
const showPlatformPickerDialog = () => {
  showPlatformPicker.value = true;
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
    
    // Reset selected platforms
    // selectedPlatforms.value = [];
  }, 2000);
};
</script>

<template>
  <div class="coupons-container">
    <van-nav-bar
      title="Coupons"
      left-arrow
      fixed
      placeholder
      @click-left="$router.go(-1)"
    />

    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" color="var(--primary-color)" size="24px" />
      <p>Loading your coupons...</p>
    </div>

    <template v-else>
      <div class="coupons-header">
        <h2>Marketing Coupons</h2>
        <van-button 
          size="small" 
          type="primary" 
          icon="plus" 
          round
          @click="showNewCouponForm = true"
        >
          New Coupon
        </van-button>
      </div>

      <!-- Active coupons section -->
      <div class="coupons-section">
        <h3>Active Coupons</h3>
        
        <div v-if="activeCoupons.length === 0" class="empty-state">
          <van-empty description="No active coupons" />
          <p>Create and publish coupons to see them here.</p>
        </div>
        
        <div v-else class="coupon-list">
          <div 
            v-for="coupon in activeCoupons" 
            :key="coupon.id"
            class="coupon-card"
          >
            <div class="coupon-info">
              <div class="coupon-platform">{{ coupon.platform }}</div>
              <h4>{{ coupon.title }}</h4>
              <p class="coupon-description">{{ coupon.description }}</p>
              <div class="coupon-dates">
                <span>Valid: {{ formatDate(coupon.validFrom) }} - {{ formatDate(coupon.validTo) }}</span>
              </div>
              <div class="coupon-code">
                Code: <strong>{{ coupon.code }}</strong>
              </div>
            </div>
            <div class="coupon-actions">
              <van-button 
                size="small" 
                type="danger" 
                plain
                @click="togglePublishStatus(coupon)"
              >
                Unpublish
              </van-button>
              <van-button 
                size="small" 
                plain
                @click="deleteCoupon(coupon)"
              >
                Delete
              </van-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Inactive coupons section -->
      <div class="coupons-section" v-if="inactiveCoupons.length > 0">
        <h3>Inactive Coupons</h3>
        
        <div class="coupon-list">
          <div 
            v-for="coupon in inactiveCoupons" 
            :key="coupon.id"
            class="coupon-card inactive"
          >
            <div class="coupon-info">
              <div class="coupon-platform">{{ coupon.platform }}</div>
              <h4>{{ coupon.title }}</h4>
              <p class="coupon-description">{{ coupon.description }}</p>
              <div class="coupon-dates">
                <span>Valid: {{ formatDate(coupon.validFrom) }} - {{ formatDate(coupon.validTo) }}</span>
              </div>
              <div class="coupon-code">
                Code: <strong>{{ coupon.code }}</strong>
              </div>
              <div class="coupon-status">
                <span v-if="!coupon.published" class="status-tag">Not Published</span>
                <span v-else-if="!isCouponValid(coupon)" class="status-tag">Expired</span>
              </div>
            </div>
            <div class="coupon-actions">
              <van-button 
                size="small" 
                type="primary" 
                plain
                @click="togglePublishStatus(coupon)"
                v-if="!coupon.published && isCouponValid(coupon)"
              >
                Publish
              </van-button>
              <van-button 
                size="small" 
                plain
                @click="deleteCoupon(coupon)"
              >
                Delete
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- New coupon popup -->
    <van-popup 
      v-model:show="showNewCouponForm" 
      position="bottom" 
      round 
      :style="{ height: '85%' }"
    >
      <div class="coupon-form">
        <div class="popup-header">
          <h2>Create New Coupon</h2>
          <van-icon name="cross" @click="showNewCouponForm = false" />
        </div>

        <van-form @submit.prevent="createCoupon">
          <van-cell-group inset>
            <van-field
              v-model="newCoupon.title"
              name="title"
              label="Coupon Title"
              placeholder="e.g. 20% Off Your First Order"
              required
            />
            
            <van-field
              v-model="newCoupon.description"
              rows="2"
              autosize
              type="textarea"
              name="description"
              label="Description"
              placeholder="Enter coupon description"
              required
            />
            
            <van-field
              v-model="newCoupon.platform"
              name="platform"
              label="Platform"
              placeholder="Select Platform"
              readonly
              required
              @click="showPlatformPickerDialog"
            />
            
            <van-field
              v-model="newCoupon.validFrom"
              name="validFrom"
              label="Valid From"
              type="date"
              required
            />
            
            <van-field
              v-model="newCoupon.validTo"
              name="validTo"
              label="Valid To"
              type="date"
              required
            />
            
            <van-field
              v-model="newCoupon.code"
              name="code"
              label="Coupon Code"
              placeholder="e.g. WELCOME20"
              required
            />
            
            <van-field
              v-model="newCoupon.discount"
              name="discount"
              label="Discount"
              placeholder="e.g. 20% or Free Item"
              required
            />
            
            <van-field name="published" label="Publish Immediately">
              <template #input>
                <van-switch v-model="newCoupon.published" />
              </template>
            </van-field>
          </van-cell-group>
          
          <div style="margin: 16px;">
            <van-button 
              round 
              block 
              type="primary" 
              native-type="submit"
              :loading="isCreating"
            >
              {{ isCreating ? 'Creating...' : 'Create Coupon' }}
            </van-button>
            <van-button 
              round 
              block 
              plain 
              style="margin-top: 10px;"
              @click="showNewCouponForm = false"
            >
              Cancel
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 平台选择器弹窗 -->
    <van-popup
      v-model:show="showPlatformPicker"
      position="bottom"
      round
      safe-area-inset-bottom
      closeable
      class="platform-picker-popup"
    >
      <van-picker
        :columns="platforms"
        @confirm="onConfirmPlatform"
        @cancel="onCancelPlatform"
        show-toolbar
        title="Select Platform"
      />
    </van-popup>

    <!-- Universal publish button -->
    <!-- <div class="universal-publish-btn">
      <van-button
        type="primary"
        size="large"
        round
        icon="share-o"
        @click="showPublishOptions = true"
      >
        One-Click Publish
      </van-button>
    </div> -->

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
              placeholder="Enter your coupon details or promotional content here..."
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

<style scoped>
.coupons-container {
  padding: 16px;
  padding-bottom: 70px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.coupons-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.coupons-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-color);
}

.coupons-section {
  margin-bottom: 24px;
}

.coupons-section h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: var(--text-color);
}

.empty-state {
  text-align: center;
  padding: 24px 0;
}

.empty-state p {
  color: #666;
  margin-top: 8px;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid var(--primary-color);
}

.coupon-card.inactive {
  border-left: 4px solid #ccc;
  opacity: 0.8;
}

.coupon-platform {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.coupon-info h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: var(--text-color);
}

.coupon-description {
  margin: 0 0 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.coupon-dates {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.coupon-code {
  font-size: 14px;
  margin-bottom: 8px;
}

.coupon-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.coupon-status {
  margin-top: 8px;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: #f2f2f2;
  color: #666;
  border-radius: 10px;
  font-size: 12px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.popup-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.popup-header .van-icon {
  font-size: 20px;
  color: #999;
}

.coupon-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Platform picker customization */
.platform-picker-popup {
  height: auto;
}

.platform-picker-popup .van-picker {
  width: 100%;
}

/* Universal publish button customization */
.universal-publish-btn {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 80%;
  max-width: 300px;
}

.universal-publish-btn .van-button {
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 16px rgba(var(--primary-color-rgb, 0, 122, 255), 0.4);
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
}

.universal-publish-btn .van-button:active {
  transform: scale(0.97);
}

.universal-publish-btn .van-button .van-icon {
  font-size: 20px;
  margin-right: 8px;
}

/* Universal publish options popup customization */
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
}

.publish-options-popup .popup-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.publish-options-popup .publish-options-content {
  padding: 16px;
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
  background-color: var(--primary-color);
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
  color: var(--primary-color);
  background-color: rgba(var(--primary-color-rgb, 0, 122, 255), 0.1);
  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb, 0, 122, 255), 0.2);
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
}

.publish-options-popup .publish-actions .van-button {
  height: 44px;
  border-radius: 22px;
  font-weight: bold;
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
  background-color: var(--primary-color);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-style-tag {
  padding: 4px 10px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  text-transform: capitalize;
  letter-spacing: 0.5px;
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
  color: var(--primary-color);
}

.preview-hashtags span {
  background-color: rgba(var(--primary-color-rgb, 0, 122, 255), 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}

/* Make the form more mobile friendly */
.van-cell-group {
  margin-bottom: 16px;
}

/* Media queries for better mobile responsiveness */
@media (max-width: 375px) {
  .publish-options-popup .style-options {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .publish-options-popup .van-checkbox-group {
    grid-template-columns: 1fr;
  }
}

.publish-options-popup .section-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 20px;
  color: var(--text-color);
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

.preview-action-icon {
  font-size: 18px;
  color: #888;
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

/* Fix for dark mode compatibility */
.universal-publish-btn .van-button {
  --button-primary-background-color: var(--primary-color);
  --button-primary-border-color: var(--primary-color);
}

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
  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb, 0, 122, 255), 0.2);
  transition: all 0.2s ease;
}

.generate-btn:active {
  transform: scale(0.97);
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

@media (max-width: 480px) {
  .content-input-container {
    gap: 8px;
  }
  
  .generate-btn {
    font-size: 12px;
    padding: 0 12px;
  }
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
</style> 