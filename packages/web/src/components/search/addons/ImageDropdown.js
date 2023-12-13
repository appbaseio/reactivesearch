import { bool, func, object, string } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import {
	Container,
	DropPlaceholder,
	ErrorMessage,
	FileInput,
	Label,
	ORDivider,
	PlaceholderText,
	Preview,
	PreviewImg,
	URLInput,
	StyledDeleteIcon,
} from './ImageDropdownStyles';
import { Placeholder } from '../../shared/Icons';

const ImageError = () => (
	<ErrorMessage>
		<ErrorMessage.Icon />
		<ErrorMessage.Text>
			Use an image in one of the formats
			<code>.jpeg</code>, <code>.png</code>,<code>.webp</code>, <code>.bmp</code> and{' '}
			<code>.tif</code>
		</ErrorMessage.Text>
	</ErrorMessage>
);

/*
 */
/**
 * *
 * image value is base64 encoded string
 * onChange is called when a new image is selected or removed
 * onChange is called when a url is changed or removed
 *
 * Image modal is responsible for showing the image preview
 * Image modal is responsible for taking user input and providing a base64 encoded string
 *
 * There are three ways to input an image
 * 1. OS file browser
 * 2. Drag and drop
 * 3. URL
 *
 * When an image is selected, the image is converted to a base64 encoded string
 *
 * 1. Using the OS file browser
 *
 * The file browser maintains an internal state of the file
 * which is accesible by input.files, where input is the file input element.
 * When the file input element is unmounted this internal state is lost.
 * Hence we should always use the imageValue provided by the user for the preview image
 * On delete, we should also call onChange provided by the user with an empty string.
 *
 * 2. Drag and drop
 *
 * 3. URL
 * */
// eslint-disable-next-line import/prefer-default-export
export const ImageDropdown = ({
	imageValue,
	onChange,
	onOutsideClick,
}) => {
	const fileInputRef = useRef();
	const imageRef = useRef();
	const containerRef = useRef();
	const [url, setURL] = useState('');
	const [showError, setShowError] = useState(false);
	const [isDropping, setIsDropping] = useState(false);
	const urlValueTimer = useRef(null);

	const handleDelete = () => {
		const image = imageRef.current;
		if (image) {
			onChange('');
			setURL('');
			setShowError(false);
		}
	};

	const readFile = (file) => {
		const reader = new FileReader();

		reader.addEventListener(
			'load',
			() => {
				const img = document.createElement('img');
				img.onload = () => {
					const MAX_WIDTH = 512;
					const MAX_HEIGHT = 512;

					let width = img.width;
					let height = img.height;

					// Change the resizing logic
					if (width > height) {
						if (width > MAX_WIDTH) {
							height *= MAX_WIDTH / width;
							width = MAX_WIDTH;
						}
					} else if (height > MAX_HEIGHT) {
						width *= MAX_HEIGHT / height;
						height = MAX_HEIGHT;
					}

					// Dynamically create a canvas element
					const canvas = document.createElement('canvas');

					canvas.width = width;
					canvas.height = height;

					// const canvas = document.getElementById("canvas");
					const ctx = canvas.getContext('2d');

					// Actual resizing
					ctx.drawImage(img, 0, 0, width, height);

					// Show resized image in preview element
					const dataurl = canvas.toDataURL(file.type);

					// Below would change the preview if the user changes the imageValue respecting below
					onChange(dataurl);
					setShowError(false);
				};
				img.onerror = () => {
					if (!img.width) {
						onChange('');
						setShowError(true);
					}
				};

				if (!reader.result) {
					setShowError(true);
					return;
				}
				img.src = reader.result;
			},
			false,
		);
		reader.addEventListener('error', () => {
			setShowError(true);
		});

		if (file) {
			reader.readAsDataURL(file);
		} else {
			onChange('');
		}
	};

	useEffect(() => {
		const imagePreview = imageRef.current;
		if (imagePreview && imageValue) {
			const image = new Image();
			image.onerror = () => {
				if (!image.width) {
					onChange('');
					setShowError(true);
				}
			};
			image.src = imageValue;
		}
	}, [imageValue]);

	useEffect(() => {
		const handleEvent = (e) => {
			const container = containerRef.current;
			if (container) {
				if (!container.contains(e.target)) {
					onOutsideClick(e);
				}
			}
		};
		window.addEventListener('click', handleEvent);
		return () => {
			window.removeEventListener('click', handleEvent);
		};
	}, []);

	useEffect(() => {
		const handleDrag = (e) => {
			if (!containerRef.current.contains(e.target) && isDropping) {
				setIsDropping(false);
			}
		};
		window.addEventListener('dragover', handleDrag);

		return () => window.removeEventListener('dragover', handleDrag);
	}, [isDropping]);

	const fetchImageFromURL = (imageURL) => {
		const DEBOUNCE_DELAY = 1000;
		if (urlValueTimer.current) {
			clearTimeout(urlValueTimer.current);
		}
		urlValueTimer.current = setTimeout(async () => {
			if (imageURL) {
				try {
					const response = await fetch(imageURL);
					const blob = await response.blob();
					const fileName = imageURL.split('/').pop();
					const fileType = blob.type;

					const file = new File([blob], fileName, { type: fileType });
					readFile(file);
				} catch (e) {
					console.error(e);
				}
			}
		}, DEBOUNCE_DELAY);
	};

	const handleFileSelect = () => {
		const fileInput = fileInputRef.current;
		if (fileInput) {
			const file = fileInput.files[0];
			readFile(file);
		}
	};
	const handleFileDrop = (ev) => {
		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault();
		if (!imageValue) {
			if (ev.dataTransfer.items) {
				// Use DataTransferItemList interface to access the file(s)
				[...ev.dataTransfer.items].forEach((item) => {
					// If dropped items aren't files, reject them
					if (item[0].kind === 'file') {
						const file = item[0].getAsFile();
						// TODO: Below is same as onChange
						readFile(file);
					}
				});
			} else {
				// Use DataTransfer interface to access the file(s)
				[...ev.dataTransfer.files].forEach((file) => {
					readFile(file);
				});
			}
		}
		setIsDropping(false);
	};

	const handleDrag = (e) => {
		e.preventDefault();
		if (containerRef.current.contains(e.target) && !isDropping) {
			setIsDropping(true);
		}
	};

	return (
		<Container onDrop={handleFileDrop} onDragOver={handleDrag} ref={containerRef}>
			{isDropping ? (
				<DropPlaceholder>Drop an image here</DropPlaceholder>
			) : (
				<ImageDropdown.Content
					imageValue={imageValue}
					showError={showError}
					handleDelete={handleDelete}
					handleFileSelect={handleFileSelect}
					fileInputRef={fileInputRef}
					imageRef={imageRef}
					setURL={setURL}
					fetchImageFromURL={fetchImageFromURL}
					url={url}
				/>
			)}
		</Container>
	);
};

