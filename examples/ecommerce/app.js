import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
	ReactiveBase,
	CategorySearch,
	NestedList,
	MultiList,
	RangeSlider,
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
				<nav className="row">
					<div className="col s3">
						<a href="#" className="brand">Car Store</a>
					</div>
					<div className="col s9">
						<CategorySearch
							appbaseField="name"
							categoryField="brand.raw"
							componentId="ItemSensor"
							placeholder="Search for cars..."
							react={{
								and: ["CategorySensor", "VehicleTypeSensor", "ModelSensor", "ColorSensor", "PriceSensor"]
							}}
						/>
					</div>
				</nav>
				<div className="row">
					<div className="col s3">
						<div className="row">
							<div className="col s12">
								<NestedList
									componentId="CategorySensor"
									appbaseField={[this.props.mapping.brand, this.props.mapping.model]}
									title="Cars"
								/>
							</div>
							<div className="col s12">
								<RatingsFilter
									componentId="RatingsSensor"
									appbaseField="rating"
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
								/>
							</div>
							<div className="col s12">
								<MultiList
									componentId="VehicleTypeSensor"
									appbaseField={this.props.mapping.vehicleType}
									showCount={true}
									size={1000}
									showSearch={true}
									title="Vehicle Type"
									searchPlaceholder="Search Vehicle Type"
								/>
							</div>

							<div className="col s12">
								<MultiList
									componentId="ModelSensor"
									appbaseField={this.props.mapping.model}
									showCount={true}
									size={1000}
									showSearch={true}
									title="Car Model"
									searchPlaceholder="Search Car Model"
								/>
							</div>

							<div className="col s12 color-sensor">
								<MultiList
									componentId="ColorSensor"
									appbaseField={this.props.mapping.color}
									showCount={true}
									size={1000}
									showSearch={false}
									title="Car Color"
									searchPlaceholder="Search Car Color"
								/>
							</div>

							<div className="col s12">
								<RangeSlider
									componentId="PriceSensor"
									appbaseField={this.props.mapping.price}
									title="Price Range"
									range={{
										start: 800,
										end: 1200
									}}
									rangeLabels={{
										start: "$800",
										end: "$1200"
									}}
									defaultSelected={{
										start: 800,
										end: 900
									}}
								/>
							</div>
						</div>
					</div>

					<div className="col s9">
						<div className="row">
							<ResultCard
								onData={this.onData}
								appbaseField={this.props.mapping.name}
								size={30}
								showPagination={true}
								react={{
									and: ["CategorySensor", "RatingsSensor", "ItemSensor", "VehicleTypeSensor", "ModelSensor", "ColorSensor", "PriceSensor"]
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
