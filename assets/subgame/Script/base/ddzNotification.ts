import {NoticeDef} from "./ddzNoticeDef";
export * from "./ddzNoticeDef";
export namespace NotificationCenter {

    interface IClassNamed {
        sClassName:string;
    }

    class CNoticer {
        ID:NoticeDef;
        data:any;
    }

    class NotificationManager {
        //注册的通知消息的接收者
        private mapReciver:{
            [key: string]:{
                [key:number]:any
            }
        };
        //待处理的通知消息
        private mapNoticer:CNoticer[];
        
        constructor() { //定义构造函数
            cc.log("this instance of Notification");

            //注册的通知消息的接收者
            this.mapReciver = {};
            //待处理的通知消息
            this.mapNoticer = [];
    
            setInterval(this.onTick.bind(this),0);            
        }    

        //注册某对像的一个消息
        Regsiter(id:NoticeDef,obj:IClassNamed,callback:any)
        {   
            //cc.log("Regsiter:",obj);
            let objname = obj.sClassName;
            //cc.log("Regsiter id~~~",id,objname);
            if (!(objname in this.mapReciver))
            {
                //cc.log("Regsiter id for",obj);
                this.mapReciver[objname] = {};            
            }
            
            this.mapReciver[objname][id] = callback.bind(obj);
        }

        //注销某对像的一个消息
        UnReg(id:NoticeDef,obj:IClassNamed)
        {
            let objname = obj.sClassName;
            //cc.log("UnReg",id,objname);
            if(this.mapReciver[objname] && this.mapReciver[objname][id])
            {
                delete this.mapReciver[objname][id]; 
            }
        }

        UnRegAll(obj:IClassNamed)
        {
            let objname = obj.sClassName
            //cc.log("UnRegAll",objname);
            delete this.mapReciver[objname];
        }

        Clear() {
            //注册的通知消息的接收者
            this.mapReciver = {};
            //待处理的通知消息
            this.mapNoticer = [];            
        }

        //发送消息，异步处理，先进入队例
        SendNotify(id:NoticeDef,data:any)
        {
            //放入队例本身也要异步，否则在消息处理中的消息入不了队例
            let delayfun = function() {
                //cc.log("SendNotify",id,data);
                let noticer = new CNoticer();
                noticer.ID = id;
                noticer.data = data;
                
                //cc.log("SendNotify 1111111111111");
                this.mapNoticer.push(noticer);
                //cc.log("SendNotify 222222222222");
                //this.ProcessOne(noticer);
            }

            setTimeout(delayfun.bind(this),0);

        }    
        
        //处理一个消息
        private ProcessOne(noticer:CNoticer)
        {
            for(let objname in this.mapReciver)
            {
                let callback = this.mapReciver[objname][noticer.ID];
                if (callback)
                {
                    callback(noticer.data,noticer.ID); 
                }

            }
        }     
        
        private onTick()
        {
            //cc.log("notification onTick 111111111111~!")
            for(let i in this.mapNoticer)
            {
                //cc.log(i,"notification onTick",this.mapNoticer[i])
                this.ProcessOne(this.mapNoticer[i]);
            }
    
            this.mapNoticer = [];
        }       

    }

    const notiMgr = new NotificationManager();
    
    export function Regsiter(id:NoticeDef,obj:IClassNamed,callback:any) {
        notiMgr.Regsiter(id,obj,callback);
    }

    export function UnRegAll(obj:IClassNamed) {
        notiMgr.UnRegAll(obj);
    }

    export function SendNotify(id:NoticeDef,data:any) {
        notiMgr.SendNotify(id,data);
    }

    export function Clear() {
        notiMgr.Clear();
    }

}

//export {NotificationCenter as NotiCenter};