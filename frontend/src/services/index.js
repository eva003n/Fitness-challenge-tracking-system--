import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
//create and configure axios instance
console.log(import.meta.env.VITE_API_BASE_URI)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URI,
  withCredentials: true,
  timeout: 1200000, //after 2mins
});

//intercept request before sending

apiClient.interceptors.request.use((config) => {
  //with each request include access token refresh token is included automatically
  const accessToken = localStorage.getItem("token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    // onsucces response data will be returned
    return response.data;
  },
  async (error) => {
    console.log(error)
    //In axios errors can occur during the request abd in the resonse(mostly server errors
    if (error.code === "ERR_NETWORK") {
      let currentToast = null
      if(!toast.isActive(currentToast)){
        currentToast = toast.error(`${error.message}, try again`);
      }
    }else {
      // toast.error(error.response.data.error || error.message);
    }
    //error that is returned from server
    if (error.response) {
      if (error instanceof AxiosError) {
        //reference to original request
        const failedRequest = error.config;
        //if Unathorized and axios has not attempted re-request
        let currentToast = null
        if(!toast.isActive(currentToast)) {
          currentToast = toast.error(error.response.data.error);
        }
      
        
        if (
          error.response &&
          error.response.status === 401 &&
          !failedRequest._retry
        ) {
          //logic to automatically send request a access token upon expiry

          //when set to false causes an infinite loop request to the backend api
          failedRequest._retry = true; //prevent infinite loop

          //make request to refresh access token,use response to set token State with new access token  and update authorization headers to new access token
          await handleTokenRefresh();
          //In case the request failed due to network error e.t.c
          //ensure theirs a request timeout to limit retries thus rpevent infinite loop
          //rerry original request
          return apiClient(failedRequest);
        }
      }
      //nay otheir errors
      // return Promise.reject(error);
    }
    if (error.request) {
      //handle request errors

      return Promise.reject(error.request);
    }
    Promise.reject(error)
  }
);

const handleTokenRefresh = async () => {
  const response = await refreshToken();
  if (response) {
    localStorage.setItem("token", response.data);
    const token = localStorage.getItem("token");
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

//endpoints

//authentication mabagement

const registerUser = async (data) => {
  return apiClient.post("/auth/signup", data);
};
const logInUser = async (data) => {
  return apiClient.post("/auth/login", data);
};
const logOutUser = async () => {
  return apiClient.delete("/auth/logout");
};
const refreshToken = async () => {
  return apiClient.post("/auth/refreshtoken");
};

//user management
const createUser = async (data) => {
  return apiClient.post("/users", data);
};

const getUsers = (page = 1, limit = 10) => {
  return apiClient.get("/users", {
    params: {
      page: page,
      limit: limit,
    },
  })
}

//update user details
const getUserProfile = async (userId) => {
  return apiClient.get(`/users/${userId}`);
};
const updateUserProfile = async (userId, data) => {
  return apiClient.put(`/users/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const deleteUserAccount = async (userId) => {
  return apiClient.delete(`/users/${userId}`, userId);
};
const userStatistics = async () => {
  return apiClient.get("/users/admin/statistics");

}
const updateStreaks = async (userId) => {
  return apiClient.put(`/users/${userId}/streaks`);
  
}
const getStreaks = async (userId) => {
  return apiClient.get(`/users/${userId}/streaks`);
}
//challenge management
const getAllChallenges = async (page = 1, limit = 10) => {
  return apiClient.get("/challenges", {
    params:{
      page,
      limit,
    }
  });
};
const getChallenges = async (page = 1, limit = 10) => {
  return apiClient.get("/challenges/admin", {
    params: {
      page: page,
      limit: limit,
    },
  });
}
const createChallenge = async (data) => {
  return apiClient.post("/challenges", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//get users challenges
const getAllUserChallenges = async (challengeId) => {
  return apiClient.get(`/challenges/user/${challengeId}`);
};
const getChallengeData = async (challengeId) => {
  return apiClient.get(`/challenges/challenge/${challengeId}`);
};
const updateChallenge = async (data, challengeId) => {
  return apiClient.put(`/challenges/challenge/${challengeId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const bookmarkChallenge = async(challengeId) => {
  return apiClient.post(`/challenges/${challengeId}/bookmark`)
}
const challengeCompletionRate = async (page= 1, limit = 10) => {
  return apiClient.get("/challenges/completionrate", {
    params: {
      page,
      limit
    }
  });
}
const challengeStatistics = async () => {
  return apiClient.get("/challenges/admin/statistics");
}

const searchChallenges = async (searchText) => {
  return apiClient.get("/challenges", {
    params: {
      q: searchText,
    },
  });
};
const deleteChallenge = async (challengeId) => {
  return apiClient.delete(`/challenges/challenge/${challengeId}`);
};

const getChallengeAnalysis = (challengeId) => {
  return apiClient.get(`/challenges/challenge/${challengeId}/progress`);
};
const getUserChallengeSummary = (userId) => {
  return apiClient.get(`/challenges/${userId}/summary`);
};

const getWorkoutSummary = () => {
  return apiClient.get(`/challenges/summary/workouts`);
};
const getAnalytics = (userId) => {
  return apiClient.get(`/challenges/analytics/${userId}`);
};
const createActivity = async (data) => {
  return apiClient.post("/activities", data);
};
const getAllActivities = async () => {
  return apiClient.get("/activities");
};
const getActivity = async (activityId) => {
  return apiClient.get(`/activities/activity/${activityId}`);
};
const getActivityByChallange = async (challengeId) => {
  return apiClient.get(`/activities/activity/challenge/${challengeId}`);
};

const deleteActivity = async (activityId) => {
  return apiClient.delete(`/activities/activity/${activityId}`);
};
const updateActivity = async (activityId, data) => {
  return apiClient.put(`/activities/activity/${activityId}`, data);
};
const deleteAllActivities = async (activityId) => {
  return apiClient.delete("/activities");
};
const getUsersOverAllActivitySummary = async (userId) => {
  return apiClient.get(`/activities/${userId}/summary`);
};

const getActivityProgress = async (userId, year, month) => {
  return apiClient.get(`/activities/progress/user/${userId}`, {
    params:{
      year,
      month
    }
  });
}
const getNotifications = async (userId) => {
  return apiClient.get(`/notifications/user/${userId}`);
};

const markNotificationAsRead = async (notificationId) => {
  return apiClient.put(`/notifications/${notificationId}`);
};

//Oauth flow management'

//make post request ti github authorization server with the auth code to get access token
const getAuthorizationCode = async () => {
  try {
    const authorizationCode = new URLSearchParams(window.location.search).get(
      "code"
    );
    //send authorization code to backend api
    const response = await apiClient.post("/auth/github/oauth", {
      authorizationCode,
    });
    return response;
  } catch (e) {
    await e.response;
    console.log(e);
    // toast.error(e.response && e.response.data.error);
  }
};
export {
  handleTokenRefresh,
  registerUser,
  logInUser,
  logOutUser,
  getUserProfile,
  createUser,
  getUsers,
  updateUserProfile,
  getStreaks,
  deleteUserAccount,
  updateStreaks,
  getAllChallenges,
  getAuthorizationCode,
  createChallenge,
  getAllUserChallenges,
  deleteChallenge,
  challengeStatistics,
  userStatistics,
  updateChallenge,
  getChallengeData,
  getChallenges,
  bookmarkChallenge,
  getUserChallengeSummary,
  challengeCompletionRate,
  getWorkoutSummary,
  getAnalytics,
  getChallengeAnalysis,
  createActivity,
  getAllActivities,
  getActivityByChallange,
  getActivity,
  updateActivity,
  deleteActivity,
  getUsersOverAllActivitySummary,
  deleteAllActivities,
  getActivityProgress,
  getNotifications,
  markNotificationAsRead
};
