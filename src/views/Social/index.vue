<script setup>
import { ref, computed, onMounted } from 'vue';
import { socialPlatformsData } from '@/mock/data';

const platforms = ref([]);
const loading = ref(true);
const newPost = ref({
  content: '',
  selectedPlatforms: []
});
const fileList = ref([]);
const isPosting = ref(false);
const showPostForm = ref(false);

// Fetch platforms data
onMounted(() => {
  setTimeout(() => {
    platforms.value = socialPlatformsData;
    loading.value = false;
  }, 800);
});

// Filter connected platforms
const connectedPlatforms = computed(() => {
  return platforms.value.filter(platform => platform.connected);
});

// Filter non-connected platforms
const nonConnectedPlatforms = computed(() => {
  return platforms.value.filter(platform => !platform.connected);
});

// Handle platform connection
const connectPlatform = (platform) => {
  // This would normally open an OAuth flow
  // For demo, we'll just update the local state
  import('vant').then(({ showDialog }) => {
    showDialog({
      title: 'Connect Account',
      message: `Would you like to connect your ${platform.name} account?`,
      showCancelButton: true,
    }).then(() => {
      // Update platform state on confirm
      const index = platforms.value.findIndex(p => p.id === platform.id);
      if (index !== -1) {
        platforms.value[index].connected = true;
        platforms.value[index].username = `@restaurant_${platform.name.toLowerCase()}`;
        
        // Show success message
        showSuccessToast(`${platform.name} connected successfully!`);
      }
    }).catch(() => {
      // User canceled
    });
  });
};

