import React, { Component } from "react";
import { render } from "react-dom";
import {
	ReactiveBase,
	DataSearch,
	RatingsFilter,
	MultiList,
	ToggleList,
	ResultList,
	ReactiveMap
} from "../../app/app.js";

require("./yelp.scss")

class Main extends Component {
	onData(res) {
		const image = res.cuisine === "Bar Food" ?
			"images/bar.jpg" :
			res.cuisine === "Desserts" ?
			"images/desserts.jpg" :
			res.cuisine === "Breakfast" ?
			"images/breakfast.jpg" : "images/default.jpg";
		const result = {
			image,
			title: res.name,
			desc: (<div>
				<p>{res.address}, {res.postal_code}</p>
				<span className="tag">{res.place_type}</span>
				<span className="tag">{res.cuisine}</span>
				<a className="call-btn" href={`tel:${res.phone_number}`}><i className="fa fa-phone"></i> Call</a>
			</div>),
			url: "#"
		};
		return result;
	}

	onPopoverTrigger(marker) {
		return (<div className="row" style={{ margin: "0", maxWidth: "300px", paddingTop: 10 }}>
			<div className="col s12">
				<div>
					<strong>{marker._source.name}</strong>
				</div>
				<p style={{ margin: "5px 0", lineHeight: "18px" }}>
					{marker._source.address}
				</p>
			</div>
		</div>);
	}

	render() {
		return (
			<ReactiveBase
				app="yelp"
				credentials="PNlPPw1xC:7de6b493-32e2-44e2-93be-221058f97090"
				type="place"
				theme="rbc-red"
			>
				<div className="mobile-banner">
					<p>Sorry, this app isn't compatible with this resolution.</p>
					<p>Please view it on desktop.</p>
					<p><a href="https://opensource.appbase.io/reactivesearch">Click here to go back</a></p>
				</div>
				<header>
					<nav>
						<a href="/examples/yelpsearch" className="brand">Yelp Search</a>
						<DataSearch
							componentId="NameSensor"
							placeholder="Search for restaurants, bars..."
							appbaseField="name"
							searchInputId="NameSearch"
						/>
						<div className="links">
							<a target="_blank" href="https://github.com/appbaseio/reactivesearch" className="link"><i className="fa fa-github" aria-hidden="true"></i> Github</a>
							<a target="_blank" href="https://opensource.appbase.io/reactive-manual/" className="link"><i className="fa fa-book" aria-hidden="true"></i> Documentation</a>
						</div>
					</nav>
				</header>

				<section className="result-wrapper clearfix">
					<div className="left-col">
						<aside className="filters-wrapper">
							<div className="scroll-wrapper">
								<MultiList
									appbaseField="place_type.raw"
									title="Category"
									componentId="CategorySensor"
									react={{
										and: ["RatingsSensor", "CuisineSensor", "WifiSensor", "DogSensor", "MusicSensor", "BookingSensor"]
									}}
								/>
								<RatingsFilter
									componentId="RatingsSensor"
									appbaseField="rating"
									title="Ratings"
									data={[
										{ start: 4, end: 5, label: "4 stars and up" },
										{ start: 3, end: 5, label: "3 stars and up" },
										{ start: 2, end: 5, label: "2 stars and up" },
										{ start: 1, end: 5, label: "> 1 stars" }
									]}
									defaultSelected={{start: 3, end: 5}}
									react={{
										and: ["CuisineSensor", "CategorySensor", "WifiSensor", "DogSensor", "MusicSensor", "BookingSensor"]
									}}
								/>
								<MultiList
									appbaseField="cuisine.raw"
									title="cuisine"
									componentId="CuisineSensor"
									react={{
										and: ["RatingsSensor", "CategorySensor", "WifiSensor", "DogSensor", "MusicSensor", "BookingSensor"]
									}}
								/>
								<ToggleList
									appbaseField="wifi"
									componentId="WifiSensor"
									title="More Filters"
									data={[
										{
											label: "Wifi",
											value: true
										}
									]}
								/>
								<ToggleList
									appbaseField="dog_friendly"
									componentId="DogSensor"
									data={[
										{
											label: "Dog Friendly",
											value: true
										}
									]}
								/>
								<ToggleList
									appbaseField="live_music"
									componentId="MusicSensor"
									data={[
										{
											label: "Live Music",
											value: true
										}
									]}
								/>
								<ToggleList
									appbaseField="online_bookings"
									componentId="BookingSensor"
									data={[
										{
											label: "Online Bookings",
											value: true
										}
									]}
								/>
							</div>
						</aside>

						<div className="list">
							<ResultList
								componentId="SearchResult"
								appbaseField="name"
								from={0}
								size={20}
								onData={this.onData}
								pagination={true}
								react={{
									and: ["NameSensor", "RatingsSensor", "CuisineSensor", "CategorySensor", "WifiSensor", "DogSensor", "MusicSensor", "BookingSensor"]
								}}
							/>
						</div>
					</div>
					<div className="right-col">
						<ReactiveMap
							appbaseField="location"
							defaultZoom={13}
							defaultCenter={{ lat: 38.23, lon: -85.76 }}
							historicalData={true}
							setMarkerCluster={true}
							showMapStyles={false}
							showSearchAsMove={false}
							defaultMapStyle="Light Monochrome"
							onPopoverTrigger={this.onPopoverTrigger}
							autoCenter={true}
							size={100}
							react={{
								and: ["NameSensor", "RatingsSensor", "CuisineSensor", "CategorySensor", "WifiSensor", "DogSensor", "MusicSensor", "BookingSensor"]
							}}
						/>
					</div>
				</section>
			</ReactiveBase>
		);
	}
}

render(<Main />, document.getElementById("app"));
