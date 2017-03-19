import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
	ReactiveBase,
	TextField,
	SingleDropdownList,
	ReactivePaginatedList
} from "@appbaseio/reactivemaps";
import moment from "moment";

require("./news.scss");

class Main extends Component {
	constructor(props) {
		super(props);
		this.newsQuery = this.newsQuery.bind(this);
		this.onData = this.onData.bind(this);
	}

	newsQuery(value) {
		if(value) {
			return {
				multi_match: {
					query: value,
					fields: ["title", "text", "by"]
				}
			};
		} else {
			return null;
		}
	}

	onData(res) {
		let result, combineData = res.currentData;
		if(res.mode === "historic") {
			combineData = res.currentData.concat(res.newData);
		}
		if (combineData) {
			result = combineData.map((markerData, index) => {
				let marker = markerData._source;
				return this.itemMarkup(marker, markerData);
			});
		}
		return result;
	}

	itemMarkup(marker, markerData) {
		return (
			<div
				className="news"
				key={markerData._id}
			>
				{
					marker.title && marker.title.length ?
						marker.url ?
						<a  className="title"
							target="_blank"
							href={marker.url}
							dangerouslySetInnerHTML={{__html: marker.title}}
						/> :
						marker.p_type == "poll" ?
						<a  className="title"
							target="_blank"
							href={`https://news.ycombinator.com/item?id=${marker.id}`}
							dangerouslySetInnerHTML={{__html: marker.title}}
						/> :
						<div className="title" dangerouslySetInnerHTML={{__html: marker.title}} />
					: null
				}
				{ marker.text ? <div className="text" dangerouslySetInnerHTML={{__html: marker.text}} /> : null }
				<p className="info">
					{
						marker.p_type == "comment" ?
						<span>parent <a target="_blank" href={`https://news.ycombinator.com/item?id=${marker.parent}`}>{marker.parent}</a><span className="separator">|</span></span>
						: null
					}
					{marker.score} points<span className="separator">|</span>
					<a target="_blank" href={`https://news.ycombinator.com/user?id=${marker.by}`}>{marker.by}</a><span className="separator">|</span>
					{moment.unix(marker.time).fromNow()}
				</p>
			</div>
		);
	}

	render() {
		return (
			<div>
				<ReactiveBase
					app="hacker-news"
					credentials="Nt7ZtBrAn:5656435e-0273-497e-a741-9a5a2085ae84"
					type="post"
					theme="rbc-orange"
				>
					<nav className="wrapper">
						Hacker News
					</nav>
					<div className="filters wrapper row">
						<div className="col s9">
							<TextField
								componentId="InputSensor"
								placeholder="Search posts by title, text or author..."
								customQuery={this.newsQuery}
							/>
						</div>

						<div className="col s3">
							<SingleDropdownList
								componentId="TypeSensor"
								appbaseField={this.props.mapping.type}
								size={100}
								selectAllLabel="All"
								defaultSelected="All"
							/>
						</div>
					</div>

					<div className="wrapper row">
						<div className="col s12">
							<ReactivePaginatedList
								componentId="SearchResult"
								appbaseField={this.props.mapping.title}
								onData={this.onData}
								from={0}
								size={30}
								react={{
									and: ["TypeSensor", "InputSensor"]
								}}
							/>
						</div>
					</div>
				</ReactiveBase>
			</div>
		);
	}
}

Main.defaultProps = {
	mapping: {
		title: "title",
		url: "url",
		type: "p_type.raw"
	}
};

ReactDOM.render(<Main />, document.getElementById("app"));