// Disconnect platform
const disconnectPlatform = (platform) => {
  import('vant').then(({ showDialog }) => {
    showDialog({
      title: 'Disconnect Account',
      message: `Are you sure you want to disconnect your ${platform.name} account?`,
      showCancelButton: true,
    }).then(() => {
      // Update platform state on confirm
      const index = platforms.value.findIndex(p => p.id === platform.id);
      if (index !== -1) {
        platforms.value[index].connected = false;
        platforms.value[index].username = '';
        
        // Show success message
        showSuccessToast(`${platform.name} disconnected successfully!`);
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

// Handle image upload
const onImageUploaded = (file) => {
  // This would normally upload the file to a server
  // For demo, we'll just store it locally
  const reader = new FileReader();
  reader.readAsDataURL(file.file);
  reader.onload = () => {
    file.content = reader.result;
    fileList.value = [file];
  };
};

// Submit new post
const submitPost = () => {
  if (newPost.value.content.trim() === '' && fileList.value.length === 0) {
    showErrorToast('Please add some content or an image to your post');
    return;
  }
  
  if (newPost.value.selectedPlatforms.length === 0) {
    showErrorToast('Please select at least one platform');
    return;
  }
  
  isPosting.value = true;
  
  // Simulate API call
  setTimeout(() => {
    isPosting.value = false;
    
    // Show success toast
    showSuccessToast('Post scheduled successfully!');
    
    // Reset form
    newPost.value = {
      content: '',
      selectedPlatforms: []
    };
    fileList.value = [];
    
    showPostForm.value = false;
  }, 1500);
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
  <div class="social-container">
    <van-nav-bar
      title="Social Media"
      left-arrow
      fixed
      placeholder
      @click-left="$router.go(-1)"
    />

    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" color="var(--primary-color)" size="24px" />
      <p>Loading your social accounts...</p>
    </div>

    <template v-else>
      <!-- Notice about account management moved to Profile -->
      <div class="notice-card">
        <van-icon name="info-o" class="notice-icon" />
        <div class="notice-content">
          <h3>Social Media Account Management Moved to Profile</h3>
          <p>You can now manage all your social media account connections in the Profile page.</p>
          <van-button 
            type="primary" 
            size="small" 
            icon="arrow" 
            to="/profile"
            class="notice-button"
          >
            Go to Profile
          </van-button>
        </div>
      </div>

      <!-- Connected platforms -->
      <div class="platform-section">
        <div class="section-header">
          <h2>Connected Accounts</h2>
          <van-button 
            size="small" 
            type="primary" 
            icon="plus" 
            round
            @click="showPostForm = true"
            v-if="connectedPlatforms.length > 0"
          >
            New Post
          </van-button>
        </div>

        <div v-if="connectedPlatforms.length === 0" class="empty-state">
          <van-empty description="No connected accounts" />
          <p>Connect your social media accounts to post content.</p>
        </div>

        <div v-else class="platform-list">
          <div 
            v-for="platform in connectedPlatforms" 
            :key="platform.id"
            class="platform-card"
          >
            <div class="platform-info">
              <div class="platform-icon">
                <van-image :src="platform.icon" round width="40" height="40" />
              </div>
              <div class="platform-details">
                <h3>{{ platform.name }}</h3>
                <p class="platform-username">{{ platform.username }}</p>
              </div>
            </div>
            <van-button 
              size="small" 
              plain 
              to="/profile"
            >
              Manage Account
            </van-button>
          </div>
        </div>
      </div>

      <!-- Available platforms -->
      <div class="platform-section" v-if="nonConnectedPlatforms.length > 0">
        <div class="section-header">
          <h2>Available Platforms</h2>
        </div>

        <div class="platform-list">
          <div 
            v-for="platform in nonConnectedPlatforms" 
            :key="platform.id"
            class="platform-card"
          >
            <div class="platform-info">
              <div class="platform-icon">
                <van-image :src="platform.icon" round width="40" height="40" />
              </div>
              <div class="platform-details">
                <h3>{{ platform.name }}</h3>
                <p class="platform-connect">Connect to post content</p>
              </div>
            </div>
            <van-button 
              size="small" 
              type="primary" 
              plain 
              to="/profile"
            >
              Go to Connect
            </van-button>
          </div>
        </div>
      </div>
    </template>

    <!-- New post popup -->
    <van-popup 
      v-model:show="showPostForm" 
      position="bottom" 
      round 
      closeable
      class="post-form-popup"
    >
      <div class="post-form">
        <div class="popup-header">
          <h2>Create New Post</h2>
          <van-icon name="cross" @click="showPostForm = false" />
        </div>

        <van-form @submit.prevent="submitPost">
          <div class="platform-selection">
            <h3>Select Platforms</h3>
            <div class="selection-chips">
              <van-checkbox-group v-model="newPost.selectedPlatforms">
                <van-checkbox 
                  v-for="platform in connectedPlatforms" 
                  :key="platform.id"
                  :name="platform.id"
                  shape="square"
                >
                  {{ platform.name }}
                </van-checkbox>
              </van-checkbox-group>
            </div>
          </div>

          <div class="post-content">
            <van-field
              v-model="newPost.content"
              rows="4"
              autosize
              type="textarea"
              placeholder="What would you like to share about your restaurant?"
            />
          </div>

          <div class="post-image">
            <van-uploader
              v-model:file-list="fileList"
              :max-count="1"
              :after-read="onImageUploaded"
            >
              <div class="uploader-btn">
                <van-icon name="photograph" />
                <span>Add Photo</span>
              </div>
            </van-uploader>
          </div>

          <div class="form-actions">
            <van-button 
              round 
              block 
              type="primary" 
              native-type="submit"
              :loading="isPosting"
            >
              {{ isPosting ? 'Posting...' : 'Post Now' }}
            </van-button>
            <van-button 
              round 
              block 
              plain 
              style="margin-top: 10px;"
              @click="showPostForm = false"
            >
              Cancel
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
.social-container {
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

.platform-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 18px;
  margin: 0;
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

.platform-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.platform-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.platform-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.platform-details h3 {
  margin: 0 0 4px;
  font-size: 16px;
  color: var(--text-color);
}

.platform-username {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.platform-connect {
  margin: 0;
  font-size: 14px;
  color: #999;
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

.post-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.platform-selection {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.platform-selection h3 {
  margin: 0 0 12px;
  font-size: 16px;
  color: var(--text-color);
}

.selection-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.post-content {
  padding: 16px;
  flex-grow: 1;
}

.post-image {
  padding: 0 16px 16px;
}

.uploader-btn {
  width: 100%;
  height: 80px;
  background-color: var(--light-bg);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
}

.uploader-btn .van-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.form-actions {
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

/* Add new styles for the notice card */
.notice-card {
  margin: 16px 16px 24px;
  background-color: rgba(25, 137, 250, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  border-left: 4px solid var(--blue-color);
}

.notice-icon {
  font-size: 24px;
  color: var(--blue-color);
  margin-right: 12px;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
}

.notice-content h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: var(--text-color);
}

.notice-content p {
  margin: 0 0 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.notice-button {
  margin-top: 8px;
}
</style> 