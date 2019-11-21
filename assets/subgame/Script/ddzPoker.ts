const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property()
    value:Number = 1;//牌值
    BrandValue:Number = 0//牌型值,区分A，2

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

    isChiose :boolean = false;//牌是否选中
    
    cardName :string = ''//当前牌名

    status  = 'SITDOWN';//牌的位置状态

    onLoad(){

    }
    public cardInit(value :Number,type:Number){
        
        this.value = value;
        this.type = type;
        if(value == 1){
            this.BrandValue = 14 //A的牌型值
        }else if(value == 2){
            this.BrandValue = 16 //2的牌型值，跟A不能相连
        }else{
            this.BrandValue = value;
        }
        if(type == 4){
            this.loadImages(`ddzimg/ddzpoker/card_${type}_${value}`,this.card.node);
            this.smallT.node.active = false;
            this.v.node.active = false;
            this.bigT.node.active = false;
            this.card.node.active = true;
        }else{  
            this.loadImages(`ddzimg/ddzpoker/poker_${Number(type)%2}_${value}`,this.v.node);
            this.loadImages(`ddzimg/ddzpoker/t_${type}`,this.smallT.node);
            this.smallT.node.active = true;
            this.v.node.active = true;
            if(this.value>10 ){
                this.loadImages(`ddzimg/ddzpoker/card_${type}_${value}`,this.card.node);
                this.bigT.node.active = false;
                this.card.node.active = true;
            }else{
                this.loadImages(`ddzimg/ddzpoker/t_${type}`,this.bigT.node);
                this.card.node.active = false;
                this.bigT.node.active = true;
            }
        }
        this.cardName = this.setCardName(value,type);
    }
    private setCardName(value,type){
        var cardName = ''
        switch(type){
            case 0 :cardName ='黑桃';break;
            case 1 :cardName ='红桃';break;
            case 2 :cardName ='梅花';break;
            case 3 :cardName ='方块';break;
            case 4 :cardName ='';break;
        }
        switch(value){
            case 1 : cardName += 'A' ;break;
            case 11 : cardName += 'J' ;break;
            case 12 : cardName += 'Q' ;break;
            case 13 : cardName += 'K' ;break;
            case 21 : cardName = '小王' ;break;
            case 22 : cardName = '大王' ;break;
            default: cardName += `${value}`; break;
        }
        return cardName
    }
    private loadImages(url:string,node:cc.Node){
        cc.loader.loadRes(url,cc.SpriteFrame,(err,spriteFrame)=>{
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
    }
    public getBoundingBox(){
        this.node.width;
        this.node.height;
    }
    public setMaskShowing(isShow:boolean){
        this.node.getChildByName('mask').active = isShow;
    }
}
