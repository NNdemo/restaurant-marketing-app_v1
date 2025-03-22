<script setup>
import { ref, onMounted } from 'vue';
import { restaurantData, analyticsData } from '@/mock/data';
import PageLoading from '@/components/PageLoading.vue';

const restaurant = ref(null);
const analytics = ref(null);
const loading = ref(true);

// Simulate data fetching
onMounted(async () => {
  setTimeout(() => {
    restaurant.value = restaurantData;
    analytics.value = analyticsData;
    loading.value = false;
  }, 800);
});
</script>

<template>
  <div class="home-container">
    <!-- Page header with restaurant info -->
    <van-nav-bar
      title="Restaurant Marketing Hub"
      fixed
      placeholder
    />

    <PageLoading v-if="loading" text="Loading restaurant data..." />

    <template v-else>
      <!-- Restaurant summary card -->
      <div class="restaurant-card">
        <div class="cover-image">
          <van-image :src="restaurant.coverImage" fit="cover" lazy-load />
        </div>
        <div class="restaurant-info">
          <div class="logo">
            <van-image :src="restaurant.logo" fit="cover" round lazy-load />
          </div>
          <h1 class="restaurant-name">{{ restaurant.name }}</h1>
          <p class="restaurant-description">{{ restaurant.description }}</p>
          <div class="restaurant-tags">
            <span v-for="(tag, index) in restaurant.tags" :key="index" class="tag">{{ tag }}</span>
          </div>
          <div class="restaurant-rating">
            <van-icon name="star" color="#FFD700" />
            <span>{{ restaurant.rating }} ({{ restaurant.reviewCount }} reviews)</span>
          </div>
        </div>
      </div>

      <!-- Quick action cards -->
      <div class="action-cards">
        <div class="action-card" @click="$router.push('/content')">
          <van-icon name="edit" size="24" color="var(--primary-color)" />
          <h3>Create Content</h3>
          <p>Generate marketing content for your restaurant</p>
        </div>
        <div class="action-card" @click="$router.push('/social')">
          <van-icon name="friends-o" size="24" color="var(--primary-color)" />
          <h3>Social Media</h3>
          <p>Manage and publish social content</p>
        </div>
        <div class="action-card" @click="$router.push('/coupons')">
          <van-icon name="coupon-o" size="24" color="var(--primary-color)" />
          <h3>Coupons</h3>
          <p>Create and manage promotional offers</p>
        </div>
      </div>

      <!-- Analytics summary -->
      <div class="analytics-section">
        <h2>Social Media Overview</h2>
        <div class="analytics-card">
          <div class="analytics-item">
            <h3>{{ analytics.socialEngagement.followers.toLocaleString() }}</h3>
            <p>Total Followers</p>
          </div>
          <div class="analytics-item">
            <h3>{{ analytics.socialEngagement.engagement }}%</h3>
            <p>Engagement Rate</p>
          </div>
          <div class="analytics-item">
            <h3>+{{ analytics.socialEngagement.weeklyGrowth }}%</h3>
            <p>Weekly Growth</p>
          </div>
        </div>

        <!-- Recently published content -->
        <h2>Recent Content Performance</h2>
        <div class="content-performance">
          <div v-for="(item, index) in analytics.contentPerformance.slice(0, 3)" 
               :key="index" 
               class="performance-item">
            <div class="performance-date">{{ item.date }}</div>
            <div class="performance-stats">
              <div class="stat">
                <van-icon name="like-o" />
                <span>{{ item.likes }}</span>
              </div>
              <div class="stat">
                <van-icon name="chat-o" />
                <span>{{ item.comments }}</span>
              </div>
              <div class="stat">
                <van-icon name="share-o" />
                <span>{{ item.shares }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.home-container {
  padding: 16px;
  padding-bottom: calc(70px + env(safe-area-inset-bottom));
}

.restaurant-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.cover-image {
  height: 150px;
  overflow: hidden;
}

.cover-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-info {
  padding: 16px;
  position: relative;
}

.logo {
  position: absolute;
  top: -40px;
  right: 20px;
  width: 80px;
  height: 80px;
  border: 4px solid white;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.restaurant-name {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 24px;
  color: var(--text-color);
}

.restaurant-description {
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.restaurant-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  background-color: var(--light-bg);
  color: var(--text-color);
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
}

.restaurant-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.action-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
}

.action-card:active {
  transform: scale(0.98);
}

.action-card h3 {
  margin: 12px 0 8px;
  font-size: 16px;
  color: var(--text-color);
}

.action-card p {
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.analytics-section h2 {
  font-size: 18px;
  margin: 24px 0 12px;
  color: var(--text-color);
}

.analytics-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.analytics-item {
  text-align: center;
}

.analytics-item h3 {
  margin: 0;
  font-size: 20px;
  color: var(--primary-color);
}

.analytics-item p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #666;
}

.content-performance {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.performance-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.performance-item:last-child {
  border-bottom: none;
}

.performance-date {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.performance-stats {
  display: flex;
  gap: 24px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
}

/* 小屏幕适配 */
@media screen and (max-width: 360px) {
  .action-cards {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .analytics-card {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .performance-stats {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style> 