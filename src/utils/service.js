import axios from "axios";
let baseURL = 'https://91.usst.edu.cn/'
const service = axios.create({
    baseURL,
    timeout: 50000, // 请求超时时间
    withCredentials: false
})
export default service
