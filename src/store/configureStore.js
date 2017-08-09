import { createStore } from "redux";
import rootReducer from "../reducers";

export default function configureStore() {
	return createStore(
		rootReducer
	);
}
