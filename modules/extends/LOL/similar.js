const Similar = (origin, compare) => {
    let str1A = Replace(origin, ["_", " "], "").split("");
    let str2A = Replace(compare, ["_", " "], "").split("");
    
    let str1R = [];
    for (const char of str1A)
        str1R = str1R.concat(getConstantVowel(char));
    let str2R = [];
    for (const char of str2A)
        str2R = str2R.concat(getConstantVowel(char));

    for (const i in str1R) if (str1R[i] == "") str1R.splice(i, 1);
    for (const i in str2R) if (str2R[i] == "") str2R.splice(i, 1);
        

    let found = 0;
    str1R.forEach((char, idx) => {
        if (str2R.indexOf(char) != -1 && str2R.indexOf(char) >= idx) {
            str2R[str2R.indexOf(char)] = "";
            found++;
        }
    })

    return found * 100 / str1R.length;
}

function getConstantVowel(kor) {
    const f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
               'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
               'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const s = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
               'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
               'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
               'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
               'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
               'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

    const ga = 44032;
    let uni = kor.charCodeAt(0);

    uni = uni - ga;

    let fn = parseInt(uni / 588 + "");
    let sn = parseInt((uni - (fn * 588)) / 28 + "");
    let tn = parseInt(uni % 28 + "");

    return [f[fn],s[sn],t[tn]];
}

function Replace(origin, find, replace) {
    if (typeof find == "object") {
        let result = origin;
        for (const char of find)
            result = result.split(char).join(replace);

        return result;
    } else {
        return origin.split(find).join(replace);
    }
}

module.exports = Similar;