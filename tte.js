/*
TTE 解锁高级特权

***************************
QuantumultX:

[rewrite_local]
^https:\/\/(api\.revenuecat\.com\/v\d\/subscribers|vsco\.co\/api\/subscriptions\/\d\.\d\/user-subscriptions)\/ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/vsco.js

[mitm]
hostname = api.revenuecat.com

***************************
Surge4 or Loon: 

[Script]
http-response ^https:\/\/(api\.revenuecat\.com\/v\d\/subscribers|vsco\.co\/api\/subscriptions\/\d\.\d\/user-subscriptions)\/ requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/vsco.js

[MITM]
hostname = api.revenuecat.com

**************************/

let obj = JSON.parse($response.body || '{}');
if (obj.subscriber) {
	obj.subscriber.non_subscriptions = {
		"ttte.iap.fullVersion": {
			"id": "1a93b01e61",
			"expires_date": "2030-02-18T07:52:54Z",
			"is_sandbox": false,
			"original_purchase_date": "2022-03-26T00:48:43Z",
			"purchase_date": "2022-03-26T00:48:43Z",
			"store": "app_store",
			"unsubscribe_detected_at": null
		}
	};
	obj.subscriber.other_purchases = {
		"ttte.iap.fullVersion": {
			"purchase_date": "2022-03-26T00:48:43Z"
		}
	};
}

$done({
	body: JSON.stringify(obj)
});