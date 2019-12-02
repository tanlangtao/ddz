cc.log("this is load messagedef.ts~!!!");

import { msg } from "./protocol";
cc.log("msg:", msg);

export namespace messagedef {
    export const enum msgtype {
        Test = 0,
        Breath = 1,
    }

    cc.log("msg:", msg);
    const messagemap: any = {}
    messagemap[msgtype.Test] = msg.Test;
    messagemap[msgtype.Breath] = msg.Breath;
    export function getMsgObj(eMsg: msgtype) {
        return messagemap[eMsg];
    }
}