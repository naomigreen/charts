import React, { useState, useEffect } from "react";
import axios from "axios";
import Bubble from "./charts/Bubble";

function FetchData() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/data");
      setData(result.data);
    };
    try {
      fetchData();
    } catch (e) {
      setErrorMsg(e.message);
      console.log(errorMsg);
    }
  }, [errorMsg]);

  return (
    <div>
      <h2>D3 Charts in React</h2>
      <Bubble apiData={data} />
    </div>
  );
}

export default FetchData;
