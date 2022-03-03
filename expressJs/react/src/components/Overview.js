import '../App.css';
import React, { useState, useEffect } from "react";
import { config } from '../Constants';


var ENDPOINT = config.url.API_URL;

const Overview = () => {
  const [test, setTest] = useState("NOTYETLOADED");

  return (
    <main className="area" >
      <h1> TECHRADAR by fierc3 🐺</h1>
      <h2>Endpoint: {ENDPOINT}</h2>
    </main>
  );
}

export default Overview;