import React from 'react';
import { node } from 'prop-types';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { isEqual } from '@appbaseio/reactivecore/lib/utils/helper';
import { recordImpressions } from '@appbaseio/reactivecore/lib/actions';
import { connect, ReactReduxContext } from '../../../utils';

const debounce = (method, delay) => {
	clearTimeout(method._tId);
	// eslint-disable-next-line
	method._tId = setTimeout(() => {
		method();
	}, delay);
};

class ImpressionTracker extends React.Component {
	// Represents the list of hits returned by the query
    currentHits = []; // An array of hits objects
	// An object to track the recorded impressions
	// It can have the values in following shape
	// { "hit_id": { "index": "test" }}
	trackedIds = {};
	// An object to know the the untracked impression i.e not recorded by BE
	// It can have the values in following shape
	// { "query_id": [{ "id": "hit_id", "index": "test"}]}
	waitingToBeTracked = {}

	static contextType = ReactReduxContext;

	componentDidMount() {
		const { hits } = this.props;
		this.setCurrentHits(hits);
		// Add scroll events to track the impressions
		if (window) {
			window.addEventListener('scroll', this.tracker);
		}
	}

	componentDidUpdate(prevProps) {
		const { hits } = this.props;
		if (hits && hits !== prevProps.hits) {
			// Only compare hit ids for performance reasons
			const prevHitIds = prevProps.hits.map(hit => hit._id);
			const currentHitIds = hits.map(hit => hit._id);
			if (!isEqual(currentHitIds, prevHitIds)) {
				this.setCurrentHits(hits);
			}
		}
	}

	componentWillUnmount() {
		// Clear the interval
		this.clearTrackerInterval();
	}

	get hitIds() {
		return this.currentHits.map(hit => hit._id).filter(id => !this.trackedIds[id]);
	}

	get queryId() {
		const state = this.context && this.context.store
			? this.context.store.getState()
			: null;

		return state ? state.analytics.searchId : null;
	}

	setTrackerInterval = () => {
		this.intervalID = setInterval(this.tracker, 1000);
	};

	clearTrackerInterval = () => {
		if (this.intervalID) {
			clearInterval(this.intervalID);
			// Reset interval ID
			this.intervalID = null;
		}
	};

	tracker = () => {
		if (!this.hitIds.length) {
			this.clearTrackerInterval();
			return;
		}
		// only run at client-side
		if (window && document) {
			this.hitIds.forEach((id) => {
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
	};

	addToWaitingList = (hitObject) => {
		const queryId = this.queryId;
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
	}

	recordImpression = () => {
		if (Object.keys(this.waitingToBeTracked).length) {
			const { trackImpressions } = this.props;
			const untrackedHits = { ...this.waitingToBeTracked };
			Object.keys(untrackedHits).forEach((queryId) => {
				if (untrackedHits[queryId] && untrackedHits[queryId].length) {
					trackImpressions(queryId, untrackedHits[queryId]);
					// Removed tracked impressions from waiting list
					delete this.waitingToBeTracked[queryId];
				}
			});
		}
	}

	inViewPort(el) {
		const rect = el.getBoundingClientRect();
		return (
			rect.top >= 0
			&& rect.left >= 0
			&& rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
			&& rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	setCurrentHits(hits) {
		this.currentHits = hits;
		// Reset the tracked Ids for new hits
		this.trackedIds = {};
		if (hits.length) {
			this.tracker();
			// Run the tracker function on an interval of 1s to track the impressions for
			// non-scroll views for e.g on tab change
			this.setTrackerInterval();
		}
	}

	render() {
		const { children } = this.props;
		return children;
	}
}

ImpressionTracker.propTypes = {
	trackImpressions: types.funcRequired,
	hits: types.hits,
	children: node,
};

const mapDispatchToProps = dispatch => ({
	trackImpressions: (queryID, impressions) => dispatch(recordImpressions(queryID, impressions)),
});

export default connect(null, mapDispatchToProps)(ImpressionTracker);
