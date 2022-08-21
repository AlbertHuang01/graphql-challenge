interface LaunchSite {
  //  站点名称
  site_name_long: string;
}

interface Links {
  //  文章链接
  article_link: string | null;
  // 视频链接
  video_link: string | null;
}

interface Rocket {
  // 火箭名称
  rocket_name: string;
  // 火箭类型
  rocket_type: string;
}

// 发射任务信息
export interface LaunchTask {
  id: string;
  // 任务名称
  mission_name: string;
  // 发射日期
  launch_date_local: string;
  // 发射站点
  launch_site: LaunchSite;
  links: Links;
  rocket: Rocket;
  // 发射成功
  launch_success: boolean | null;
  // 详细信息
  details: string | null;
}

export type ContextType = {
  nextLaunch: {
    data: LaunchTask;
    loading: boolean;
  };
  launchList: {
    data: LaunchTask[];
    hasMore: boolean;
    loadMoreData: () => Promise<void>;
  };
} | null;
