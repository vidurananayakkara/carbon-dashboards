/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Handlebars helpers
 */
// Check whether a particular object has a property.
Handlebars.registerHelper('has', function () {
    var has = function (o) {
        if (!o) {
            return false;
        }
        if (o instanceof Array && !o.length) {
            return false;
        }
        var key;
        for (key in o) {
            if (o.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    };
    var args = Array.prototype.slice.call(arguments);
    var options = args.pop();
    var length = args.length;
    if (!length) {
        return new Handlebars.SafeString(options.inverse(this));
    }
    var i;
    for (i = 0; i < length; i++) {
        if (has(args[i])) {
            return new Handlebars.SafeString(options.fn(this));
        }
    }
    return new Handlebars.SafeString(options.inverse(this));
});

// Check whether the left hand side equals to the right hand side.
Handlebars.registerHelper('equals', function (left, right, options) {
    if (left === right) {
        return options.fn(this);
    }
    return options.inverse(this);
});

// Check whether the left hand side does not equals to the right hand side.
Handlebars.registerHelper('if_neq', function (a, b, blocks) {
    if (a != b) {
        return blocks.fn(this);
    } else {
        return blocks.inverse(this);
    }
});

// JSON stringify a particular object.
Handlebars.registerHelper('dump', function (o) {
    return JSON.stringify(o);
});

// Resolve a URI.
Handlebars.registerHelper('resolveURI', function (path) {
    return ues.dashboards.resolveURI(path);
});

//return menu hierachy
Handlebars.registerHelper('traverseMenu', function (menu, designer, isAnonView, user) {
    var div = "<div id ='ds-menu-root' class='ds-menu-root'>root</div>",
        depth = 1,
        padding = 10;

    updateSubordinates(menu, null);

    function updateSubordinates(menu, parent){
        for (var i = 0; i < menu.length; i++) {
                //console.log("I is: " + i + " depth is: " + depth + " parent is : " + parent + " page : " + menu[i].id);
                div += "<ul class='menu-hierarchy' id='"+ menu[i].id + "' data-anon='" + menu[i].isanon + "'>";

                if (designer) {
                    div +="<li data-parent='" + parent +
                        "' data-id='"+ menu[i].id + "' data-anon='" + menu[i].isanon + "' class='depth" +
                            depth +" panel panel-default ' position: relative;'>" +
                                menu[i].id;
                } else {
                    if (isAnonView || !user) {
                        if (menu[i].isanon) {
                            // Anonymous viewing. So render only anonymous pages links.
                            div += "<li><a href='" + menu[i].id + "' style='padding-left: " + (padding * depth) +
                                "px; position: relative;'>" + menu[i].title + "</a>"
                        }
                    } else {
                            div += "<li><a href='" + menu[i].id + "' style='padding-left: " + (padding * depth) +
                                "px; position: relative;'>" + menu[i].title + "</a>"
                    }
                }

                if(menu[i].subordinates.length > 0){
                    depth++;
                    updateSubordinates(menu[i].subordinates, menu[i].id);
                } else{
                    div += "</li></ul>";
                }
        }
        depth--;
        div += "</ul>";
    }
    return div;
});