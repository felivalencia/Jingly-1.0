import React from "react";
import { useState } from "react";

const Test = () => {
  const [router, setRouter] = useState(1);

  const handleClick = () => {};

  return (
    <div className="wrapper">
      {router === 1 && (
        <div className="animate__animated animate__bounceInDown">
          <h2>What do you feel like listening to?</h2>
          <button onClick={handleClick}>Click me</button>
        </div>
      )}

      {router === 2 && (
        <div className="animate__animated animate__bounceInDown">
          <h2>What do you feel like listening to?</h2>
          <button onClick={handleClick}>Click me</button>
        </div>
      )}
    </div>
  );
};

export default Test;
