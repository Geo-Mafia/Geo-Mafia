export class Snapshot {
    snapshot_id;
    snapshot_content;

    constructor(content){
        this.snapshot_id = -1
        this.snapshot_content = content
    }

    getMessageID(){
        return this.snapshot_id;
    }
    getMessageContent(){
        return this.snapshot_content;
    }
    setMessageID(id){
        this.snapshot_id = id;
        return 10;
    }

}