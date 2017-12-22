import React from "react";
import { ResultList, SelectedFilters } from "@appbaseio/reactivesearch";

const onData = res => {
	const topics = res.topics.map(topic => (
		<span key={topic} className="tag">
			{topic}
		</span>
	));
	return {
		title: res.name,
		desc: (
			<div>
				<p>{res.tagline}</p>
				{topics}
				<div className="stats">
					<span>
						<i className="fa fa-caret-up" /> {res.upvotes}
					</span>
					<span>
						<i className="fa fa-comment" /> {res.comments_count}
					</span>
				</div>
			</div>
		)
	};
};

const onResultStats = (results, time) => `Found ${results} results in ${time} milliseconds`;

const Results = () => (
	<div>
		<SelectedFilters />
		<ResultList
			componentId="results"
			dataField="name"
			react={{
				and: ["categories", "search"]
			}}
			onData={onData}
			onResultStats={onResultStats}
			innerClass={{
				listItem: "card-item"
			}}
		/>
	</div>
);

export default Results;
