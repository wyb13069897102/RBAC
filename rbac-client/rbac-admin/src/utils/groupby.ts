export const groupBy = (list:any, fun:Function) => {
    const groupData = {};
    list.forEach((item) => {
        const con = fun(item);
        // 对象 key 唯一性
        groupData[con] = groupData[con] || [];
        groupData[con].push(item);
    });
    return groupData;
}