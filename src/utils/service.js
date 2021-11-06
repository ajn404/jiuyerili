import axios from "axios";
let baseURL = 'http://cn3.frp.cool:12355'
const service = axios.create({
    baseURL,
    timeout: 50000, // 请求超时时间
    withCredentials: false
})
export default service
