from urllib import request as urlrequest

proxy_host = '192.168.2.12:9999'
apinc_url = "http://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest"
retry_times = 5

def getCnIp():
    req = urlrequest.Request(apinc_url)
    req.set_proxy(proxy_host, 'http')
    contents = urlrequest.urlopen(req).read().decode("utf-8")
    if contents is not None and len(contents) > 0:
        cn_ips = [ip for ip in contents.split('\n') if "CN|ipv4|" in ip]
        for cn_ip in cn_ips:
            ip_info = cn_ip.split('|')
            if len(ip_info) > 4:
                ip = ip_info[3]
                end_ip = intToIp(ipToInt(ip) + int(ip_info[4]) - 1)
                print(f"{ip} {end_ip}")
        return True
    return False
    
def intToIp(ip):
    addr1 = (ip & 0xFF000000) >> 0x18
    addr2 = (ip & 0x00FF0000) >> 0x10
    addr3 = (ip & 0x0000FF00) >> 0x08
    addr4 = (ip & 0x000000FF)
    return f"{addr1}.{addr2}.{addr3}.{addr4}"
    
def ipToInt(ip):
    ips = ip.split('.')
    ipcode = 0xFFFFFF00 | int(ips[3])
    ipcode = ipcode & 0xFFFF00FF | (int(ips[2]) << 0x08)
    ipcode = ipcode & 0xFF00FFFF | (int(ips[1]) << 0x10)
    ipcode = ipcode & 0x00FFFFFF | (int(ips[0]) << 0x18)
    return ipcode
    
if __name__ == '__main__':
    result = getCnIp()
    while not result and retry_times > 0:
        result = getCnIp()
        retry_times = retry_times - 1
    