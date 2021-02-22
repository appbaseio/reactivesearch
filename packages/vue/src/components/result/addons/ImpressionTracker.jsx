import { Actions, helper } from '@appbaseio/reactivecore';
import VueTypes from '../../../utils/vueTypes';
import { connect } from '../../../utils/index';

const { recordImpressions } = Actions;

const { isEqual } = helper;

const debounce = (method, delay) => {
	clearTimeout(method._tId);
	// eslint-disable-next-line
	method._tId = setTimeout(() => {
		method();
	}, delay);
};

const ImpressionTracker = {
	name: 'ImpressionTracker',
	inject: ['$$store'],
	props: {
		hits: VueTypes.hits,
	},
	created() {
		// Represents the list of hits returned by the query
		this.currentHits= []; // An array of hits objects
		// An object to track the recorded impressions
		// It can have the values in following shape
		// { "hit_id": { "index": "test" }}
		this.trackedIds= {};
		// An object to know the the un-tracked impression i.e not recorded by BE
		// It can have the values in following shape
		// { "query_id": [{ "id": "hit_id", "index": "test"}]}
		this.waitingToBeTracked= {};
	},
	mounted() {
		this.setCurrentHits(this.hits);
		// Add scroll events to track the impressions
		if (window) {
			window.addEventListener('scroll', this.tracker);
		}
	},
	destroy() {
		// Clear the interval
		this.clearTrackerInterval();
	},
	watch: {
		hits(newVal, oldVal) {
			if (newVal && newVal !== oldVal) {
				// Only compare hit ids for performance reasons
				const prevHitIds = oldVal.map(hit => hit._id);
				const currentHitIds = newVal.map(hit => hit._id);
				if (!isEqual(currentHitIds, prevHitIds)) {
					this.setCurrentHits(newVal);
				}
			}
		},
	},
	methods: {
		inViewPort(el) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top >= 0
				&& rect.left >= 0
				&& rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
				&& rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			);
		},
		setCurrentHits(hits) {
			this.currentHits = hits;
			// Reset the tracked Ids for new hits
			this.trackedIds = {};
			if (hits && hits.length) {
				this.tracker();
				// Run the tracker function on an interval of 1s to track the impressions for
				// non-scroll views for e.g on tab change
				this.setTrackerInterval();
			}
		},
		recordImpression() {
			if (Object.keys(this.waitingToBeTracked).length) {
				const unTrackedHits = { ...this.waitingToBeTracked };
				Object.keys(unTrackedHits).forEach(queryId => {
					if (unTrackedHits[queryId] && unTrackedHits[queryId].length) {
						this.trackImpressions(queryId, unTrackedHits[queryId]);
						// Removed tracked impressions from waiting list
						delete this.waitingToBeTracked[queryId];
					}
				});
			}
		},
		addToWaitingList(hitObject) {
			const queryId = this.getQueryId();
			if (hitObject && queryId) {
				const impression = {
					id: hitObject._id,
					index: hitObject._index,
				};
				// Check if query id already present in waiting list
				if (this.waitingToBeTracked[queryId]) {
					this.waitingToBeTracked[queryId].push(impression);
				} else {
					this.waitingToBeTracked[queryId] = [impression];
				}
			}
		},
		tracker() {
			if (!this.getHitIds().length) {
				this.clearTrackerInterval();
				return;
			}
			// only run at client-side
			if (window && document) {
				this.getHitIds().forEach(id => {
					const element = document.getElementById(id);
					if (element) {
						if (this.inViewPort(element)) {
							// Add the hit id in the list of tracked ids
							const hitObject = this.currentHits.find(hit => hit._id === id);
							this.trackedIds[id] = true;
							// Add hit to waiting list to be recorded
							this.addToWaitingList(hitObject);
						}
					}
				});
			}
			debounce(this.recordImpression, 300);
		},
		setTrackerInterval() {
			this.intervalID = setInterval(this.tracker, 1000);
		},
		clearTrackerInterval() {
			if (this.intervalID) {
				clearInterval(this.intervalID);
				// Reset interval ID
				this.intervalID = null;
			}
		},
		getQueryId() {
			const state = this.$$store ? this.$$store.getState() : null;
			return state ? state.analytics.searchId : null;
		},
		getHitIds() {
			return this.currentHits.map(hit => hit._id).filter(id => !this.trackedIds[id]);
		}
	},
	render() {
		return this.$slots.default;
	},
};

const mapDispatchToProps = {
	trackImpressions: recordImpressions,
};

export default connect(
	() => null,
	mapDispatchToProps,
)(ImpressionTracker);
