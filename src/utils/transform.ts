export async function processContent(value1: string, type: string) {
  let value2 = "";
  let flag = "success";
  if (type === "/json-format") {
    try {
      const object = JSON.parse(value1);
      value2 = JSON.stringify(object, null, 2);
    } catch (error) {
      flag = "failure"
      value2 = 'JSON 解析失败';  
    }
  } else if(type === "/url-parser") {
    try {
      const object = new URL(value1);
      const map: Record<string, string> = {};
      const params = object.searchParams;
      params.forEach((value,key)=> {
        map[key] = value
      })      
      value2 = JSON.stringify({
        href: object.href,
        protocol: object.protocol,
        host: object.host,
        hostname: object.hostname,
        port: object.port,
        pathname: object.pathname,
        hash: object.hash,
        search: object.search,
        searchParams: map,
      }, null, 2);  
    } catch (error) {
      flag = "failure"
      value2 = 'URL 解析失败';
    }
  } else  {
    value2 = value1;
  }
  return [value2, flag];
}
