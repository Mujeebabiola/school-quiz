


function isAlphaNumeric(str) {
    var code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };

function PurifyString(word){
    result ="";
    if (word.length>0){
        for(let i =0;i<word.length;i++){
            if (isAlphaNumeric(word[i])){
                result+=word[i];
            }
        }
    }
    return result.toLowerCase()
   
}
module.exports= PurifyString;