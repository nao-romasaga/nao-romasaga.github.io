var DATA_URL = (location.href.indexOf("nao-romasaga.github.io") < 10) ? "https://romasagatool.com" : ".";
function dataload(filenames){
    for(let file of filenames ) {
        document.write(`<script src='${DATA_URL}/data/${file}.js.gz' defer></script> `);
    }    
}