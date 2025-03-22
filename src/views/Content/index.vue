<script setup>
import { ref, computed } from 'vue';
import { templateContentData } from '@/mock/data';
import { formatTemplate, generateId } from '@/utils/helpers';

const templates = ref(templateContentData);
const selectedTemplate = ref(null);
const formData = ref({});
const generatedContent = ref('');
const isSaving = ref(false);
const showGeneratedContent = ref(false);

// Extract placeholder fields from template
const templateFields = computed(() => {
  if (!selectedTemplate.value) return [];
  
  const regex = /{([^{}]+)}/g;
  const template = selectedTemplate.value.template;
  const matches = template.match(regex) || [];
  
  // Extract field names without the brackets
  return [...new Set(matches.map(match => match.replace(/{|}/g, '')))];
});

// Handle template selection
const selectTemplate = (template) => {
  selectedTemplate.value = template;
  formData.value = {};
  generatedContent.value = '';
  showGeneratedContent.value = false;
};

// Generate content from template
const generateContent = () => {
  if (!selectedTemplate.value) return;
  
  generatedContent.value = formatTemplate(selectedTemplate.value.template, formData.value);
  showGeneratedContent.value = true;
};

// Save the generated content
const saveContent = () => {
  if (!generatedContent.value) return;
  
  isSaving.value = true;
  
  // Simulate API call
  setTimeout(() => {
    isSaving.value = false;
    // Show success toast
    showSuccessToast('Content saved successfully!');
    
    // Reset form
    selectedTemplate.value = null;
    formData.value = {};
    generatedContent.value = '';
    showGeneratedContent.value = false;
  }, 1500);
};

// Show success toast
const showSuccessToast = (message) => {
  // Using Vant's toast component
  import('vant').then(({ showToast }) => {
    showToast({
      message,
      position: 'bottom',
      duration: 2000
    });
  });
};

// Copy content to clipboard
const copyToClipboard = () => {
  if (!generatedContent.value) return;
  
  navigator.clipboard.writeText(generatedContent.value)
    .then(() => {
      showSuccessToast('Content copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
};

// Share to social media
const shareToSocial = () => {
  // This would normally open a dialog to select platforms
  // For demo purposes, we'll just show a toast
  showSuccessToast('Sharing functionality would open here!');
};
</script>

<template>
  <div class="content-container">
    <van-nav-bar
      title="Content Generator"
      left-arrow
      fixed
      placeholder
      @click-left="$router.go(-1)"
    />

    <div class="content-section">
      <h2 v-if="!selectedTemplate">Select a Template</h2>

      <!-- Template selection -->
      <template v-if="!selectedTemplate">
        <div 
          v-for="template in templates" 
          :key="template.id" 
          class="template-card"
          @click="selectTemplate(template)"
        >
          <h3>{{ template.title }}</h3>
          <p>{{ template.template.substring(0, 80) }}...</p>
          <van-icon name="arrow" class="template-arrow" />
        </div>
      </template>

      <!-- Template form -->
      <template v-else-if="!showGeneratedContent">
        <h2>{{ selectedTemplate.title }}</h2>
        <p class="template-preview">{{ selectedTemplate.template }}</p>
        
        <div class="form-container">
          <h3>Fill in the details</h3>
          
          <van-form @submit.prevent="generateContent">
            <van-cell-group inset>
              <van-field
                v-for="field in templateFields"
                :key="field"
                v-model="formData[field]"
                :name="field"
                :label="field.replace('_', ' ')"
                :placeholder="'Enter ' + field.replace('_', ' ')"
                required
              />
            </van-cell-group>
            
            <div style="margin: 16px;">
              <van-button round block type="primary" native-type="submit">
                Generate Content
              </van-button>
              <van-button 
                round 
                block 
                plain 
                style="margin-top: 10px;" 
                @click="selectedTemplate = null"
              >
                Cancel
              </van-button>
            </div>
          </van-form>
        </div>
      </template>

      <!-- Generated content view -->
      <template v-else>
        <h2>Generated Content</h2>
        
        <div class="generated-content">
          <pre>{{ generatedContent }}</pre>
        </div>
        
        <div class="action-buttons">
          <van-button round block type="primary" @click="saveContent" :loading="isSaving">
            {{ isSaving ? 'Saving...' : 'Save Content' }}
          </van-button>
          
          <van-button round block @click="copyToClipboard" style="margin-top: 10px;">
            Copy to Clipboard
          </van-button>
          
          <van-button round block @click="shareToSocial" style="margin-top: 10px;">
            Share to Social Media
          </van-button>
          
          <van-button 
            round 
            block 
            plain 
            style="margin-top: 10px;" 
            @click="showGeneratedContent = false"
          >
            Edit Content
          </van-button>
          
          <van-button 
            round 
            block 
            plain 
            style="margin-top: 10px;" 
            @click="selectedTemplate = null"
          >
            Start Over
          </van-button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.content-container {
  padding: 16px;
  padding-bottom: 70px;
}

.content-section {
  margin-top: 16px;
}

h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: var(--text-color);
}

.template-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  transition: transform 0.2s;
}

.template-card:active {
  transform: scale(0.98);
}

.template-card h3 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 16px;
  color: var(--primary-color);
}

.template-card p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.template-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
}

.template-preview {
  background-color: var(--light-bg);
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  white-space: pre-wrap;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
}

.form-container {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.form-container h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  color: var(--text-color);
}

.generated-content {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.generated-content pre {
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-color);
  margin: 0;
}

.action-buttons {
  margin-top: 20px;
}
</style> 