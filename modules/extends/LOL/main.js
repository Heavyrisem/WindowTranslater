const axios = require('axios');
const similar = require('./similar');
let ChampionList;
let Version;

async function init() {
    Version = await axios.get("https://ddragon.leagueoflegends.com/api/versions.json");
    Version = Version.data[0];
    ChampionList = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${Version}/data/ko_KR/champion.json`);
    ChampionList = ChampionList.data.data;
}

function Search(args) {
    return new Promise(async resolve => {
        
        let command = args.split(' ')[0];
        let arg = args.replace(args.split(' ')[0] + ' ', "");

        if (command == "룬") {
            
            let SearchResult = [];
            for (const Champion in ChampionList) {
                SearchResult.push({name: ChampionList[Champion].name, id: ChampionList[Champion].id, acc: (ChampionList[Champion].name.indexOf(arg) != -1)? 100 : similar(arg, ChampionList[Champion].name)});
            }
            SearchResult.sort((a, b) => b.acc - a.acc);

            
            let champ_export = {
                type: 'network',
                data: []
            }

            for (let i = 0; i < 5; i++) {
                let Champion = await (await axios.default.post("http://kunrai.kro.kr:3111/GetChampion", {Champion: SearchResult[i].id})).data;
                if (Champion && Champion.position) {
                    for (const Position of Champion.position) {
                        let data = {
                            title: SearchResult[i].name,
                            desc: "클릭시 " + Position.type + `http://localhost:3222/LCU/SetRune?name=${SearchResult[i].id}&pos=${Position.type}`,
                            url: `http://localhost:3222/LCU/SetRune?name=${SearchResult[i].id}&pos=${Position.type}`,
                            imgurl: `http://ddragon.leagueoflegends.com/cdn/${Version}/img/champion/`+SearchResult[i].id+".png"
                        }
                        champ_export.data.push(data);
                    }

                }

            }
            return resolve(champ_export);
        } else {
            let SearchResult = [];
            for (const Champion in ChampionList) {
                SearchResult.push({name: ChampionList[Champion].name, id: ChampionList[Champion].id, acc: (ChampionList[Champion].name.indexOf(args) != -1)? 100 : similar(args, ChampionList[Champion].name)});
            }
            
            SearchResult.sort((a, b) => b.acc - a.acc);
    
            let champ_export = {
                type: 'dict',
                data: SearchResult
            }
    
            champ_export.data.forEach((Champion, idx, arr) => {
                arr[idx].title = Champion.name;
                arr[idx].desc = Champion.acc + "% 일치 https://www.op.gg/champion/"+Champion.id;
                arr[idx].url = "https://www.op.gg/champion/"+Champion.id;
                arr[idx].imgurl = `http://ddragon.leagueoflegends.com/cdn/${Version}/img/champion/`+Champion.id+".png";
            })
    
            return resolve(champ_export);
        }
        
        
    })
}

init();
module.exports = Search;