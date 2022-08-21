import React from "react";
import "./App.css";
import { Card } from "antd";
import { LaunchList } from "./LaunchList";
import NextLaunch from "./NextLaunch";

function App() {
  return (
    <Card title="SpaceX Launch Plan" bordered={false}>
      <NextLaunch />
      <LaunchList />
    </Card>
  );
}

export default App;
