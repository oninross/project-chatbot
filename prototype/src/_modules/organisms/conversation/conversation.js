'use strict';

import mCustomScrollbar from 'mCustomScrollbar';
import { iOS } from '../../../_assets/chatbot/js/_helper';

export default class Conversation {
    constructor() {
        const that = this,
            $chatBox = $('.chat__box');

        that.$convo = $('.conversation');
        that.audio = new Audio('/assets/chatbot/media/pop.mp3');
        that.botTmp = doT.template($('#msg__bot-template').html());
        that.humanTmp = doT.template($('#msg__human-template').html());
        that.$jsSendQuery = $('.js-send-query');
        that.$convoWrap = $('.conversation__wrap');
        // that.msgStr = 'Hello! My name is Nathan and I\'m Niño\'s digital portfolio assistant. Would you like to get to know more about him or contact him?';
        that.msgStr = 'Hello! My name is Nathan and I\'m Niño\'s digital portfolio assistant. Before we begin, can you introduce yourself to me please?';
        that.obj = {};

        that.$convo.mCustomScrollbar({
            setTop: 0,
            theme: 'minimal-dark',
            scrollbarPosition: 'outside'
        });

        // that.obj.message = 'Hello! My name is Nathan and I\'m Niño\'s digital <a class="js-click-msg" href="#">portfolio</a> assistant.<br/><br/>Would you like to get to know more <a class="js-click-msg" href="#">about him</a> or <a class="js-click-msg" href="#">contact</a> him?';
        that.obj.message = 'Hello! My name is Nathan and I\'m Niño\'s digital <a class="js-click-msg" href="#">portfolio</a> assistant.<br/><br/>Before we begin, can you introduce yourself to me please? 😄';

        that.sendToSpeak(that.msgStr);

        that.$convoWrap.append(that.botTmp(that.obj));

        that.enterChatBubble();

        $chatBox.on('keypress', function (e) {
            if (e.keyCode == 13) {
                that.$jsSendQuery.click();
            }
        });

        that.$jsSendQuery.on('click', function (e) {
            e.preventDefault();

            if ($chatBox.val() == '') {
                return false;
            }

            that.obj.message = $chatBox.val();
            that.$convoWrap.append(that.humanTmp(that.obj));

            that.enterChatBubble();

            $chatBox.val('');
            that.$jsSendQuery.attr('disabled', true);

            that.sendQuery(that.obj.message);
        });

        $('body').on('click', '.js-click-msg', function (e) {
            e.preventDefault();

            $chatBox.val($(this).text());
            that.$sendQuery.trigger('click');
        });
    }

    sendQuery(msg) {
        const that = this;

        $.ajax({
            url: '/sendRequest',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                message: msg
            }),
            success: function (data) {
                let _data = JSON.parse(data),
                    cacheBuster = Math.round(new Date().getTime() / 1000),
                    audioResponse = new Audio('/assets/chatbot/media/' + _data.UUID + '.wav?cb=' + cacheBuster);

                that.$jsSendQuery.attr('disabled', false);

                audioResponse.play();

                that.obj.message = _data.message;
                that.$convoWrap.append(that.botTmp(that.obj));

                that.enterChatBubble();

                that.msgStr = that.$convoWrap.find('.conversation__row:last-child .conversation__msg').text();
            },
            error: function (error) {
                console.log(error);
                that.$jsSendQuery.attr('disabled', false);
            }
        });
    }

    sendToSpeak(msg) {
        $.ajax({
            url: '/sendToSpeak',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                message: msg
            }),
            success: function (data) {
                let _data = JSON.parse(data),
                    cacheBuster = Math.round(new Date().getTime() / 1000),
                    audioResponse = new Audio('/assets/chatbot/media/' + _data.UUID + '.wav?cb=' + cacheBuster);

                audioResponse.play();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    enterChatBubble() {
        var that = this;

        TweenLite.to($('.conversation__msg'), 0.2, {
            opacity: 1,
            scale: 1,
            ease: Back.easeOut,
            onStart: function () {
                that.audio.play();
            },
            onComplete: function () {
                that.$convo.mCustomScrollbar('scrollTo', 'bottom');
            }
        });
    }
}

