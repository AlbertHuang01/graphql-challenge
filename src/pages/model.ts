interface LaunchSite {
  //  站点名称
  site_name_long: string;
}

interface Links {
  //  文章链接
  article_link: any;
  // 视频链接
  video_link: string;
}

interface Rocket {
  // 火箭名称
  rocket_name: string;
  // 火箭类型
  rocket_type: string;
}

// 发射任务信息
interface LaunchTask {
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
  launch_success: boolean;
  // 详细信息
  details: string | null;
}

export type LaunchPast = LaunchTask[];
export type LaunchNext = LaunchTask;
