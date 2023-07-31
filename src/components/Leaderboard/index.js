import { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import LeaderboardTable from "../LeaderboardTable";
import { LeaderboardContainer, LoadingViewContainer } from "./styledComponents";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const Leaderboard = () => {
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  });

  useEffect(() => {
    const getLeaderboardData = async () => {
      setApiResponse({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      });

      const url = "https://apis.ccbp.in/leaderboard";
      const options = {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU",
        },
      };
      const response = await fetch(url, options);
      const responseData = await response.json();
      console.log(responseData);
      if (response.ok) {
        const formattedData = responseData.leaderboard_data.map((each) => ({
          id: each.id,
          rank: each.rank,
          name: each.name,
          profileImgUrl: each.profile_image_url,
          rank: each.rank,
          score: each.score,
          timeSpent: each.time_spent,
          language: each.language,
        }));
        setApiResponse((prevApiResponse) => ({
          ...apiResponse,
          status: apiStatusConstants.success,
          data: formattedData,
        }));
      } else {
        setApiResponse((prevApiResponse) => ({
          ...apiResponse,
          status: apiStatusConstants.failure,

          errorMsg: responseData.error_msg,
        }));
      }
    };

    getLeaderboardData();
  }, []);

  const renderFailureView = () => {};

  const renderSuccessView = () => {
    const { data } = apiResponse;
    return <LeaderboardTable leaderboardData={data} />;
  };

  const renderLoadingView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </LoadingViewContainer>
  );

  const renderLeaderboard = () => {
    const { status } = apiResponse;

    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>;
};

export default Leaderboard;
