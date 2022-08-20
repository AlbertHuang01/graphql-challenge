import { useQuery, gql } from "@apollo/client";

const GET_LOCATIONS = gql`
  query ExampleQuery {
    launchesPast(limit: 10) {
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

export default function MyDemo() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log("data is ", data);
  return <h1>My Demo</h1>;
}
