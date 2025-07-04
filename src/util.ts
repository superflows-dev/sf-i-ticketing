
const validateName = (name: string) => {
    if((name + "").length > 2) {
      return true;
    }
    return false;
}

function isJsonString(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function readCookie(key: string) {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function callApi(url: string, data: string, authorization: any) {

    return new Promise((resolve: any) => {

        const jsonData = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", () => {
            if(xhr != null) {
                if(xhr.readyState === 4) {
                    resolve(xhr);
                }
            }
        });
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
        if(authorization != null) {
            xhr.setRequestHeader('Authorization', 'Basic ' + authorization);
        }
        xhr.send(jsonData);

        return xhr;

    })

}

async function replaceElement(element: any) {
    var old_element = element;
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    return new_element;
}

function getDayMonthYear(d: Date) {
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [day, month, year]
}

function getDateTimeStrings(unixTimestamp: number): String {
    // Convert to milliseconds if the timestamp is in seconds
    if (unixTimestamp.toString().length === 10) {
      unixTimestamp *= 1000;
    }
  
    const date = new Date(unixTimestamp);
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
  
    const estFormatter = new Intl.DateTimeFormat('en-US', {
      ...options,
      timeZone: 'America/New_York',
    });
  
    const istFormatter = new Intl.DateTimeFormat('en-IN', {
      ...options,
      timeZone: 'Asia/Kolkata',
    });
  
    const [estDate, estTime] = estFormatter.format(date).split(', ');
    const [istDate, istTime] = istFormatter.format(date).split(', ');
    return `${estDate} ${estTime} EST, ${istDate} ${istTime} IST`;
}

const exportFunctions = {
   callApi, validateName, readCookie, replaceElement, getDayMonthYear, isJsonString, getDateTimeStrings
};

export default exportFunctions;