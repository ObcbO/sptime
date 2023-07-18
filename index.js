const table = document.getElementById("timeTable");

function getNextGiftTime(timestamp) {
    const giftInterval = 20 * 60 * 1000; // 20分钟转化为毫秒
    const now = Date.now();

    let nextGiftTime = timestamp;

    while (nextGiftTime <= now) {
        nextGiftTime += giftInterval;
    }

    return nextGiftTime;
}

fetch('https://athena.wynntils.com/cache/get/serverList', {
    method: "GET",
    mode: 'cors',
    timeout: 5000, // 设置5秒超时
    headers: {
        "Content-Type": "application/json",
        "User-Agent": "Awa/0.1"
    }
}).then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
    .then(data => {
        const servers = data.servers;
        const times = new Map();
        Object.keys(servers).forEach(server => {
            if (server !== 'YT') {
                let nextGiftTime = getNextGiftTime(servers[server].firstSeen);
                times.set(server, nextGiftTime);
            }
        })
        // value升序
        const sortedTimes = new Map([...times.entries()].sort((a, b) => a[1] - b[1]));
        for (const [key, value] of sortedTimes) {
            const row = table.insertRow(-1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.innerHTML = key;
            cell2.innerHTML = new Date(value).toLocaleString();
        }
    })