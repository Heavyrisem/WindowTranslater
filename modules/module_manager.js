const fs = require('fs');
const moduleDIR = __dirname+'/extends';
let moduleList = {};

function canVal(name) {
    const canVar = /[a-zA-Z가-힣]+/;
    const whitespace = /\s/g;

    if (canVar.test(name) && !whitespace.test(name))
        return true;
    else 
        return false;
}

function init() {
    return new Promise((resolve, reject) => {
        
        fs.readdir(moduleDIR, {withFileTypes: true},(err, filelist) => {
            if (err) return resolve({modulename: "모듈 로드", err: err});
            if (!filelist.length) return resolve({modulename: "모듈 로드", err:'가져올 모듈이 없습니다. 모듈이 존재하는지 확인해 주세요'});
            
            moduleList = {};
            console.log('--------------------------');
            filelist.forEach(folder => {
                if (canVal(folder.name)) {
                    console.log(`모듈 로드, ${folder.name}`);
                    var moduleinfo = require(`${moduleDIR}/${folder.name}/info.json`);
                    var worker = require(`${moduleDIR}/${folder.name}/${moduleinfo.start}`);
                    
                    // console.log(worker);
                    let module = {
                        "keywords": moduleinfo.keyword,
                        "name": moduleinfo.name,
                        "worker": worker
                    };

                    moduleList[folder.name] = module;
                    
                    // eval(`moduleList.${folder.name} = module`);

                }
            });
        });

    })
}

function search(string) {
    return new Promise((resolve, reject) => {

        if (Object.keys(moduleList).length == 0) return resolve({modulename: "모듈 탐색", err: "모듈의 로드가 완료되지 않았습니다."});
        if (string == null) return resolve({modulename: "명령어", err: "실행할 명령어를 입력해 주세요."});
        let str = string.split(' ');
        let command = str[0];
        let args = string.replace(str[0] + ' ', "");
        const keys = Object.keys(moduleList);


        // if (command == "module") {
        //     switch(args) {
        //         case "reload":
        //             init(); resolve({type: 'list', data: [{title: "모듈 재구성", desc: "모듈이 재구성 되었습니다."}]}); return;
        //     }
        // }


        let commandfound = false;
        keys.forEach(async key => {
            
            if (moduleList[key].keywords.indexOf(command) != -1) {
                commandfound = true;
                
                let res = await moduleList[key].worker(args);
                res.modulename = moduleList[key].name;
                
                return resolve(res);
            }
        });
        
        if (!commandfound)
            return resolve({modulename: "명령어 검색 모듈", err: `"${command}" 에 대응하는 명령어가 없습니다.`});

    })
}


module.exports = {
    init: init,
    search: search
}
