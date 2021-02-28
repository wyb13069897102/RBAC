class HttpException extends Error{
    status:number ;
    message:string ;
    errors?:any ;
    constructor(status:number, message:string, errors?:any){
        super();
        this.status = status, this.message = message, this.errors = errors;
    }
}
// status : 200 201 204 401(授权问题) 403(禁止访问) 404(资源找不到) 422(匹配输入验证) 500 502

export default HttpException;