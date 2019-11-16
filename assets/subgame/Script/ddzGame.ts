import Utils from "./untils/ddzUtils";
const {ccclass, property} = cc._decorator;

interface porker {
    value : number,
    type : number,
}
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    porker:cc.Prefab = null;

    InitPoker:cc.Node = null;//初始牌堆

    HandlePoker:cc.Node = null;//玩家自己手牌

    upHandlePoker:cc.Node = null;//上家手牌

    downHandlePoker:cc.Node = null;//下家手牌

    underPoker :cc.Node = null;//地主牌

    arr:porker[] = [];//54个数字

    pokerArr :porker[] = [];

    handlePosArr:cc.Vec2[] = [];

    onLoad(){
        this.addBtnHandler('LogicLayer/btn_fapai');
        this.addBtnHandler('LogicLayer/btn_xipai');
        this.InitPoker = cc.find("Canvas/LogicLayer/InitPoker");
        this.HandlePoker = cc.find("Canvas/LogicLayer/HandlePoker");
        this.upHandlePoker = cc.find("Canvas/LogicLayer/upHandlePoker");
        this.downHandlePoker = cc.find("Canvas/LogicLayer/downHandlePoker");
        this.underPoker = cc.find("Canvas/LogicLayer/underPoker");
        this.arrInit();
        this.getHandlePos();
    }
    /**
     * 初始化牌
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
        this.arr.push({ value:14, type:4 })
        this.arr.push({ value:15, type:4 })
        this.arr= (this.ruffler(this.arr))
    }
    getHandlePos(){
        this.handlePosArr.push(this.upHandlePoker.position)
        this.handlePosArr.push(this.HandlePoker.position)
        this.handlePosArr.push(this.downHandlePoker.position)
    }
    /**
     * 洗牌
     * @param arr 
     */
    private ruffler(arr){
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
                this.InitPoker.addChild(node);
                node.getComponent('ddzPoker').cardInit(item.value,item.type);
            })
        }
        else if(btnName == 'btn_fapai'){
            this.fapaiStart()
        }
    }
    /**
     * 开始发牌
     */
    private fapaiStart(){
        if(this.InitPoker.children.length==0) return;
        var index= 53;
        //发牌动画
        let pokerAction = (item,num,handNode,cover)=>{
            var action = cc.moveTo(0.1,this.handlePosArr[num]);
            let call = cc.callFunc(()=>{
                item.getChildByName('cover').active = cover;
                this.InitPoker.removeChild(item);
                handNode.addChild(item);
                index-=1;
                fapai()
            })
            item.runAction(cc.sequence(action,call))
        }
        let fapai= ()=>{
            var item = this.InitPoker.children[index];
            if(index >36){
                pokerAction(item,1,this.HandlePoker,false)
            }else if(index > 19){
                pokerAction(item,2,this.downHandlePoker,false)
            }else if(index>2){
                pokerAction(item,0,this.upHandlePoker,false)
            }else if(index >=0){
                pokerAction(item,4,this.underPoker,true)
            }else{
                //发牌结束
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
                if(array[i].value > pork0.value){
                    bigArr.push(array[i])
                }else{
                    smallArr.push(array[i])
                }0
            }
            return quickSort(bigArr).concat([pork0].concat(quickSort(smallArr)))
        }
        return quickSort(porkArr)
    }
}
