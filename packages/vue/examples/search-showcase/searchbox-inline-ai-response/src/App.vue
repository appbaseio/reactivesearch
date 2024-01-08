<template>
  <div id="app">
    <reactive-base
      :theme="{
        typography: {
          fontFamily: 'monospace',
          fontSize: '16px',
        },
      }"
      :reactivesearch-apiconfig="{
        recordAnalytics: false,
        userId: 'jon',
      }"
      app="reactivesearch_docs_v2"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
    >
      <search-box
        :data-field="[
          {
            field: 'keywords',
            weight: 4,
          },
          {
            field: 'heading',
            weight: 2,
          },
          {
            field: 'meta_title',
            weight: 1,
          },
        ]"
        :debounce="500"
        :show-clear="true"
        :highlight="false"
        :size="5"
        :urlparams="true"
        :autosuggest="true"
        :enable-a-i="true"
        :aiconfig="{
          docTemplate:
            'title is \'${source.title}\', page content is \'${source.tokens}\', URL is https://docs.reactivesearch.io${source.url}',
          queryTemplate:
            'Answer the query: \'${value}\', cite URL in your answer below it similar to a science paper format',
          topDocsForContext: 2,
        }"
        :AIUIConfig="{
          askButton: true,
          triggerOn: 'question'
        }"
        distinct-field="meta_title.keyword"
        class="mx-5 mt-2"
        component-id="search"
      >
        <template #renderAskButton="clickHandler">

          <button class="ask-ai-button" @click="clickHandler">
            <span class="button-emoji">
              <Gradient/>
            </span>
            <span class="button-text">
              Ask AI
            </span>
          </button>
        </template>
        <template
          #render="{
						downshiftProps: { isOpen, getItemProps, getItemEvents, highlightedIndex, selectedItem },
						AIData: { answer: aiAnswer, isAILoading },
						data,
            loading
					}"
        >
          <div v-if="isOpen">
            <div class="suggestions">
              <div v-if="isAILoading || loading">
                <div
                  :style="{
                    alignSelf: 'flex-start',
                    margin: 8,
                    maxWidth: '100%',
                    padding: '5px'
                  }"
                >
                  <div
                    :style="{
                      display: 'inline-block',
                      maxWidth: '100%',
                      backgroundColor: '#f1f1f1',
                      color: 'black',
                      borderRadius: '16px',
                      padding: '8px 16px',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                    }"
                  >
                    <span>Loading...</span>
                  </div>
                </div>
              </div>
              <div v-else-if="isAILoading || aiAnswer">
                <div
                  :style="{
                    alignSelf: 'flex-start',
                    margin: 8,
                    maxWidth: '100%',
                    padding: '5px'
                  }"
                >
                  <div
                    :style="{
                      display: 'inline-block',
                      maxWidth: '100%',
                      backgroundColor: '#f1f1f1',
                      color: 'black',
                      borderRadius: '16px',
                      padding: '8px 16px',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                    }"
                  >
                    <span v-if="aiAnswer">{{ aiAnswer }}</span>
                    <span v-else-if="isAILoading || loading">Loading...</span>
                  </div>
                </div>
              </div>
              <div v-else-if="!(data && data.length)">
                <p class="bg-gray p-2 m-0 suggestionHeading">
                  Frequently Asked Questions
                  <span
                    role="img"
                    aria-label="confused"> 🤔 </span>
                </p>
                <div>
                  <div
                    v-for="(item, index) in faqs"
                    :key="item.id + index"
                    v-bind="getItemProps({
                      item,
                      index
                    })"
                    :class="{
                      activeSuggestion: highlightedIndex === index,
                      suggestion: !(highlightedIndex === index),
                      selectedSuggestion:
                        selectedItem && selectedItem.value === item.value,
                    }"
                    v-on="getItemEvents({
                      item,
                      index: Number(index)
                    })"
                  >
                    <span className="clipText">{{ item.value }}</span>
                  </div>
                </div>
              </div>
              <div v-else-if="data && data.length">
                <p class="bg-gray p-2 m-0 suggestionHeading">
                  Documentation pages
                  <span
                    role="img"
                    aria-label="confused"> 📄 </span>
                </p>
                <div>
                  <a
                    v-for="(item, index) in data"
                    :key="item._id + index"
                    v-bind="getItemProps({ item, index })"
                    :class="{
                      activeSuggestion: highlightedIndex === index,
                      suggestion: !(highlightedIndex === index),
                      selectedSuggestion:
                        selectedItem && selectedItem.value === item.value,
                    }"
                    :href="`https://docs.reactivesearch.io${item._source.url}`"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div class="row">
                      <div
                        class="d-flex justify-content-center align-items-center col col-3 col-md-1"
                      >
                        <div class="p-1 bg-white rounded suggestionIcon">
                          <img
                            :src="getIcon(item._source.keywords)"
                            class="w-100 h-100"
                            alt="icon"
                          >
                        </div>
                      </div>
                      <div class="col col-9 col-md-11">
                        <div
                          :title="item.value"
                          class="suggestionTitle">
                          {{ item.value || item._source.title }}
                        </div>
                        <div
                          v-if="
                            item._source.heading
                              ? `${item._source.meta_title} > ${item._source.heading}`
                              : item._source.meta_title
                          "
                        >
                          <span
                            :title="
                              item._source.heading
                                ? `${item._source.meta_title} > ${item._source.heading}`
                                : item._source.meta_title
                            "
                            class="suggestionBreadcrumb"
                          >
                            {{
                              item._source.heading
                                ? `${item._source.meta_title} > ${item._source.heading}`
                                : item._source.meta_title
                            }}
                          </span>
                        </div>
                        <div
                          :title="item._source.meta_description"
                          class="suggestionDescription"
                        >
                          <div>
                            {{ item._source.meta_description }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </template>
      </search-box>
    </reactive-base>
  </div>
</template>

<script>
import { ReactiveBase, ReactiveList, SearchBox, AIAnswer } from '@appbaseio/reactivesearch-vue';
import { getIcon } from './getIcon';
import Gradient from './Gradient.vue'

import 'bootstrap/dist/css/bootstrap.min.css';

export default {
	name: 'App',
	components: { ReactiveBase, ReactiveList, SearchBox, AIAnswer, Gradient },
	data(){
		return {
			faqs: [
				{
					label:
      'How to use the SearchBox component with MultiList and ReactiveList in Vue?',
					value:
      'How to use the SearchBox component with MultiList and ReactiveList in Vue?',
					id: 'faq-1',
				},
				{
					label: 'Basic usage for MultiList in Vue',
					value: 'Basic usage for MultiList in Vue',
					id: 'faq-2',
				},
			]
		}
	},
	methods: {
		getMessageStyle(message) {
			const isSender = message.role === 'user';
			return {
				backgroundColor: isSender ? '#cce5ff' : '#f8f9fa',
				padding: '10px',
				borderRadius: '7px',
				marginBottom: '10px',
				maxWidth: '80%',
				alignSelf: isSender ? 'flex-end' : 'flex-start',
				display: 'inline-block',
				border: '1px solid',
				color: isSender ? '#004085' : '#383d41',
				position: 'relative',
				whiteSpace: 'pre-wrap',
			};
		},
		getIcon,
	},
};
</script>

<style>
@keyframes glowing {
  0% {
    box-shadow: 0 0 5px #47b5ff;
  }
  50% {
    box-shadow: 0 0 20px #47b5ff, 0 0 30px #47b5ff;
  }
  100% {
    box-shadow: 0 0 5px #47b5ff;
  }
}

@keyframes rotate {
  0% {
    transform: scale(1.7) rotate(0deg);
  }
  50% {
    transform: scale(1.7) rotate(180deg);
  }
  51% {
    transform: scale(1.7) rotate(185deg);
  }
  52% {
    transform: scale(1.7) rotate(180deg);
  }
  80% {
    transform: scale(1.7) rotate(360deg);
  }
}

.ask-ai-button {
  display: inline-block;
  position: relative;
  padding: 5px 10px;
  background-color: #f8f8f8;
  border: 2px solid transparent;
  border-radius: 0;
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333333;
  cursor: pointer;
  overflow: hidden;
  animation: glowing 2s infinite;
  height: 42px;
}

.ask-ai-button:before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid transparent;
  border-radius: 0;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
  animation: glowing 2s infinite;
}

