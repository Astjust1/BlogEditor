module.exports = class GitFile{
    constructor(type,encoding,size,name,content,sha,url){
        this.type = type;
        this.encoding = encoding;
        this.size = size;
        this.name = name;
        this.content = content;
        this.sha = sha;
        this.url = url;

    }
};