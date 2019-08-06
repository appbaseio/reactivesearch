const { writeFileSync } = require('fs');
const { join } = require('path');
const sanitize = require('sanitize-html');

const query = `
{
  allMarkdownRemark {
    edges {
      node {
        html
        frontmatter {
		  title
          meta_description
          meta_title
        }
        fields {
          slug
        }
        tableOfContents
        headings {
          value
        }
      }
    }
  }
}
`;

// TODO: use a library for a more versatile stop words, probably use stemmer also
const StopWords = {
	a: true,
	an: true,
	the: true,
	to: true,
};

const TOKENIZER_REGEX = /[^a-zа-яё0-9\-\.']+/i;

function tokenize(text) {
	const uniqueWords = {};

	return text
		.split(TOKENIZER_REGEX) // Split words at boundaries
		.map(word => word.toLowerCase())
		.filter(word => {
			// remove empty tokens and stop-words
			return word != '' && StopWords[word] === undefined;
		})
		.filter(word => {
			if (uniqueWords[word] === undefined) {
				uniqueWords[word] = true;
				return true;
			}
			return false;
		});
}

function getTokens(text) {
	const sanitizedText = sanitize(text, {
		allowedTags: [],
		allowedAttributes: [],
	});
	return tokenize(sanitizedText);
}

function getHashId(heading, tableOfContents, startFrom = 0) {
	const headingPos = tableOfContents.indexOf(`>${heading}<`, startFrom);
	const hashPos = tableOfContents.lastIndexOf('#', headingPos);

	if (headingPos === -1 || hashPos === -1) {
		return null;
	}
	const end = headingPos - 1; // subtract 1 for "
	return {
		hashId: tableOfContents.substring(hashPos, end),
		endsAt: headingPos + heading.length - 2, // subtract 2 for > and <
	};
}

exports.createPages = async ({ graphql }) => {
	const result = await graphql(query);

	if (result.errors) {
		throw new Error(result.errors.join(`, `));
	}

	const searchData = [];

	result.data.allMarkdownRemark.edges.forEach(edge => {
		const { html, headings, tableOfContents } = edge.node;
		const { slug } = edge.node.fields;
		const { title, meta_title, meta_description } = edge.node.frontmatter;
		if (headings.length) {
			let prevHashIndex = 0;
			let prevHashId = '';
			let prevEndsAt = 0; // keep track of last matched heading
			headings.forEach(({ value }, index) => {
				const hashObject = getHashId(value, tableOfContents, prevEndsAt);
				if (hashObject) {
					const { hashId, endsAt } = hashObject;
					if (hashId) {
						const hashPos = html.indexOf(hashId, prevHashIndex);
						searchData.push({
							title,
							heading: prevHashId === '' ? '' : headings[index - 1].value,
							tokens: getTokens(html.substring(prevHashIndex, hashPos)),
							url: slug + prevHashId,
						});
						prevHashIndex = hashPos;
						prevHashId = hashId;
						prevEndsAt = endsAt;
					}
				}
			});
			// push for the last heading
			searchData.push({
				title,
				meta_title,
				meta_description,
				heading: prevHashId === '' ? '' : headings[headings.length - 1].value,
				tokens: getTokens(html.substring(prevHashIndex)),
				url: slug + prevHashId,
			});
		} else {
			searchData.push({
				title,
				meta_title,
				meta_description,
				heading: '',
				tokens: getTokens(html),
				url: slug, // no hash since result should match the root url
			});
		}
	});

	const dir = `${process.cwd()}/src/data`;
	const path = join(dir, './search.index.json');
	const data = JSON.stringify(searchData);

	writeFileSync(path, data);
	console.log('Created search index at', dir); // eslint-disable-line
};
