import React from 'react';

const DropdownContext = React.createContext();

class DropdownLink extends React.Component {
	state = {
		open: false,
		selectedKey: null,
	};

	handleShowOverlay = () => {
		this.setState({
			open: true,
		});
	};

	handleCloseOverlay = () => {
		this.setState({
			selectedKey: null,
			open: false,
		});
	};

	handleKey = key => {
		const { selectedKey: prevKey } = this.state;
		this.setState(
			{
				selectedKey: key,
			},
			() => {
				const { selectedKey } = this.state;
				if (selectedKey === prevKey) {
					this.handleCloseOverlay();
				} else {
					this.handleShowOverlay();
				}
			},
		);
	};

	static Item = ({ children }) => (
		<DropdownContext.Consumer>{value => children(value)}</DropdownContext.Consumer>
	);

	render() {
		const { selectedKey, open } = this.state;
		return (
			<DropdownContext.Provider
				value={{
					selectedKey,
					handleKey: this.handleKey,
				}}
			>
				{open && (
					<div className="dropdown-header-overlay" onClick={this.handleCloseOverlay} />
				)}
				{this.props.children}
			</DropdownContext.Provider>
		);
	}
}

export default DropdownLink;
