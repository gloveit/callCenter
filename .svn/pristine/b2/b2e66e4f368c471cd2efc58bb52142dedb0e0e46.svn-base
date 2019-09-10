
var QPhoneInternalVersion = "1.0.1.50";
QPhoneInternal = {};
QPhoneInternal.State = 'idle';
QPhoneInternal.PhoneVersion = QPhoneInternalVersion;

function resetQPhoneInternal() {
    QPhoneInternal.NeedInitWhenReady = false;
    QPhoneInternal.JsSIP = null;
    QPhoneInternal.oUserAgent = null;
    QPhoneInternal.oConfigCall = null;
    QPhoneInternal.oConfigRegister = null;
    QPhoneInternal.oSipSessionCall = null;
    QPhoneInternal.QCallInternal = null;
    QPhoneInternal.State = 'idle';
}

QPhoneInternal.NeedInitWhenReady = false;
QPhoneInternal.CurrentJS = null;
QPhoneInternal.JsSIP = null;
QPhoneInternal.oUserAgent = null;
QPhoneInternal.oConfigCall = null;
QPhoneInternal.oConfigRegister = null;
QPhoneInternal.oSipSessionCall = null;
QPhoneInternal.QCallInternal = null;
QPhoneInternal.IsSafari = false;

QPhoneInternal.OnRegisterSuccessful = null;
QPhoneInternal.OnRegisterFailed = null;
QPhoneInternal.OnUnregistered = null;
QPhoneInternal.OnCallIncoming = null;
QPhoneInternal.OnCallProceeding = null;
QPhoneInternal.OnCallTerminated = null;
QPhoneInternal.OnCallConnected = null;
QPhoneInternal.OnMessageSentOK = null;
QPhoneInternal.OnMessageSentFail = null;
QPhoneInternal.OnMessageReceived = null;
QPhoneInternal.OnCallVideoReceived = null;
QPhoneInternal.OnRecordSnapShot = null;
QPhoneInternal.WebsocketServer = null;
QPhoneInternal.RegistrarServer = null;
QPhoneInternal.AuthName = null;
QPhoneInternal.AuthPassword = null;
QPhoneInternal.PhoneNumber = null;
QPhoneInternal.PhoneName = null;
QPhoneInternal.StunServer = null;
QPhoneInternal.UserAgentSuffix = null;
QPhoneInternal.CodedVideoWidth = undefined;
QPhoneInternal.CodedVideoHeight = undefined;
QPhoneInternal.VideoBitrate = undefined;
QPhoneInternal.VideoFrameRate = undefined;
QPhoneInternal.AudioBitrate = undefined;
QPhoneInternal.ICETimeout = undefined;
QPhoneInternal.MessageCounter = 0;
QPhoneInternal.WebSocketDisconnected = false;
QPhoneInternal.DisableAEC = false;
QPhoneInternal.LocalRecordSupported = false;

QPhoneInternal.oReadyStateTimer = null
QPhoneInternal.fOnBeforeUnload = null;

function QPhoneInternalEnableDebug() {
    if (QPhoneInternal.JsSIP)
        QPhoneInternal.JsSIP.debug.enable("JsSIP:*");
    return true;
}

function QPhoneInternalDisableDebug() {
    if (QPhoneInternal.JsSIP)
        QPhoneInternal.JsSIP.debug.disable("JsSIP:*");
    return true;
}

function QPhoneInternalLog() {
    if (!QPhoneInternal.JsSIP)
        return;
    args = arguments;
    args = ["%cQPhoneH5: %c" + args[0], "color:DarkBlue", 'color: inherit'].concat(Array.prototype.slice.call(args, 1));
    Function.prototype.apply.call(QPhoneInternal.JsSIP.debug.log, QPhoneInternal.JsSIP.debug, args);
}

function QPhoneInternalCreateMediaStream(mediaConstraints, onSuccess, onFailed) {
    navigator.mediaDevices.getUserMedia(mediaConstraints)['then'](function(mediaStream) {
            if (QPhoneInternal.QCallInternal)
                QPhoneInternal.QCallInternal.oStaticMediaStream = mediaStream;
            if (onSuccess)
                onSuccess();
        })['catch'](function(error) {
            if (QPhoneInternal.QCallInternal)
                QPhoneInternal.QCallInternal.oStaticMediaStream = null;
            if (onFailed)
                onFailed();
        });
}

function QCallReject() {
    var qc = this;
    if (qc != QPhoneInternal.QCallInternal)
        return;
    qc.getSession().terminate({ status_code: 603, reason_phrase: 'Decline' });
}

function QCallHangup() {
    var qc = this;
    if (qc != QPhoneInternal.QCallInternal)
        return;
    qc.StopRecord2();
    qc.getSession().terminate({ status_code: 603, reason_phrase: 'Decline' });
}

function QPhoneInternalAcceptCurrentCall() {
    if (QPhoneInternal.QCallInternal) {
        QPhoneInternal.QCallInternal.Accept();
    }
}

function QPhoneInternalRejectCurrentCall() {
    if (QPhoneInternal.QCallInternal) {
        QPhoneInternal.QCallInternal.getSession().terminate({ status_code: 488, reason_phrase: 'Not Acceptable' });
    }
}

function QPhoneInternalCheckCandidateEnd(session) {
    var connection = session.connection;
    if (!QPhoneInternal.ICETimeout)
        return;
    setTimeout(function() {
        var evt = document.createEvent('Event');
        evt.initEvent('icecandidate', false, false);
        connection.dispatchEvent(evt);
    }, QPhoneInternal.ICETimeout);
}

function QCallAccept() {
    var qc = this;
    if (qc != QPhoneInternal.QCallInternal)
        return;
    if (qc.AcceptState == 'accepted')
        return;
    oconfig = QPhoneGetCallConfig(null, QPhoneInternal.QCallInternal.oLocalVideoView, QPhoneInternal.QCallInternal.oRemoteVideoView);
    if (qc.NeedCreateStream && !qc.oStaticMediaStream) {
        if (qc.AcceptState == 'createMedia')
            return;
        qc.AcceptState = 'createMedia';
        QPhoneInternalCreateMediaStream(oconfig.mediaConstraints, QPhoneInternalAcceptCurrentCall, QPhoneInternalRejectCurrentCall);
        return;
    }
    var session = qc.getSession();
    session.answer(oconfig);
    QPhoneInternalOverrideConnectionCreateAnswer(session);
    session.connection.onaddstream = QPhoneInternalOnAddStream;
    session.connection.onremovestream = QPhoneInternalOnRemoveStream;
    QPhoneInternalCheckCandidateEnd(session);
    QPhoneInternalResetConnectionSetMedia(session);
    qc.AcceptState = 'accepted';
}

