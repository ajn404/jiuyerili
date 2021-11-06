import service from "../utils/service";
export function getCampusRecruList(data) {
    return service({
        url:'/v1/recruit/query',
        method:'POST',
        data:data
    })
}
// 获取招聘列表
export function getMeetTable(data) {
    return service({
        url:'/v1/meet/query',
        method:'POST',
        data:data
    })
}
