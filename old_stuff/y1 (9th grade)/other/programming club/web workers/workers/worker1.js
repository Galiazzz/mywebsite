var prevDate = Date.now();

for (var i = 0; i < 10000; i++) {
    postMessage([i, false]);
}

postMessage([Date.now() - prevDate, true]);