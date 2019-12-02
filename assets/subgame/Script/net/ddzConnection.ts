//import {msg} from "./msg_pb";

export default class Connection {
    private ws:WebSocket;

    public Create(serverurl:string) {
        cc.log("Connection is creating~!");
        this.ws = new WebSocket(serverurl);
        this.ws.binaryType = "arraybuffer"

        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onerror = this.onError.bind(this);
        
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);  
    }

    private onError(ev:Event) {
        cc.log("websocket gen a error");
        cc.log(ev);
    }

    public onOpen(ev: Event) {
        cc.log("connect to server",this.ws.url);
        cc.log(ev);
    }

    public onClose() {
        cc.log("websocket has close");
    }

    public Close() {
        if(this.ws.readyState!==WebSocket.OPEN) return
        cc.log("client active disconnect~!! ");
        this.ws.close();
    }

    private onMessage(ev: MessageEvent) {
        // cc.log("receive a message");
        // cc.log(ev);
        if(ev.data instanceof ArrayBuffer)
        {
            //cc.log("!!!!!!!!");
            //leaf 前两位为协议序号，需要解一下协议序号
            let retdata = this.parseProtoBufId(ev);  
            let id = retdata.id;
            let data = retdata.data;
            this.onDispatchMessage(id,data);
            //this.dealMessage(id,data);
        }         
    }

    public onDispatchMessage(id:number,data:any) {
        cc.log("onDispatchMessage!此函数需要在 {GameStatMgr} 重载!");
    }

    //将unit8数组转换为int..
    private Uint8ArrayToInt(uint8Ary:any) {
        let retInt = 0;
        for(let i= 0;i<uint8Ary.length;i++)
            retInt|=(uint8Ary[i] << (8*(uint8Ary.length-i-1)));

        return retInt;
    }

    parseProtoBufId(obj:any) {
        let arrayBuffer = obj.data;
        let dataUnit8Array = new Uint8Array(arrayBuffer);
        let msgid = this.Uint8ArrayToInt(dataUnit8Array.slice(0,2));
        //console.log("receive message id = "+ msgid);
        dataUnit8Array = dataUnit8Array.slice(2);
        
        return {id: msgid,data:dataUnit8Array};
    }

    //将int转换为uint8数组
    private IntToUint8Array (num:number, Bits:any) {
        let resArry = [];
        let xresArry = [];
        let binaryStr = num.toString(2);
        for(let i=0;i<binaryStr.length;i++)
            resArry.push(parseInt(binaryStr[i]));

        if (Bits) {
            for(let r = resArry.length; r < Bits; r++) {
                resArry.unshift(0);
            }
        }
        
        let  resArryStr= resArry.join("");
        for(let j=0;j<Bits;j+=8)
            xresArry.push(parseInt(resArryStr.slice(j,j+8),2));

        return xresArry;
    }  

    public protoBufAddtag(tag:number,buffer:any)
    {
        let addtag_buffer=new Uint8Array(buffer.length+2);
        let tagBinary = this.IntToUint8Array(tag,16);
        let tagUnit8 = new Uint8Array(tagBinary);
        
        addtag_buffer.set(tagUnit8,0);
        addtag_buffer.set(buffer.subarray(0,buffer.length),2);

        return addtag_buffer;
    }

    public SendMessage(tag:number,buff:any) {
        let full = this.protoBufAddtag(tag,buff)

        //为了避免因为网络卡堵塞主线程，异步发送消息
        let callback = function()
        {            
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(full);
            }
            else {
                
                cc.log("WebSocket instance wasn't ready...");
            }            
        }

        setTimeout(callback.bind(this),0);
    }

}