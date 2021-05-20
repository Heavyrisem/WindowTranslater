const EBSClass = require('./ebs.js');

function getUrl(args) {
    return new Promise(async(resolve, reject) => {

        let ebs_result = await EBSClass(replaceAll(args, ' ', ''));
        if (ebs_result.err) return resolve({modulename: "EBS 온라인클래스 모듈", err: ebs_result.err});
        if (ebs_result.length == 0) return resolve({modulename: "EBS 온라인클래스 모듈", err: "검색 결과가 없습니다."});
        
        let ebs_export = {
            type: 'list',
            data: []
        };
        ebs_result.forEach(list => {
            ebs_export.data.push({ title: `${list.schulNm} EBS온라인클래스 주소`, desc: list.url, url: list.url });
        });
        return resolve(ebs_export);

    })
}

function replaceAll(str, searchStr, replaceStr) { // string data 처리
    return str.split(searchStr).join(replaceStr);
}

module.exports = getUrl;