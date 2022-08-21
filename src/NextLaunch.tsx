import { gql, useQuery } from "@apollo/client";
import { LaunchTask } from "./model";
import { Descriptions, message, Spin, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import { LaunchDetail } from "./LaunchList";
import { LoadingOutlined } from "@ant-design/icons";

const NEXT_LAUNCH = gql`
  query NextLaunch {
    launchNext {
      launch_date_local
      id
      launch_site {
        site_name_long
      }
      launch_success
      links {
        article_link
        video_link
      }
      rocket {
        rocket_name
        rocket_type
      }
      details
      mission_name
    }
  }
`;

export default function NextLaunch() {
  const [nextLaunch, setNextLaunch] = useState({} as LaunchTask);
  const [loading, setLoading] = useState(true);

  useQuery<{ launchNext: LaunchTask }>(NEXT_LAUNCH, {
    onCompleted(data) {
      setNextLaunch(data.launchNext);
      setLoading(false);
    },
    onError(err) {
      message.error("Next launch info error : " + err.message);
      setLoading(false);
    },
  });

  return (
    <Spin spinning={loading} indicator={<LoadingOutlined />}>
      <Descriptions title="Next Launch" style={{ width: "80%" }}>
        <Descriptions.Item label="id">{nextLaunch.id}</Descriptions.Item>
        <Descriptions.Item label="mission name">
          {nextLaunch.id && (
            <LaunchDetail item={nextLaunch} isNextLaunch>
              <Tooltip title={"view detail"}>
                <Typography.Link>{nextLaunch.mission_name}</Typography.Link>
              </Tooltip>
            </LaunchDetail>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="launch date">{nextLaunch.launch_date_local}</Descriptions.Item>
      </Descriptions>
    </Spin>
  );
}
