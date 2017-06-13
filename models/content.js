
module.exports = class Content{
    constructor(name,url,path,sha,size,type){
        this.name = name;
        this.url = url;
        this.path = path;
        this.sha = sha;
        this.size = size;
        this.type = type;
    }
};