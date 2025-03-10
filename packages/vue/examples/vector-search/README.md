# Vector Search with ReactiveSearch Vue

This example demonstrates vector search in ReactiveSearch Vue using the `vectorDataField` and `candidates` props. It shows how to implement vector search on a dataset of startup companies.

## Features

- Uses the `vectorDataField` prop to specify which field contains the vector data
- Uses the `candidates` prop to control how many nearest neighbors to return
- Integrates standard ReactiveSearch components like SearchBox and MultiList with vector search

## Running the Example

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## How It Works

1. The SearchBox component's input value is used for the vector search
2. The `vectorDataField` prop in ReactiveList points to the vector field in your index
3. The `candidates` prop controls how many nearest neighbors to return

## Related Concepts

- [Vector Search Documentation](https://docs.appbase.io/docs/search/vector-search)
- [kNN Search (k-Nearest Neighbors)](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html)