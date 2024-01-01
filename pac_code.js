let no_proxy = 'DIRECT';
let proxy = 'PROXY 192.168.2.12:9999; DIRECT; SOCKS5 192.168.2.12:10000';
// cache map
let hostMap = {};

function ip2int(ip) {
    return ip.split('.').reduce(function (ipInt, octet) { return (ipInt << 8) + parseInt(octet, 10) }, 0) >>> 0;
}

function isCNIP(ipAddr) {
    intIp = ip2int(ipAddr);
    if (intIp == 0) {
        return true;
    }
    let isInRange = false;
    for (let i = 0; i < cnIp.length; i++) {
        item = cnIp[i];
        if (intIp >= item[0] && intIp <= item[1]) {
            isInRange = true;
            break;
        }
    }

    return isInRange;
}

function getProxyByIP(ipAddr, host) {
    let is_cnip = isCNIP(ipAddr);
    alert('isCNIP: ' + is_cnip + ' : ' + host);
    setCache(host, is_cnip);
    return is_cnip ? no_proxy : proxy;
}

function getCache(host) {
    if (hostMap[host] != null) {
        return hostMap[host] ? no_proxy : proxy;
    }
    return null;
}

function setCache(host, noProxy) {
    // clear cache in a simple way.
    let cacheSize = Object.keys(hostMap).length;
    alert('cache size: ' + cacheSize);
    if (cacheSize > 99999) {
        hostMap = {};
    }
    hostMap[host] = noProxy;
}

function FindProxyForURL(url, host) {
    if (isInNet(host, "192.168.0.0",  "255.255.0.0") ||
        isInNet(host, "10.10.0.0",  "255.255.0.0") ||
        shExpMatch(host, "*:*:*:*") ||
        isPlainHostName(host)) {
        return no_proxy;
    }

    let cacheValue = getCache(host);
    alert('cache value: ' + cacheValue + ' host: ' + host);
    if (cacheValue) {
        return cacheValue;
    }

    ipAddr = dnsResolve(host);
    alert('DNS resolve: ' + ipAddr + ' host: ' + host);
    if (!ipAddr) {
        setCache(host, true);
        return no_proxy;
    }

    return getProxyByIP(ipAddr, host);
}
