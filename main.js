/**
 * When the document is ready check to see if we are on an element or getting started page.
 * If we are on an element or getting started page, load the content from the HTML file.
 * If not, load the list of elements and getting started items from the JSON file.
 */
document.addEventListener('DOMContentLoaded', function() {
    const element = getQueryParameter('element');
    const start = getQueryParameter('start');
    if(element || start){
        document.getElementById('list').remove();
        
        load_file('./data.json', function(text){
            let data = JSON.parse(text);
            let folderLocation = (element) ? 'elements' : 'getting-started';
            let file = (element) ? element : start;
            if(element){
                document.getElementById('content').className = data.container[element];
            } else {
                document.getElementById('content').className = 'max-w-3xl p-10 prose';
            }
            load_file('./' + folderLocation + '/' + file + '.html', function(text){
                document.getElementById('content').innerHTML = text;
                document.body.style = '';
            });
        });
    } else {
        document.getElementById('content').remove();
        load_file('./data.json', function(text){
            let data = JSON.parse(text);
            addItemsToList(data.elements, document.getElementById('elements'), 'element');
            addItemsToList(data.start, document.getElementById('gettingStarted'), 'start');
            document.body.style = '';
        });
    }
});


/**
 * Get the value of a query parameter from the URL. ?element=accordion or ?start=introduction, etc.
 */
function getQueryParameter(parameter){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const element = urlParams.get(parameter);
    return element;
}


/**
 * Add element and getting started items from the JSON file to the html list
 */
function addItemsToList(myObject, myList, param){
    for (const key in myObject) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'text-blue-500 underline';
        link.href = '?' + param + '=' + key;
        link.textContent = myObject[key];
        listItem.appendChild(link);
        myList.appendChild(listItem);

        // POSSIBLE TODO: Add click event to load content from HTML file, DYNAMIC PAGE LOAD INSTEAD OF FULL PAGE LOAD
        // link.addEventListener('click', function(e){
        //     e.preventDefault();
        //     console.log(e.target.href);
        //     console.log('do magic');
        //     get_element(e.target.href, function(text){
        //         const parser = new DOMParser();
        //         const doc = parser.parseFromString(text, 'text/html');
        //         const bodyContent = doc.querySelector('body').innerHTML;
        //         console.log(bodyContent);
        //     });
        // });
    }
}


/**
 * Load the contents of a file using the Fetch API and passes it to a callback function.
 */
function get_element(filename, callback) {
    fetch(filename).then(response => response.text()).then(text => callback(text));
}

/**
 * Load the contents of a file using the Fetch API and passes it to a callback function.
 */
function load_file(filename, callback) {
    fetch(filename).then(response => response.text()).then(text => callback(text));
}


/**
 * Format lowercase string to title case.
 */
function formatString(str) {
    let formattedStr = str.replace(/-/g, ' ');
    formattedStr = formattedStr.replace(/\b\w/g, (match) => match.toUpperCase());
    return formattedStr;
}