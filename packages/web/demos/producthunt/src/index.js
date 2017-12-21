import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
	ReactiveBase,
	DataSearch,
	MultiList,
	ResultList,
	SelectedFilters
} from "@appbaseio/reactivesearch";
import Box from "react-layout-components";

class ProductHuntApp extends Component {
	onData = hit => {
		const res = hit._source;
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

	render() {
		return (
			<ReactiveBase
				app="producthunt"
				credentials="We5c0D8OP:b3f3b3ee-529c-41b2-b69a-84245c091105"
				type="post"
			>
				{/* header */}
				<Box width={"100%"}>
					<SelectedFilters />
				</Box>
				<Box width={"100%"} className="mt-20">
					<DataSearch
						title="Search"
						componentId="searchbox"
						dataField={["name", "tagline"]}
						placeholder="Discover products..."
						URLParams={true}
						defaultSelected="iphone"
						filterLabel="Search"
					/>
				</Box>
				<Box flexDirection={"row"} className="mt-20">
					<Box width={"30%"}>
						{/* left sidebar */}
						<MultiList
							componentId="categories"
							dataField="topics.raw"
							title="Categories"
							size={50}
							sortBy={"count"}
							showCount={true}
							queryFormat="and"
							react={{
								and: ["searchbox"]
							}}
							URLParams={true}
							showSearch={false}
							showCheckbox={false}
							filterLabel="Categories"
						/>
					</Box>
					<Box width={"70%"}>
						{/* right sidebar */}
						<ResultList
							componentId="results"
							dataField="name"
							react={{
								and: ["categories", "searchbox"]
							}}
							onData={this.onData}
							onResultStats={(results, time) => {
								return `Found ${results} results in ${time} milliseconds`;
							}}
						/>
					</Box>
				</Box>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<ProductHuntApp />, document.getElementById("app"));
