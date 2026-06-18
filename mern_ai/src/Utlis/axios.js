import axios from 'axios'

const instance=axios.create({
    baseURL:"http://localhost:5000/"
})

// Request interceptor to automatically attach user ID header if logged in
instance.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      if (parsed && parsed._id) {
        config.headers['x-user-id'] = parsed._id;
      }
    } catch (e) {
      console.error("Error parsing user info in Axios interceptor", e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;