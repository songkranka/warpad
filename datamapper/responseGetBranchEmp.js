function getResponse(data) {

    let dataArray = [];
    if (data != null) {
        if (data.length > 0) {
            data.forEach(field => {
                let result = {
                    "BranchCode": field.BranchCode,
                    "BranchName": field.BranchName,
                }
                dataArray.push(result);
            });
        }
    }

    return dataArray;
}

module.exports = {
    getResponse
}