function QCallRecorder(qc, handler) {
    var self = this;
    if (!QPhoneInternal.LocalRecordSupported)
        return null;
    if (typeof MediaRecorder == undefined)
        return null;
    var session = qc.getSession();
    var localStreams = session.connection.getLocalStreams();
    if (localStreams.length <= 0)
        return null;
    var localStream = localStreams[0];
    var remoteStreams = session.connection.getRemoteStreams();
    if (remoteStreams.length <= 0)
        return null;
    var remoteStream = remoteStreams[0];
    var constraints = {"audio": true, "video": {  "mandatory": {  "minWidth": 640,  "maxWidth": 640, "minHeight": 480,"maxHeight": 480 }, "optional": [] } };
    var chunks = [];
    var boxWidth = QPhoneInternal.CodedVideoWidth;
    var boxHeight = QPhoneInternal.CodedVideoHeight;
    var mixer = new MultiStreamsMixer([localStream, remoteStream]);
    localStream.width = remoteStream.width = boxWidth;
    localStream.height = remoteStream.height = boxHeight;
    var mediaRecorder = new MediaRecorder(mixer.getMixedStream(), constraints);
    mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
    };
    mediaRecorder.onerror = function(e){
        console.log('Error: ', e);
    };
    mediaRecorder.onstart = function(){
    };
    mediaRecorder.onstop = function(){
        var blob = new Blob(chunks, {type: "video/webm"});
        chunks = [];
        handler['recordsnap']({'qcall': qc, 'blob': blob, 'param': null, 'rectype': 1});
    };
    this.start = function() {
        mixer.startDrawingFrames();
        mediaRecorder.start(10);
    }
    this.stop = function() {
        mediaRecorder.stop();
        mixer.releaseStreams();
    }
    function computeSize(mainSize, subSize, output, scale) {
        var mainWidth, mainHeight, subWidth, subHeight, mainRatio, subRatio;
        mainWidth = mainSize.width;
        mainHeight = mainSize.height;
        subWidth = subSize.width;
        subHeight = subSize.height;
        mainRatio = mainWidth / mainHeight;
        subRatio = subWidth / subHeight;
        if (mainRatio >= subRatio) {
            outputHeight = mainHeight * scale.num / scale.den;
            outputWidth = outputHeight / subHeight * subWidth;
        } else {
            outputWidth = mainWidth * scale.num / scale.den;
            outputHeight = outputWidth / subWidth * subHeight;
        }
        output.width = outputWidth;
        output.height = outputHeight;
    }
    function computeBoxSize(mainBox, subSize, output, scale) {
        var mainSize = {'left': 0, 'top': 0, 'width': mainBox.width, 'height': mainBox.height};
        computeSize(mainSize, subSize, output, scale);
    }
    function computeNewPosition(box, size) {
        var output = {'left': 0, 'top': 0, 'width': 0, 'height': 0};
        var scale = {'num': 1, 'den': 1};
        computeBoxSize(box, size, output, scale);
        size.width = output.width;
        size.height = output.height;
        size.left += (box.width - size.width) / 2;
        size.top += (box.height - size.height) / 2;
    }
    this.onLocalStreamSize = function(width, height) {
        var pos = {'left': 0, 'top': 0, 'width': width, 'height': height};
        var box = {'left': 0, 'top': 0, 'width': boxWidth, 'height': boxHeight};
        computeNewPosition(box, pos);
        localStream.width = pos.width;
        localStream.height = pos.height;
        localStream.top = pos.top;
        localStream.left = pos.left;
    }
    this.onRemoteStreamSize = function(width, height) {
        var pos = {'left': boxWidth, 'top': 0, 'width': width, 'height': height};
        var box = {'left': boxWidth, 'top': 0, 'width': boxWidth, 'height': boxHeight};
        computeNewPosition(box, pos);
        remoteStream.width = pos.width;
        remoteStream.height = pos.height;
        remoteStream.top = pos.top;
        remoteStream.left = pos.left;
    }
}

function QCallStartRecord2() {
    var qc = this;
    if (qc != QPhoneInternal.QCallInternal)
        return;
    qc.recorder = new QCallRecorder(qc, QPhoneInternalEventHandlers);
    if (!qc.recorder)
        return;
    qc.recorder.start();
}

function QCallStopRecord2() {
    var qc = this;
    if (qc != QPhoneInternal.QCallInternal)
        return;
    if (!qc.recorder)
        return;
    qc.recorder.stop();
    qc.recorder = null;
}

function QCallPhotographer(qc, handler) {
    var self = this;
    if (!QPhoneInternal.LocalRecordSupported)
        return null;
    var session = qc.getSession();
    var remoteView = qc.oRemoteVideoView;
    var streamWidth = remoteView.videoWidth;
    var streamHeight = remoteView.videoHeight;
    if (!streamWidth || !streamHeight)
        return null;
    this.takePhoto = function() {
        var canvas = document.createElement('canvas');
        canvas.width  = streamWidth;
        canvas.height = streamHeight;
        canvas.style.zIndex   = -1;
        document.body.appendChild(canvas);
        canvas.getContext('2d').drawImage(remoteView, 0, 0, streamWidth, streamHeight);
        canvas.toBlob(function(blob) {
            handler['recordsnap']({'qcall': qc, 'blob': blob, 'param': null, 'rectype': 0});
        }, "image/png", 0.98);
        document.body.removeChild(canvas);
    }
}

function QCallSnapShot() {
    var qc = this;
    if (qc != QPhoneInternal.QCallInternal)
        return;
    var ss = new QCallPhotographer(qc, QPhoneInternalEventHandlers);
    if (!ss)
        return;
    ss.takePhoto();
}

function QCallProcessMessageList(qc, msg) {
    var msglist = qc.MessageList;
    if (msglist.length == 0)
        return;
    var first = msglist[0];
    if (msg.msgid == first.msgid) {
        msglist.shift();
        if (msglist.length == 0)
            return;
        first = msglist[0];
        first.send();
    }
}
function QPhoneInternalMessage(qc, handler, msgid, contentType, body) {
    this.owner = qc;
    this.session = qc.getSession();
    this.dialog = this.session.dialog;
    this.handler = handler;
    this.msgid = msgid;
    this.contentType = contentType;
    this.body = body;
}
QPhoneInternalMessage.prototype.send = function(options) {
    if (this.contentType === undefined) {
        throw new TypeError('Not enough arguments');
    }
    this.dialog.sendRequest(this, 'MESSAGE', {
        extraHeaders: ["Content-Type: " + this.contentType],
        body: this.body
    });
    return this.msgid;
}
QPhoneInternalMessage.prototype.receiveResponse = function(response) {
  switch(true) {
    case /^1[0-9]{2}$/.test(response.status_code):
      // Ignore provisional responses.
      break;

    case /^2[0-9]{2}$/.test(response.status_code):
      this.handler['msgsentok']({'qcall': this.owner, 'msgid': this.msgid});
      QCallProcessMessageList(this.owner, this);
      break;

    default:
      this.handler['msgsentfail']({'qcall': this.owner, 'msgid': this.msgid});
      QCallProcessMessageList(this.owner, this);
      break;
  }
};
QPhoneInternalMessage.prototype.onRequestTimeout = function() {
    QPhoneInternalLog('onRequestTimeout');
    this.handler['msgsentfail']({'qcall': this.owner, 'msgid': this.msgid});
    QCallProcessMessageList(this.owner, this);
};

