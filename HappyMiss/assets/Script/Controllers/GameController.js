// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import {GameModel} from "../Model/GameModel";
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        grid:{
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.gameModel = new GameModel();
        this.gameModel.init(5);
        var gridScript = this.grid.getComponent("GridView");
        gridScript.setController(this);
        gridScript.initWithCellModels(this.gameModel.getCells());
    },

    selectCell: function(pos){
        return this.gameModel.selectCell(pos);
    },
    cleanCmd: function(){
        this.gameModel.cleanCmd();
    }

    // update (dt) {},
});
