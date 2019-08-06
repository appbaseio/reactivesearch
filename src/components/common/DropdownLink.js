import React from 'react';

const DropdownContext = React.createContext();

class DropdownLink extends React.Component {
	state = {
		selectedKey: null,
	};

	handleCloseOverlay = () => {
		this.setState({
			selectedKey: null,
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
				}
			},
		);
	};

	static Item = ({ children }) => (
		<DropdownContext.Consumer>{value => children(value)}</DropdownContext.Consumer>
	);

	render() {
		const { selectedKey } = this.state;
		return (
			<DropdownContext.Provider
				value={{
					selectedKey,
					handleKey: this.handleKey,
				}}
			>
				{this.props.children}
			</DropdownContext.Provider>
		);
	}
}

export default DropdownLink;