QPhoneInternalMessage.prototype.onTransportError = function() {
    QPhoneInternalLog('onTransportError');
    this.handler['msgsentfail']({'qcall': this.owner, 'msgid': this.msgid});
    QCallProcessMessageList(this.owner, this);
};

QPhoneInternalMessage.prototype.onDialogError = function() {
    QPhoneInternalLog('onDialogError');
    this.handler['msgsentfail']({'qcall': this.owner, 'msgid': this.msgid});
    QCallProcessMessageList(this.owner, this);
};
QPhoneInternalMessage.prototype.init_incoming = function(message) {
    this.message = message;
    message.accept();

    this.contentType = message.content_type;
    this.body = message.content;
    this.from = message.remote_identity.uri.user;
    this.to = message.local_identity.uri.user;
    this.handler['msgrecv']({'qcall': this.owner, 'from': this.from, 'to': this.to, 'contentType': this.contentType, 'body': this.body});
};

function QCallSendInstantMessage(message, isHTML) {
    var qc = this;
    if (qc != QPhoneInternal.QCallInternal)
        return;
    var msgid = QPhoneInternal.MessageCounter++;
    var ctype = isHTML ? "text/html" : "text/plain";
    var msg = new QPhoneInternalMessage(qc, QPhoneInternalEventHandlers, msgid, ctype, message);
    var msglist = qc.MessageList;
    if (msglist.length == 0) {
        msg.send(null);
    }
    msglist.push(msg);
    return msgid;
}

function QCallSetVideoWindow(localVideo, peerVideo) {
    var qc = this;
    if (qc != QPhoneInternal.QCallInternal)
        return;
    qc.oLocalVideoView = localVideo;
    qc.oRemoteVideoView = peerVideo;
}

function QCallSetLocalAudioEnable(qc, enabled) {
    var session = qc.getSession();
    var localStreams = session.connection.getLocalStreams();
    if (localStreams.length <= 0)
        return;
    var localStream = localStreams[0];
    var track = localStream.getAudioTracks()[0];
    track.enabled = enabled ? true : false;
}

function QCallSetRemoteAudioEnable(qc, enabled) {
    var session = qc.getSession();
    var remoteStreams = session.connection.getRemoteStreams();
    if (remoteStreams.length <= 0)
        return;
    var remoteStream = remoteStreams[0];
    var track = remoteStream.getAudioTracks()[0];
    track.enabled = enabled ? true : false;
}

function RunCallbackFunctionWithCall(pf, qc)
{
    if (!pf && typeof(pf) != "function")
        return;
    try {
        QPhoneInternalLog("call callback function: " + pf.name);
        pf(qc);
    } catch (ex) {
        QPhoneInternalLog("exception when call callback function: " + ex);
    }
}

function RunCallbackFunction(pf)
{
    if (!pf && typeof(pf) != "function")
        return;
    try {
        QPhoneInternalLog("call callback function: " + pf.name);
        pf();
    } catch (ex) {
        QPhoneInternalLog("exception when call callback function: " + ex);
    }
}

function checkQCallIsVideo(request) {
    if (!request)
        return false;
    try {
        var videoPattern=new RegExp("m=video ");
        return videoPattern.test(request.body);
    } catch (exc) {
        return false;
    }
}

function setupQCall(session, request) {
    var qc = {};
    qc.Reject = QCallReject;
    qc.Accept = QCallAccept;
    qc.Hangup = QCallHangup;
    qc.SetVideoWindow = QCallSetVideoWindow;
    qc.SendInstantMessage = QCallSendInstantMessage;
    qc.StartRecord2 = QCallStartRecord2;
    qc.StopRecord2 = QCallStopRecord2;
    qc.SnapShot = QCallSnapShot;
    for (event in QPhoneInternalEventHandlers) {
        session.on(event, QPhoneInternalEventHandlers[event]);
    }
    var from, to;
    from = session.local_identity;
    to = session.remote_identity;
    var callid = session.id;
    var tag = session.from_tag;
    if (!callid) {
        session.terminate({ status_code: 603, reason_phrase: 'Decline' });
        return;
    }
    if (tag != "" && callid.lastIndexOf(tag) == callid.length - tag.length) {
        callid = callid.substr(0, callid.length - tag.length)
    }
    if (session.connection) {
        session.connection.onaddstream = QPhoneInternalOnAddStream;
        session.connection.onremovestream = QPhoneInternalOnRemoveStream;
    }
    var origTerminate = session.terminate;
    session.terminate = function(options) {
        if (options.cause == JsSIP.C.causes.RTP_TIMEOUT &&
            options.status_code == 200)
        {
            options.status_code = 408;
        }
        origTerminate.call(session, options);
    };
    qc.connected = false;
    qc.EndReason = 0;
    qc.EndDescription = null;
    if (from) {
        qc.FromNumber = from.uri.user;
        qc.FromName = from.display_name;
    }
    if (to) {
        qc.ToNumber = to.uri.user;
        qc.ToName = to.display_name;
    }
    qc.NeedCreateStream = false;
    if (request && !request.body)
        qc.NeedCreateStream = true;
    qc.RemoteIsVideo = checkQCallIsVideo(request);
    qc.LocalVoiceEnergy = 0;
    qc.RemoteVoiceEnergy = 0;
    qc.NetworkStatus = 100;
    qc.LocalIsVideo = false;
    qc.LocalVideoWindow = null;
    qc.RemoteVideoWindow = null;
    qc.SendVoiceInternal = true;
    Object.defineProperty(qc, "SendVoice", {
        get: function() {
            return qc.SendVoiceInternal;
        },
        set: function(newvalue) {
            qc.SendVoiceInternal = newvalue;
            QCallSetLocalAudioEnable(qc, newvalue);
        }
    });
    qc.ReceiveVoiceInternal = true;
    Object.defineProperty(qc, "ReceiveVoice", {
        get: function() {
            return qc.ReceiveVoiceInternal;
        },
        set: function(newvalue) {
            qc.ReceiveVoiceInternal = newvalue;
            QCallSetRemoteAudioEnable(qc, newvalue);
        }
    });
    qc.SendVideo = true;
    qc.ReceiveVideo = true;
    qc.AppData = null;
    qc.ReceivedPackets = 1;
    qc.LostPackets = 0;
    qc.LocalMaxEnergy = 100;
    qc.RemoteMaxEnergy = 100;
    qc.CallIDString = callid;
    qc.oLocalVideoView = null;
    qc.oRemoteVideoView = null;
    qc.VideoCapture = 0;
    qc.AcceptState = 'noAccept';
    qc.oStaticMediaStream = null;
    session.bufferedRequest = null;
    qc.getSession = function () {
        return session;
    }
    qc.MessageList = [];

    QPhoneInternal.QCallInternal = qc;
}

