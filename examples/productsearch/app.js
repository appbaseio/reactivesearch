import React, { Component } from "react";
import { render } from "react-dom";
import {
	ReactiveBase,
	DataSearch,
	MultiList,
	DataController,
	ResultList,
	SelectedFilters
} from "../../app/app.js";

const $ = require("jquery");

require("./producthunt.scss");

class Main extends Component {
	onData(res) {
		const topics = res.topics.map(topic => (
			<span key={topic} className="tag">{topic}</span>
		));
		return {
			image: "images/default.png",
			title: res.name,
			desc: (<div>
				<p>{res.tagline}</p>
				{topics}
				<div className="stats">
					<span><i className="fa fa-caret-up"></i> {res.upvotes}</span>
					<span><i className="fa fa-comment"></i> {res.comments_count}</span>
				</div>
			</div>),
			url: "#"
		}
	}

	defaultQuery() {
		return {
			"match_all": {}
		}
	}

	render() {
		return (
			<ReactiveBase
				app="producthunt"
				credentials="We5c0D8OP:b3f3b3ee-529c-41b2-b69a-84245c091105"
				type="post"
				theme="rbc-red"
			>
				<div className="mobile-banner">
					<p>Sorry, this app isn't compatible with this resolution.</p>
					<p>Please view it on desktop.</p>
					<p><a href="https://opensource.appbase.io/reactivesearch">Click here to go back</a></p>
				</div>
				<header>
					<a href="/examples/productsearch" className="brand">Product Search</a>
					<DataSearch
						componentId="Search"
						placeholder="Discover products..."
						dataField={["name", "tagline"]}
					/>
					<div className="links">
						<a target="_blank" href="https://github.com/appbaseio/reactivesearch" className="link"><i className="fa fa-github" aria-hidden="true"></i> Github</a>
						<a target="_blank" href="https://opensource.appbase.io/reactive-manual/" className="link"><i className="fa fa-book" aria-hidden="true"></i> Documentation</a>
					</div>
				</header>

				<section className="result-wrapper clearfix">
					<div className="left-col">
						<MultiList
							dataField="topics.raw"
							title="Filter Topics"
							componentId="Topics"
							sortBy="count"
							showCount={false}
							size={15}
							tags={false}
							selectAllLabel="all"
						/>
						<DataController
							componentId="DefaultSensor"
							visible={false}
							customQuery={this.defaultQuery}
							allowFilter={false}
						/>
					</div>
					<div className="right-col">
						<div className="row">
							<SelectedFilters componentId="SelectedFilters" />
						</div>
						<ResultList
							dataField="name"
							from={0}
							size={10}
							scrollOnTarget={window}
							pagination={false}
							onData={this.onData}
							react={{
								and: ["Search", "Topics", "DefaultSensor"]
							}}
							sortOptions={[
								{"label": "Sort by Popularity", "dataField": "upvotes", "sortBy": "desc"}
							]}
						/>
					</div>
				</section>
			</ReactiveBase>
		);
	}
}

render(<Main />, document.getElementById("app"));
