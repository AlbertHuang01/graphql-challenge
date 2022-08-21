import { Descriptions, Spin, Tooltip, Typography } from "antd";
import React, { useContext } from "react";
import { LaunchDetail } from "./LaunchList";
import { LoadingOutlined } from "@ant-design/icons";
import { APP_CONFIG } from "./App";

/**
 * 下一次发射信息展示
 */
export default function NextLaunch() {
  const {
    nextLaunch: { loading, data },
  } = useContext(APP_CONFIG)!;

  return (
    <Spin spinning={loading} indicator={<LoadingOutlined />}>
      <Descriptions title="Next Launch" style={{ width: "80%" }}>
        <Descriptions.Item label="id">{data.id}</Descriptions.Item>
        <Descriptions.Item label="mission name">
          {data.id && (
            <LaunchDetail item={data} isNextLaunch>
              <Tooltip title={"view detail"}>
                <Typography.Link>{data.mission_name}</Typography.Link>
              </Tooltip>
            </LaunchDetail>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="launch date">{data.launch_date_local}</Descriptions.Item>
      </Descriptions>
    </Spin>
  );
}