var QPhoneInternalSIPReasons = {
    401: 5,
    407: 5,
    403: 6,
    404: 7,
    415: 8,
    408: 9,
    480: 10,
    486: 11,
    603: 15,
    410: 16,
    402: 17,
    503: 18
};
function determineTerminatedReasion(ev) {
    var code = 0;
    switch (ev.originator) {
        case 'local':
            if (!ev.message) {
                if (ev.cause == JsSIP.C.causes.BYE)
                    code = 3;
                else if (ev.cause == JsSIP.C.causes.CANCELED)
                    code = 4;
                else if (ev.cause == JsSIP.C.causes.USER_DENIED_MEDIA_ACCESS)
                    code = 4;
                else
                    code = 3;
            } else if (!ev.message.reason_phrase) {
                switch (ev.message.method) {
                    case 'BYE':    code = 3; break;
                    case 'CANCEL': code = 4; break;
                    default:       code = 1; break;
                }
            } else {
                code = 3;
            }
            break;
        case 'remote':
            if (!ev.message) {
                code = 2;
            } else if (!ev.message.reason_phrase) {
                code = 2;
            } else {
                code = QPhoneInternalSIPReasons[ev.message.status_code];
                if (!code) {
                    if (ev.message.status_code > 600)
                        code = 13;
                    else if (ev.message.status_code > 500)
                        code = 12;
                    else
                        code = 1;
                }
            }
            break;
    }
    return code;
}

function doSipRegister() {
    try {
        if (!QPhoneInternal.oUserAgent)
            return;
        QPhoneInternal.oUserAgent.register();
    }
    catch (exc) {
        throw exc;
    }
}

function QPhoneInternalOnAddStream() {
    QPhoneInternalAttachMedia();
}

function QPhoneInternalOnRemoveStream() {
    QPhoneInternalDetachMedia();
}

function QPhoneInternalOnRemoteStreamAddTrack(ev) {
    if (ev.target.kind != 'video')
        return;
    ev.target.onmute = QPhoneInternalOnRemoteVideoTrackMute;
    ev.target.onunmute = QPhoneInternalOnRemoteVideoTrackUnmute;
}

function QPhoneInternalOnRemoteStreamRemoveTrack(ev) {
}

function QPhoneInternalOnRemoteVideoTrackMute(ev) {
    ev.target.enabled = false;
}

function QPhoneInternalOnRemoteVideoTrackUnmute(ev) {
    ev.target.enabled = true;
}

function QPhoneInternalSetView(obj, stream) {
    if (obj.srcObject || obj.srcObject === null)
        obj.srcObject = stream;
    else
        obj.src = window.URL.createObjectURL(stream);
}

function QCallInternalStartStat() {
    var qc = QPhoneInternal.QCallInternal;
    var localView = qc.oLocalVideoView;
    var remoteView = qc.oRemoteVideoView;
    var localSize = {'width': 0, 'height': 0};
    var remoteSize = {'width': 0, 'height': 0};
    function buildChromeStandReports(response) {
        var standardReport = {};
    		response.result().forEach(function(report) {
    		    var standardStats = {
    					id: report.id,
    					type: report.type
    				};
    				report.names().forEach(function(name) {
    					standardStats[name] = report.stat(name);
    				});
    				standardReport[standardStats.id] = standardStats;
    		});
    		return standardReport;
    }
    function buildSafariStandReports(response) {
        var standardReport = {};
    		response.forEach(function(report) {
    				standardReport[report.id] = report;
    		});
    		return standardReport;
    }
    function getStats(pc, selector) {
        if (navigator.mozGetUserMedia) {
            return pc.getStats(selector);
        }
        if (QPhoneInternal.IsSafari) {
            return new Promise(function(resolve, reject) {
                pc.getStats(selector).then(function(response) {
                    resolve(buildSafariStandReports(response));
                }).catch(reject);
            });
        }
        return new Promise(function(resolve, reject) {
            pc.getStats(function(response) {
                resolve(buildChromeStandReports(response));
            }, selector, reject);
        });
    }
    function raiseVideoReceivedEvent(qc) {
        if (!qc.haveReceivedVideo) {
            qc.haveReceivedVideo = true;
            RunCallbackFunctionWithCall(QPhoneInternal.OnCallVideoReceived, qc);
        }
    }
    function processStat(qc, report) {
        for (var i in report) {
            var item = report[i];
            if (item.type == "ssrc" && item.id.search(/ssrc_.*_recv/) >= 0 && (item.mediaType == "video" || item.transportId.search(/-video-/) > 0)) {
                if (item.googFrameWidthReceived && item.googFrameWidthReceived > 0) {
                    raiseVideoReceivedEvent(qc);
                }
            }
            if (item.id.search(/RTCInboundRTPVideoStream/) == 0) {
                if (item.framesDecoded && item.framesDecoded > 0) {
                    raiseVideoReceivedEvent(qc);
                }
            }
            if (item.type == "inboundrtp" && item.mediaType == "video") {
                if (item.framerateMean && item.framerateMean > 0) {
                    raiseVideoReceivedEvent(qc);
                }
            }
        }
    }
    function checkSizeChanged(view, size) {
        if (view
            && ((view.videoWidth && view.videoWidth != size.width)
                || (view.videoHeight && view.videoHeight != size.height))) {
            size.width = view.videoWidth;
            size.height = view.videoHeight;
            return true;
        }
        return false;
    }
    function checkViewChanged() {
        if (!qc.recorder) {
            localSize.width = localSize.height = 0;
            remoteSize.width = remoteSize.height = 0;
            return;
        }
        if (checkSizeChanged(localView, localSize)) {
            qc.recorder.onLocalStreamSize(localSize.width, localSize.height);
        }
        if (checkSizeChanged(remoteView, remoteSize)) {
            qc.recorder.onRemoteStreamSize(remoteSize.width, remoteSize.height);
        }
    }
    var connection = QPhoneInternal.oSipSessionCall.connection;
    qc.statTimer = setInterval(function() {
        var selector = null;
        var streams = connection.getRemoteStreams();
        if (streams.length > 0) {
            var stream = streams[0];
            var tracks = stream.getVideoTracks();
            if (tracks.length > 0)
                selector = tracks[0];
        }
        streams = connection.getLocalStreams();
        if (streams && streams.length > 0) {
            var stream = streams[0];
        }
        getStats(connection, selector).then(function (report) {
            processStat(qc, report);
        }).catch(function() {
            
        });
        checkViewChanged();
    }, 1000);
}

function QCallInternalStopStat() {
    var qc = QPhoneInternal.QCallInternal;
    if (qc.statTimer) {
        clearInterval(qc.statTimer);
        qc.statTimer = null;
    }
}

