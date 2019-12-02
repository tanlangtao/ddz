import Utils from "./untils/ddzUtils";
import {GameStatMgr} from "./ddzGameStatMgr";
import {NoticeDef as NotiDef,NotificationCenter as NotiCenter, NoticeDef} from "./base/ddzNotification";
const {ccclass, property} = cc._decorator;

interface porker {
    value : number,
    type : number,
}
@ccclass
export default class ddzGame extends cc.Component {
    readonly sClassName = "ddzGame";

    @property(cc.Prefab)
    porker:cc.Prefab = null;

    InitPoker:cc.Node = null;//初始牌堆

    HandlePoker:cc.Node = null;//玩家自己手牌

    upHandlePoker:cc.Node = null;//上家手牌

    downHandlePoker:cc.Node = null;//下家手牌

    underPoker :cc.Node = null;//地主牌
    
    PlayHand : cc.Node = null;//出牌选择

    DisPoker :cc.Node = null;//玩家出牌节点

    DisType:cc.Node = null;//显示出牌牌型

    arr:porker[] = [];//54个数字

    pokerArr :porker[] = [];

    handlePosArr:cc.Vec2[] = [];

    onLoad(){
        GameStatMgr.gsMgr.ConnectServer();
        NotiCenter.Regsiter(NotiDef.Test,this,this.onTest)
        this.addBtnHandler('LogicLayer/btn_fapai');
        this.addBtnHandler('LogicLayer/btn_xipai');
        this.addBtnHandler('LogicLayer/PlayerPos1/PlayHand/ddz_btn_bc');
        this.addBtnHandler('LogicLayer/PlayerPos1/PlayHand/ddz_btn_ts');
        this.addBtnHandler('LogicLayer/PlayerPos1/PlayHand/ddz_btn_cp');
        this.InitPoker = cc.find("Canvas/LogicLayer/InitPoker");
        this.upHandlePoker = cc.find("Canvas/LogicLayer/PlayerPos0/HandlePoker");
        this.HandlePoker = cc.find("Canvas/LogicLayer/PlayerPos1/HandlePoker");
        this.downHandlePoker = cc.find("Canvas/LogicLayer/PlayerPos2/HandlePoker");
        this.underPoker = cc.find("Canvas/LogicLayer/underPoker");
        this.PlayHand = cc.find("Canvas/LogicLayer/PlayerPos1/PlayHand");
        this.DisPoker = cc.find("Canvas/LogicLayer/PlayerPos1/DisPoker");
        this.DisType = cc.find("Canvas/LogicLayer/PlayerPos1/DisType");
        this.arrInit();
        this.getHandlePos();
    }
    /**
     * 初始化牌数组
     */
    arrInit(){
        for(var i = 0;i<4;i++){
            for(var j = 1;j<=13;j++){
                this.arr.push({
                    value:j,
                    type:i
                })
            }
        }
        this.arr.push({ value:21, type:4 })
        this.arr.push({ value:22, type:4 })
        this.arr= (this.ruffler(this.arr))
    }
    getHandlePos(){
        this.handlePosArr.push(this.upHandlePoker.position)
        this.handlePosArr.push(this.HandlePoker.position)
        this.handlePosArr.push(this.downHandlePoker.position)
    }
    onTest = (msg)=>{
        console.log(msg)
    }
    /**
     * 洗牌
     * @param arr 
     */
    private ruffler(arr){
        GameStatMgr.gsMgr.sendTest('黎明')
        this.InitPoker.removeAllChildren();
        this.HandlePoker.removeAllChildren();
        this.upHandlePoker.removeAllChildren();
        this.downHandlePoker.removeAllChildren();
        this.underPoker.removeAllChildren();
        let newarr = [];
        for(let i=arr.length;i>0;i--){
            let range = Math.floor(Math.random()*i)
            newarr.push(arr[range])
            arr.splice(range,1)
        }
        return newarr
    }
    private addBtnHandler(btnName:string) :void {
        var btn = cc.find("Canvas/"+btnName);
        Utils.addClickEvent(btn,this.node,"ddzGame","onBtnCLicked");
    }
   
