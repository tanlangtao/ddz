import {messagedef} from "./messagedef-ddz";
//import {msg} from "./msg_pb";
import {NoticeDef as NotiDef,NotificationCenter as NotiCenter, NoticeDef} from "../base/ddzNotification";

export namespace messageDispatcher {
    const mapMessageFunc:any = {}

    const mapMessageNotify:any = {}
    mapMessageNotify[messagedef.msgtype.Test] = NotiDef.Test;
    mapMessageNotify[messagedef.msgtype.Breath] = NoticeDef.Breath;
    export function onMessageDispatch(tag:messagedef.msgtype,data:any) {
        let msgclass = messagedef.getMsgObj(tag);
        if (msgclass) {
            let msg = msgclass.decode(data);
            let notitype = mapMessageNotify[tag];
            NotiCenter.SendNotify(notitype,msg); 
            let callback = mapMessageFunc[tag];
            if (callback) {
                callback(msg);
            }
        } else {
            cc.log("there is message haven't define",tag)
        }
        
    } 
}