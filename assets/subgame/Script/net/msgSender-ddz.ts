import Connection from "./ddzConnection";
import {messagedef} from "./messagedef-ddz";
//import {msg} from "./msg_pb";

export default class MessageSender {
    public connection:Connection;

    private SendMessage(msgtag:messagedef.msgtype,data:any) {
        let msgClass = messagedef.getMsgObj(msgtag);
        let msgObj = msgClass.create(data);
        let buff = msgClass.encode(msgObj).finish();
        this.connection.SendMessage(msgtag,buff);  
    }
    
    //发送某种消息只需要三步
    //1 确定发送tag
    //2 定义发送消息结构体
    //3 调用sendmessage发送以上两个对像

    public SendTest(name) {
        let msgtag = messagedef.msgtype.Test;
        let msgData = {Test:name};
        this.SendMessage(msgtag,msgData);  
    }

    public SendBreathe() {
        let msgtag = messagedef.msgtype.Breath;
        let msgData = {}
        this.SendMessage(msgtag,msgData);
    }
}