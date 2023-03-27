
function isOnlyEnglishLetters(str) {
    let regexExp = /^[a-zA-Z]+$/;
    return regexExp.test(str);
}

function isOnlyTurkishLetters(str) {
    let regexExp = /[a-zA-ZğüşıöçĞÜŞİÖÇ]+/;
    return regexExp.test(str);
}

export { isOnlyEnglishLetters, isOnlyTurkishLetters }
