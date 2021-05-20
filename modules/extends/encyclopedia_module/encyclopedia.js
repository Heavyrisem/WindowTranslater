const request = require('request');
const setting = require('./info.json');
const client_id = setting.client_id;
const client_secret = setting.client_secret;

module.exports = function searchWord(target) {
    return new Promise((resolve, reject) => {

        const api_url = 'https://openapi.naver.com/v1/search/encyc.json';
        let info = {
            uri: api_url,
            qs: {query: target, display: 5},
            headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
        }

        request.get(info, (err, response, body) => {
            if (err) return resolve({err: err});

            try {
                let data = JSON.parse(body);
                if (!data.items.length) return resolve({err: "NO_RESULT"});
                let enc_export = {
                    type: 'dict',
                    data: []
                };

                data.items.forEach(dict => {
                    let description = replaceAll(dict.description, "<b>", "");
                    description = replaceAll(description, "</b>", "");
                    if (dict.thumbnail == "")
                        enc_export.data.push({title: `${dict.title} 백과사전 검색 결과`, desc: description, url: dict.link});
                    else
                        enc_export.data.push({title: `${dict.title} 백과사전 검색 결과`, desc: description, url: dict.link, imgurl: dict.thumbnail});
                });
                return resolve(enc_export);
            } catch (err) {
                return resolve({err: "PARSE_ERROR", msg: err});
            }

        });

    })
}

function replaceAll(origin, find, replace) {
    return origin.split(find).join(replace);
}