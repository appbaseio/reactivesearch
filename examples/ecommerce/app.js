import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
	ReactiveBase,
	CategorySearch,
	NestedList,
	MultiList,
	RatingsFilter,
	ResultCard
} from "../../app/app.js";
import ReactStars from "react-stars";

require("./ecommerce.scss");

class Main extends Component {
	onData(res) {
		const image = res.vehicleType == "other" || res.vehicleType == "unknown" ?
			"images/car.jpg" :
			`images/${res.vehicleType.replace(/ /g,"-")}/${res.color}.jpg`

		const result = {
			image,
			title: res.name,
			desc: (
				<div>
					<div className="product-price">${res.price}</div>
					<div className="product-info">
						<div className="product-seller">
							{res.seller}
							<ReactStars
								count={5}
								value={res.rating}
								size={20}
								color1={"#bbb"}
								edit={false}
								color2={"#ffd700"}
							/>
						</div>
					</div>
					<div className="product-footer">
						<span className="tag">{res.model}</span>
						<span className="tag">{res.vehicleType}</span>
						{ res.fuelType ? <span className="tag">{res.fuelType}</span> : null }

						<span className="metadata">REGD. {res.yearOfRegistration}</span>
					</div>
				</div>
			),
			url: "#"
		};
		return result;
	}

	render() {
		return (
			<ReactiveBase
				app="car-store"
				credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
				type="cars"
			>
				<div className="mobile-banner">
					<p>Sorry, this app isn't compatible with this resolution.</p>
					<p>Please view it on desktop.</p>
					<p><a href="https://opensource.appbase.io/reactivesearch">Click here to go back</a></p>
				</div>
				<nav className="row">
					<div className="col s3">
						<a href="/examples/ecommerce" className="brand">Car Store</a>
					</div>
					<div className="col s9">
						<CategorySearch
							dataField="name"
							categoryField="brand.raw"
							componentId="CategorySensor"
							placeholder="Search for cars..."
							react={{
								and: "CarSensor"
							}}
						/>
					</div>
				</nav>
				<div className="row">
					<div className="col s3">
						<div className="row">
							<div className="col s12">
								<NestedList
									componentId="CarSensor"
									dataField={[this.props.mapping.brand, this.props.mapping.model]}
									title="Cars"
									showSearch={true}
									placeholder="Filter Cars"
									react={{
										and: ["CategorySensor", "RatingsSensor", "VehicleTypeSensor"]
									}}
								/>
							</div>
							<div className="col s12">
								<RatingsFilter
									componentId="RatingsSensor"
									dataField="rating"
									title="Rating"
									data={
									[{ start: 4, end: 5, label: "4 stars and up" },
										{ start: 3, end: 5, label: "3 stars and up" },
										{ start: 2, end: 5, label: "2 stars and up" },
										{ start: 1, end: 5, label: "> 1 stars" }]
									}
									defaultSelected={{
										start: 3,
										end: 5
									}}
									react={{
										and: ["CarSensor", "VehicleTypeSensor"]
									}}
								/>
							</div>
							<div className="col s12">
								<MultiList
									componentId="VehicleTypeSensor"
									dataField={this.props.mapping.vehicleType}
									showCount={true}
									size={100}
									showSearch={false}
									title="Vehicle Type"
									searchPlaceholder="Search Vehicle Type"
									react={{
										and: ["RatingsSensor", "CarSensor"]
									}}
								/>
							</div>
						</div>
					</div>

					<div className="col s9">
						<div className="row">
							<ResultCard
								onData={this.onData}
								dataField={this.props.mapping.name}
								size={9}
								pagination={true}
								react={{
									and: ["CategorySensor", "RatingsSensor", "CarSensor", "VehicleTypeSensor"]
								}}
							/>
						</div>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

Main.defaultProps = {
	mapping: {
		name: "name",
		vehicleType: "vehicleType.raw",
		model: "model.raw",
		brand: "brand.raw",
		color: "color.raw",
		price: "price"
	}
};

ReactDOM.render(<Main />, document.getElementById("app"));
