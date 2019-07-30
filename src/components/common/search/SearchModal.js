import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import Search from './Search';
import SearchInput from './SearchInput';
import Icon from '../Icon';

class SearchModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			modalIsOpen: false,
		};

		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	openModal() {
		this.setState(() => {
			return { modalIsOpen: true };
		});
	}

	closeModal() {
		this.setState(() => {
			return { modalIsOpen: false };
		});
	}

	componentDidMount() {
		Modal.setAppElement(`#___gatsby`);
	}

	render() {
		return (
			<>
				<SearchInput
					theme={this.props.theme}
					isHome={this.props.isHome}
					onClick={this.openModal}
				/>
				<Modal
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					shouldFocusAfterRender
					contentLabel="Search"
					shouldCloseOnEsc
					shouldReturnFocusAfterClose={false}
					className="search-modal br5 mw-m center left-5 right-5 top-5 left-15-ns right-15-ns top-15-ns bg-white absolute mb10 pa5 pt10 pb10 pa10-ns shadow-3"
					overlayClassName="search-modal-overlay fixed absolute--fill flex flex-column items-center z-999"
					bodyOpenClassName="body-modal-open z-9999"
				>
					<div
						className="absolute pa4 top-0 right-0 pointer"
						onClick={this.closeModal}
						data-cy="close-modal"
					>
						<Icon name="close" className="fill-midgrey w3 h-auto" />
					</div>
					<div className="relative">
						<Icon
							name="search"
							className="fill-midgrey-l1 w4 h-auto absolute search-modal-input-field left-3"
						/>
						<label htmlFor="globalsearch" className="clip">
							Search
						</label>
						<Search />
					</div>
				</Modal>
			</>
		);
	}
}

SearchModal.defaultProps = {
	isHome: false,
};

SearchModal.propTypes = {
	theme: PropTypes.shape({
		icon: PropTypes.string,
		searchBox: PropTypes.string,
	}),
	isHome: PropTypes.bool,
};

export default SearchModal;
