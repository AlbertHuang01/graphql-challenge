import { gql, useQuery } from "@apollo/client";
import { LaunchTask } from "./model";
import { Descriptions, Tooltip, Typography } from "antd";
import { useState } from "react";
import { LunchPastDetail } from "./LaunchList";

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

  useQuery<{ launchNext: LaunchTask }>(NEXT_LAUNCH, {
    onCompleted(data) {
      setNextLaunch(data.launchNext);
    },
  });

  return (
    <Descriptions title="Next Launch" style={{ width: "80%" }}>
      <Descriptions.Item label="id">{nextLaunch.id}</Descriptions.Item>
      <Descriptions.Item label="mission_name">
        <LunchPastDetail item={nextLaunch}>
          <Tooltip title={"view detail"}>
            <Typography.Link>{nextLaunch.mission_name}</Typography.Link>
          </Tooltip>
        </LunchPastDetail>
      </Descriptions.Item>
      <Descriptions.Item label="launch_date_local">
        {nextLaunch.launch_date_local}
      </Descriptions.Item>
    </Descriptions>
  );
}
