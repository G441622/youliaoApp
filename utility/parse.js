const emojiData = require('./emoji.json');
import _ from 'lodash';
require('./string')

const parse = (text) => {
    try {
        // if (text.indexOf('[') == -1) return text;
        _.each(emojiData, (value, key) => {
            var reg = new RegExp('\\[' + value.name + '\\]', "g");
            const emoji = String.fromCodePoint(...value.unified.split('-').map(u => '0x' + u));
            text = text.replace(reg, emoji);
            // if (text.indexOf('[') == -1) return text;
        });
    } catch (error) {
        // console.log('emoticons parse : ', error)
    }
    return text;
};

export default parse;