//选牌
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    game = null;
    _touchBegan = null;
    _touchMoved = null;
    HandlePoker = null;
    onLoad(){
        this.HandlePoker = cc.find('Canvas/LogicLayer/HandlePoker')
        this.onTouchEvent();
    }
    
    onTouchEvent(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
    }
    
    _getBox(cardArr,index,startindex) {
        var cardPos  = cardArr[index].convertToWorldSpace(cc.v2(0,0))//转换当前坐标到世界坐标
        var cardWidth = cardArr[index]._contentSize.width;
        var cardHeight = cardArr[index]._contentSize.height;
        var box = null;
        if(index == startindex){
            //获取card覆盖坐标范围,第一张牌范围
            box = cc.Rect.fromMinMax(cardPos,cc.v2(cardWidth+cardPos.x,cardHeight+cardPos.y))
        }else{
            //获取card覆盖坐标范围,不是第一张牌，减去间距70
            box = cc.Rect.fromMinMax(cardPos,cc.v2(cardWidth+cardPos.x-70,cardHeight+cardPos.y))
        }
        return box
    }
    _getCardForTouch(touch,cardArr){
        cardArr.reverse();      //to 1
        for (var k in cardArr) {
            var box = this._getBox(cardArr,k,0)
            if(box.contains(touch)){
                cardArr[k].getComponent("ddzPoker").isChiose = true;
                cardArr[k].getComponent("ddzPoker").setMaskShowing(true);  //显示阴影遮罩
                cardArr.reverse();
                return cardArr[k];
            }
        }
        cardArr.reverse();
    }
    
    _checkSelectCardReserve(touchBegan, touchMoved){
        let cardArr = this.HandlePoker.children
        //获取左边的点 为起始点
        var p1 = touchBegan.x < touchMoved.x ? touchBegan : touchMoved;
        //滑动的宽度
        var width = Math.abs(touchBegan.x - touchMoved.x);
        //滑动的高度 最小设置为5
        var height = Math.abs(touchBegan.y - touchMoved.y) > 5 ? Math.abs(touchBegan.y - touchMoved.y) : 5;
        //根据滑动 获取矩形框
        var rect = cc.rect(p1.x, p1.y, width, height);
        for (let i = 0; i < cardArr.length; i++) {
            var box = this._getBox(cardArr,i,cardArr.length-1)
            //判断矩形是否相交
            if (!rect.intersects(box)) {
                //不相交 设置为反选状态
                cardArr[i].getComponent("ddzPoker").isChiose = false;
                cardArr[i].getComponent("ddzPoker").setMaskShowing(false);
            }
        }
    }
    touchBegan = (event)=>{
        cc.log("Touch begin");
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        cc.log("touch begin location: "+touchLoc);
        this._touchBegan = touchLoc;
        cc.log("_touchBegan: "+this._touchBegan);
        this._getCardForTouch( this._touchBegan, this.HandlePoker.children);
    }
    touchCancel = ()=>{
        
    }
    touchEnd = ()=>{
        let cardArr = this.HandlePoker.children
        cc.log("Touch end");
        for (var k in cardArr) {
           
            var ddzPoker = cardArr[k].getComponent("ddzPoker")
            ddzPoker.setMaskShowing(false);
            if (ddzPoker.isChiose === true) {
                ddzPoker.isChiose = false;
                // to 2
                if (ddzPoker.status === "SITDOWN") {
                    ddzPoker.status = "STANDUP";
                    cardArr[k].y += 19;
                } else {
                    ddzPoker.status = "SITDOWN";
                    cardArr[k].y -= 19;
                }
            }
        }
    }
    touchMoved = (event)=>{
        cc.log("Touch move");
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        this._touchMoved = touchLoc;
        this._getCardForTouch( this._touchMoved, this.HandlePoker.children);
        this._checkSelectCardReserve(this._touchBegan, this._touchMoved);
    }
    onDestroy(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
    }
}
