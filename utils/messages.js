const moment =require('moment');


function formatMessage(username, text){

    return{
        text,
        username,
        time: moment().format('h:mm a')
    }


}

module.exports = formatMessage;