.ask-ai-button:hover:before {
  opacity: 1;
}

.button-text {
  position: relative;
  z-index: 1;
}

.button-emoji {
  margin-right: 10px;
}

.button-emoji svg {
  transform: scale(1.7) rotate(0deg);
  animation: rotate 2s infinite linear;
}

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
.bg-gray {
    background-color: #eee;
}
.ai-answer-container {
	display: block;
	margin: 40px;
}
.spinner {
  position: absolute;
  height: 80vh;
  width: 100vw;
  left: 0px;
  display: flex;
  justify-content: center;
  padding-top: 50px;
  z-index: 1;
  background-color: white;
}
.headingTag {
  background: linear-gradient(
    30deg,
    rgb(59, 130, 246) 0%,
    rgb(59, 130, 246) 0%,
    rgb(255, 42, 111) 100%
  );
  margin-right: auto;
  border-radius: var(--bs-border-radius);
  padding: 5px 10px;
}
.suggestions {
  position: absolute;
  z-index: 2;
  box-shadow: #9597a1 0px 8px 24px;
  background: white;
  width: 100%;
  border-radius: 0px 0px 10px 10px;
  max-height: 500px;
  overflow: auto;
  font-size: 0.9rem;
}
.suggestionHeading {
  font-size: 0.8rem;
  font-weight: bold;
}
.suggestion {
  background-color: white;
  color: var(--bs-black);
  font-weight: normal;
  padding: 10px 15px;
  width: 100%;
  height: 100%;
  display: block;
  text-decoration: none;
  position: relative;
}
.activeSuggestion,
.activeSuggestion:hover {
  background-color: var(--bs-primary);
  color: white;
  padding: 10px 15px;
  width: 100%;
  height: 100%;
  display: block;
  text-decoration: none;
  position: relative;
}
.suggestionTitle {
  text-transform: uppercase;
  font-weight: bold;
  width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.suggestionBreadcrumb {
  padding: 0.25rem;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  position: absolute;
  top: 2px;
  max-width: 30%;
  right: 10px;
  background-color: #eee;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: var(--bs-border-radius);
}
.suggestionDescription {
  margin-top: 0.25rem;
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
@media (max-width: 500px) {
  .suggestionDescription {
    -webkit-line-clamp: 3;
  }
  .suggestionBreadcrumb {
    position: relative;
    top: 0;
    right: 0;
    font-size: 0.7rem;
    display: block;
    max-width: 100%;
  }
  .suggestionTitle {
    width: 100%;
  }
}
.suggestionIcon {
  max-width: 3rem;
  margin: auto;
}
.selectedSuggestion {
  font-weight: bold;
}
</style>
