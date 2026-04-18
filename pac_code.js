let no_proxy = 'DIRECT';
let hosts = "192.168.2.11:9999";

let hostMap = {};
const MAX_CACHE_SIZE = 1000;

function ip2int(ip) {
    return ip.split('.').reduce(function (ipInt, octet) {
        return (ipInt << 8) + parseInt(octet, 10);
    }, 0) >>> 0;
}

function isCNIP(ipAddr) {
    const intIp = ip2int(ipAddr);
    
    if (intIp === 0) {
        return true;
    }
    
    let left = 0;
    let right = cnIp.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const range = cnIp[mid];
        
        if (intIp < range[0]) {
            right = mid - 1;
        } else if (intIp > range[1]) {
            left = mid + 1;
        } else {
            return true;
        }
    }
    
    return false;
}

function getRandomProxy() {
    const hostsArray = hosts.split(" ");
    const randomIndex = Math.floor(Math.random() * hostsArray.length);
    return "PROXY " + hostsArray[randomIndex] + "; " + no_proxy;
}

function getProxyByIP(ipAddr, host) {
    const isChinaIP = isCNIP(ipAddr);
    setCache(host, isChinaIP);
    return isChinaIP ? no_proxy : getRandomProxy();
}

function getCache(host) {
    if (host in hostMap) {
        return hostMap[host] ? no_proxy : getRandomProxy();
    }
    return null;
}

function setCache(host, isChinaIP) {
    const cacheSize = Object.keys(hostMap).length;
    if (cacheSize >= MAX_CACHE_SIZE) {
        const keys = Object.keys(hostMap);
        const halfSize = Math.floor(keys.length / 2);
        for (let i = 0; i < halfSize; i++) {
            delete hostMap[keys[i]];
        }
    }
    hostMap[host] = isChinaIP;
}

function FindProxyForURL(url, host) {
    if (isInNet(host, "192.168.0.0", "255.255.0.0") ||
        isInNet(host, "10.0.0.0", "255.0.0.0") ||
        isPlainHostName(host)) {
        return no_proxy;
    }
    
    if (shExpMatch(host, "*:*:*:*")) {
        return no_proxy;
    }
    
    const cacheValue = getCache(host);
    if (cacheValue !== null) {
        return cacheValue;
    }
    
    const ipAddr = dnsResolve(host);
    if (!ipAddr) {
        setCache(host, true);
        return no_proxy;
    }
    
    if (shExpMatch(ipAddr, "*:*:*:*")) {
        setCache(host, true);
        return no_proxy;
    }
    
    return getProxyByIP(ipAddr, host);
}
