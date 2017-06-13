

module.exports = class Repo{
    constructor(name,url,description){
        this.name = name;
        this.url = url + "/contents";
        this.description = description;
    }
};