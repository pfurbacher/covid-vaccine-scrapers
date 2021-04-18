const site = {
    name: "Lowell General",
    signUpLink: "https://www.lowellgeneralvaccine.com/#schedule",
    startUrl:
        "https://www.lowellgeneralvaccine.com/schedule.html?wpforms%5Bfields%5D%5B2%5D=Massachusetts+residents+over+the+age+of+75+or+those+75%2B+with+a+Circle+Health+affiliated+PCP&wpforms%5Bfields%5D%5B5%5D%5B%5D=I+hereby+attest+under+penalty+of+perjury+and+to+the+best+of+my+knowledge+and+belief+that+I+%28or+the+individual+I+am+scheduling%29+belong+to+one+of+the+Massachusetts+Vaccination+Priority+Group+selected+above&wpforms%5Bfields%5D%5B6%5D%5B%5D=I+hereby+attest+under+penalty+of+perjury+that+I%2Fthey+reside%2C+work%2C+and%2For+study+in+the+State+of+Massachusetts&wpforms%5Bfields%5D%5B7%5D%5B%5D=I+understand+that+at+the+vaccination+site+I+may+be+asked+to+provide+proof+of+the+above.+Such+proof+can+include%3A+government+issued+ID%2C+work+badge%2C+employment+letter+or+current+pay+stub&wpforms%5Bid%5D=6400&wpforms%5Bauthor%5D=1&wpforms%5Bpost_id%5D=6037&wpforms%5Btoken%5D=dca7ffc8c0e098ddf465f4dc68841c1d",
    street: "Cross River Center - East 1001 Pawtucket Blvd",
    city: "Lowell",
    state: "MA",
    zip: "01854",
};

const fetchOptions = `{
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "request-context": "appId=cid-v1:16aec3bf-9cd7-4c04-9a3b-2faf27c18efa",
    "request-id": "|4e465541a3304d659fc4608cfcb2e044.73fe9808996b4da9",
    "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-4e465541a3304d659fc4608cfcb2e044-73fe9808996b4da9-01",
    "x-requested-with": "XMLHttpRequest",
    "cookie": "ASP.NET_SessionId=taioq5vrmbchw5bhiv15kdqc; MhdSessionUrlLaunch=AwV6hRfDt9UyYppKJO0VUPlsb9V3t9yGsKKFfKeooCVG+NDDg/E8C+oztsUlskeWEH5SUu84T+n7xth3xST0AY0LrpDCzK3Ca+2gAla3bPUEf5xdyKJXrU5nJNI4gN4RMXi38KfpO+6JsMj3j/aKEmvotgbOBdvzJ768dkILieTXGz1d; ARRAffinity=6c5458dd548284d7396cd2cba264e633b6118968d745d1e82e3c3f7fc14794d7; ARRAffinitySameSite=6c5458dd548284d7396cd2cba264e633b6118968d745d1e82e3c3f7fc14794d7; ai_user=l9zNs4hVO02fxFXzJ9vSK0|2021-04-15T15:50:05.382Z; ai_session=QP02ZCQLJvb+QkUheBdIf8|1618501805485|1618502032159; .ASPXAUTH=8FC02EDAEC13500D88C9C124C34E680B7B9E8F8E7883180F6DFE2834E1602EA6B05FC67BBC4700F1A98D5B2B3B8806C706A7035691FBF40C17E7E021DE2417EB68B5AE9A41AF884726CB3F487D985E7C8900C88D33C544AE627CE3F49329495A5866495951D882865EEBF44A40DDCE57573A1005"
  },
  "referrer": "https://lowellgeneralvaccine.myhealthdirect.com/provider/info/32122-False--True",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors"
}`;

module.exports = {
    site,
    fetchOptions,
};
