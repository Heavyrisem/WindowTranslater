// const { ipcRenderer } = require('electron');

ipcRenderer.on("show_bar", show_bar);

ipcRenderer.on("hide_bar", hide_bar);

ipcRenderer.on("fold", (event, Data) => {
    document.getElementById("card").style.display = 'none';
});

ipcRenderer.on("unfold", (event, Data) => {
    let input_bar = document.getElementById("inputRoot");
    let cls = document.getElementById("cls");
    input_bar.style.height = Data.default.height+'px';
    cls.style.fontSize =  Data.default.height+'px';

    // document.getElementById("card").style.height = (Data.new.height-Data.default.height)+'px';
    document.getElementById("card").style.display = 'block';
});

ipcRenderer.on("clipUpdate", (event, Data) => {

    switch (Data.type) {
        case "list":
            listClip(Data.data); break;
        case "dict":
            dictClip(Data.data); break;
        case "network":
            networkClip(Data.data); break;
    }

});

function networkClip(data) {
    document.getElementById("card").innerHTML = '';
    data.forEach(value => {

        let li = document.createElement('li');
        if (value.url) li.onclick = () => {
            let HttpRequest = new XMLHttpRequest();

            if (!HttpRequest) return console.log("XMLHttpRequest 객체 생성 오류");

            HttpRequest.onreadystatechange = () => {
                if (HttpRequest.readyState === XMLHttpRequest.DONE) {
                    if (HttpRequest.status === 200) {
                        li.innerHTML = `
                        <div>
                            <div class="DictType_title">${value.title}</div>
                            <span class="DictType_description">
                                <span>${HttpRequest.responseText}</span>
                            </span>
                        </div>
                            ${(value.imgurl) ? `<img class="DictType_img" src="${value.imgurl}">` : ""}
                            
                        `.trim();
                        console.log(HttpRequest.responseText);
                    } else {
                        console.log('request에 뭔가 문제가 있어요.');
                    }
                }
            }
            HttpRequest.open('GET', value.url);
            HttpRequest.send();
        }
        li.innerHTML = `
        <div>
            <div class="DictType_title">${value.title}</div>
            <span class="DictType_description">
                <span>${value.desc}</span>
            </span>
        </div>
            ${(value.imgurl) ? `<img class="DictType_img" src="${value.imgurl}">` : ""}
            
        `.trim();
        li.onmouseover = (e)=> {e.currentTarget.classList = "DictType onmouse"}
        li.onmouseleave = (e)=> {e.currentTarget.classList = "DictType"}
        li.className = "DictType";
        document.getElementById("card").appendChild(li);
    });
}

function dictClip(data) {
    document.getElementById("card").innerHTML = '';
    data.forEach(value => {

        let li = document.createElement('li');
        if (value.url) li.onclick = () => {openURL(value.url)}
        li.innerHTML = `
        <div>
            <div class="DictType_title">${value.title}</div>
            <span class="DictType_description">
                <span>${value.desc}</span>
            </span>
        </div>
            ${(value.imgurl) ? `<img class="DictType_img" src="${value.imgurl}">` : ""}
            
        `.trim();
        li.onmouseover = (e)=> {e.currentTarget.classList = "DictType onmouse"}
        li.onmouseleave = (e)=> {e.currentTarget.classList = "DictType"}
        li.className = "DictType";
        document.getElementById("card").appendChild(li);

    });
}

function listClip(data) {
    document.getElementById("card").innerHTML = '';
    data.forEach(value => {
        let li = document.createElement('li');
        if (value.url) li.onclick = ()=>{openURL(value.url)}
        li.innerHTML = `
            <div class="title">${value.title}</div>
            <div class="description">
                <span>${value.desc}</span>
            </div>`.trim();
        li.onmouseover = (e)=> {e.currentTarget.className = "onmouse"}
        li.onmouseleave = (e)=> {e.currentTarget.className = ""}
        
        document.getElementById("card").appendChild(li);
    });
}

function openURL(URL) {
    shell.openExternal(URL);
}

function show_bar() {
    hided = false;
    document.getElementById("card").innerHTML = '';

    let input_bar = document.getElementById("input_bar");
    input_bar.focus();
    console.log('focus');
    checkSizeUpdate();
}

function hide_bar() {
    hided = true;
    clearSizeUpdate();
    ipcRenderer.send("hide_bar")
}


function input_event() {
    let input_bar = document.getElementById("input_bar");
    let str = input_bar.value;
    console.log(str)
    if (event.keyCode == 13) ipcRenderer.send("command", str);
    // else ipcRenderer.send("keyinput", str);
}


let interval;
let lastHeight = 0;
function checkSizeUpdate() {
    interval = setInterval(() => {
        console.log('check')
        let card = document.getElementById("card");
        if (card == null) return;
        (card.offsetHeight != lastHeight) ? sizeUpdate() : '';
        lastHeight = card.offsetHeight;
    }, 200);
}
function clearSizeUpdate() {
    clearInterval(interval);
}


function sizeUpdate() {
    ipcRenderer.send("bodyResize", document.body.offsetHeight);
}