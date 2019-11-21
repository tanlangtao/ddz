
// cc.Class({
//     extends: cc.Component,

//     properties: {
//         _touchBegan: null,
//         _touchMoved: null,
//         //用于调用Main场景上的脚本的方法，同时可以传递数据
//         HandlePoker:null,
//     },

//     onTouchEvent: function () {
//         this.node.on(cc.Node.EventType.TOUCH_START, ()=>this.touchBegan, this);
//         this.node.on(cc.Node.EventType.TOUCH_CANCEL, ()=>this.touchCancel, this);
//         this.node.on(cc.Node.EventType.TOUCH_END, ()=>this.touchEnd, this);
//         this.node.on(cc.Node.EventType.TOUCH_MOVE, ()=>this.touchMoved, this);
//     },

//     offTouchEvent: function () {
//         this.node.off(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
//         this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
//         this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
//         this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
//     },

//     onLoad () {
//         this.game = cc.find('Canvas/LogicLayer/HandlePoker')
//         this.onTouchEvent();
//     },

//     onDestroy(){
//         this.offTouchEvent();
//     },
   
//      /**
//      * Touch begin
//      * 当前触摸的点 是否在牌的区域
//      * */
//     _getCardForTouch: function (touch, cardArr) {
//         cardArr.reverse();      //to 1
//         for (var k in cardArr) {
//             var box = cc.Rect.fromMinMax(cardArr[k].position,cardArr[k].size)//获取card覆盖坐标范围
//             console.log(box)
//             if (cc.rectContainsPoint(box, touch)) {      //判断触摸的点，是否在当前牌的范围内
//                 cardArr[k].isChiose = true;
//                 cardArr[k].getComponent("ddzPoker").setMaskShowing(true);  //显示阴影遮罩
//                 cc.log("CCC touch select: "+k);

//                 cardArr.reverse();
//                 return cardArr[k];
//             }
//         }
//         cardArr.reverse();
//     },

//     /**
//      * Touch move
//      *
//      * */
//     _checkSelectCardReserve(touchBegan, touchMoved) {
//         //获取左边的点 为起始点
//         var p1 = touchBegan.x < touchMoved.x ? touchBegan : touchMoved;
//         //滑动的宽度
//         var width = Math.abs(touchBegan.x - touchMoved.x);
//         //滑动的高度 最小设置为5
//         var height = Math.abs(touchBegan.y - touchMoved.y) > 5 ? Math.abs(touchBegan.y - touchMoved.y) : 5;
//         //根据滑动 获取矩形框
//         var rect = cc.rect(p1.x, p1.y, width, height);

//         for (let i = 0; i < this.game.cardArr.length; i++) {
//             //判断矩形是否相交
//             if (!cc.rectIntersectsRect(this.game.cardArr[i].getBoundingBox(), rect)) {
//                 //不相交 设置为反选状态
//                 this.game.cardArr[i].isChiose = false;
//                 this.game.cardArr[i].getComponent("Card").setMaskShowing(false);
//             }
//         }

//         //如果是从右向左滑动
//         if (p1 === touchMoved) {
//             for (let i = this.game.cardArr.length - 1; i >= 0; i--) {
//                 //从右往左滑时，滑到一定距离，又往右滑
//                 //这是要判断反选
//                 if (this.game.cardArr[i].x - p1.x < 24) {  //
//                     this.game.cardArr[i].getComponent("Card").setMaskShowing(false);
//                     this.game.cardArr[i].isChiose = false;
//                 }
//             }
//         }

//     },

//     /**
//      * 开始点击  TOUCH_START回调函数
//      * */
//     touchBegan(event) {
//         cc.log("Touch begin");
//         var touches = event.getTouches();
//         var touchLoc = touches[0].getLocation();
//         cc.log("touch begin location: "+touchLoc);
//         this._touchBegan = this.node.convertToNodeSpace(touchLoc);
//         cc.log("_touchBegan: "+this._touchBegan);
//         this._getCardForTouch( this._touchBegan, this.HandlePoker.children);
//     },

//     /**
//      * 移动  TOUCH_MOVE回调函数
//      * */
//     touchMoved (event) {
//         cc.log("Touch move");
//         var touches = event.getTouches();
//         var touchLoc = touches[0].getLocation();
//         this._touchMoved = this.node.convertToNodeSpace(touchLoc);
//         this._getCardForTouch(this._touchMoved, this.game.cardArr);
//         this._checkSelectCardReserve(this._touchBegan, this._touchMoved);
//     },

//     touchCancel() {

//     },

//     /**
//      * 点击结束  TOUCH_END回调函数
//      * */
//     touchEnd(event) {
//         cc.log("Touch end");
//         var touches = event.getTouches();
//         var touchLoc = touches[0].getLocation();
//         for (var k in this.game.cardArr) {
//             this.game.cardArr[k].getComponent("Card").setMaskShowing(false);
//             if (this.game.cardArr[k].isChiose === true) {
//                 this.game.cardArr[k].isChiose = false;
//                 // to 2
//                 if (this.game.cardArr[k].status === SITDOWN) {
//                     this.game.cardArr[k].status = STANDUP;
//                     this.game.cardArr[k].y += 19;
//                 } else {
//                     this.game.cardArr[k].status = SITDOWN;
//                     this.game.cardArr[k].y -= 19;
//                 }
//             }
//         }
//     }
// })