function QPhoneInternalAttachMedia() {
    if (!QPhoneInternal.oSipSessionCall)
        return;
    QCallInternalStartStat();
    var connection = QPhoneInternal.oSipSessionCall.connection;
    var localStreams = connection.getLocalStreams();
    var remoteStreams = connection.getRemoteStreams();
    if (localStreams.length > 0 && QPhoneInternal.QCallInternal.oLocalVideoView) {
        QPhoneInternalSetView(QPhoneInternal.QCallInternal.oLocalVideoView, localStreams[0]);
    }
    if (remoteStreams.length > 0) {
        var stream = remoteStreams[0];
        stream.onaddtrack = QPhoneInternalOnRemoteStreamAddTrack;
        stream.onremovetrack = QPhoneInternalOnRemoteStreamRemoveTrack;
        var tracks = stream.getVideoTracks();
        if (tracks.length > 0) {
            var track = tracks[0];
            track.enabled = false;
            setTimeout(function() { track.enabled = true; }, 0);
            track.onmute = QPhoneInternalOnRemoteVideoTrackMute;
            track.onunmute = QPhoneInternalOnRemoteVideoTrackUnmute;
        }
        if (QPhoneInternal.QCallInternal.oRemoteVideoView) {
            QPhoneInternalSetView(QPhoneInternal.QCallInternal.oRemoteVideoView, remoteStreams[0]);
        } else {
            try {
                var streamSrc = window.URL.createObjectURL(remoteStreams[0]);
                if (streamSrc.indexOf("blob:null") == 0) {
                    QPhoneInternalLog("%clocal stream not allowed: " + streamSrc, "color:red");
                }
            } catch(ex) {}
            QPhoneInternalSetView(QPhoneInternal.AudioRemote, remoteStreams[0]);
        }
    }
}

function QPhoneInternalEnableAudioTrack() {
    if (!QPhoneInternal.oSipSessionCall)
        return;
    var connection = QPhoneInternal.oSipSessionCall.connection;
    var remoteStreams = connection.getRemoteStreams();
    if (remoteStreams.length > 0) {
        var stream = remoteStreams[0];
        var audioTracks = stream.getAudioTracks();
        var videoTracks = stream.getVideoTracks();
        var audioTrack, videoTrack;
        if (audioTracks.length > 0) {
            audioTrack = audioTracks[0]
        }
        if (videoTracks.length > 0) {
            videoTrack = videoTracks[0];
        }
        if (audioTrack && videoTrack) {
            videoTrack.enabled = false;
            setTimeout(function() { videoTrack.enabled = true; }, 0);
        }
    }
}

function QPhoneInternalDetachMedia() {
    QCallInternalStopStat();
    var qc = QPhoneInternal.QCallInternal;
    var localView, remoteView;
    lovalView = qc.oLocalVideoView;
    remoteView = qc.oRemoteVideoView;
    if (lovalView) {
        if (lovalView.src) {
            lovalView.src = "";
        }
        if (lovalView.srcObject) {
            lovalView.srcObject = null;
        }
    }
    if (remoteView) {
        if (remoteView.src) {
            remoteView.src = "";
        }
        if (remoteView.srcObject) {
            remoteView.srcObject = null;
        }
    }
}

function QPhoneInternalGetBandwidth(ev, type) {
    var sdps = ev.sdp.split("\r\n");
    var state = "none";
    for (var i = 0; i < sdps.length; ++i) {
        var line = sdps[i];
        if (line.indexOf("m=audio") >= 0)
            state = "audio";
        else if (line.indexOf("m=video") >= 0)
            state = "video";
        if (line.indexOf("b=") == 0) {
            if (state == type) {
                var pos = line.indexOf(":");
                var bstr = line.substr(pos + 1);
                return parseInt(bstr);
            }
        }
    }
    return -1;
}

function QPhoneInternalSetBandwidth(ev, type, bw) {
    function getPayloadType(sdp, codec) {
        var rtpmap = new RegExp("a=rtpmap:([0-9]+) " + codec, "g");
        var pts = [];
        var item;
        while ((item = rtpmap.exec(sdp)) != null) {
            var pt = parseInt(item[1]);
            if (pt >= 0)
                pts.push(pt);
        }
        return pts;
    }
    function removeCodecFormat(sdp, pt, regex) {
        var lines = sdp.split("\r\n");
        var newsdp = "";
        var attr = "a=fmtp:" + pt + " ";
        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            if (line.indexOf(attr) >= 0) {
                var segs = line.split(" ");
                if (segs.length < 2) {
                    newsdp += line + "\r\n";
                } else {
                    var key = segs.shift();
                    var paramstr = segs.join("");
                    var params = paramstr.split(";");
                    var newparams = [];
                    for (var j = 0; j < params.length; ++j) {
                        var param = params[j];
                        var prmreg = new RegExp(regex);
                        if (param.search(prmreg) < 0) {
                            newparams.push(param);
                        }
                    }
                    if (newparams.length > 0)
                        newsdp += key + " " + newparams.join(';') + "\r\n";
                }
            } else {
                if (line.length > 0)
                    newsdp += line + "\r\n";
            }
        }
        return newsdp;
    }
    function setCodecFormat(sdp, codec, format) {
        var pts = getPayloadType(sdp, codec);
        if (pts.length <= 0)
            return sdp;
        newsdp = sdp;
        for (var i = 0; i < pts.length; ++i) {
            pt = pts[i];
            newsdp = removeCodecFormat(newsdp, pt, "x-google-.+-bitrate");
            if (newsdp.search("a=fmtp:" + pt + " ") > 0) {
                var reg = new RegExp("(a=fmtp:" + pt + " .*)");
                newsdp = newsdp.replace(reg, "$1;" + format);
            } else {
                var reg = new RegExp("(a=rtpmap:" + pt + " .*)");
                newsdp = newsdp.replace(reg, "$1\r\na=fmtp:" + pt + " " + format);
            }
        }
        return newsdp;
    }
    
    if (type == "audio") {
        ev.sdp = setCodecFormat(ev.sdp, "opus", "maxaveragebitrate=" + bw);
    }
    if (type == "video") {
        ev.sdp = setCodecFormat(ev.sdp, "VP8", "x-google-start-bitrate=" + bw/2 + ";x-google-min-bitrate=" + bw/2 + ";x-google-max-bitrate=" + bw);
        ev.sdp = setCodecFormat(ev.sdp, "H264", "x-google-start-bitrate=" + bw/2 + ";x-google-min-bitrate=" + bw/2 + ";x-google-max-bitrate=" + bw);
    }
}

function QPhoneInternalCheckBandwidth(ev) {
    var ab = (QPhoneInternalGetBandwidth(ev, "audio"));
    var vb = (QPhoneInternalGetBandwidth(ev, "video"));
    var audioBitrate = QPhoneInternal.AudioBitrate;
    var videoBitrate = QPhoneInternal.VideoBitrate;
    ev.sdp = ev.sdp.replace(/\r\nb=AS:(.*)\r\n/g, '\r\n');
    if (audioBitrate || ab > 0) {
        if ((audioBitrate > ab && ab > 0) || !audioBitrate)
            audioBitrate = ab;
        QPhoneInternalSetBandwidth(ev, "audio", audioBitrate);
    }
    if (videoBitrate || vb > 0) {
        if ((videoBitrate > vb && vb > 0) || !videoBitrate)
            videoBitrate = vb;
        QPhoneInternalSetBandwidth(ev, "video", videoBitrate);
    }
}

function makeTelephoneEventOnly8K(ev) {
    var evtreg1 = /\r\n.+telephone-event\/48000\r\n/g;
    var evtreg2 = /\r\n.+telephone-event\/32000\r\n/g;
    var evtreg3 = /\r\n.+telephone-event\/16000\r\n/g;
    ev.sdp = ev.sdp.replace(evtreg1, '\r\n');
    ev.sdp = ev.sdp.replace(evtreg2, '\r\n');
    ev.sdp = ev.sdp.replace(evtreg3, '\r\n');
}

