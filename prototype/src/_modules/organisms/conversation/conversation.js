'use strict';

export default class Conversation {
    constructor() {
        const that = this,
            $chatBox = $('.chat__box'),
            $sendQuery = $('.js-send-query'),
            $convo = $('.conversation'),
            botTmp = doT.template($('#msg__bot-template').html()),
            humanTmp = doT.template($('#msg__human-template').html());

        var obj = {};

        obj.message = 'Hello! My name is Nino and I\'m a UX developer in Canberra, Australia.  Would you like to know more <a class="js-click-msg" href="#about">about me</a> or my <a class="js-click-msg" href="#skills">skills</a>?';
        $convo.append(botTmp(obj));

        that.enterChatBubble();

        $chatBox.on('keypress', function (e) {
            if (e.keyCode == 13) {
                $sendQuery.click();
            }
        });

        $sendQuery.on('click', function (e) {
            e.preventDefault();

            obj.message = $chatBox.val();
            $convo.append(humanTmp(obj));

            that.enterChatBubble();

            $chatBox.val('');
            $sendQuery.attr('disabled', true);

            $.ajax({
                url: '/sendRequest',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    message: obj.message
                }),
                success: function (data) {
                    console.log(data);
                    $sendQuery.attr('disabled', false);

                    obj.message = data.message;
                    $convo.append(botTmp(obj));

                    that.enterChatBubble();
                },
                error: function (error) {
                    console.log(error);
                    $sendQuery.attr('disabled', false);
                }
            });
        });

        $('body').on('click', '.js-click-msg', function (e) {
            e.preventDefault();

            $chatBox.val($(this).text());
            $sendQuery.trigger('click');
        });
    }

    enterChatBubble() {
        TweenLite.to($('.conversation .-hide'), 0.5, {
            opacity: 1,
            y: 0,
            ease: Expo.easeOut,
            delay: 0.2,
            onComplete: function () {
                $(this).removeClass('-hide');
            }
        });
    }
}
