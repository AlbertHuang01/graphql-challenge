import React, { useState } from "react";
import { LaunchTask } from "./model";
import { gql, useQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { ArrowsAltOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card, message, Modal, Tag, Timeline, Typography } from "antd";

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

export function LaunchList() {
  const LIMIT = 10;

  const [hasMore, setHasMore] = useState(true);
  const [dataList, setDataList] = useState<LaunchTask[]>([]);
  const { fetchMore } = useQuery<{ launchesPast: LaunchTask[] }>(LAUNCHES_PAST, {
    variables: {
      offset: 0,
      limit: LIMIT,
    },
    onCompleted(data) {
      setDataList([...dataList, ...data.launchesPast]);
      if (data.launchesPast.length < LIMIT) {
        setHasMore(false);
      }
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
    setDataList([...dataList, ...moreData.data?.launchesPast]);
    if (moreData.data.launchesPast.length < LIMIT) {
      setHasMore(false);
    }
  };

  return (
    <Card title="Launch History">
      <InfiniteScroll
        dataLength={dataList.length}
        hasMore={hasMore}
        loader={
          <div style={{ margin: "0 auto", width: "fit-content" }}>
            <LoadingOutlined />
          </div>
        }
        next={loadMoreData}
      >
        <Timeline mode={"alternate"} style={{ padding: 10 }}>
          {dataList.map((item) => (
            <Timeline.Item key={item.id} color={item.launch_success ? "green" : "red"}>
              id: {item.id} <br />
              mission name: {item.mission_name} <br />
              launch status: {item.launch_success ? "success" : "fail"} <br />
              launch date: {item.launch_date_local} <br />
              <LaunchDetail item={item}>
                <Button
                  icon={<ArrowsAltOutlined />}
                  type="link"
                  size={"small"}
                  style={{ padding: 0 }}
                >
                  Detail
                </Button>
              </LaunchDetail>
            </Timeline.Item>
          ))}
        </Timeline>
      </InfiniteScroll>
    </Card>
  );
}

export function LaunchDetail({
  children,
  item,
  isNextLaunch = false,
}: {
  children: JSX.Element[] | JSX.Element;
  item: LaunchTask;
  isNextLaunch?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const onModalCancel = (event: React.MouseEvent) => {
    setVisible(false);
    event.stopPropagation();
  };
  const { Title, Paragraph, Link, Text } = Typography;

  const {
    links: { article_link, video_link },
  } = item;

  let videoUrl = "";
  if (video_link) {
    const split = video_link.split("/");
    videoUrl = `https://www.youtube.com/embed/${split[split.length - 1]}`;
  }

  return (
    <div onClick={() => setVisible(true)} style={{ display: "inline-block" }}>
      {children}
      <Modal
        title={"Mission detail"}
        visible={visible}
        closable={true}
        onCancel={onModalCancel}
        footer={null}
        width={800}
        destroyOnClose={true}
      >
        <Typography>
          <Title>{item.mission_name}</Title>
          <Paragraph>{item.details}</Paragraph>
          <ul>
            {!isNextLaunch && (
              <li>
                <Text strong>launch status: </Text>
                <Tag color={item.launch_success ? "green" : "red"}>
                  {item.launch_success ? "success" : "fail"}
                </Tag>
              </li>
            )}
            <li>
              <Text strong>launch date: </Text>
              {item.launch_date_local}
            </li>
            <li>
              <Text strong>launch site: </Text>
              {item.launch_site.site_name_long}
            </li>
          </ul>

          <Title level={2}>Rocket info</Title>
          <ul>
            <li>
              <Text strong>rocket name: </Text>
              {item.rocket.rocket_name}
            </li>
            <li>
              <Text strong>rocket type: </Text>
              {item.rocket.rocket_type}
            </li>
          </ul>

          {(video_link || article_link) && <Title level={2}>Report and video</Title>}
          {article_link && (
            <>
              <Link href={article_link} target={"_blank"}>
                report article
              </Link>
              <br />
            </>
          )}
          {video_link && (
            <iframe
              width="560"
              height="315"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </Typography>
      </Modal>
    </div>
  );
}