function QPhoneInternalClearCurrentCall() {
    QPhoneInternal.oSipSessionCall = null;
    if (QPhoneInternal.QCallInternal && QPhoneInternal.QCallInternal.oStaticMediaStream) {
        QPhoneInternal.JsSIP.Utils.closeMediaStream(QPhoneInternal.QCallInternal.oStaticMediaStream);
        QPhoneInternal.QCallInternal.oStaticMediaStream = null;
    }
    QPhoneInternal.QCallInternal = null;
}

function QPhoneInternalOverrideConnectionCreateAnswer(session) {
    if (!session.connection)
        return;
    var originalCreateAnswer = session.connection.createAnswer;
    session.connection.createAnswer = function() {
        if (arguments.length == 1 && typeof arguments[0] === 'undefined')
            arguments[0] = null;
        return originalCreateAnswer.apply(this, arguments);
    }
}

var QPhoneInternalEventHandlers = {
    'connecting': function(ev) {
    },
    'connected': function(ev) {
        setTimeout(function() {
            doSipRegister();
        }, 5);
        if (QPhoneInternal.WebSocketDisconnected) {
            QPhoneInternal.WebSocketDisconnected = false;
            if (QPhoneInternal.QCallInternal) {
                QPhoneInternal.QCallInternal.Hangup();
            }
        }
    },
    'disconnected': function(ev) {
        QPhoneInternal.WebSocketDisconnected = true;
        RunCallbackFunction(QPhoneInternal.OnRegisterFailed);
    },
    'registered': function(ev) {
        RunCallbackFunction(QPhoneInternal.OnRegisterSuccessful);
    },
    'unregistered': function(ev) {
        RunCallbackFunction(QPhoneInternal.OnUnregistered);
    },
    'registrationFailed': function(ev) {
        RunCallbackFunction(QPhoneInternal.OnRegisterFailed);
        setTimeout(doSipRegister, 5000);
    },
    'progress': function(ev) {
        if (ev.originator == 'local')
            return;
        RunCallbackFunctionWithCall(QPhoneInternal.OnCallProceeding, QPhoneInternal.QCallInternal);
    },
    'failed': function(ev) {
        if (QPhoneInternal.oSipSessionCall) {
            QPhoneInternalDetachMedia();
            QPhoneInternal.QCallInternal.EndDescription = ev.cause;
            QPhoneInternal.QCallInternal.EndReason = determineTerminatedReasion(ev);
            RunCallbackFunctionWithCall(QPhoneInternal.OnCallTerminated, QPhoneInternal.QCallInternal);
        }
        QPhoneInternalClearCurrentCall();
    },
    'ended': function(ev) {
        if (QPhoneInternal.oSipSessionCall) {
            QPhoneInternalDetachMedia();
            QPhoneInternal.QCallInternal.EndDescription = ev.cause;
            QPhoneInternal.QCallInternal.EndReason = determineTerminatedReasion(ev);
            RunCallbackFunctionWithCall(QPhoneInternal.OnCallTerminated, QPhoneInternal.QCallInternal);
        }
        QPhoneInternalClearCurrentCall();
    },
    'accepted': function(ev) {
        if (QPhoneInternal.QCallInternal && QPhoneInternal.QCallInternal.connected)
            return;
        RunCallbackFunctionWithCall(QPhoneInternal.OnCallConnected, QPhoneInternal.QCallInternal);
        QPhoneInternal.QCallInternal.connected = true;
    },
    'confirmed': function(ev) {
        if (QPhoneInternal.QCallInternal && QPhoneInternal.QCallInternal.connected)
            return;
        RunCallbackFunctionWithCall(QPhoneInternal.OnCallConnected, QPhoneInternal.QCallInternal);
        QPhoneInternal.QCallInternal.connected = true;
    },
    'newRTCSession': function(ev) {
        QPhoneInternalOverrideConnectionCreateAnswer(ev.session);
        if (ev.originator == 'local') {
            QPhoneInternalCheckCandidateEnd(ev.session);
            //RunCallbackFunctionWithCall(QPhoneInternal.OnCallProceeding, QPhoneInternal.QCallInternal);
            return;
        }
        if (QPhoneInternal.oSipSessionCall) {
            ev.session.terminate({ status_code: 486, reason_phrase: 'Busy Here' });
            return;
        }
        QPhoneInternal.oSipSessionCall = ev.session;
        setupQCall(QPhoneInternal.oSipSessionCall, ev.request);
        RunCallbackFunctionWithCall(QPhoneInternal.OnCallIncoming, QPhoneInternal.QCallInternal);
    },
    'sdp': function(ev) {
        QPhoneInternalCheckBandwidth(ev);
        makeTelephoneEventOnly8K(ev);
        if (ev.type == 'answer') {
            QPhoneInternalEnableAudioTrack();
        }
    },
    'newMessage': function(ev) {
        if (!QPhoneInternal.QCallInternal || !QPhoneInternal.QCallInternal.connected) {
            ev.message.reject({'status_code': 403, 'reason_phrase': 'Not Allowed'});
            return;
        }
        var msg = new QPhoneInternalMessage(QPhoneInternal.QCallInternal, QPhoneInternalEventHandlers);
        msg.init_incoming(ev.message);
    },
    'msgsentok': function(ev) {
        var pf = QPhoneInternal.OnMessageSentOK;
        if (!pf && typeof(pf) != "function")
            return;
        var qc = ev.qcall;
        try {
            QPhoneInternalLog("call callback function: " + pf.name);
            pf(qc, ev.msgid);
        } catch (ex) {
            QPhoneInternalLog("exception when call callback function: " + ex);
        }
    },
    'msgsentfail': function(ev) {
        var pf = QPhoneInternal.OnMessageSentFail;
        if (!pf && typeof(pf) != "function")
            return;
        var qc = ev.qcall;
        try {
            QPhoneInternalLog("call callback function: " + pf.name);
            pf(qc, ev.msgid);
        } catch (ex) {
            QPhoneInternalLog("exception when call callback function: " + ex);
        }
    },
    'msgrecv': function(ev) {
        var pf = QPhoneInternal.OnMessageReceived;
        if (!pf && typeof(pf) != "function")
            return;
        var qc = ev.qcall;
        var contentType = ev.contentType;
        var isHTML = contentType == "text/html";
        try {
            QPhoneInternalLog("call callback function: " + pf.name);
            pf(qc, ev.from, ev.to, ev.body, isHTML);
        } catch (ex) {
            QPhoneInternalLog("exception when call callback function: " + ex);
        }
    },
    'recordsnap': function(ev) {
        var pf = QPhoneInternal.OnRecordSnapShot;
        if (!pf && typeof(pf) != "function")
            return;
        var qc = ev.qcall;
        try {
            QPhoneInternalLog("call callback function: " + pf.name);
            pf(qc, ev.blob, ev.param, ev.rectype);
        } catch (ex) {
            QPhoneInternalLog("exception when call callback function: " + ex);
        }
    }
};

