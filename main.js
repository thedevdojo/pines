/**
 * When the document is ready check to see if we are on an element or getting started page.
 * If we are on an element or getting started page, load the content from the HTML file.
 * If not, load the list of elements and getting started items from the JSON file.
 */
document.addEventListener('DOMContentLoaded', function() {
    let element = getQueryParameter('element');
    const start = getQueryParameter('start');
    if(element || start){
        document.getElementById('list').remove();
        
        load_file('./data.json', function(text){
            let data = JSON.parse(text);
            let folderLocation = (element) ? 'elements' : 'getting-started';
            let file = (element) ? element : start;
            if(element){
                
                if(element.includes('-examples')){
                    element = element.replace('-examples', '').split('/')[0];
                }
                console.log(element);
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
            addItemsToList(data.elements, document.getElementById('elements'), 'element', data.examples);
            addItemsToList(data.start, document.getElementById('gettingStarted'), 'start');

            // for(let i=0; i < data.examples.length; i++){
                
            // }

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
function addItemsToList(myObject, myList, param, examples = null){
    for (const key in myObject) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'text-blue-500 underline';
        link.href = '?' + param + '=' + key;
        link.textContent = myObject[key];

        listItem.appendChild(link);

        if(examples){
            if(examples[key]){
                let exampleList = document.createElement('ul');
                exampleList.classList.add('list-disc', 'pl-4');
                let exampleFiles = examples[key];
                for(let i=0; i < exampleFiles.length; i++){
                    let exampleListItem = document.createElement('li');
                    let exampleLink = document.createElement('a');
                    exampleLink.className = 'text-blue-500 underline';
                    exampleLink.href = '?' + param + '=' + key + '-examples/example-' + exampleFiles[i];
                    exampleLink.textContent = 'Example ' + exampleFiles[i];

                    exampleListItem.appendChild(exampleLink);
                    exampleList.appendChild(exampleListItem);

                }
            
                listItem.appendChild(exampleList);
            }
        }
        
        myList.appendChild(listItem);

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