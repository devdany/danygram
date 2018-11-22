/***
 * Error Code Table
 * 0 Empty Value return
 * 1 Input Error
 * 2 DataBase Error
 * 3 Backend Error
 * 4 Auth Error
 */
class ErrorTemplate{
    constructor(code, text){
        this.code = code;
        this.text = text;
    }
}

module.exports = {ErrorTemplate}