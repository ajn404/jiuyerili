import service from "../utils/service";
export function getXuanJIang() {
    return service({
        url:'/API/Meet/GetCampusRecruList',
        method:'Get'
    })
}
