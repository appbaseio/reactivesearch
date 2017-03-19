import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
	ReactiveBase,
	CategorySearch,
	NestedList,
	MultiList,
	RangeSlider,
	ReactivePaginatedList
} from "../../app/app.js";
import ReactStars from "react-stars";

require("./ecommerce.scss");

class Main extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
		this.itemQuery = this.itemQuery.bind(this);
	}

	itemQuery(value) {
		if(value) {
			return {
				"match": {
					"name": value
				}
			};
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
			<a className="product"
				href="#"
				key={markerData._id}>
				<div className="product__price">${marker.price}</div>
				{ marker.vehicleType == "other" || marker.vehicleType == "unknown" ?
					<div className="product__image" style={{"backgroundImage": "url(/examples/ecommerce/images/car.jpg)"}}></div> :
					<div className="product__image" style={{"backgroundImage": `url(/examples/ecommerce/images/${marker.vehicleType.replace(/ /g,"-")}/${marker.color}.jpg)`}}></div>
				}
				<div className="product__info">{marker.name}</div>
				<div className="product__seller">
					{marker.seller}

					<ReactStars
						count={5}
						value={marker.rating}
						size={20}
						color1={"#bbb"}
						edit={false}
						color2={"#ffd700"}
					/>
				</div>
				<div className="product__footer">
					<span className="tag">{marker.model}</span>
					<span className="tag">{marker.vehicleType}</span>
					{ marker.fuelType ? <span className="tag">{marker.fuelType}</span> : null }

					<span className="metadata">REGD. {marker.yearOfRegistration}</span>
				</div>
			</a>
		);
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
							customQuery={this.itemQuery}
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
							<ReactivePaginatedList
								onData={this.onData}
								appbaseField={this.props.mapping.name}
								size={30}
								react={{
									and: ["CategorySensor", "ItemSensor", "VehicleTypeSensor", "ModelSensor", "ColorSensor", "PriceSensor"]
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
