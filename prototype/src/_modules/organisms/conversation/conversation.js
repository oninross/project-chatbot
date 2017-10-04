'use strict';

export default class Conversation {
    constructor() {
        const $chatBox = $('.chat__box'),
            $trigger = $('.js-send-query');

        $chatBox.on('keypress', function (e) {
            if (e.keyCode == 13) {
                $trigger.click();
            }
        });

        $('.js-send-query').on('click', function (e) {
            e.preventDefault();

            $.ajax({
                url: '//' + BASE_URL + '/sendRequest',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    query: $chatBox.val()
                }),
                dataType: 'json',
                success: function (data) {

                },
                error: function (error) {
                    console.log(error);
                }
            });
        });
    }
}
