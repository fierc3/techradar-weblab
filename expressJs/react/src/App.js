import './App.css';
import React from "react";
import Overview from './components/Overview';
import { useRoutes } from 'react-router';

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Overview /> },

  ]);
  return routes;
}

export default App;
