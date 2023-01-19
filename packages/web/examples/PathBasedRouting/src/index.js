import ReactDOM from 'react-dom/client';
import SearchUI from './components/SearchUI';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SearchUI />,
  },
  {
    path: '/:category',
    element: <SearchUI />,
  },
  {
    path: '/:category/:subCategory',
    element: <SearchUI />,
  },
]);
const Main = () => <RouterProvider router={router} />;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
