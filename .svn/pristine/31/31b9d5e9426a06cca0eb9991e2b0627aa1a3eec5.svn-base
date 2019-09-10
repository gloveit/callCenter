/**
 * <p>Copyright: Copyright (c) 2015</p>
 * <p>Company: 杭州网梭科技有限公司</p>
 * <p>Hangzhou Onesoul Technologies Inc. 
 * 	– Confidential and Proprietary</p>
 * 
 * 呼叫中心内嵌网页跨域呼叫控制器 跨域 SimpleAgentMgr 的访问类。
 * 
 * 实现原理：Html5 的 window.postMessage 的支持。
 * 
 * 主要业务类：
 * 
 * CSAM, 即 CrossBrowserSAM, 对于 SAM 进行跨域调用封装的对象。
 * CSAMResult 专用于获取函数返回值的对象。具体使用见下方例子。
 * 
 * 理论上所有原 SAM 的方法都可以在 CSAM 里面进行访问和调用。
 * 
 * 但是由于跨域，相关调用由同步变成了异步，因此程序写法有些不同，具体请参阅例子：
 * 
 * 使用举例：
 * 
 * 1. 开启服务并接管 SAM 的事件
 * 
 * // 假设 SAM 组件是在 iframeABC 所在窗口里，因此 CSAM 的 start 参数
 * // 必须指向 该iframe对应的窗口。 
 * CSAM.start($("#iframeABC")[0].contentWindow);
 * 
 * // 接管事件
 * CSAM.onSAMEvent = function(eventObject) {
 * 	// 事件处理。
 *   if (eventObject.eventType == "xxxx") {
 *   }
 * };
 * 
 * 2. 使用 CSAM.call 调用简单函数(不关心返回值)
 * 
 * 以 SAM 里面的下列函数为例：
 * function connect(accessInfo, telOption, agentStatus)
 * 
 * 使用 CSAM 来调用该函数，不获取函数返回值：
 * 
 * CSAM.call("connect", accessInfo, telOption, agentStatus);
 * 
 * 3. 使用 CSAM.call 调用有返回值的函数，且函数中有回调函数等参数。
 * 
 * 以 SAM 里面的下列函数为例：
 * function makeCallToPhone (phone, callback, callbackError) ，该函数返回 actionId，用于进行取消操作。
 *  
 * 使用 CSAM 来调用该函数：
 *
 * CSAM.call("makeCallToPhone", phone, callback, callbackError, new CSAMResult(function(actionId, error) {
 * 		// 此 actionId 为 SAM的 makeCallToPhone 的返回值。
 * 		// 若调用时抛出异常，则 actionId 为 null，error 为 Error 异常对象。
 * })); 
 * 
 * 以 SAM.getACDEvent() 为例，使用 CSAM 的写法为：
 * 
 * CSAM.call("getACDEvent", new CSAMResult(function(result, error) {
 *   // result 就是 获取到的 acdEvent 对象。
 * }));
 * 
 */
 
 ( function() { 

	/**
	 * 此字串常量用来表征 参数为回调函数，在异域进行实际方法调用时应予以替换。
	 */
	var _CAMCallbackParamFeature = "_cam_call_back_param_feature_"; 	
 	var _CAMResultFeature = "onesoul.csamresult.feature"; 
 	
 	var packet_type = "CROSS_BROWSER_SAM_PACKET";

	function CSAMResult(callback) {
		/**
		 * 此常量用于识别此特定对象，属于接口约定，请勿擅自更改。
		 */
		this.feature = _CAMResultFeature;
		this.callback = callback;
	}
 	
 	/**
 	 * 务必从 1 开始，而不是从 0 开始。因为 0 可能导致误判为空。
 	 */
	var requestId = 1;
	
	// key: id
	var _requestCache = {};
	
	var isStarted = false;
	
	var _cam = {
		
		/**
		 * postMessage 的目标窗口。若为 null, 则分发到 当前 window
		 */
		"targetWindow": null, 
		
		"onSAMEvent": null, // 此为 SAM 事件的回调接管器。
		
		"call": function() {
			
			/**
			 * 要求参数必须大于等于1个，且第一个参数必须是 String 类型。
			 */
			if (arguments.length < 1) {
				throw new Error("CSAM.call 参数必须大于1个。");
			}
			
			if (typeof arguments[0] != "string") {
				throw new Error("CSAM.call 第一个参数必须是方法名(String)类型");
			}
			
			/**
			 * 整体实现机制：
			 * 1. 将本地参数除 CAMResult 以及 funciton 类型之外的参数打包;
			 * 2. 发送 postMessage 到异域，并开启定时器检测是否没有响应(因为可能异域模块没有挂载监听);
			 *    若 CAMResult 没有提供，那就没有办法告知是否超时不响应了。
			 * 3. 异域模块调用本地方法，传入备用的 callback, 以及 callbackError 两个函数。
			 *   若抛出异常，则马上会送消息给原始模块。
			 *   当回调 callback 以及 callbackError 时，再回送消息给原始模块。
			 * 4. 无论如何，为避免内存泄漏，所有 cached 的请求参数必须在给定时间内清理掉( n 分钟截止)。
			 * 
			 */
			
			requestId ++;
			
			var item = {
				"id": requestId, // 唯一请求参数
				"method": arguments[0], // 方法名称
				"params": [], // 参数列表
				"callbacks": [], // 回调函数列表，如果长度>0, 则回调之后就从 cache 里面去除。若回调
				"cResult": null, // CSAMResult 信息。
				"waitTimeoutBack": true, // 是否等待超时回调，一旦有任何 返回值或者 callbacks 等的回调
							// 应立即将此标志置为 false.
				"start_time": new Date().getTime() 
			};
			
			/**
			 * Cache 清除机制：
			 * 1. 通过一个 timeout来确保 5分钟必须清除(也就是说，不支持通过 CSAM 来调用 SAM.addEventListener 之类的方法 );
			 * 2. callbacks 的长度 > 1，则引用计数 + 1;
			 *    CAMResult 非空，则 引用计数 + 1;
			 * 3. 一旦引用计数为 0，则清除 cache; 
			 * 真正实现时，为简化起见，上述引用计数的机制先不管了，也就是说 cache 总是在5分钟后才清除。
			 */
			
			/**
			 * 该参数需要细致处理，不适合直接克隆
			 */
			for (var i=1; i<arguments.length; i++) {
				var argument = arguments[i];
				
				if (typeof(arguments[i]) == "function") {
					
					/**
					 * 此处需要将回调的索引跟在 feature后面。以便于回调时不要弄错对象。
					 * 回调处理时，需要做字串替换然后取出索引值。
					 */
					item.params.push(_CAMCallbackParamFeature + item.callbacks.length);
					
					item.callbacks.push(arguments[i]);
				}
				else if (arguments[i].feature == _CAMResultFeature) {
					// 识别为该参数为 CAMResult 对象。因此也不应该添加到参数里。
					item.cResult = arguments[i];
				}
				else {
					/**
					 * NOTE: 即便是空参数也必须加入
					 */
					item.params.push(arguments[i]);
				}
			}

			/**
			 * 先缓存
			 */
			_requestCache[item.id] = item;
			
			var packet = {
				"id": item.id,
				"type": "request", 
				"packet_type": packet_type, // 常量，见上面定义。 
				"method": arguments[0], // 方法名称
				"params": item.params 
			};
			
			var tempId = item.id;
			
			var str = JSON.stringify(packet);
			
			if (_cam.targetWindow) {
				_cam.targetWindow.postMessage(str, "*");
			}
			else {
				window.postMessage(str, "*");
			}
			
			setTimeout(function() {
				var item = _requestCache[tempId];
				if (item != null 
					&& item.waitTimeoutBack) {
					// 确实没有回调过, 且设置了 相关回调。
					try {
						if (item.cResult && item.cResult.callback) {
							item.cResult.callback(null, new Error("timeout"));
						}
					}
					finally {
						delete _requestCache[tempId];
					}
				}
			}, 1000 * 5);		
	
			/**
			 * 为了防止内存泄漏，务必清除。
			 */		
			setTimeout(function() {
				delete _requestCache[tempId];
			}, 1000 * 60 * 3);				
			
		},
		
		"packet_type": packet_type,
		
		"onMessage": function(resp) {
			
			/**
			 * 分成 onSAMEvent
			 */
			if (resp.type == "onSAMEvent") {
				
				if (CSAM.onSAMEvent) {
					CSAM.onSAMEvent(resp.event);
				}
			}
			else if (resp.type == "result" && resp.id) {
				// 这是函数返回值的调用，如果函数没有返回值，也得走这一遭，为的是表明有此函数，不至于
				// 前端 5 秒超时了。
				var item = _requestCache[resp.id];
				if (item) {
					item.waitTimeoutBack = false;
					
					if (item.cResult && item.cResult.callback) {
						item.cResult.callback(resp.result, resp.error);
					}
										
				}
				
			} 
			else if (resp.type.indexOf(_CAMCallbackParamFeature) >= 0 && resp.id) {
				
				var item = _requestCache[resp.id];
				if (item) {
				
					item.waitTimeoutBack = false;
				
					var callBackIndex = resp.type.replace(_CAMCallbackParamFeature, "");
					callBackIndex = parseInt(callBackIndex);
					
					if (item.callbacks.length > callbackIndex) {
						
						/**
						 * 回调相关函数。这里为了兼容，识别回调里有 result 参数则直接回调
						 * 否则按照多参数 params 的格式进行回调
						 */
						if (!(resp.result === undefined)) {
							item.callbacks[callbackIndex](resp.result);	
						}
						else if (resp.params 
							&& !(resp.params.length === undefined)) {
							
							item.callbacks[callbackIndex].apply(null, resp.params);
						}
						else {
							item.callbacks[callbackIndex]();
						}						
					}
					else {
						throw new Error("unexpected callback index out of bounds. callbackIndex:" + callbackIndex);
					}
					
										
				}
			} //
			
		}, // end of onMessage
		
		"start": function(targetWindow) {
			
			if (targetWindow && !targetWindow.postMessage) {
				throw new Error("传入的窗口对象不支持 postMessage 机制。");
			}
			
			_cam.targetWindow = targetWindow;
			
			if (isStarted) {
				return;
			}
			
			 /*
			 * 处理跨域的 数据返回。
			 */
			var onmessage = function (event) {
			    var data = event.data;
			    var origin = event.origin;
			    var source = event.source;
			    
			    /**
			     * data 必须是 String, 且格式为 JSONObject：
			     */
			    data = JSON.parse(data);
			    
			    if (data.packet_type == CSAM.packet_type) {
			    	
			    	CSAM.onMessage(data);
			    	
			    }
			    
			};
			
			if (typeof window.addEventListener != 'undefined') {
			    window.addEventListener('message', onmessage, false);
			} else if (typeof window.attachEvent != 'undefined') {
			    //for ie
			    window.attachEvent('onmessage', onmessage);
			}			
			
			isStarted = true;
			
		}		
		
	}; 	
	
 	window.CSAM = _cam;
 	window.CrossBrowserSAM = _cam;
 	window.CSAMResult = CSAMResult;
 	  
 })();
 
