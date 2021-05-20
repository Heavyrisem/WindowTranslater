import * as LCU from './LCU';
import express from 'express';
import bodyParser from 'body-parser';

const LCU_Server = express();

LCU_Server.use(bodyParser.json());       // to support JSON-encoded bodies
LCU_Server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


// function Test(): Promise<any> {
//     return new Promise(async resolve => {
//         let champ_export = {
//             type: 'network',
//             data: [{
//                 title: 'test',
//                 desc: "teststststs",
//                 url: "http://localhost:3222/LCU/SetRune?name=Xayah&pos=Bottom"
//             }]
//         }
//         resolve(champ_export)
//     })
// }

LCU_Server.get('/LCU/SetRune', async (req, res) => {
    if (!req.query.name || !req.query.pos) return res.send("WRONG_DATA");
    
    let Result = await LCU.SetRune(req.query.name+"", req.query.pos+"");
    if (!Result) {
        res.send({err: "Something goes Wrong"});
    } else {
        res.send("SUCCESS");
    }
})

LCU_Server.listen(3222, async () => {
    await LCU.init();
})