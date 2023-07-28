const table = document.getElementById("timeTable");

function sortTable(servers) {
    var rowCount = table.rows.length;
    // 保留第一行
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    const sortedTimes = new Map([...servers.entries()].sort((a, b) => getNextGiftTime(a[1]) - getNextGiftTime(b[1])));
    for (const [key, value] of sortedTimes) {
        const nextGiftTime = getNextGiftTime(value);

        const row = table.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.innerHTML = key;
        cell2.innerHTML = new Date(nextGiftTime).toLocaleString();
        cell3.innerHTML = `${((nextGiftTime - Date.now()) / 1000).toFixed(2)}s`;
    }
}

function getNextGiftTime(timestamp) {
    const giftInterval = 20 * 60 * 1000; // 20分钟转化为毫秒
    const now = Date.now();

    let nextGiftTime = timestamp;

    while (nextGiftTime <= now) {
        nextGiftTime += giftInterval;
    }

    return nextGiftTime;
}

async function init() {
    const response = await fetch('https://athena.wynntils.com/cache/get/serverList', {
        method: "GET",
        mode: 'cors',
        timeout: 5000,
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Awa/0.1"
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const servers = data.servers;
    const times = new Map();
    Object.keys(servers).forEach(server => {
        if (server !== 'YT') {
            times.set(server, servers[server].firstSeen);
        }
    });
    return times;
}

async function main() {
    const servers = await init();
    setInterval(() => sortTable(servers), 500);
}

main();