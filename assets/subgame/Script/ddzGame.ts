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

    InitPoker:cc.Node = null;

    HandlePoker:cc.Node = null;

    upHandlePoker:cc.Node = null;

    downHandlePoker:cc.Node = null;

    arr:porker[] = [];

    pokerArr :porker[] = [];

    onLoad(){
        this.addBtnHandler('LogicLayer/btn_fapai');
        this.addBtnHandler('LogicLayer/btn_xipai');
        this.InitPoker = cc.find("Canvas/LogicLayer/InitPoker");
        this.HandlePoker = cc.find("Canvas/LogicLayer/HandlePoker");
        this.upHandlePoker = cc.find("Canvas/LogicLayer/upHandlePoker");
        this.downHandlePoker = cc.find("Canvas/LogicLayer/downHandlePoker");
        this.arrInit()
    }

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
    /**
     * 洗牌
     * @param arr 
     */
    private ruffler(arr){
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
            this.InitPoker.removeAllChildren();
            this.HandlePoker.removeAllChildren();
            this.upHandlePoker.removeAllChildren();
            this.downHandlePoker.removeAllChildren();
            this.arr = this.ruffler(this.arr)
            this.arr.forEach((item:porker)=>{
                var node = cc.instantiate(this.porker);
                this.InitPoker.addChild(node);
                node.getComponent('ddzPoker').cardInit(item.value,item.type);
            })
        }
        else if(btnName == 'btn_fapai'){
            this.InitPoker.children.forEach((item:cc.Node,index) => {
                var item2 = item;
                this.InitPoker.removeChild(item);
                if(index<17){
                    this.HandlePoker.addChild(item2);
                }else if(index <34){
                    this.downHandlePoker.addChild(item2)
                }else if(index <52){
                    this.upHandlePoker.addChild(item2)
                }
            });
            console.log(this.HandlePoker.children.length)
            console.log(this.upHandlePoker.children.length)
            console.log(this.downHandlePoker.children.length)
        }
    }
    
}
