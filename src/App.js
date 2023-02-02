import { Button, Divider, TextField } from "@mui/material";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { useState } from "react";
import { bbox, point, polygon } from "turf";
import "./App.css";

function App() {
  const [inputJSON, setInputJSON] = useState("");
  const [count, setCount] = useState(100);
  const [isInvalidInput, setIsInvalidInput] = useState(false);
  const [points, setPoints] = useState([]);

  function isInvalidJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return true;
    }
    return false;
  }

  const onInputChange = (e) => {
    setInputJSON(e.target.value);
    setIsInvalidInput(isInvalidJsonString(e.target.value));
  };

  const onCountChange = (e) => {
    const regex = new RegExp("^[0-9]+$");
    if (regex.test(e.target.value)) {
      setIsInvalidInput(false);
      setCount(Math.min(e.target.value, 1000));
    } else {
      setIsInvalidInput(true);
      setCount(e.target.value);
    }
  };

  const onCalculateClick = () => {
    const boudnary = JSON.parse(inputJSON);
    const bounds = bbox(boudnary);
    let points = [];
    while (points.length < count) {
      const randomPoint = [
        (Math.random() * (bounds[2] - bounds[0]) + bounds[0]).toFixed(6),
        (Math.random() * (bounds[3] - bounds[1]) + bounds[1]).toFixed(6),
      ];
      if (booleanPointInPolygon(randomPoint, boudnary))
        points.push(randomPoint);
    }
    setPoints(points);
  };

  const getString = (points) => {
    let str = "";
    points.forEach((point) => {
      str += `${point[0]}, ${point[1]}\n`;
    });
    return str;
  };

  const onClearClick = () => {
    setPoints([]);
    navigator.clipboard.writeText("");
  }

  const copyClipboardClick = () => {
    navigator.clipboard.writeText(getString(points));
  }

  return (
    <div className="App">
      <div className="heading"> Location Generator</div>
      <Divider />
      <div className="app-content">
        <div className="left-content">
          <div>Input Valid Geojson Here:</div>
          <textarea
            className="input-textarea"
            value={inputJSON}
            onChange={onInputChange}
            placeholder={`input valid Geojson Here.\nGeoJson of type Polygon/MultiPolygon only.`}
          />
          <TextField
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            label="Count"
            value={count}
            onChange={onCountChange}
          />

          <Button
            variant="contained"
            disabled={isInvalidInput || !inputJSON}
            onClick={onCalculateClick}
          >
            Calculate
          </Button>
          {isInvalidInput && (
            <div className="error-message">
              Please Enter Valid JSON only !!!
            </div>
          )}
        </div>
        <div className="right-content">
          <div>Result:</div>
          <textarea
            placeholder="RESULT"
            className="input-textarea"
            readOnly
            value={getString(points)}
          />
          <Button
            variant="outlined"
            onClick={onClearClick}
          >
            clear
          </Button>
          <Button
            variant="contained"
            disabled={!points?.length}
            onClick={copyClipboardClick}
          >
            copy
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
