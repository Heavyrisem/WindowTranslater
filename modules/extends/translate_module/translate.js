const request = require('request');
const setting = require('./info.json');

const client_id = setting.client_id;
const client_secret = setting.client_secret;

function detectLang(target) {
    return new Promise((resolve, reject) => {

        const api_url = 'https://openapi.naver.com/v1/papago/detectLangs';
        let info = {
            uri: api_url,
            form: {query: target},
            headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
        }
    
        request.post(info, (err, response, body) => {
            if (err) return resolve({err: err});

            let data = JSON.parse(body);
            
            if (data.code) return resolve({err: body});
            return resolve(data.langCode);
        });

    });
}

module.exports = function translate(string, target) {
    return new Promise(async (resolve, reject) => {

        const api_url = "https://openapi.naver.com/v1/papago/n2mt";
        const source = await detectLang(string);
        if (source.err || source == 'unk') return resolve({err: (source.err) ? source.err : 'string_unk'});
        const to = await findTargetLang(target);
        if (source.err) return resolve({err: source.err});

        let info = {
            uri: api_url,
            form: {source: source, target: to, text: string},
            headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
        }
        
        request.post(info, (err, request, body) => {
            if (err) return resolve({err: err});

            let data = JSON.parse(body);
            
            
            if (data.code || data.errorCode) return resolve({err: body});
            return resolve(data.message.result);
        });

    })
}

function findTargetLang(str) {
    return new Promise((resolve, reject) => {
        
        const dataset = {
            ko: ['한국어', '한글', '한', 'ko', 'kor', 'korean'],
            en: ['영어', '영', 'en', 'eng', 'english'],
            ja: ['일본어', '일어', '일', 'japanese', 'japan', 'jp'],
            'zh-CN': ['중국어간체', '중국어', '중국', '중', 'zn-CN'],
            'zh-TW': ['중국어번체', 'zn-TW'],
            es: ['스페인어', '스페인', 'spain', 'es'],
            fr: ['프랑스어', '프랑스', 'france', 'fr'],
            vi: ['베트남어', '베트남', 'vietnam', 'vi'],
            th: ['태국어', '태국', 'thailand', 'th'],
            id: ['인도네시아어', '인도', 'indonesia', 'id'],
            de: ['독일어', '독일', 'deutsch', 'de'],
            ru: ['러시아어', '러시아', '러', 'ru'],
            it: ['이탈리아어', '이탈리아', 'it', 'italian']
        }

        let keys = Object.keys(dataset);
        keys.forEach(name => {
            if (dataset[name].indexOf(str) != -1) return resolve(name);
        });
        return resolve({err: "lang_not_found"});

    })
}