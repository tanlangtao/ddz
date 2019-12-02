cc.log("this is load GameStatMgr.ts~!!!");
import Connection from "./net/ddzConnection";
import MessageSender from "./net/msgSender-ddz";
import {messageDispatcher as msgDisp} from "./net/msgDispatcher-ddz";
import {NoticeDef as NotiDef,NotificationCenter as NotiCenter} from "./base/ddzNotification";

export namespace GameStatMgr {
    class GameStatusManager {
        readonly sUrlServer = "ws://127.0.0.1:3653"; //local
        readonly connection = new Connection();
        readonly msgSender = new MessageSender();
        readonly sClassName = "GameStatMgr";
        private uBeatheDelay = 0;
        private uBeatheTick = null;
        private bConnected = false;

        constructor() { //定义构造函数
        }   
        private RegstierNotifies() {
            cc.log("this instance of GameStatusManager");
            NotiCenter.Regsiter(NotiDef.Test,this,this.onLoginRsp);
        }
        private StartActiveBreathe() {
            cc.log("StartActiveBreathe~!!!");
            if(this.uBeatheTick == null) {
                this.uBeatheTick = setInterval(this.ActiveBreathe.bind(this),1000);
            }
            this.uBeatheDelay = 0;
        }

        private ActiveBreathe() {
            this.uBeatheDelay++;
            this.msgSender.SendBreathe();
            if(this.uBeatheDelay > 10) {
                if(this.bConnected &&this.uBeatheDelay%10==2){
                    cc.log("here is over 10 sec don't receive any server message,may be has dissconnected!!");
                    this.bConnected = false;
                    NotiCenter.Clear();
                    this.connection.Close()
                }
            }
        }

        private StopBreathe() {
            if(this.uBeatheTick != null)
            {
                clearInterval(this.uBeatheTick);
            }
            this.uBeatheTick = null;            
        }
        
        private onServerBreathe() {
            cc.log("GameStatusManager onServerBreathe");                                
        }
        
        private onLoginRsp(msg) {
            cc.log("GameStatusManager onLoginRsp");
            cc.log(msg)
        }
        public ConnectServer() { 
            if(!this.bConnected){
                this.connection.onOpen = this.onConnected.bind(this);
                this.connection.onClose = this.onDisconnected.bind(this);   
                this.connection.onDispatchMessage = this.onDispatchMessage.bind(this);
                console.log("连接服务器地址:",this.sUrlServer)
                this.connection.Create(this.sUrlServer);
                this.msgSender.connection = this.connection; 
            }else {
                cc.log('已连接,勿需重连!')
            }
            
        }
        public  sendLogin(){
        }
        private onConnected() {
            cc.log("连接服务器成功~！！");
            this.sendLogin();
            this.bConnected = true;
            this.StartActiveBreathe();
        }

        private onDispatchMessage(id:number,data:any) {
            cc.log("receive a message");
            cc.log(id,data);
            msgDisp.onMessageDispatch(id,data);
        }

        private onDisconnected() {
            cc.log("已经和服务器断开连接");
        }
        public clearTimer(){
        }
        public Open(){
            this.RegstierNotifies()
        }
        //游戏关闭（子游戏退出时调用）
        public Close() {    
            NotiCenter.Clear();
            this.StopBreathe();        
            this.connection.Close();            
        }
        public sendTest(name){
            this.msgSender.SendTest(name)
        }
    }
    
    export const gsMgr = new GameStatusManager();
    
}