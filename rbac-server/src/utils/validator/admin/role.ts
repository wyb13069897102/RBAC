import validator from 'validator'

interface roleError {
    name?:string,
    desc?:string
}

export const validateRoleSave = (name:string, desc:string) => {
    let error:roleError = {};
    if(validator.isEmpty(name)){
        error.name = '角色名不能为空'
    }
    if(validator.isEmpty(desc)){
        error.desc = '角色描述不能为空'
    }
    let validate = Object.keys(error).length < 1;
    return {error, validate}
}