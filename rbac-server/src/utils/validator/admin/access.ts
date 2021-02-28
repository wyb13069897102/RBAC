import validator from 'validator'

interface accessError {
    name?:string,
    desc?:string
}

export const validateAccessSave = (name:string, desc:string) => {
    let error:accessError = {};
    if(validator.isEmpty(name)){
        error.name = '权限名不能为空'
    }
    if(validator.isEmpty(desc)){
        error.desc = '权限描述不能为空'
    }
    let validate = Object.keys(error).length < 1;
    return {error, validate}
}