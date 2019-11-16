const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property()
    value:Number = 1;//牌值
    @property()
    type:Number = 0;//花色 0,1,2,3,4 对应 黑 红 梅 方
    
    @property(cc.Sprite)
    v : cc.Sprite = null;

    @property(cc.Sprite)
    smallT : cc.Sprite = null;

    @property(cc.Sprite)
    card : cc.Sprite =null;

    @property(cc.Sprite)
    bigT :cc.Sprite = null;

    @property(cc.Node)
    cover : cc.Node = null;

    onLoad(){
    }
    public cardInit(value :Number,type:Number){
        
        this.value = value;
        this.type = type;
        if(type == 4){
            this.loadImages(`ddzimg/ddzpoker/card_${type}_${value}`,this.card.node);
            this.bigT.node.active = false;
        }else{  
            this.loadImages(`ddzimg/ddzpoker/poker_${Number(type)%2}_${value}`,this.v.node);
            this.loadImages(`ddzimg/ddzpoker/t_${type}`,this.smallT.node);
            if(this.value>10 ){
                this.loadImages(`ddzimg/ddzpoker/card_${type}_${value}`,this.card.node);
                this.bigT.node.active = false;
            }else{
                this.loadImages(`ddzimg/ddzpoker/t_${type}`,this.bigT.node);
                this.card.node.active = false;
            }
        }
       
    }
    private loadImages(url:string,node:cc.Node){
        cc.loader.loadRes(url,cc.SpriteFrame,(err,spriteFrame)=>{
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
    }
}
