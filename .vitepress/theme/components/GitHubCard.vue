<script setup>
import { computed } from 'vue'

// 定义组件接收的 props
const props = defineProps({
  // 格式： "username/repo"
  repo: {
    type: String,
    required: true
  },
  // 可选的描述
  desc: {
    type: String,
    default: ''
  }
})

// 计算仓库的完整 URL
const repoUrl = computed(() => `https://github.com/${props.repo}`)

// 从 "username/repo" 中提取仓库名
const repoName = computed(() => props.repo.split('/')[1])
</script>

<template>
  <a :href="repoUrl" target="_blank" rel="noopener noreferrer" class="github-card">
    <div class="card-content">
      <div class="card-title">
        <svg
          class="github-icon"
          viewBox="0 0 16 16"
          version="1.1"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
        <span>{{ repoName }}</span>
      </div>
      <p class="card-desc">{{ desc || `GitHub 仓库: ${props.repo}` }}</p>
    </div>
    <div class="card-arrow">→</div>
  </a>
</template>

<style scoped>
/* 样式可以根据你的主题自行调整 */
.github-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--vp-c-divider); /* 使用 VitePress 的 CSS 变量 */
  border-radius: 8px;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 16px 0;
}

.github-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-content {
  flex-grow: 1;
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 1.1em;
  font-weight: 600;
  color: var(--vp-c-brand); /* 标题使用主题色 */
}

.github-icon {
  margin-right: 8px;
  fill: currentColor; /* 随标题颜色变化 */
}

.card-desc {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin: 8px 0 0 0;
  line-height: 1.5;
}

.card-arrow {
  font-size: 1.5em;
  font-weight: bold;
  color: var(--vp-c-text-3);
  margin-left: 16px;
  transition: transform 0.3s ease;
}

.github-card:hover .card-arrow {
  transform: translateX(5px);
  color: var(--vp-c-brand);
}
</style>