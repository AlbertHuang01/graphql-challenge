import React from "react";
import "./App.css";
import { BackTop, Card } from "antd";
import NextLaunch from "./NextLaunch";
import { ContextType } from "./model";
import { useLaunchListQuery, useNextLaunchQuery } from "./hooks";
import { LaunchList } from "./LaunchList";

export const APP_CONFIG = React.createContext<ContextType>(null);

function App() {
  const nextLaunch = useNextLaunchQuery();
  const launchList = useLaunchListQuery();

  return (
    <APP_CONFIG.Provider
      value={{
        nextLaunch,
        launchList,
      }}
    >
      <Card title="SpaceX Launch Plan" bordered={false}>
        <NextLaunch />
        <LaunchList />
        <BackTop />
      </Card>
    </APP_CONFIG.Provider>
  );
}

export default App;
