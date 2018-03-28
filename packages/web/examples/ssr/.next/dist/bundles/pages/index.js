module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./pages/index.css":
/***/ (function(module, exports) {



/***/ }),

/***/ "./pages/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Main; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__appbaseio_reactivesearch__ = __webpack_require__("@appbaseio/reactivesearch");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__appbaseio_reactivesearch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__appbaseio_reactivesearch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__appbaseio_reactivesearch_lib_server__ = __webpack_require__("@appbaseio/reactivesearch/lib/server");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__appbaseio_reactivesearch_lib_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__appbaseio_reactivesearch_lib_server__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__index_css__ = __webpack_require__("./pages/index.css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__index_css__);


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsxFileName = '/Users/grover/Desktop/appbase/reactivesearch/packages/web/examples/ssr/pages/index.js';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }








function renderBooks(data) {
	return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
		'div',
		{ className: 'flex book-content', key: data._id, __source: {
				fileName: _jsxFileName,
				lineNumber: 15
			}
		},
		__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement('img', { src: data.image, alt: 'Book Cover', className: 'book-image', __source: {
				fileName: _jsxFileName,
				lineNumber: 16
			}
		}),
		__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
			'div',
			{ className: 'flex column justify-center', style: { marginLeft: 20 }, __source: {
					fileName: _jsxFileName,
					lineNumber: 17
				}
			},
			__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
				'div',
				{ className: 'book-header', __source: {
						fileName: _jsxFileName,
						lineNumber: 18
					}
				},
				data.original_title
			),
			__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
				'div',
				{ className: 'flex column justify-space-between', __source: {
						fileName: _jsxFileName,
						lineNumber: 19
					}
				},
				__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
					'div',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 20
						}
					},
					__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
						'div',
						{
							__source: {
								fileName: _jsxFileName,
								lineNumber: 21
							}
						},
						'by ',
						__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
							'span',
							{ className: 'authors-list', __source: {
									fileName: _jsxFileName,
									lineNumber: 21
								}
							},
							data.authors
						)
					),
					__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
						'div',
						{ className: 'ratings-list flex align-center', __source: {
								fileName: _jsxFileName,
								lineNumber: 22
							}
						},
						__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
							'span',
							{ className: 'stars', __source: {
									fileName: _jsxFileName,
									lineNumber: 23
								}
							},
							Array(data.average_rating_rounded).fill('x').map(function (item, index) {
								return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement('i', { className: 'fas fa-star', key: index, __source: {
										fileName: _jsxFileName,
										lineNumber: 26
									}
								});
							}) // eslint-disable-line

						),
						__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
							'span',
							{ className: 'avg-rating', __source: {
									fileName: _jsxFileName,
									lineNumber: 29
								}
							},
							'(',
							data.average_rating,
							' avg)'
						)
					)
				),
				__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
					'span',
					{ className: 'pub-year', __source: {
							fileName: _jsxFileName,
							lineNumber: 32
						}
					},
					'Pub ',
					data.original_publication_year
				)
			)
		)
	);
}

var settings = {
	app: 'good-books-ds',
	credentials: 'nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d'
};

var singleListProps = {
	componentId: 'BookSensor',
	dataField: 'original_series.raw',
	defaultSelected: 'In Death',
	size: 100
};

var reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title.raw',
	className: 'result-list-container',
	from: 0,
	size: 5,
	onData: renderBooks,
	react: {
		and: ['BookSensor']
	}
};

var Main = function (_Component) {
	_inherits(Main, _Component);

	function Main() {
		_classCallCheck(this, Main);

		return _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).apply(this, arguments));
	}

	_createClass(Main, [{
		key: 'render',
		value: function render() {
			return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
				__WEBPACK_IMPORTED_MODULE_2__appbaseio_reactivesearch__["ReactiveBase"],
				_extends({}, settings, { initialState: this.props.store, __source: {
						fileName: _jsxFileName,
						lineNumber: 91
					}
				}),
				__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
					'div',
					{ className: 'row', __source: {
							fileName: _jsxFileName,
							lineNumber: 92
						}
					},
					__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
						'div',
						{ className: 'col', __source: {
								fileName: _jsxFileName,
								lineNumber: 93
							}
						},
						__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__appbaseio_reactivesearch__["SingleList"], _extends({}, singleListProps, {
							__source: {
								fileName: _jsxFileName,
								lineNumber: 94
							}
						}))
					),
					__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
						'div',
						{ className: 'col', __source: {
								fileName: _jsxFileName,
								lineNumber: 99
							}
						},
						__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__appbaseio_reactivesearch__["SelectedFilters"], {
							__source: {
								fileName: _jsxFileName,
								lineNumber: 100
							}
						}),
						__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__appbaseio_reactivesearch__["ReactiveList"], _extends({}, reactiveListProps, {
							onData: renderBooks,
							__source: {
								fileName: _jsxFileName,
								lineNumber: 101
							}
						}))
					)
				)
			);
		}
	}], [{
		key: 'getInitialProps',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
				return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.t0 = settings;
								_context.t1 = reactiveListProps;
								_context.t2 = singleListProps;
								_context.next = 5;
								return __WEBPACK_IMPORTED_MODULE_3__appbaseio_reactivesearch_lib_server___default()([_extends({}, singleListProps, {
									type: 'SingleList',
									source: __WEBPACK_IMPORTED_MODULE_2__appbaseio_reactivesearch__["SingleList"]
								}), _extends({}, reactiveListProps, {
									type: 'ReactiveList',
									source: __WEBPACK_IMPORTED_MODULE_2__appbaseio_reactivesearch__["ReactiveList"]
								})], null, settings);

							case 5:
								_context.t3 = _context.sent;
								return _context.abrupt('return', {
									settings: _context.t0,
									reactiveListProps: _context.t1,
									singleListProps: _context.t2,
									store: _context.t3
								});

							case 7:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function getInitialProps() {
				return _ref.apply(this, arguments);
			}

			return getInitialProps;
		}()
	}]);

	return Main;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);



/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./pages/index.js");


/***/ }),

/***/ "@appbaseio/reactivesearch":
/***/ (function(module, exports) {

module.exports = require("@appbaseio/reactivesearch");

/***/ }),

/***/ "@appbaseio/reactivesearch/lib/server":
/***/ (function(module, exports) {

module.exports = require("@appbaseio/reactivesearch/lib/server");

/***/ }),

/***/ "babel-runtime/regenerator":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map