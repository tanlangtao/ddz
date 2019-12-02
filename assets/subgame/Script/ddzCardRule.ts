
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    
    @property(cc.Label)
    Label:cc.Label = null;

    @property()
    cardType = null;

    cardIndex = 0;

    value  = 0;

    len = 0;

    onLoad(){
        this.cardType = [
            '无效牌型',//0
            '单张',//1
            '对子',//2
            '连对',//3
            '顺子',//4
            '三张',//5
            '三带一',//6
            '三带对',//7
            '飞机',//8
            '炸弹',//9
            '王炸',//10
            '四带二',//11
            '四带二对'//12
        ]
        
    }
    init(arr){
        var cardIndex = this.getCardType(arr);
        if(cardIndex>2){
            this.Label.string = this.cardType[cardIndex];
        }else{
            this.Label.string = ''
        }
        let self = this;
        if(cardIndex!=0){
            self.node.active = true;
        }
        setTimeout(()=>{
            self.node.active = false;
        },1000)
        console.log('maxvalue',this.value,'length',this.len)
        return this.cardType[cardIndex]
    }   
    /**
     * 牌型计算 
     */  
    getCardType(arr){
        this.len = arr.length;
        switch (arr.length){
            case 1 :
                this.value = arr[0]  //值
                return 1;//是单张
            case 2 :
                if(arr[0]==arr[1]){
                    this.value = arr[0] 
                    return 2//是对子
                }else if(arr[0]==22 && arr[1]==21){
                    this.value = 22
                    return 10//是王炸
                }else{
                    return 0
                }
            case 3 :
                if(arr[0]==arr[1] && arr[0]==arr[2]){
                    this.value = arr[0]
                    return 5//是三张
                }else {
                    return 0
                }
            case 4 :
                if( arr[0]==arr[3]){
                    this.value = arr[0]//第1张一定是4个里的牌
                    return 9 //是炸弹
                } else if( arr[0]==arr[2] || arr[1]==arr[3]){
                    this.value = arr[1]//第2张一定是3个里的牌
                    return 6//是三带一
                }else {
                   return 0
                }
            case 5 :
                if( arr[0]==arr[2] && arr[3]==arr[4]){
                    this.value = arr[2]//第3张一定是3个里的牌
                    return 7//三带对
                }else if(arr[0] == arr[1] && arr[2]==arr[4]){
                    this.value = arr[2]//第3张一定是3个里的牌
                    return 7//三带对
                }else{
                    //5张牌还有其他可能，所以break出去
                    break ;
                }
            case 6 :
                if((arr[0]==arr[3]) 
                ||(arr[1]==arr[4])
                || (arr[2]== arr[5])
                ){
                    this.value = arr[2] //第3张一定是4个里的牌
                    return 11 // 四带二
                }else{
                    //6张牌还有其他可能，所以break出去
                    break ;
                }
            case 8 :
                if(arr[0]==arr[3]){
                    if(arr[4]==arr[5]&&arr[6]==arr[7]){
                        this.value = arr[0]//第1张一定是4个里的牌
                        return 12// 四带二对
                    }else{
                        return 0
                    }
                }else if( arr[2]== arr[5]){
                    if(arr[0]==arr[1]&& arr[6]==arr[7]){
                        this.value = arr[2] //第3张一定是4个里的牌
                        return 12// 四带二对
                    }else{
                        return 0
                    }
                }else if(arr[4]==arr[7]){
                    if(arr[0]==arr[1] && arr[2]==arr[3]){
                        this.value = arr[2] //第5张一定是4个里的牌
                        return 12// 四带二对
                    }else{
                        return 0
                    }
                }else{
                    //8张牌还有其他可能，所以break出去
                    break ;
                }
            default :
               break;
        }
        
        //判断是否是连对
        if(arr.length>=6 && arr.length%2 ==0){
            var len = 0;
            var realType = true;
            var arr1=[];
            var arr2 = [];
            //拆分成两个数组
            for(let i = 0;i<arr.length;i++){
                if(i%2 ==0){
                    arr1.push(arr[i])
                }else{
                    arr2.push(arr[i])
                }
            }
            //判断两个数组对应的项是否相等，组成对子
            for(let j =0;j<arr1.length;j++){
                if(arr1[j]==arr2[j]){
                    len+=1;
                }
            }
            //判断对子是否相连
            for(let j =0;j<arr1.length-1;j++){
                if((arr1[j]-1 )!=arr1[j+1]){
                    realType = false;
                }
            }
            if(len==arr.length/2&&realType){
                this.value = arr[0]; //第0张牌最大
                return 3
            }
        }

        //判断是否是顺子,
        if(arr.length>=5){
            len = 0;
            realType = true;
            for(let i = 0;i<arr.length-1;i++){
                if((arr[i]-1 )== arr[i+1]){
                    len+=1
                }else{
                    realType = false;
                }
            }
            if(len>=4&&realType){
                this.value = arr[0]; //第0张牌最大
                return 4
            }
        }
        //判断是否是飞机
        if(arr.length%4==0  || arr.length %5 ==0){
            var CountThree = [];
            var CountTwo = [];
            var CountOne = [];

            for (var i =0;i<arr.length ;i++){
                var count = this.Count(arr[i],arr);
                if(count >=3){
                    CountThree.push(arr[i]);
                }else if(count == 2){
                    CountTwo.push(arr[i]);
                }else if(count == 1){
                    CountOne.push(arr[i])
                }
                if(count == 4){
                    CountOne.push(arr[i])
                }
            }
            var NoRepet1 = this.NoRepet(CountOne);
            var NoRepet2 = this.NoRepet(CountTwo);
            var NoRepet3 = this.NoRepet(CountThree);
            if((NoRepet3[0] - NoRepet3[NoRepet3.length-1]) != (NoRepet3.length -1) ){
                return 0;
            }else if(NoRepet3.length == NoRepet1.length || NoRepet3.length == NoRepet2.length){
                this.value = NoRepet3[0]
                return 8;
            }else{
                return 0;
            }
        }
        return 0;
    }
    Count(num,arr){
        var count = 0;
        for(let k in arr){
            if(num == arr[k]){
                count ++
            }
        }
        return count;
    }

    NoRepet(arr){
        var newArr = [];
        arr.forEach(element => {
            if(newArr.indexOf(element)==-1){
                newArr.push(element)
            }
        });
        return newArr

    }
}
