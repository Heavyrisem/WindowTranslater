const request = require('request');
const parseString = require('xml2js').parseString;

const KEY = '976A8E6B38F7A59407707788CF17CD3D';

function replaceAll(str, searchStr, replaceStr) { // string data 처리
    return str.split(searchStr).join(replaceStr);
}

module.exports =  function searchWord(target) {
    return new Promise((resolve, reject) => {
        
        const api_url = 'https://stdict.korean.go.kr/api/search.do';
        
        let info = {
            uri: api_url,
            qs: {
                key: KEY,
                q: target,
                method: 'exact'
            }
        }

        request.get(info, (err, response, body) => {
            if(err) return resolve({err: err});
            parseString(body, (err, result) => {
                if (err) return resolve({err: err});
                if (!result.channel.item) return resolve({err: 'NO_RESULT'});

                // result.channel.item.forEach(word => {
                //     console.log(word.sense);
                // });
                // console.log(result);
                let dict_export = {
                    type: 'list',
                    data: []
                };
                result.channel.item.forEach(word => {
                    dict_export.data.push({title: `${word.word[0]}(${word.pos[0]}) 표준국어대사전 검색 결과`, desc: word.sense[0].definition[0], url: word.sense[0].link[0]});
                });
                

                return resolve(dict_export);
            });

        })

    })
}