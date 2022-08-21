import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { LaunchTask } from "./model";
import { message } from "antd";

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

/**
 * 加载下一次发射数据的 GraphQL 查询
 */
export function useNextLaunchQuery() {
  const [nextLaunch, setNextLaunch] = useState({
    data: {} as LaunchTask,
    loading: true,
  });

  useQuery<{ launchNext: LaunchTask }>(NEXT_LAUNCH, {
    onCompleted(data) {
      setNextLaunch({
        data: data.launchNext,
        loading: false,
      });
    },
    onError(err) {
      console.log("onError");
      message.error("Next launch info error : " + err.message);
      setNextLaunch({
        ...nextLaunch,
        loading: false,
      });
    },
  });
  return nextLaunch;
}

const LAUNCHES_PAST = gql`
  query LaunchesPast($offset: Int!, $limit: Int!) {
    launchesPast(limit: $limit, offset: $offset) {
      id
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
      links {
        article_link
        video_link
      }
      rocket {
        rocket_name
        rocket_type
      }
      launch_success
      details
    }
  }
`;

/**
 * 加载发射历史数据的 GraphQL 查询
 */
export function useLaunchListQuery() {
  const LIMIT = 10;

  const [hasMore, setHasMore] = useState(true);
  const [dataList, setDataList] = useState<LaunchTask[]>([]);

  const onCompleted = (data: LaunchTask[]) => {
    setDataList([...dataList, ...data]);
    if (data.length < LIMIT) {
      setHasMore(false);
    }
  };

  const { fetchMore } = useQuery<{ launchesPast: LaunchTask[] }>(LAUNCHES_PAST, {
    variables: {
      offset: 0,
      limit: LIMIT,
    },
    onCompleted(data) {
      onCompleted(data.launchesPast);
    },
    onError(err) {
      message.error("Launch history info error : " + err.message);
    },
  });

  const loadMoreData = async () => {
    const moreData = await fetchMore({
      variables: {
        offset: dataList.length,
        limit: LIMIT,
      },
    });
    onCompleted(moreData.data.launchesPast);
  };
  return {
    data: dataList,
    hasMore,
    loadMoreData,
  };
}
