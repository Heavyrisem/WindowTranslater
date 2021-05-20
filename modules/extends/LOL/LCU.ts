import LCUConnector from 'lcu-connector';
import axios from 'axios';
import https from 'https';
import { API_perk, Champion_DB, current_summoner, perk } from './LCU_Types';

const connector = new LCUConnector();
let summoner: current_summoner;

let LCU: { 
    get: (path: string) => Promise<any>,
    post: (path: string, json?: Object) => Promise<any>,
    delete: (path: string, json?: Object) => Promise<any>,
    put: (path: string, json?: Object | undefined) => Promise<any>; 
};



export const SetRune = (name: string, Pos: string): Promise<boolean> => {

    return new Promise(async resolve => {
        
        let UserRunes: Array<perk> = await LCU.get(`/lol-perks/v1/pages`);
        let Rune = {
            "autoModifiedSelections": [], 
            "current": true,
            "id": 1,
            "isActive": true,
            "isDeletable": true,
            "isEditable": true,
            "isValid": true,
            "lastModified": 0,
            "name": "AutoCreatedRune",
            "order": 0,
            "primaryStyleId": 8000,
            "selectedPerkIds": [
            8005, 9101, 9104,
            8014, 8126, 8136,
            5008, 5008, 5001
            ],
            "subStyleId": 8100
        }


        let ChampionInfo: Champion_DB = await (await axios.post("http://kunrai.kro.kr:3111/GetChampion", {Champion: name})).data;
        let Position: number = -1;

        UserRunes.some((rune, i) => {
            if (rune.name.indexOf("자동:") == -1) return false;
            else {
                LCU.delete(`/lol-perks/v1/pages/${rune.id}`);
                return true;
            }
        });

        let FindPos = ChampionInfo.position?.some((pos, idx) => {
            console.log(pos.type)
            if (pos.type?.indexOf(Pos) == -1) return false;
            
            Position = idx;
            return true;
        })

        if (!FindPos) {
            resolve(false);
            return console.log("ERR");
        }

        if (ChampionInfo.position?.length) {
            Rune.primaryStyleId = ChampionInfo.position[Position].primaryKeyStone;
            Rune.subStyleId = ChampionInfo.position[Position].subKeyStone;
            Rune.selectedPerkIds = ChampionInfo.position[Position].perk;

            Rune.name = "자동: "+ChampionInfo.name+`[${ChampionInfo.position[Position].type}]`;
        }
        
        await LCU.post(`/lol-perks/v1/pages`, Rune);
        resolve(true);
    })
}

export const init = (): Promise<void> => {
    return new Promise(resolve => {
        connector.on('connect', async (data) => {
    
            LCU = {
                get: (path: string): Promise<any> => {
                    return new Promise(async resolve => {
                        let result = await axios.get(`https://${data.address}:${data.port}${path}`);
                        if (result)
                            resolve(result.data);
                        else 
                            resolve(undefined);
                    })
                },
                post: (path: string, json?: Object): Promise<any> => {
                    return new Promise(async resolve => {
                        let result = await axios.post(`https://${data.address}:${data.port}${path}`, json);
                        if (result)
                            resolve(result.data);
                        else 
                            resolve(undefined);
                    })
                },
                put: (path: string, json?: Object): Promise<any> => {
                    return new Promise(async resolve => {
                        let result = await axios.put(`https://${data.address}:${data.port}${path}`, json);
                        if (result)
                            resolve(result.data);
                        else 
                            resolve(undefined);
                    })
                },
                delete: (path: string, json?: Object): Promise<any> => {
                    return new Promise(async resolve => {
                        let result = await axios.delete(`https://${data.address}:${data.port}${path}`, json);
                        if (result)
                            resolve(result.data);
                        else 
                            resolve(undefined);
                    })
                },
            }


            const agent = new https.Agent({  
                rejectUnauthorized: false
            });
            axios.defaults.headers.common['Authorization'] = "Basic " + Buffer.from("riot:"+data.password).toString('base64');
            axios.defaults.httpsAgent = agent;
        
            summoner = await LCU.get("/lol-summoner/v1/current-summoner");
            console.log(summoner.summonerId, summoner.displayName ,summoner.summonerLevel);

            resolve();
        });
        connector.start();
    })
}

export const Close = (): Promise<void> => {
    return new Promise(resolve => {
        connector.stop();
        resolve();
    })
}
