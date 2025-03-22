<script setup>
import { ref, onMounted, computed } from 'vue';
import { restaurantData, socialPlatformsData } from '@/mock/data';

const restaurant = ref(null);
const loading = ref(true);
const form = ref({
  name: '',
  description: '',
  address: '',
  phone: '',
  businessHours: '',
  tags: []
});
const isEditing = ref(false);
const isSaving = ref(false);
const platforms = ref([]);

// Fetch restaurant data
onMounted(() => {
  setTimeout(() => {
    restaurant.value = restaurantData;
    platforms.value = socialPlatformsData;
    // Copy data to form
    form.value = {
      name: restaurantData.name,
      description: restaurantData.description,
      address: restaurantData.address,
      phone: restaurantData.phone,
      businessHours: restaurantData.businessHours,
      tags: [...restaurantData.tags]
    };
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

// Start editing profile
const startEditing = () => {
  isEditing.value = true;
};

// Cancel editing
const cancelEditing = () => {
  // Reset form to original values
  form.value = {
    name: restaurant.value.name,
    description: restaurant.value.description,
    address: restaurant.value.address,
    phone: restaurant.value.phone,
    businessHours: restaurant.value.businessHours,
    tags: [...restaurant.value.tags]
  };
  isEditing.value = false;
};

// Save profile changes
const saveProfile = () => {
  isSaving.value = true;
  
  // Simulate API call
  setTimeout(() => {
    // Update restaurant data
    restaurant.value = {
      ...restaurant.value,
      ...form.value
    };
    
    isSaving.value = false;
    isEditing.value = false;
    
    // Show success message
    showSuccessToast('Profile updated successfully!');
  }, 1500);
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

// Add new tag
const addTag = () => {
  if (!form.value.newTag) return;
  
  if (!form.value.tags.includes(form.value.newTag)) {
    form.value.tags.push(form.value.newTag);
  }
  
  form.value.newTag = '';
};

// Remove tag
const removeTag = (tagIndex) => {
  form.value.tags.splice(tagIndex, 1);
};

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

// Log out function
const logOut = () => {
  import('vant').then(({ showDialog }) => {
    showDialog({
      title: 'Log Out',
      message: 'Are you sure you want to log out?',
      showCancelButton: true,
    }).then(() => {
      // Simulate logout
      showSuccessToast('You have been logged out');
      // This would normally clear session and redirect to login
    }).catch(() => {
      // User canceled
    });
  });
};
</script>

<template>
  <div class="profile-container">
    <van-nav-bar
      title="My Profile"
      left-arrow
      fixed
      placeholder
      @click-left="$router.go(-1)"
    />

    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" color="var(--primary-color)" size="24px" />
      <p>Loading...</p>
    </div>

    <template v-else>
      <!-- Profile header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <van-image :src="restaurant.logo" width="80" height="80" round />
        </div>
        <h2>{{ restaurant.name }}</h2>
        <p class="rating">
          <van-icon name="star" color="#FFD700" />
          <span>{{ restaurant.rating }} ({{ restaurant.reviewCount }} reviews)</span>
        </p>
      </div>

      <!-- Profile form -->
      <div class="profile-form">
        <template v-if="isEditing">
          <van-form @submit.prevent="saveProfile">
            <van-cell-group inset>
              <van-field
                v-model="form.name"
                label="Restaurant Name"
                placeholder="Enter your restaurant name"
                required
              />
              
              <van-field
                v-model="form.description"
                rows="3"
                autosize
                type="textarea"
                label="Description"
                placeholder="Describe your restaurant features"
                required
              />
              
              <van-field
                v-model="form.address"
                label="Address"
                placeholder="Enter your address"
                required
              />
              
              <van-field
                v-model="form.phone"
                label="Phone"
                placeholder="Enter your phone number"
                required
              />
              
              <van-field
                v-model="form.businessHours"
                label="Business Hours"
                placeholder="e.g. Mon-Fri: 9:00-21:00"
                required
              />
              
              <van-field
                v-model="form.newTag"
                label="Tags"
                placeholder="Add a tag and press Enter"
                @keyup.enter="addTag"
              />
              
              <div class="tags-container">
                <div 
                  v-for="(tag, index) in form.tags" 
                  :key="index"
                  class="tag-item"
                >
                  {{ tag }}
                  <van-icon name="cross" @click="removeTag(index)" />
                </div>
              </div>
            </van-cell-group>
            
            <div class="form-actions">
              <van-button 
                round 
                block 
                type="primary" 
                native-type="submit"
                :loading="isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </van-button>
              <van-button 
                round 
                block 
                plain 
                style="margin-top: 10px;"
                @click="cancelEditing"
              >
                Cancel
              </van-button>
            </div>
          </van-form>
        </template>
        
        <template v-else>
          <van-cell-group inset>
            <van-cell title="Restaurant Name" :value="restaurant.name" />
            <van-cell title="Description">
              <template #value>
                <div class="cell-multiline">{{ restaurant.description }}</div>
              </template>
            </van-cell>
            <van-cell title="Address" :value="restaurant.address" />
            <van-cell title="Phone" :value="restaurant.phone" />
            <van-cell title="Business Hours" :value="restaurant.businessHours" />
            <van-cell title="Tags">
              <template #value>
                <div class="tags-list">
                  <span 
                    v-for="(tag, index) in restaurant.tags" 
                    :key="index"
                    class="profile-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </template>
            </van-cell>
          </van-cell-group>
          
          <div class="profile-actions">
            <van-button 
              type="primary" 
              plain 
              block 
              icon="edit"
              @click="startEditing"
            >
              Edit Profile
            </van-button>
          </div>
        </template>
      </div>

      <!-- Social Media Accounts Section -->
      <div class="social-accounts-section">
        <h2 class="section-title">Social Media Accounts</h2>
        
        <!-- Connected platforms -->
        <div class="platform-section">
          <div class="section-header">
            <h3>Connected Accounts</h3>
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
                @click="disconnectPlatform(platform)"
              >
                Disconnect
              </van-button>
            </div>
          </div>
        </div>

        <!-- Available platforms -->
        <div class="platform-section" v-if="nonConnectedPlatforms.length > 0">
          <div class="section-header">
            <h3>Available Platforms</h3>
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
                @click="connectPlatform(platform)"
              >
                Connect
              </van-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Log out -->
      <div class="logout-container">
        <van-button 
          block 
          type="danger" 
          plain 
          icon="close"
          @click="logOut"
        >
          Log Out
        </van-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.loading-container p {
  margin-top: 16px;
  color: #999;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.profile-avatar {
  margin-bottom: 16px;
}

.profile-header h2 {
  margin: 0 0 8px;
  font-size: 20px;
}

.rating {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.rating .van-icon {
  margin-right: 4px;
}

.profile-form {
  margin-top: 20px;
}

.cell-multiline {
  white-space: pre-wrap;
  word-break: break-word;
}

.form-actions {
  margin: 20px 0;
  padding: 0 16px;
}

.profile-actions {
  margin: 20px 0;
  padding: 0 16px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
}

.tag-item {
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
}

.tag-item .van-icon {
  margin-left: 4px;
  font-size: 14px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.profile-tag {
  background-color: #f2f2f2;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
}

.logout-container {
  margin-top: 30px;
  padding: 0 16px;
}

/* 社交媒体账号部分的样式 */
.social-accounts-section {
  margin-top: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  padding: 0 16px;
}

.platform-section {
  margin-bottom: 24px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 16px;
  margin: 0;
  color: var(--text-color);
}

.empty-state {
  text-align: center;
  padding: 16px 0;
}

.empty-state p {
  color: #999;
  margin-top: 8px;
  font-size: 14px;
}

.platform-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.platform-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
}

.platform-info {
  display: flex;
  align-items: center;
}

.platform-icon {
  margin-right: 12px;
}

.platform-details h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.platform-username {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.platform-connect {
  margin: 0;
  color: #999;
  font-size: 13px;
}
</style> 