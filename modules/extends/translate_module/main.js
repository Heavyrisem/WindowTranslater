const translate = require('./translate.js');

function trans(args) {
    return new Promise(async (resolve, reject) => {
        let target = args.split(' ')[0];
        let string = args.replace(args.split(' ')[0] + ' ', "");
        
        let translate_res = await translate(string, target);

        if (translate_res.err) return resolve({err: translate_res.err});

        let export_data = {
            type: 'list',
            data: [
                {
                    title: `${translate_res.srcLangType} > ${translate_res.tarLangType}`,
                    desc: translate_res.translatedText
                }
            ]
        }

        return resolve(export_data);
    });
}


module.exports = trans;