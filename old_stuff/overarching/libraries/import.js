function InportJSFile(filePath){
    var script = document.createElement("script");
    script.src = filePath;

    document.body.appendChild(script);
}