function QPhoneGetCallConfig(appdata, localVideo, peerVideo) {
    var stunserver = QPhoneInternal.StunServer;
    if (!stunserver)
        stunserver = QPhoneInternal.RegistrarServer.replace(/:\d+$/, "");
    if (stunserver.indexOf(":") < 0)
        stunserver += ":3478";
    var iceservers = [{ urls: ["stun:" + stunserver]}];
    var videoConstraints = false;
    if (localVideo && peerVideo) {
        var param = QPhoneInternalGetVideoConstraints();
        if (param)
            videoConstraints = param;
        else
            videoConstraints = true;
    }
    var audioConstraints = QPhoneInternalGetAudioConstraints();
    var config = {
        //'eventHandlers'    : QPhoneInternalEventHandlers,
        'mediaConstraints' : { 'audio': audioConstraints, 'video': videoConstraints },
        'pcConfig': {
            'iceServers': iceservers
        },
    sessionTimersExpires: 1800,
    mediaStream: QPhoneInternal.QCallInternal ? QPhoneInternal.QCallInternal.oStaticMediaStream : null
    };
    if (!config.extraHeaders)
        config.extraHeaders = [];
    config.extraHeaders.push("QPhone-Version: " + QPhoneInternal.PhoneVersion);
    if (appdata) {
        config.extraHeaders.push("MessageData: " + appdata);
    }

    return config;
}

function QPhoneInternalGetVideoConstraints() {
    if (!QPhoneInternal.CodedVideoWidth || !QPhoneInternal.CodedVideoHeight)
        return null;
    var param = {'optional': [
                    { 'maxWidth': QPhoneInternal.CodedVideoWidth},
                    { 'maxHeight': QPhoneInternal.CodedVideoHeight}
                ]}
    return param;
}

function QPhoneInternalGetAudioConstraints() {
    if (!QPhoneInternal.DisableAEC)
        return true;
    var param;
    param = {
                //'echoCancellation': false,
                'googEchoCancellation': false,
                'googEchoCancellation2': false
            };
    return param;
}

function QPhoneInternalInitialize () {
    QPhoneInternal.JsSIP = JsSIP;
    if (!QPhoneInternal.WebsocketServer) {
        QPhoneInternal.WebsocketServer = "wss://" + window.location.host + "/webphone";
    }
    QPhoneInternal.oConfigCall = QPhoneGetCallConfig(null, null, null);
    var socket = new JsSIP.WebSocketInterface(QPhoneInternal.WebsocketServer);
    var uristr = "sip:" + QPhoneInternal.PhoneNumber + "@" + QPhoneInternal.RegistrarServer;
    var contactstr = uristr + ";transport=wss";
    var configuration = {
        sockets           : [ socket ],
        uri               : uristr,
        display_name      : QPhoneInternal.PhoneName,
        authorization_user: QPhoneInternal.AuthUser,
        contact_uri       : contactstr,
        password          : QPhoneInternal.AuthPassword,
        register          : false,
        registrar_server  : QPhoneInternal.RegistrarServer
    };
    if (!QPhoneInternal.AudioRemote) {
        var ar = document.createElement("AUDIO");
        ar.setAttribute("autoplay", "autoplay");
        QPhoneInternal.AudioRemote = ar;
    }
    QPhoneInternal.ICETimeout = 2000;
    QPhoneInternal.oUserAgent = new JsSIP.UA(configuration);
    for (event in QPhoneInternalEventHandlers) {
        QPhoneInternal.oUserAgent.on(event, QPhoneInternalEventHandlers[event]);
    }
    QPhoneInternal.JsSIP.C.USER_AGENT = "QPhoneH5" + (QPhoneInternal.UserAgentSuffix ? " " + QPhoneInternal.UserAgentSuffix : "");
    QPhoneInternal.oUserAgent.registrator().setExtraHeaders(["QPhone-Version: " + QPhoneInternal.PhoneVersion]);
    var sf = QPhoneInternal.oUserAgent.receiveRequest;
    QPhoneInternal.oUserAgent.receiveRequest = function (request) {
        if (request.method == "INVITE") {
            var session = this.findSession(request);
            if (session && session.status == 6) {
                QPhoneInternalLog("this INVITE message is buffered");
                session.bufferedRequest = request;
                return;
            }
        } else if (request.method == "ACK") {
            var session = this.findSession(request);
            if (session && session.bufferedRequest) {
                var bufferedRequest = session.bufferedRequest;
                var ua = this;
                session.bufferedRequest = null;
                setTimeout(function() {
                    QPhoneInternalLog("call buffered request");
                    sf.call(ua, bufferedRequest);
                }, 0);
            }
        } else if (request.method == "BYE") {
            var session = this.findSession(request);
            if (session && session.status == 6) {
                QPhoneInternalLog("this BYE message is buffered");
                session.bufferedRequest = request;
                return;
            }
        }
        sf.call(this, request);
    }
    QPhoneInternal.oUserAgent.start();
    QPhoneInternal.State = 'initialized';
};

function checkWebRTCSupported() {
    var sBrowserName, sAppName, sAppVersion;
    sBrowserName = navigator.userAgent ? navigator.userAgent.toLowerCase() : 'null';
    sAppVersion = navigator.appVersion ? navigator.appVersion.toLowerCase() : 'null';
    //sAppName = navigator.appName ? navigator.appName.toLowerCase() : 'null';
    var isChrome = sBrowserName.indexOf("chrome") != -1;
    var isFireFox = sBrowserName.indexOf("firefox") != -1;
    var isEdge = sBrowserName.indexOf("edge") != -1;
    var isSafari = sBrowserName.indexOf("safari") != -1;
    if (isEdge) isChrome = false;
    QPhoneInternal.LocalRecordSupported = false;
    if (isFireFox) {
        var verPos = sBrowserName.indexOf("firefox/");
        if (verPos == -1) {
            throw new Error("webrtc version not found");
        }
        var nVer = parseInt(sBrowserName.substr(verPos + 8));
        if (nVer < 47)
            throw new Error("firefox webrtc version not supported " + nVer);
        if (nVer > 30)
            QPhoneInternal.LocalRecordSupported = true;
    } else if (isChrome) {
        var verPos = sAppVersion.indexOf("chrome/");
        if (verPos == -1) {
            throw new Error("chrome webrtc version not found");
        }
        var nVer = parseInt(sAppVersion.substr(verPos + 7));
        if (nVer < 34)
            throw new Error("chrome webrtc version not supported " + nVer);
        if (nVer > 48)
            QPhoneInternal.LocalRecordSupported = true;
    } else if (isSafari) {
        var verPos = sBrowserName.indexOf("version/");
        if (verPos == -1) {
            throw new Error("safari webrtc version not found");
        }
        var nVer = parseInt(sBrowserName.substr(verPos + 8));
        if (nVer < 11)
            throw new Error("safari webrtc version not supported " + nVer);
        QPhoneInternal.IsSafari = true;
    } else {
        throw new Error("webrtc not supported");
    }
}

var QPhoneInternalExternalJSList = ['jssip-3.0.0.js', 'MultiStreamsMixer.js'];

