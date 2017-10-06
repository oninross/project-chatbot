'use strict';

import mCustomScrollbar from 'mCustomScrollbar';
import { iOS } from '../../../_assets/chatbot/js/_helper';

export default class Conversation {
    constructor() {
        const that = this,
            $chatBox = $('.chat__box'),
            $convo = $('.conversation');

        that.audio = new Audio('/assets/chatbot/media/pop.mp3');
        that.botTmp = doT.template($('#msg__bot-template').html());
        that.humanTmp = doT.template($('#msg__human-template').html());
        that.$jsSendQuery = $('.js-send-query');
        that.$convoWrap = $('.conversation__wrap');
        that.msgStr = 'Hello! My name is Nathan and I\'m Niño\'s digital portfolio assistant. Would you like to get to know more about him or contact him?';
        that.obj = {};

        $convo.mCustomScrollbar({
            setTop: 0,
            theme: 'minimal-dark',
            scrollbarPosition: 'outside'
        });

        that.obj.message = 'Hello! My name is Nathan and I\'m Niño\'s digital portfolio assistant.<br/><br/>Would you like to get to know more <a class="js-click-msg" href="#">about him</a> or <a class="js-click-msg" href="#">contact</a> him?';
        that.$convoWrap.append(that.botTmp(that.obj));

        that.enterChatBubble();

        that.speak('en-US', 'Google US English', that.msgStr);

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

        if ('webkitSpeechRecognition' in window) {
            const $jsTalk = $('.js-talk');

            $jsTalk.attr('disabled', false).on('click', function () {
                recognition.start();
            });

            let recognition = new webkitSpeechRecognition();

            recognition.onstart = function () {
                $jsTalk.addClass('-active');
            }

            recognition.onresult = function (e) {
                that.obj.message = e.results["0"]["0"].transcript;

                that.sendQuery(that.obj.message);
                that.$convoWrap.append(that.humanTmp(that.obj));

                that.enterChatBubble();
                $jsTalk.removeClass('-active');
            }

            recognition.onerror = function (event) {
                $jsTalk.removeClass('-active');

                that.obj.message = 'Sorry, I could\'t understand that. Can you say it a little bit slower please?';
                that.$convoWrap.append(that.botTmp(that.obj));

                that.enterChatBubble();
            }

            recognition.onend = function () {
                $jsTalk.removeClass('-active');
            }
        }
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
                that.$jsSendQuery.attr('disabled', false);

                that.obj.message = data.message;
                that.$convoWrap.append(that.botTmp(that.obj));

                that.enterChatBubble();

                that.msgStr = that.$convoWrap.find('.conversation__row:last-child .conversation__msg').text();

                that.speak('en-US', 'Google US English', that.msgStr);
            },
            error: function (error) {
                console.log(error);
                that.$jsSendQuery.attr('disabled', false);
            }
        });
    }

    enterChatBubble() {
        var that = this;

        $('.conversation').mCustomScrollbar('scrollTo', 'bottom');

        TweenLite.to($('.conversation__msg'), 0.2, {
            opacity: 1,
            scale: 1,
            ease: Back.easeOut,
            delay: 0.75,
            onStart: function () {
                that.audio.play();
            }
        });
    }

    speak(newLang, newVoice, string) {
        var that = this;

        that.canITalk();

        // Create a new instance of SpeechSynthesisUtterance.
        var msg = new SpeechSynthesisUtterance();

        // Set the text.
        msg.text = string;

        msg.volume = 1; // 0 to 1
        msg.rate = 1; // 0.1 to 10
        msg.pitch = 1; //0 to 2

        // Set the language
        msg.lang = newLang;


        // If a voice has been selected, find the voice and set the
        // utterance instance's voice attribute.
        msg.voice = speechSynthesis.getVoices().filter(function (voice) {
            return voice.name == newVoice;
            // native
            // Google Deutsch
            // Google US English
            // Google UK English Female
            // Google UK English Male
            // Google español
            // Google español de Estados Unidos
            // Google français
            // Google हिन्दी
            // Google Bahasa Indonesia
            // Google italiano
            // Google 日本語
            // Google 한국의
            // Google Nederlands
            // Google polski
            // Google português do Brasil
            // Google русский
            // Google 普通话（中国大陆）
            // Google 粤語（香港）
            // Google 國語（臺灣）
        })[0];


        window.speechSynthesis.speak(msg);

        // msg.onend = function(e) {
        //     console.log('Finished in ' + event.elapsedTime + ' seconds.');
        // };
    }

    canITalk() {
        if (iOS()) {
            return false;
        }

        var SpeechSynthesisUtterance = window.webkitSpeechSynthesisUtterance || window.mozSpeechSynthesisUtterance || window.msSpeechSynthesisUtterance || window.oSpeechSynthesisUtterance || window.SpeechSynthesisUtterance;

        if (SpeechSynthesisUtterance === undefined) {
            return false;
        }
    }
}

