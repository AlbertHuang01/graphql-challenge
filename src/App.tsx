import React from "react";
import "./App.css";
import { BackTop, Card } from "antd";
import NextLaunch from "./NextLaunch";
import { LaunchList } from "./LaunchList";

function App() {
  return (
    <Card title="SpaceX Launch Plan" bordered={false}>
      <NextLaunch />
      <LaunchList />
      <BackTop />
    </Card>
  );
}

export default App;
