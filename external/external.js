/*
 * external.js
 * Jan Schoepke <janschoepke@me.com>
 * Released under the MIT license
 * Load external files into a reveal.js presentation.
 *
 * This is a reveal.js plugin to load external files. It replaces the
 * content of any element with a data-external="file.ext" with the contents
 * of file.ext.
 *
 * This started life as markdown.js. Thank you to whomever wrote it.
 * This version is based on external.js by Cal Evans. Thanks Cal!
 */

(function(){
    loadExternal(document);
    
    function loadExternal(selector, path) {
        "use strict";

        var sections = selector.querySelectorAll( "[data-external]"),
            section, 
            i, 
            xhr, 
            url;
        
        path = typeof path === "undefined" ? "" : path;

        for( i = 0; i < sections.length; i+=1 ) {

            section = sections[i];

            if( section.getAttribute( "data-external" ).length ) {

                xhr = new XMLHttpRequest();
                url = section.getAttribute( "data-external" );

                url = path !== "" ? (path + "/" + url) : url;
                 
                xhr.onreadystatechange = function() {
                    if( xhr.readyState === 4 ) {
                        // file protocol yields status code 0 (useful for local debug, mobile applications etc.)
                        if ( ( xhr.status >= 200 && xhr.status < 300 ) || xhr.status === 0 ) {
                            section.innerHTML = xhr.responseText;
                            loadExternal(section, url.substr(0, url.lastIndexOf("/")));
                        }
                        else {
                            console.log("ERROR: The attempt to fetch " + url + " failed with HTTP status " + xhr.status + ".");
                        }
                    }
                };

                xhr.open( "GET", url, false );

                try {
                    xhr.send();
                }
                catch ( e ) {
                    console.log( "Failed to get the file " + url + ". Make sure that the presentation and the file are served by a HTTP server and the file can be found there. " + e );
                }
            }
        }
        return;
    }
})();