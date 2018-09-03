// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import AudioUtils from "../Utils/AudioUtils";

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
        loadingBar: {
            type: cc.ProgressBar,
            default: null,

        },
        loginButton: {
            type: cc.Button,
            default: null,
        },
        worldSceneBGM: {
            url: cc.AudioClip,
            default: null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.gameSceneBGMAudioId = cc.audioEngine.play(this.worldSceneBGM, true, 3);
        this.timer = 0;
        this.beiginGame = false;
    },

    start() {

    },

    onLogin: function() {
        this.loadingBar.node.active = true;
        this.loginButton.node.active = false;
        this.loadingBar.progress = 0;
        this.beiginGame = true;
    },

    onDestroy: function() {
        cc.audioEngine.stop(this.gameSceneBGMAudioId);
    },

    update: function(dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        if (this.beiginGame) {
            this.loadingBar.progress = this.timer / 120;
            if (this.timer === 120) {
                var that = this;
                cc.director.preloadScene("GameScene", function() {
                    // that.loadingBar.node.active = false;
                    // that.loginButton.node.active = true;
                    cc.director.loadScene("GameScene");
                }, that);
                that.beiginGame = false;
            }
            this.timer += 1;
        }


    },
});