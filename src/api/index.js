import service from "../utils/service";
export function getCampusRecruList() {
    return service({
        url:'/API/Meet/GetCampusRecruList',
        method:'Get'
    })
}
//https://91.usst.edu.cn/API/Meet/GetMeetTableList
export function getMeetTable() {
    return service({
        url:'/API/Meet/GetMeetTableList',
        method:'Get'
    })
}