    onBtnCLicked(event:cc.Event) :void{
        var btnName = event.target.name;
        if(btnName == 'btn_xipai'){
            this.arr = this.ruffler(this.arr)
            this.arr.forEach((item:porker)=>{
                var node = cc.instantiate(this.porker);
                node.getComponent('ddzPoker').cardInit(item.value,item.type);
                this.InitPoker.addChild(node);
            })
        }
        else if(btnName == 'btn_fapai'){
            this.fapaiStart()
        }
        else if(btnName == 'ddz_btn_bc'){
            console.log('不要')
        }
        else if(btnName == 'ddz_btn_ts'){
            console.log('提示')
        }
        //出牌
        else if(btnName == 'ddz_btn_cp'){
            let cardArr = this.HandlePoker.children
            var cpArr = [];
            for (var k in cardArr) {
                var ddzPoker = cardArr[k].getComponent("ddzPoker")
                if (ddzPoker.status === "STANDUP") {
                    cpArr.push(cardArr[k])
                }
            }
            this.discards(cpArr,this.HandlePoker,this.DisPoker);
            this.PlayHand.active = false;
            let self = this;
            setTimeout(() => {
                self.PlayHand.active = true;
            }, 3000);
        }
    }
    /**
     * 开始发牌
     */
    private fapaiStart(){
        if(this.InitPoker.children.length==0) return;
        var index= 53;
        //发牌动画
        let pokerAction = (item:cc.Node,num:number,handNode:cc.Node,cover:boolean)=>{
            var action = cc.moveTo(0.1,this.handlePosArr[num]);
            let call = cc.callFunc(()=>{
                item.getChildByName('cover').active = cover;
                this.InitPoker.removeChild(item);
                handNode.addChild(item);
                item.position = cc.v2(0,0)
                index-=1;
                fapai();
            })
            item.runAction(cc.sequence(action,call));
        }
        let fapai= ()=>{
            //逆时针顺序发牌
            var item = this.InitPoker.children[index];
            var itemD = this.InitPoker.children[index-1];
            var itemU = this.InitPoker.children[index-2];
            if((index+1)%3 == 0 && index>2){
                pokerAction(item,1,this.HandlePoker,false)
                pokerAction(itemD,2,this.downHandlePoker,true)
                pokerAction(itemU,0,this.upHandlePoker,true)
            } else if(index<=2&&index>=0){
                pokerAction(item,4,this.underPoker,true)
            }else{
                //排序
                var newPoker = this.handleSort(this.HandlePoker.children)
                this.HandlePoker.children.forEach((item,index)=>{
                    item.getComponent('ddzPoker').cardInit(newPoker[index].value,newPoker[index].type)
                })
                var newPoker2 = this.handleSort(this.downHandlePoker.children)
                this.downHandlePoker.children.forEach((item,index)=>{
                    item.getComponent('ddzPoker').cardInit(newPoker2[index].value,newPoker2[index].type)
                })
                var newPoker3 = this.handleSort(this.upHandlePoker.children)
                this.upHandlePoker.children.forEach((item,index)=>{
                    item.getComponent('ddzPoker').cardInit(newPoker3[index].value,newPoker3[index].type)
                })
            }
            //轮流发牌
            // if(index >36){
            //     pokerAction(item,1,this.HandlePoker,false)
            // }else if(index > 19){
            //     pokerAction(item,2,this.downHandlePoker,true)
            // }else if(index>2){
            //     pokerAction(item,0,this.upHandlePoker,true)
            // }else if(index >=0){
            //     pokerAction(item,4,this.underPoker,true)
            // }else{
            //     //发牌结束
            //     var newPoker = this.handleSort(this.HandlePoker.children)
            //     this.HandlePoker.children.forEach((item,index)=>{
            //         item.getComponent('ddzPoker').cardInit(newPoker[index].value,newPoker[index].type)
            //     })
            //     var newPoker2 = this.handleSort(this.downHandlePoker.children)
            //     this.downHandlePoker.children.forEach((item,index)=>{
            //         item.getComponent('ddzPoker').cardInit(newPoker2[index].value,newPoker2[index].type)
            //     })
            //     var newPoker3 = this.handleSort(this.upHandlePoker.children)
            //     this.upHandlePoker.children.forEach((item,index)=>{
            //         item.getComponent('ddzPoker').cardInit(newPoker3[index].value,newPoker3[index].type)
            //     })
            // }
        }
        fapai()
    }
    /**
     * 手牌排序
     */
    handleSort(arr:cc.Node[]){
        var porkArr = []
        arr.forEach((item)=>{
            var poker = {
                BrandValue:item.getComponent("ddzPoker").BrandValue,
                value:item.getComponent("ddzPoker").value,
                type:item.getComponent('ddzPoker').type,
            }
            porkArr.push(poker)
        })
        let quickSort =(array)=> {
            if(array.length<=1) return array;
            let pork0 = array[0];
            array.splice(0,1);
            var smallArr = [];
            var bigArr=[];
            for(let i = 0;i<array.length;i++){
                //比较牌型值 
                if(array[i].BrandValue > pork0.BrandValue){
                    bigArr.push(array[i])
                }else{
                    smallArr.push(array[i])
                }
            }
            return quickSort(bigArr).concat([pork0].concat(quickSort(smallArr)))
        }
        return quickSort(porkArr)
        
    }
     //出牌
     discards(cards,handNode:cc.Node,disNode:cc.Node){
        if(!cards || cards.length == 0 ) return

        var cardsArr = []
        disNode.removeAllChildren();
        cards.forEach(item => {
            cardsArr.push(item.getComponent("ddzPoker").BrandValue)
        });
        var cardtype = this.DisType.getComponent('ddzCardRule').init(cardsArr);
        if(cardtype=='无效牌型'){
            cards.forEach(item => {
                var poker = item.getComponent('ddzPoker');
                poker.isChiose = false;
                poker.status = "SITDOWN";
                item.y -= 19;
            });
            return
        }else{
            for (const key in cards){
                var pos = cards[key].convertToWorldSpaceAR(cc.v2(0,0))
                let endPos = disNode.convertToWorldSpaceAR(cc.v2(-56,-77.7))
                var node = cc.instantiate(this.porker);
                node.position = pos;
                console.log(pos,endPos);
                var poker = cards[key].getComponent('ddzPoker');
                node.getComponent('ddzPoker').cardInit(poker.value,poker.type);
                disNode.addChild(node);
                // let callFun = cc.callFunc(()=>{
                //     handNode.removeChild(cards[key]);
                // })
                // var action = cc.moveTo(1,endPos);
                // var action2 = cc.sequence(action,callFun);
                // node.runAction(action2);
                // let callFun = cc.callFunc(()=>{
                //     handNode.removeChild(cards[key]);
                //     disNode.addChild(cards[key]);
                // })
                // var action = cc.moveTo(0,endPos);
                // var action2 = cc.sequence(action,callFun);
                // cards[key].runAction(action2)
            }
        }
    }
}
