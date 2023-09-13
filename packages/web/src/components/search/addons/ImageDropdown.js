/* eslint-disable jsx-a11y/alt-text */
import styled from '@emotion/styled';
import React, { useRef } from 'react';

const Container = styled.div`
	position: absolute;
	width: 100%;
	padding: 10px;
	background-color: lightgray;
`;

const FileInput = styled.input`
	width: 100%;
	padding: 10px;
`;

const Preview = styled.img`
	display: block;
	width: 100%;
`;

const getBase64 = (inputString) => {
	// Define a generic regular expression to match any data URI and capture the Base64 part
	const regex = /^data:[a-zA-Z0-9/+]+;base64,([A-Za-z0-9+/=]+)/;

	// Use the exec() method to extract the Base64 string
	const matches = regex.exec(inputString);

	// Check if there was a match
	if (matches && matches.length > 1) {
		const base64String = matches[1];
		return base64String;
	}
	console.error('No Base64 string found in the input.');
	return '';
};

/*
    Image modal is responsible for showing the image preview
    Image modal is responsible for taking user input and providing a base64 encoded string
*/
// image value is base64 encoded string
// onChange is called when a new image is selected or removed
// onChange is called when a url is changed or removed

// eslint-disable-next-line
export const ImageDropdown = ({ imageValue, onChange, visible }) => {
	const fileInputRef = useRef();
	const imageRef = useRef();

	const handleChange = () => {
		const fileInput = fileInputRef.current;
		const image = imageRef.current;
		if (fileInput && image) {
			const preview = image;
			const file = fileInput.files[0];
			const reader = new FileReader();

			reader.addEventListener(
				'load',
				() => {
					// convert image file to base64 string
					preview.src = reader.result;
					onChange((getBase64(reader.result)));
				},
				false,
			);

			if (file) {
				reader.readAsDataURL(file);
			} else {
				preview.src = '';
				onChange('');
			}
		}
	};

	return (
		<Container style={visible ? { visibility: 'visible' } : { visibility: 'hidden' }}>
			<FileInput ref={fileInputRef} onChange={handleChange} type="file" accept="image/*" />
			<Preview ref={imageRef} />
		</Container>
	);
};
