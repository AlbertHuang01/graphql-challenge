import React, { useState } from "react";
import { LaunchTask } from "./model";
import { gql, useQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { ArrowsAltOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Image, Modal, Timeline, Typography } from "antd";

const LAUNCHES_PAST = gql`
  query LaunchesPast($offset: Int!) {
    launchesPast(limit: 10, offset: $offset) {
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
  const [dataList, setDataList] = useState<LaunchTask[]>([]);
  const { fetchMore } = useQuery<{ launchesPast: LaunchTask[] }>(LAUNCHES_PAST, {
    variables: {
      offset: 0,
    },
    onCompleted(data) {
      setDataList([...dataList, ...data.launchesPast]);
    },
  });

  const loadMoreData = async () => {
    const moreData = await fetchMore({
      variables: {
        offset: dataList.length,
      },
    });
    setDataList([...dataList, ...moreData.data?.launchesPast]);
  };

  return (
    <Card title="Launch List">
      <InfiniteScroll
        dataLength={dataList.length}
        hasMore={true}
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
              mission_name: {item.mission_name} <br />
              launch_success: {item.launch_success + ""} <br />
              launch_date_local: {item.launch_date_local} <br />
              <LunchPastDetail item={item}>
                <Button
                  icon={<ArrowsAltOutlined />}
                  type="link"
                  size={"small"}
                  style={{ padding: 0 }}
                >
                  Detail
                </Button>
              </LunchPastDetail>
            </Timeline.Item>
          ))}
        </Timeline>
      </InfiniteScroll>
    </Card>
  );
}

export function LunchPastDetail({
  children,
  item,
}: {
  children: JSX.Element[] | JSX.Element;
  item: LaunchTask;
}) {
  const [visible, setVisible] = useState(false);
  const onModalCancel = (event: React.MouseEvent) => {
    setVisible(false);
    event.stopPropagation();
  };
  const { Title, Paragraph, Link, Text } = Typography;

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
      >
        <Typography>
          <Title>{item.mission_name}</Title>
          <Paragraph>{item.details}</Paragraph>
          <ul>
            <li>
              <Text strong>launch success: </Text>
              {item.launch_success?.toString()}
            </li>
            <li>
              <Text strong>launch date_local: </Text>
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

          <Title level={2}>Report and video</Title>
          <Link href={item.links.article_link || ""} target={"_blank"}>
            report article
          </Link>
          <Image width={200} src={item.links.video_link} />
        </Typography>
      </Modal>
    </div>
  );
}
