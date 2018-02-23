/**
 * Created by lcavero on 20/02/18.
 */
module.exports = Adapter;

function Adapter(redis_client, prefix){
    if(redis_client.constructor.name != 'RedisClient'){
        var type;

        if(typeof redis_client === 'object'){
            type = redis_client.constructor.name;
        }else{
            type = typeof redis_client;
        }
        console.error('node-redis-adapter Adapter expects the Redis Client instance, ' + type + ' was received. Adapter disabled.');
        return;
    }

    if(!prefix){
        console.warn('You don\'t set a prefix, "df" prefix will be used');
        prefix = 'df';
    }

    let replaceNulls = function(data) {
        if(typeof data == "object"){
            for(var i in data){
                data[i] = replaceNulls(data[i]);
            }
        }else if(typeof data === 'string'){
            if(data === 'null' || data === 'undefined'){
                data = null;
            }
        }

        return data;
    };

    redis_client.internal_send_command = (function () {
        var cached_function = redis_client.internal_send_command;
        return function () {
            var new_arguments = Array.prototype.slice.call(arguments);
            var command = new_arguments[0];
            if(!command.prefixed){
                command.args[0] = prefix + '-' + command.args[0];
                command.prefixed = true;
            }

            if(command.callback){
                var old = command.callback;
                command.callback = function () {
                    var args = Array.prototype.slice.call(arguments);
                    let new_args = replaceNulls(args);
                    return old.apply(old, new_args);
                };
            }

            return cached_function.apply(this, new_arguments);
        }
    })();
}