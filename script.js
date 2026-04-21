let callStack = [];
let microTaskQueue = [];
let callbackQueue = [];

// ! for render
function render() {
    document.getElementById("stack").innerHTML =
        [...callStack].reverse().map(i => `<p>${i}</p>`).join("");

    document.getElementById("micro").innerHTML =
        microTaskQueue.map(i => `<p>${i.name}</p>`).join("");

    document.getElementById("callback").innerHTML =
        callbackQueue.map(i => `<p>${i.name}</p>`).join("");
}


function addLog(msg) {
    let logDiv = document.getElementById("logs");
    let p = document.createElement("p");
    p.textContent = msg;
    logDiv.appendChild(p);

}

// override console.log
console.log = function(msg) {
    addLog(msg);
};


// ! to make delay between each code
function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

// ================= RUN =================
async function run(fn, name) {
    callStack.push(name);
    render();
    await sleep(500);

    await fn();

    callStack.pop();
    render();
    await sleep(500);

    await checkMicrotasks();
    await checkCallbacks();
}

// ================= MICROTASK =================
function myPromise(fn) {
    microTaskQueue.push({ fn, name: "Promise" });
    // addLog("Microtask added");
    render();
}

async function checkMicrotasks() {
    if (callStack.length === 0) {
        while (microTaskQueue.length > 0) {
            let task = microTaskQueue.shift();
            await run(task.fn, task.name);
        }
    }
}

// ================= CALLBACK =================
function setTimeoutSim(fn) {
    callbackQueue.push({ fn, name: "Timeout" });
    // addLog("Callback added");
    render();
}

async function checkCallbacks() {
    if (callStack.length === 0 && microTaskQueue.length === 0) {
        while (callbackQueue.length > 0) {
            let task = callbackQueue.shift();
            await run(task.fn, task.name);
        }
    }
}

// ================= USER CODE RUN =================
async function runUserCode() {
    // reset state
    callStack = [];
    microTaskQueue = [];
    callbackQueue = [];

    document.getElementById("logs").innerHTML = "";

    render();

    let userCode = document.getElementById("code").value;

    try {
        let fn = new Function(userCode);
        // await run(fn, "main");
    } catch (e) {
        addLog("Error: " + e.message);
    }
}