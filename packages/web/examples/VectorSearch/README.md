# Vector Search Example

This example demonstrates how to use the vector search capabilities in ReactiveSearch. Vector search lets you perform semantic similarity searches using embeddings.

## Features

- Uses `vectorDataField` prop to specify the vector field in your index
- Uses `candidates` prop to control the number of nearest neighbors to find
- Combines vector search with traditional filters using `MultiList`
- Shows how the `react` prop connects components for complex queries

## How it works

1. The SearchBox component captures user input
2. The value from SearchBox is used as input for the vector search
3. The ReactiveList component uses the `vectorDataField` to search by semantic similarity
4. Facet filtering is applied with the MultiList component

## Requirements

- An Elasticsearch/OpenSearch cluster with vector search capabilities
- An index with vector embeddings
- The appropriate mappings for vector fields

## Running this example

```bash
# Install dependencies
npm install

# Start the development server
npm start
```