function QPhoneInternalCheckHaveJsSIP() {
    if (typeof(JsSIP) != "undefined" && !QPhoneInternal.JsSIP)
        return true;
    else
        return false;
}

function QPhoneInternalCheckCanInitialize(currele) {
    if (QPhoneInternalCheckHaveJsSIP()) {
        QPhoneInternalInitialize();
    }
    if (currele) {
        var head0 = currele.parentNode.children;
        for ( elei in head0) {
            var ele = head0[elei];
            ele.onload = QPhoneInternalOnExternalJSLoad;
        }
    }
}

function QPhoneInternalOnExternalJSLoad() {
    if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
        QPhoneInternalCheckCanInitialize(this);
    }
}

function QPhoneInternalLoadExternalJS() {
    var tag_hdr = document.getElementsByTagName('head')[0];
    var jslist = QPhoneInternalExternalJSList;
    for (var i = 0; i < jslist.length; ++i) {
        var tag_script = document.createElement('script');
        tag_script.setAttribute('type', 'text/javascript');
        tag_script.setAttribute('src', QPhoneInternal.CurrentJS.replace(/[^\/]+$/, jslist[i]));
        tag_script.onload = QPhoneInternalOnExternalJSLoad;
        tag_hdr.appendChild(tag_script);
    }
}

function onDocuemtnReadyForMe() {
    if (!QPhoneInternal.NeedInitWhenReady)
        return;
    QPhoneInternalLoadExternalJS();
}

QPhoneInternal.Initialize = function () {
    checkWebRTCSupported();
    if (QPhoneInternal.State != 'idle')
        return;
    QPhoneInternal.State = 'initializing';
    if (document.readyState !== "complete") {
        QPhoneInternal.NeedInitWhenReady = true;
        return;
    }
    if (typeof(JsSIP) == "undefined") {
        QPhoneInternalLoadExternalJS();
        return;
    }
    QPhoneInternalInitialize();
};

function makeSipDestinationNumberToURI(destNumber) {
    if (destNumber.indexOf("@") > 0 || !QPhoneInternal.RegistrarServer)
        return destNumber;
    return destNumber + "@" + QPhoneInternal.RegistrarServer;
}

function QPhoneInternalResetConnectionSetMedia(session) {
    var connection = session.connection;
    var pranswerSet = false;
    var answerSet = false;
    if (!connection)
        return;

    var nativeSetRemoteMethod = connection.setRemoteDescription;
    connection.setRemoteDescription = function() {
        var args = arguments;
        var self = this;
        var desc = args[0];
        var promise = {
            doMethod: function() {},
            then: function() {
                doMethod = arguments[0];
                setTimeout(function() {
                    doMethod();
                }, 0);
                return this;
            },
            'catch': function() {
            }
        };

        QPhoneInternalCheckBandwidth(desc);
        if (desc.type == 'pranswer') {
            if (pranswerSet) {
                return promise;
            }
            args[0] = {type: 'answer', sdp: desc.sdp}
            answerSet = true;
            return nativeSetRemoteMethod.apply(this, args);
        } else {
            var result;
            if (pranswerSet && !answerSet) {
                result = promise;
            } else {
                result = nativeSetRemoteMethod.apply(this, args);
            }
            if (desc.type == 'answer')
            answerSet = true;
            return result;
        }
    }

    var nativeSetLocalMethod = connection.setLocalDescription;
    connection.setLocalDescription = function() {
        var args = arguments;
        var self = this;
        var desc = args[0];
        QPhoneInternalCheckBandwidth(desc);
        return nativeSetLocalMethod.apply(this, args);
    }
}

function makeSipCallInternal(destNumber, appdata, localVideo, peerVideo) {
    destNumber = makeSipDestinationNumberToURI(destNumber);
    var oconfig = QPhoneGetCallConfig(appdata, localVideo, peerVideo);
    QPhoneInternal.oSipSessionCall = QPhoneInternal.oUserAgent.call(destNumber, oconfig);
    QPhoneInternalResetConnectionSetMedia(QPhoneInternal.oSipSessionCall);
    setupQCall(QPhoneInternal.oSipSessionCall, null);
    if (localVideo || peerVideo) {
        QPhoneInternal.QCallInternal.SetVideoWindow(localVideo, peerVideo);
        QPhoneInternal.QCallInternal.LocalIsVideo = true;
    }
    return QPhoneInternal.QCallInternal;
}

function makeSipCallWithVideo(destNumber, appdata, localVideo, peerVideo) {
    return makeSipCallInternal(destNumber, appdata, localVideo, peerVideo);
}

function makeSipCallWithAppData(destNumber, appdata) {
    return makeSipCallInternal(destNumber, appdata, null, null);
}

function makeSipCall(destNumber) {
    return makeSipCallWithAppData(destNumber, null);
}

function QPhoneInternalSetCodedVideoSize(w, h) {
    QPhoneInternal.CodedVideoWidth = w;
    QPhoneInternal.CodedVideoHeight = h;
}

function internalDeinitialize() {
    if (QPhoneInternal.State != 'initialized')
        return;
    if (QPhoneInternal.oUserAgent) {
        QPhoneInternal.oUserAgent.stop(); // shutdown all sessions
    }
    resetQPhoneInternal();
}

function onBeforeUnloadMe() {
    internalDeinitialize();
    if (QPhoneInternal.fOnBeforeUnload)
        return QPhoneInternal.fOnBeforeUnload();
}

function QPhoneInternalBeforeUnloadDocument() {
    QPhoneInternal.fOnBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = onBeforeUnloadMe;
}

function QPhoneInternalGetCurrentJS() {
    var alljs = document.getElementsByTagName('script');
    QPhoneInternal.CurrentJS = alljs[alljs.length - 1].getAttribute("src");
}

var NotImplementedFunction = function () {
    throw new Error("not implemented");
}

QPhoneInternal.MakeCall = makeSipCall;
QPhoneInternal.Deinitialize = internalDeinitialize;
QPhoneInternal.MakeCallEx = makeSipCallWithAppData;
QPhoneInternal.MakeVideoCall = makeSipCallWithVideo;
QPhoneInternal.MakeVideoCallWithCapture = NotImplementedFunction;
QPhoneInternal.SetCodedVideoSize = QPhoneInternalSetCodedVideoSize;
QPhoneInternal.debug = {
    enable: QPhoneInternalEnableDebug,
    disable: QPhoneInternalDisableDebug
};

QPhoneInternal.MakePath = NotImplementedFunction;
QPhoneInternal.SetRTPPortRange = NotImplementedFunction;


try {
    checkWebRTCSupported();
    window.QPhoneH5 = QPhoneInternal;
} catch (ex) {}

QPhoneInternalGetCurrentJS();
QPhoneInternalBeforeUnloadDocument();

QPhoneInternal.oReadyStateTimer = setInterval(function () {
    if (document.readyState === "complete") {
        clearInterval(QPhoneInternal.oReadyStateTimer);
        QPhoneInternal.oReadyStateTimer = null;
        onDocuemtnReadyForMe();
    }
}, 500);
