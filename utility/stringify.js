const emojiData = require('./emoji.json');
import _ from 'lodash';
require('./string')


const stringify = (text) => {
    let result = ''
    // _.each(emojiData, (value, key) => {
    //     const emoji = String.fromCodePoint(...value.unified.split('-').map(u => '0x' + u));
    //     const pointAt = emoji.codePointAt()
    //     emojiData[key].pointAt = pointAt;
    // });
    const arr = _.toArray(text);
    // console.log('emoji stringify', JSON.stringify(arr))
    _.each(arr, (value, key) => {
        if (value.length==1) return result += value; 
        const index = _.findIndex(emojiData, function (o) {
            const emoji = String.fromCodePoint(...o.unified.split('-').map(u => '0x' + u));
            return emoji.codePointAt() == value.codePointAt();
        });
        if (index > -1) {
            result += '[' + emojiData[index]['name'] + ']';
        } else {
            result += value;
        }
    });
    // console.log('emoji stringify result : ',result)
    return result;
};

export default stringify;