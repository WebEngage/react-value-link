
function ValueLink (root, onChange) {
    var data = {
        root: root || {}
    };

    var slice    = Array.prototype.slice,
        toString = Object.prototype.toString;

    function resolve (path) {
        var cursor = data,
            i, iu = path.length - 1;

        for (i = 0; i < iu; i++) {
            if (cursor.hasOwnProperty(path[i])) {
                cursor = cursor[path[i]];
            } else {
                break;
            }
        }

        if (cursor.hasOwnProperty(path[i])) {
            return cursor[path[iu]];
        } else {
            return null;
        }
    }

    function _requestChange (link, path, value) {
        if (toString.call(link.handleChange) === '[object Function]') {
            return link.handleChange(value, function (value) { _requestChange(link, path, value) });
        }

        var cursor = data,
            i, iu = path.length - 1;

        for (i = 0; i < iu; i++) {
            if (!cursor.hasOwnProperty(path[i])) {
                // is the next path element an integer?
                if (Math.floor(path[i + 1]) === path[i + 1]) {
                    cursor[path[i]] = [];
                } else {
                    cursor[path[i]] = {};
                }
            }

            cursor = cursor[path[i]];
        }

        cursor[path[i]] = value;
        onChange(data.root);
    }

    function _onChange (link, element) {
        link.requestChange(element.type === 'checkbox' ? element.checked : element.value);
    }

    function getLink (path) {
        function link () {
            return getLink(path.concat(slice.call(arguments)));
        }

        link.value = resolve(path);
        link.onChange = function(event) { _onChange(link, event.target) };
        link.requestChange = function(value) { _requestChange(link, path, value) };

        return link;
    }

    return getLink(['root']);
}

if (typeof module === 'object') {
    module.exports = ValueLink;
}
