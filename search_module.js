const translater = require('./custom_modules/translate_module/translate');
const EBSClass = require('ebs_onlinecls');
const dictionary = require('./custom_modules/ko_dictionary_module/dictionary');
const encyclopedia = require('./custom_modules/encyclopedia_module/encyclopedia');
const youtube = require('ytsearch_api');
const runprocess = require('./custom_modules/run_module/runprocess');


function searchModel(input) {
    return new Promise(async (resolve, reject) => {

        if (input == null) return resolve({title: "명령어", err: "실행할 명령어를 입력해 주세요."});
        let str = input.split(' ');
        let command = str[0];
        let args = input.replace(str[0] + ' ', "");


        switch (command) {
            case "번역":
                let lang = args.split(' ')[0];
                
                let trans_result = await translater(args.replace(lang, ""), lang);
                if (trans_result.err) return resolve({module: "번역기 모듈", err: trans_result.err});
                return resolve({
                    type: 'list',
                    data: [{ title: `번역 ${trans_result.srcLangType} > ${trans_result.tarLangType}`, desc: trans_result.translatedText }]
                });
                break;
            case "EBS":
            case "ebs":
                let ebs_result = await (EBSClass(args.split(' ')[0]));
                if (ebs_result.err) return resolve({module: "EBS 온라인클래스 모듈", err: ebs_result.err});
                if (ebs_result.length == 0) return updateClip({module: "EBS 온라인클래스 모듈", err: "검색 결과가 없습니다."});
                
                let ebs_export = {
                    type: 'list',
                    data: []
                };
                ebs_result.forEach(list => {
                    ebs_export.data.push({ title: `${list.schulNm} EBS온라인클래스 주소`, desc: list.url, url: list.url });
                });
                return resolve(ebs_export);
                break;
            case "단어사전":
            case "단어":
                let dict_result = await dictionary(args);
                if (dict_result.err == "NO_RESULT") return resolve({module: "단어사전 모듈", err: dict_result.err});
                if (dict_result.err) return resolve({module: "단어사전 모듈", err: dict_result.err});

                let dict_export = {
                    type: 'list',
                    data: []
                };
                dict_result.forEach(word => {
                    dict_export.data.push({title: `${word.word[0]}(${word.pos[0]}) 표준국어대사전 검색 결과`, desc: word.sense[0].definition[0], url: word.sense[0].link[0]});
                });
                
                return resolve(dict_export);
                break;
            case "백과사전":
                let enc_result = await encyclopedia(args);
                if (enc_result.err == "NO_RESULT") return resolve({module: "백과사전 모듈", err: enc_result.err});
                if (enc_result.err) return resolve({module: "백과사전 모듈", err: enc_result.err});

                let enc_export = {
                    type: 'dict',
                    data: []
                };

                enc_result.forEach(dict => {
                    let description = replaceAll(dict.description, "<b>", "");
                    description = replaceAll(description, "</b>", "");
                    if (dict.thumbnail == "")
                        enc_export.data.push({title: `${dict.title} 백과사전 검색 결과`, desc: description, url: dict.link});
                    else
                        enc_export.data.push({title: `${dict.title} 백과사전 검색 결과`, desc: description, url: dict.link, imgurl: dict.thumbnail});
                });
                return resolve(enc_export);
                break;
            case "유튜브":
                const KEY = "AIzaSyCRVDOHLCBSnIjOxzEG_lgDVe7LWwgk7cU";
                let youtube_result = await youtube.SearchAllYoutube(args, KEY);
                if (youtube_result.err) return resolve({module: "유튜브 모듈", err: youtube_result.err});
                if (!youtube_result.length) return resolve({module: "유튜브 모듈", err: "검색 결과가 없습니다."});
        
                let youtube_export = {
                    type: 'dict',
                    data: []
                }
                youtube_result.forEach(item => {
                    switch (item.type) {
                        case "video":
                            youtube_export.data.push({
                                title: `${item.data.title} (${item.data.duration})`, 
                                desc: (item.data.description.length >= 50)? item.data.description.slice(0, 55)+"..." : item.data.description, 
                                imgurl: item.data.thumbnail.maxres.url, 
                                url: `https://www.youtube.com/watch?v=${item.data.id}`
                            }); break;
                        case "channel":
                            youtube_export.data.push({
                                title: item.data.title, 
                                desc: (item.data.channelDescription.length >= 50)? item.data.channelDescription.slice(0, 55)+"..." : item.data.channelDescription, 
                                imgurl: item.data.thumbnail.high.url, 
                                url: `https://www.youtube.com/channel/${item.data.id}`
                            }); break;
                    }
                });
                return resolve(youtube_export);
                break;
            case "terminal":
            case "cmd":
            case "터미널":
                if(runprocess.run_terminal() == false) {
                    return resolve({module: "실행 모듈 (터미널)", err: '지원되지 않는 플랫폼 입니다.'});
                };
            default:
                return resolve({module: "명령어 검색 모듈", err: `"${command}" 에 대응하는 명령어가 없습니다.`}); break;
        }

    });
}


function replaceAll(str, searchStr, replaceStr) { // string data 처리
    return str.split(searchStr).join(replaceStr);
}

module.exports = searchModel;