ImageDropdown.Content = ({
	imageValue,
	showError,
	handleDelete,
	handleFileSelect,
	fileInputRef,
	imageRef,
	setURL,
	fetchImageFromURL,
	url,
}) => (
	<div>
		{imageValue && !showError ? (
			<Preview>
				<PreviewImg ref={imageRef} src={imageValue} />
				<StyledDeleteIcon onClick={handleDelete} />
			</Preview>
		) : null}

		{!imageValue ? (
			<Container.Body>
				{showError ? <ImageError /> : <Placeholder />}
				<PlaceholderText>
					<span>Drag an image here or </span>
					{/* eslint-disable-next-line jsx-a11y/label-has-for */}
					<Label>
						upload a file
						<FileInput
							ref={fileInputRef}
							onChange={handleFileSelect}
							type="file"
							accept=".svg,.png,.jpg,.jpeg,.bmp,.tif,.webp"
						/>
					</Label>
				</PlaceholderText>
				<ORDivider>
					<ORDivider.Divider />
					<ORDivider.Text>OR</ORDivider.Text>
					<ORDivider.Divider />
				</ORDivider>
				<URLInput
					type="text"
					placeholder="Paste an image link"
					value={url}
					onChange={(e) => {
						setURL(e.target.value);
						fetchImageFromURL(e.target.value);
					}}
				/>
			</Container.Body>
		) : null}
	</div>
);

ImageDropdown.Content.propTypes = {
	imageValue: string,
	showError: bool,
	handleDelete: func.isRequired,
	handleFileSelect: func.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	fileInputRef: object.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	imageRef: object.isRequired,
	setURL: func.isRequired,
	fetchImageFromURL: func.isRequired,
	url: string,
};

ImageDropdown.propTypes = {
	imageValue: string,
	onChange: func.isRequired,
	visible: bool,
	/**
	 * Called when user clicks outside the dropdown
	 * */
	onOutsideClick: func.isRequired,
};
