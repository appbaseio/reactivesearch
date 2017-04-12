### Installation

```
git clone git@github.com:appbaseio/reactivesearch.git && cd reactivesearch
npm install (or yarn)
cd website/
npm install (or yarn)
bower install
```

### How To Run

Use the `dev` branch for development.

In the project root:

```
npm start (or yarn start)
```

In the website/ directory:

```
gulp watch
```

will run the website in live mode.

### File Paths

All HTML files are under pages/ and partials/.

All SCSS files are under assets/styles.

### Compiling

```
gulp
```

### Misc Tasks

- `yarn run imagemin` minifies all images from `assets/images` to `dist/images`. Add raw images to `assets/images` and run this command.
