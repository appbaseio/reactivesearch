/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/alt-text */
import styled from '@emotion/styled';
import { bool, func, object, string } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

const Container = styled.div`
	position: absolute;
	width: 100%;
	padding: 10px;
	background-color: white;
	box-shadow: rgb(0 0 0 / 20%) 0px 10px 15px;
	border-radius: 0px 0px 10px 10px;
	z-index: 1;
`;

const FileInput = styled.input`
	width: 100%;
	padding: 10px;
	/*visually hide file input*/
	opacity: 0;
	position: absolute;
	z-index: -1;
`;
const Preview = styled.div`
	position: relative;
	padding: 10px;
	margin: auto;
	width: min-content;
`;
const PreviewImg = styled.img`
	min-width: 100px;
	max-width: 250px;
`;

const ThemedSVG = styled.svg`
	color: ${props => props.theme.colors.primaryColor};
`;

const PlaceholderSVG = styled.svg`
	display: block;
	margin: auto;
`;

const StyledDeleteIcon = styled(ThemedSVG)`
	color: #0B6AFF;
	position: absolute;
	top: 10px;
	right: 10px;
	padding: 4px;
	background: rgb(250 250 250 / 90%);
`;

const Label = styled.label`
	cursor: pointer;
    color: ${props => props.theme.colors.primaryColor};
    text-decoration: underline;
`;
const URLInput = styled.input`
	display: block;
	margin: 5px 0px;
	padding: 5px;
	border-radius: 10px;
	border: 2px solid gray;
	width: 100%;
`;

const ORDivider = styled.div`
	display: flex;
	margin: 10px 0px;
`;

ORDivider.Divider = styled.hr`
	width: 100%;
`;

const ErrorMessage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 3rem;
`;

const ErrorIcon = styled(ThemedSVG)`
`;

ErrorMessage.Icon = ({ size = '50px' }) => (
	<ErrorIcon width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.5-5.009c0-.867.659-1.491 1.491-1.491.85 0 1.509.624 1.509 1.491 0 .867-.659 1.509-1.509 1.509-.832 0-1.491-.642-1.491-1.509zM11.172 6a.5.5 0 0 0-.499.522l.306 7a.5.5 0 0 0 .5.478h1.043a.5.5 0 0 0 .5-.478l.305-7a.5.5 0 0 0-.5-.522h-1.655z" fill="crimson" /></ErrorIcon>
);

ErrorMessage.Text = styled.div`
	text-align: center;
`;

ErrorMessage.Icon.propTypes = {
	size: string,
};

const Placeholder = ({ style }) => (
	<PlaceholderSVG style={style} width="100px" height="100px" viewBox="0 0 24 24" color="blue" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" strokeWidth="1.5" />
		<circle opacity="0.5" cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
		<path opacity="0.5" d="M5 13.307L5.81051 12.5542C6.73658 11.6941 8.18321 11.7424 9.04988 12.6623L11.6974 15.4727C12.2356 16.0439 13.1166 16.1209 13.7457 15.6516C14.6522 14.9753 15.9144 15.0522 16.7322 15.8334L19 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
	</PlaceholderSVG>
);

const PlaceholderText = styled.div`
	text-align: center;
`;

const DeleteIcon = props => (
	<StyledDeleteIcon {...props} width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M10 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M14 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	</StyledDeleteIcon>
);

Placeholder.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	style: object,
};


const ImageError = () => (
	<ErrorMessage>
		<ErrorMessage.Icon />
		<ErrorMessage.Text>
			Use an image in one of the formats
			<code>.jpeg</code>, <code>.png</code>,
			<code>.webp</code>, <code>.bmp</code> and <code>.tif</code>
		</ErrorMessage.Text>
	</ErrorMessage>);


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
export const ImageDropdown = ({ imageValue, onChange }) => {
	const fileInputRef = useRef();
	const imageRef = useRef();
	const [url, setURL] = useState('');
	const [showError, setShowError] = useState(false);
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
		const fileInput = fileInputRef.current;
		if (fileInput) {
			const reader = new FileReader();

			reader.addEventListener(
				'load',
				() => {
					if (!reader.result) {
						setShowError(true);
						return;
					}
					// convert image file to base64 string
					onChange(reader.result);
					setShowError(false);
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
	  };
	  const handleDrag = (ev) => {
		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault();
	  };

	return (
		<Container
			onDrop={handleFileDrop}
			onDragOver={handleDrag}
		>
			{imageValue && !showError
				? (
					<Preview>
						<PreviewImg ref={imageRef} src={imageValue} />
						<DeleteIcon onClick={handleDelete} />
					</Preview>
				) : null}

			{!imageValue
				? (
					<div>
						{showError ? <ImageError /> : <Placeholder />}
						<PlaceholderText>
							<span>Drag an image here or </span>
							<Label>
								upload a file
								<FileInput ref={fileInputRef} onChange={handleFileSelect} type="file" accept="image/*" />
							</Label>
						</PlaceholderText>
						<ORDivider>
							<ORDivider.Divider />
							<div>OR</div>
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
					</div>
				) : null}
		</Container>
	);
};

ImageDropdown.propTypes = {
	imageValue: string,
	onChange: func.isRequired,
	visible: bool,
};
