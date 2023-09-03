(function () {
  ("use strict");
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isOnIOS =
    navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i);
  const eventName = isOnIOS ? "pagehide" : "beforeunload";

  const audioInputSelect = document.querySelector("select#audioSource");
  const videoInputSelect = document.querySelector("select#videoSource");
  const selectors = [audioInputSelect, videoInputSelect];

  let mixer;
  let socket;
  let device;
  let settings;
  let recorder;
  let uploader;
  let resizeTimeout;
  let mouseMoveTimer;
  let displayFileUrl;
  let localAudioStream;
  let localVideoStream;
  let producerTransport;
  let currentMeetingTime;
  let routerRtpCapabilities;
  let usersCount = 1;
  let messageCount = 0;
  let audioMuted = true;
  let videoMuted = true;
  let isRecording = false;
  let screenShared = false;
  let whiteboardAdded = false;
  let whiteboardVisible = false;

  let recordingData = [];
  let consumerTransports = [];
  let consumingTransports = [];
  let websocketConnection = false;

  // let videoQualitySelect = "VGA";
  let timer = new easytimer.Timer();
  let notificationTone = new Audio("https://testat-app.com/assets/success.mp3");
  let layoutContainer = document.getElementById("videos");
  let layout = initLayoutContainer(layoutContainer).layout;
  let designer = new CanvasDesigner();
  // designer.widgetHtmlURL = "/whiteboard.html";
  designer.widgetHtmlURL = "/white-board";
  // designer.widgetHtmlURL = "https://develop.testat-app.com/widget";
  designer.widgetJsURL = "/assets/js/js/widget.js";
  // designer.widgetJsURL = "https://develop.testat-app.com/assets/js/js/widget.js";

  let videoOptions = {
    encodings: [
      {
        rid: "r0",
        maxBitrate: 100000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        maxBitrate: 300000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r2",
        maxBitrate: 900000,
        scalabilityMode: "S1T3",
      },
    ],
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  };

  let audioParams = { appData: { type: "mic", username: "" } };
  let videoParams = { videoOptions, appData: { type: "webcam", username: "" } };
  let screenAudioParams = { appData: { type: "screenAudio", username: "" } };
  let screenVideoParams = {
    videoOptions,
    appData: { type: "screenVideo", username: "" },
  };
  // get session details
  (function () {
    fetch(
      "https://api.testat-app.com/test_meeting/index.php?action=getDetails&meetId=" +
      userInfo.meetingId
    )
      .then((response) => response.json())
      .then((data) => {
        // data = JSON.parse(data);
        console.log(data);
        if (data.success) {
          settings = data.data;
          console.log("get details dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", data);
          initializeSocket(data.data.signalingURL);
        } else {
          // showError();
          showError(languages.no_session);
        }
      });
    // $.get({
    //     url: "https://api.testat-app.com/test_meeting/index.php?action=getDetails",
    // })
    //     .done(function (data) {
    //         data = JSON.parse(data);

    //         if (data.success) {
    //             settings = data.data;
    //             console.log('get details dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', data);
    //             initializeSocket("https://link.testat-app.com:9006");
    //         } else {
    //             showError("no session found");
    //         }
    //     })
    //     .catch(function (a) {
    //         console.log('ssssssssssssssssssssssssssssssssssss', a)
    //         showError("no session found post ajax");
    //     });
  })();
  //initialize socket and listen for events
  function initializeSocket(signalingURL) {
    console.log("init websocket ?!");
    socket = io.connect(signalingURL);
    uploader = new SocketIOFileUpload(socket);

    //show the error message and disable the join button
    socket.on("connect_error", function () {
      console.log("websocket connection error");
      $("#joinMeeting").attr("disabled", true);
      $("#error").show();
      websocketConnection = false;
    });

    //hide the error message and enable the join button
    socket.on("connect", function () {
      console.log("websocket connected");
      websocketConnection = true;
      window["stopLoader"] = true;
      $("#joinMeeting").attr("disabled", false);

      // let last_meetId = localStorage.getItem("last_meetId");
      // if (isModerator && last_meetId != userInfo.meetingId) {
      //   localStorage.setItem("last_meetId", userInfo.meetingId);
      //   console.log(
      //     ' document.getElementById("joinMeeting")',
      //     document.getElementById("joinMeeting")
      //   );
      //   document.getElementById("joinMeeting").click();
      // } else {
      //   localStorage.setItem("last_meetId", "");
      // }
      $("#error").hide();
    });
    socket.on("message", (data) => {
      console.log("DATA IS :->", data);
      switch (data.type) {
        case "newProducer":
          console.log("websocket message in case newProducer", data);
          signalNewConsumerTransport(data.producerId);
          if (data.actionType == "webcam") {
            $(
              '#participantListBody button[data-username="' +
              data.username +
              '"][data-action="usernames_vid"]'
            ).html('<i class="fa fa-video"></i>');
          }
          if (data.actionType == "mic") {
            $(
              '#participantListBody button[data-username="' +
              data.username +
              '"][data-action="usernames_mic"]'
            ).html(`<i class="fa fa-microphone"></i>`);
            $(
              '#participantListBody button[data-username="' +
              data.username +
              '"][data-action="usernames_hand"]'
            ).html("");
          }
          break;
        case "producerClosed":
          console.log("websocket message in case producerClosed", data);
          handleProducerClosed(
            data.remoteProducerId,
            data.producerSocketId,
            data.trackType
          );
          if (data.trackType.type == "webcam") {
            $(
              '#participantListBody button[data-username="' +
              data.trackType.username +
              '"][data-action="usernames_vid"]'
            ).html('<i class="fa fa-video-slash"></i>');
          }
          if (data.trackType.type == "mic") {
            $(
              '#participantListBody button[data-username="' +
              data.trackType.username +
              '"][data-action="usernames_mic"]'
            ).removeClass('openedMicNow').html('<i class="fa fa-microphone-slash"></i>');
            $(
              '#participantListBody button[data-username="' +
              data.username +
              '"][data-action="usernames_hand"]'
            ).html("");
          }
          break;
        case "leave":
          console.log("websocket message in case leave", data);
          handleLeave(data.socketId, data.isModerator, data.username);
          break;
        case "meetingMessage":
          console.log("websocket message in case meetingMessage", data);
          handlemeetingMessage(data);
          break;
        case "file":
          console.log("websocket message in case file", data);
          handleFileMessage(data);
          break;
        case "raiseHand":
          console.log("websocket message in case raiseHand", data);
          $(
            '#participantListBody button[data-username="' +
            data.username +
            '"][data-action="usernames_hand"]'
          ).html('<i class="fas fa-hand-paper" style="color:#FF6600!important"></i>');
          showInfo(languages.hand_raised + " " + data.username);

          break;
        case "whiteboard":
          console.log("websocket message in case whiteboard", data);
          handleWhiteboard(data.data);
          break;
        case "clearWhiteboard":
          console.log("websocket message in case clearWhiteboard", data);
          designer.clearCanvas();
          designer.sync();
          break;
        case "sync":
          console.log("websocket message in case sync", data);
          designer.sync();
          break;
        case "recordingPermission":
          console.log("websocket message in case recordingPermission", data);
          handleRecordingPermission(data);
          break;
        case "recordongPermissionResult":
          console.log(
            "websocket message in case recordongPermissionResult",
            data
          );
          handleRecordingPermissionResult(data);
          break;
        case "permissionResult":
          console.log("websocket message in case permissionResult", data);
          checkMeetingResult(data);
          break;
        case "permission":
          console.log("websocket message in case permission", data);
          handlePermission(data);
          break;
        case "kick":
          console.log("websocket message in case kick", data);
          showInfo(languages.kicked);

          reload(0);
          break;

        case "recordingStarted":
          console.log("websocket message in case recordingStarted", data);
          notificationTone.play();
          showInfo(languages.recording_started + ": " + data.username);

          break;
        case "userJoined":
          console.log("websocket message in case userJoined", data);
          let img =
            userImagesUrl +
            data.username.slice(data.username.lastIndexOf("%image%") + 7);
          let user = data.username.slice(0, data.username.indexOf("%image%"));
          let socketId = data.socketId;
          let micIcon =
            data.mic == true ? "fa-microphone" : "fa-microphone-slash";
          let vidIcon = data.vid == true ? "fa-video" : "fa-video-slash";
          $("#participantListBody").append(
            "<tr class='list-" +
            user +
            "'><th scope='row'></th>" +
            `<td><img src="${img}" alt="" width="30" height="30" style="border-radius: 50%" /></td>` +
            "<td>" +
            user +
            "</td>" +
            `
                        <td>
                        <button class="btn meeting-option mx-2" data-username="${user}" data-socketId="${socketId}" title="Mute/Unmute Mic"
                        id="toggleMicUsers" data-action="usernames_mic">
                        <i class="fa ${micIcon}"></i>
                        </button>
                        <button class="btn meeting-option mx-2" data-username="${user}" data-socketId="${socketId}" title="On/Off Camera"
                        id="toggleVideoUsers" data-action="usernames_vid">
                        <i class="fa ${vidIcon}"></i>
                        </button>
                        <button class="btn meeting-option mx-2" data-username="${user}" data-action="usernames_hand">
                        </td>
                        ` +
            "</tr>"
          );
          $("#showParticipantList")
            .addClass("number")
            .attr("data-content", ++usersCount);
          break;
        case "usernames":
          console.log("websocket message in case usernames", data);
          data.usernames.forEach((username) => {
            let img =
              userImagesUrl +
              username.slice(username.lastIndexOf("%image%") + 7);
            let user = username.slice(0, username.indexOf("%image%"));
            let micIcon =
              data.mic == true ? "fa-microphone" : "fa-microphone-slash";
            let vidIcon = data.vid == true ? "fa-video" : "fa-video-slash";
            $("#participantListBody").append(
              "<tr class='list-" +
              user +
              "'><th scope='row'></th>" +
              `<td><img src="${img}" alt="" width="30" height="30" style="border-radius: 50%" /></td>` +
              "<td>" +
              user +
              "</td>" +
              `
                  <td>
                  <button type="button" class="btn meeting-option mx-2" data-action="usernames_mic" data-username="${user}" style="cursor:default;">
                  <i class="fa ${micIcon}"></i>
                  </button>
                    <button type="button" class="btn meeting-option mx-2" data-action="usernames_vid" data-username="${user}" style="cursor:default;">
                      <i class="fa ${vidIcon}"></i>
                    </button>
                    <button type="button" class="btn meeting-option mx-2" data-action="usernames_vid" data-username="${user}" style="cursor:default;">
                      <i class="fa-solid fa-hand"></i>
                    </button>
                  </td>
                        ` +
              "</tr>"
            );
            $("#showParticipantList")
              .addClass("number")
              .attr("data-content", ++usersCount);
          });
          break;
        case "clientModeratorControl":
          console.log("clientModeratorControl", data);
          clientModeratorControl(data);
          break;
        case "openMicPermissionRequest":
          console.log("open cam request from client socket ??!!");
          handelOpenMicPermissionRequest(data);
          break;
        case "openMicPermissionResult":
          console.log("websocket message in case openMicPermissionResult");
          handelOpenMicPermissionResult(data);
          break;
        case "ClientChMicLevel":
          console.log("ClientChMicLevel", data);
          ClientChMicLevelHandel(data);
          break;
      }
    });
    // moderator controls
    $(document).on("click", "#toggleMicUsers", function () {
      let hand = $(
        '#participantListBody button[data-username="' +
        $(this)[0].dataset.username +
        '"][data-action="usernames_hand"]'
      ).html();
      sendMessage({
        type: "moderatorControl",
        socketId: $(this)[0].dataset.socketid,
        action: "toggleMic",
        userhand: hand.toString()
      });
      $(this).removeClass('openedMicNow').html('<i class="fa fa-microphone-slash"></i>');
    });
    $(document).on("click", "#toggleVideoUsers", function () {
      sendMessage({
        type: "moderatorControl",
        socketId: $(this)[0].dataset.socketid,
        action: "toggleVideo",
        userhand: null
      });
      $(this).html('<i class="fa fa-video-slash"></i>');
    });

    async function clientModeratorControl(data) {
      console.log("EEEEEEEEEEEEEEEEEEEEEEe", data);
      if (data.clientData.action === "toggleMic") {
        if (!audioMuted) {
          console.log("mic is now muted ");
          audioParams.track.stop();
          sendMessage({ type: "producerClose", id: audioParams.id });
          localAudio.srcObject = null;

          $("#toggleMic").removeClass('openedMicNow').html('<i class="fa fa-microphone-slash"></i>');
          audioMuted = true;
          showSuccess(languages.mic_mute);
          if (isRecording) mixer.resetVideoStreams(getMediaStreams());
        } else {
          if (data.clientData.userhand.startsWith("<i")) {
            console.log("mic is now unmuted ");
            let stream = await getUserMedia(true, false);
            audioParams.track = stream.getTracks()[0];
            producerTransport.produce(audioParams);
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
            console.log(producerTransport._handler._sendStream);
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
            // localAudio.srcObject = new MediaStream([audioParams.track]);
            $(this).html('<i class="fa fa-microphone"></i>');
            audioMuted = false;
            showSuccess(languages.mic_unmute);
            getMicActLev();
            if (isRecording)
              mixer.appendStreams(new MediaStream([audioParams.track]));
            // $(
            //   '#participantListBody button[data-username="' +
            //   data.clientData.username +
            //   '"][data-action="usernames_hand"]'
            // ).html("");
          }
        }
      }
      if (data.clientData.action === "toggleVideo") {
        videoParams.track.stop();
        sendMessage({ type: "producerClose", id: videoParams.id });
        localVideo.srcObject = null;

        $("#toggleVideo").html('<i class="fa fa-video-slash"></i>');
        $(
          '[data-socketId="' + data.clientData.socketId + '"]#toggleVideoUsers'
        ).html('<i class="fa fa-video-slash"></i>');
        videoMuted = true;
        showSuccess(languages.camera_off);
        if (isRecording) mixer.resetVideoStreams(getMediaStreams());
      }
    }
    //listen on sendFile button click event
    uploader.listenOnSubmit($("#sendFile")[0], $("#file")[0]);

    //start file upload
    uploader.addEventListener("start", function (event) {
      console.log("websocket start upload file");
      event.file.meta.extension = event.file.name.substring(
        event.file.name.lastIndexOf(".")
      );
      event.file.meta.username = userInfo.username;
      showInfo(languages.uploading);
    });

    //append file when file upload is completed
    uploader.addEventListener("complete", function (event) {
      console.log("websocket complete upload file", event);
      // let msg = `<img src="${}" />`;
      // appendMessage();
      appendFile(event.detail.file, event.detail.extension, null, true);
    });

    //handle file upload error
    uploader.addEventListener("error", function (event) {
      console.log("websocket error upload file");
      showError(event.message);
    });

    //get item from localStorage and set to html
    videoQualitySelect.value = localStorage.getItem("videoQuality") || "VGA";
    if (!userInfo.username)
      userInfo.username = username.value =
        localStorage.getItem("username") || htmlEscape("User");

    setMediaPreview(true, true);
  }
  /************************************************************************************************ */
  $("#showParticipantList").on("click", function () {
    let posVal = $("#participantList").css("right");
    if (posVal == '0' || posVal == '0px') {
      $("#participantList").css("right", "-500px");
    } else {
      $("#participantList").css("right", "0");
    }
  });
  $("#closeparticipantList").on("click", function () {
    $("#participantList").css("right", "-500px");
  });
  /************************************************************************************************ */
  // get media stream and set video preview, show the error if any
  async function setMediaPreview(audio, video) {
    try {
      if (audio) localAudioStream = await getUserMedia(true, false);
      if (video) localVideoStream = await getUserMedia(false, true);
      console.log("set media preview for live stream");
      let last_meetId = "xzjiwxapurx7mb3p5k85ag";
      if (isModerator && last_meetId != userInfo.meetingId) {
        localStorage.setItem("last_meetId", "xzjiwxapurx7mb3p5k85ag");
        console.log(
          ' document.getElementById("joinMeeting")',
          document.getElementById("joinMeeting")
        );
        document.getElementById("joinMeeting").click();
      } else {
        localStorage.setItem("last_meetId", "");
      }
    } catch (e) {
      //show an error if the media device is not available
      document.querySelector("div.text-show.text_error").style.display =
        "block";
      $(".text-show").text(languages.no_device + e);
      $("#toggleAudioPreview, #toggleVideoPreview").removeClass("disabled");
    }

    if (audio && localAudioStream) {
      if (!isModerator) {
        audioMuted = true;
        $("#toggleAudioPreview, #toggleMic").removeClass('openedMicNow')
          .html('<i class="fa fa-microphone-slash"></i>')
          .removeClass("disabled");
      } else {
        audioMuted = false;
        $("#toggleAudioPreview, #toggleMic")
          .html('<i class="fa fa-microphone"></i>')
          .removeClass("disabled");
      }
    }

    if (video && localVideoStream) {
      if (!isModerator) {
        videoMuted = false;
        $("#toggleVideoPreview, #toggleVideo")
          .html('<i class="fa fa-video"></i>')
          .removeClass("disabled");
      } else {
        videoMuted = false;
        $("#toggleVideoPreview, #toggleVideo")
          .html('<i class="fa fa-video"></i>')
          .removeClass("disabled");
      }
      previewVideo.srcObject = new MediaStream([
        localVideoStream.getTracks()[0],
      ]);
      previewVideo.style.zIndex = 5;
    }

    if (localAudioStream && localVideoStream) {
      $(".text-show").text();
    }
  }

  //toggle audio preview
  $("#toggleAudioPreview").on("click", function () {
    if (!audioMuted) {
      localAudioStream.getTracks().forEach((track) => track.stop());
      localAudioStream.removeTrack(localAudioStream.getTracks()[0]);
      localAudioStream = null;
      $("#toggleAudioPreview, #toggleMic").removeClass('openedMicNow').html(
        '<i class="fa fa-microphone-slash"></i>'
      );
      audioMuted = true;
    } else {
      if (isModerator) {
        $("#toggleAudioPreview").addClass("disabled");
        setMediaPreview(true, false);
      }
    }
  });

  //toggle video preview
  $("#toggleVideoPreview").on("click", function () {
    if (!videoMuted) {
      localVideoStream.getTracks().forEach((track) => track.stop());
      localVideoStream.removeTrack(localVideoStream.getTracks()[0]);
      previewVideo.srcObject = localVideoStream = null;
      previewVideo.style.zIndex = 0;
      $("#toggleVideoPreview, #toggleVideo").html(
        '<i class="fa fa-video-slash"></i>'
      );
      videoMuted = true;
    } else {
      $("#toggleVideoPreview").addClass("disabled");
      setMediaPreview(false, true);
    }
  });

  //check meeting password if present
  // $("#passwordCheck").on("submit", function (e) {
  $("#joinMeeting").on("click", function (e) {
    if (websocketConnection == true) {
      localStorage.setItem("last_meetId", userInfo.meetingId);
      e.preventDefault();
      $("#joinMeeting").attr("disabled", true);

      //show an error if the signaling server is not connected
      if (!socket.connected) {
        showError(languages.cant_connect);

        $("#joinMeeting").attr("disabled", false);
        return;
      }
      continueToMeeting();
    }
  });

  //send a message to the server to check meeting
  function continueToMeeting() {
    //set username
    // userInfo.username = username.value || htmlEscape("User");
    audioParams.appData.username =
      videoParams.appData.username =
      screenAudioParams.appData.username =
      screenVideoParams.appData.username =
      userInfo.username;
    localStorage.setItem("username", userInfo.username);

    //check if the meeting is full or not
    socket.emit(
      "message",
      {
        type: "checkMeeting",
        username: userInfo.username,
        meetingId: userInfo.meetingId,
        moderator: isModerator,
        authMode: "enbaled",
        moderatorRights: "enbaled",
      },
      (result) => {
        checkMeetingResult(result);
      }
    );
  }

  //check meeting request
  function checkMeetingResult(data) {
    if (data.type == "info") {
      showInfo(languages[data.message]);
      return;
    }

    if (data.result) {
      //initiate the meeting
      init();
    } else {
      //there is an error, show it to the user
      showInfo(languages[data.message]);
      $("#joinMeeting").attr("disabled", false);
    }
  }

  //initiate the meeting
  async function init() {
    $(".meeting-details, .navbar, footer").hide();
    $(".meeting-section").show();
    // if (!audioMuted) localAudio.srcObject = new MediaStream([localAudioStream.getTracks()[0]]);
    if (!videoMuted) localVideo.srcObject = new MediaStream([localVideoStream.getTracks()[0]])
    previewVideo.srcObject = null;

    $(".user-initial")
      .text(userInfo.username[0])
      .css("background", getRandomColor());

    if (!audioMuted)
      audioParams = { track: localAudioStream.getTracks()[0], ...audioParams };
    if (!videoMuted)
      videoParams = { track: localVideoStream.getTracks()[0], ...videoParams };

    socket.emit(
      "message",
      {
        type: "join",
        isModerator,
        meetingId: userInfo.meetingId,
        mic: !audioMuted,
        vid: !videoMuted,
        username:
          userInfo.username +
          "%image%" +
          userInfo.img,
        // avatar: localStorage.getItem('currentUserFront.img') || htmlEscape(settings.defaultAvatar)
      },
      (data) => {
        routerRtpCapabilities = data.rtpCapabilities;
        createDevice();
      }
    );
    // moderatorControls();
    manageOptions();
    initKeyShortcuts();
    getMicActLev();
    layout();
    if (!isMobile) $("#screenShare").show();

    //start with a time limit for limited time meeting
    timer.start({
      precision: "seconds",
      startValues: { seconds: 0 },
      target: { seconds: timeLimit * 60 - 60 },
    });

    $("#showParticipantList")
      .addClass("number")
      .attr("data-content", usersCount);
  }
  //hide/show certain meeting related details
  function manageOptions() {
    $(".meeting-options").show();
    $("#meetingIdInfo").html(meetingTitle);
    localStorage.setItem("videoQuality", videoQualitySelect.value);

    setTimeout(function () {
      hideOptions();
      $(".local-user-name, .remote-user-name, .kick").hide();
    }, 3000);

    $("body").on("mousemove", function () {
      showOptions();
    });
  }

  //hide meeting ID and options
  function hideOptions() {
    $(".meeting-options, .meeting-info").hide();
  }

  //show meeting ID and options
  function showOptions() {
    $(".meeting-options, .meeting-info").show();

    if (mouseMoveTimer) {
      clearTimeout(mouseMoveTimer);
    }

    mouseMoveTimer = setTimeout(function () {
      hideOptions();
    }, 3000);
  }

  //handle mouseover event on video container
  $(document).on("mouseover", ".videoContainer", function () {
    $(this).find("span, button").show();
  });

  //handle mouseout event on video container
  $(document).on("mouseout", ".videoContainer", function () {
    $(this).find("span, button").hide();
  });

  //notify the moderator for new join request
  function handlePermission(data) {
    notificationTone.play();
    var approve = languages.approve;
    var decline = languages.decline;
    var request_join_meeting = languages.request_join_meeting;

    toastr.info(
      '<br><button type="button" class="btn btn-primary btn-sm clear approve" data-from="' +
      data.fromSocketId +
      '">' +
      approve +
      '</button><button type="button" class="btn btn-warning btn-sm clear ml-2 decline" data-from="' +
      data.fromSocketId +
      '">' +
      decline +
      "</button>",
      request_join_meeting + " " + data.username,
      {
        tapToDismiss: false,
        timeOut: 0,
        extendedTimeOut: 0,
        newestOnTop: false,
      }
    );
  }

  //notify participant about the request approval
  $(document).on("click", ".approve", function () {
    $(this).closest(".toast").remove();
    sendMessage({
      type: "permissionResult",
      result: true,
      toSocketId: $(this).data("from"),
    });
  });

  //notify participant about the request rejection
  $(document).on("click", ".decline", function () {
    $(this).closest(".toast").remove();
    sendMessage({
      type: "permissionResult",
      result: false,
      toSocketId: $(this).data("from"),
      message: "request_declined",
    });
  });

  function handelOpenMicPermissionRequest(data) {
    console.log("toster DATA IS : ", data);
    var yes = languages.approve;
    var no = languages.decline;
    notificationTone.play();
    toastr.info(
      '<br><button type="button" class="btn btn-success btn-sm clear handelMicRequestAccept" data-from="' +
      data.fromSocketId +
      '">' +
      yes +
      '</button><button type="button" class="btn btn-danger btn-sm clear ml-2 handelMicRequestReject" data-from="' +
      data.fromSocketId +
      '">' +
      no +
      "</button>",
      "request to open Mic To User : " + data.username,
      {
        tapToDismiss: false,
        timeOut: 0,
        extendedTimeOut: 0,
        newestOnTop: false,
      }
    );
  }

  //notify participant about the request approval
  $(document).on("click", ".handelMicRequestAccept", function () {
    $(this).closest(".toast").remove();
    //ask moderator for permission
    sendMessage({
      type: "openMicPermissionResult",
      result: true,
      toSocketId: $(this).data("from"),
      message: "you have accept permission to talk",
    });
    $('[data-socketId="' + $(this).data("from") + '"]#toggleMicUsers').html(
      '<i class="fa fa-microphone"></i>'
    );
    console.log("Yeeeeeeeeeeeeeeeeeeeeeeees");
  });

  //notify participant about the request rejection
  $(document).on("click", ".handelMicRequestReject", function () {
    $(this).closest(".toast").remove();
    sendMessage({
      type: "openMicPermissionResult",
      result: false,
      toSocketId: $(this).data("from"),
      message: "you have not permission to talk",
    });
    $('[data-socketId="' + $(this).data("from") + '"]#toggleMicUsers').removeClass('openedMicNow').html(
      '<i class="fa fa-microphone-slash"></i>'
    );
    console.log("Noooooooooooooooooooooooo");
  });

  //start the recording or notify the user about the rejection
  async function handelOpenMicPermissionResult(data) {
    $("#toggleMic").attr("disabled", false);

    if (data.result) {
      // true code
      $("#toggleAudioPreview").addClass("disabled");
      setMediaPreview(true, false);
      console.log("mic is now unmuted ");
      let stream = await getUserMedia(true, false);
      audioParams.track = stream.getTracks()[0];
      producerTransport.produce(audioParams);
      // localAudio.srcObject = new MediaStream([audioParams.track]);

      $("#toggleMic").html('<i class="fa fa-microphone"></i>');
      audioMuted = false;
      showSuccess(languages.mic_unmute);
      getMicActLev();
      if (isRecording)
        mixer.appendStreams(new MediaStream([audioParams.track]));
    } else {
      showInfo(languages.record_request_declined);
    }
  }

  //notify the moderator for new recording request
  function handleRecordingPermission(data) {
    notificationTone.play();
    var approve = languages.approve;
    var decline = languages.decline;
    var request_record_meeting = languages.request_record_meeting;

    toastr.info(
      '<br><button type="button" class="btn btn-primary btn-sm clear approveRecording" data-from="' +
      data.fromSocketId +
      '">' +
      approve +
      '</button><button type="button" class="btn btn-warning btn-sm clear ml-2 declineRecording" data-from="' +
      data.fromSocketId +
      '">' +
      decline +
      "</button>",
      request_record_meeting + " " + data.username,
      {
        tapToDismiss: false,
        timeOut: 0,
        extendedTimeOut: 0,
        newestOnTop: false,
      }
    );
  }

  //notify participant about the recording request approval
  $(document).on("click", ".approveRecording", function () {
    $(this).closest(".toast").remove();

    sendMessage({
      type: "recordongPermissionResult",
      result: true,
      toSocketId: $(this).data("from"),
    });
  });

  //notify participant about the recording request rejection
  $(document).on("click", ".declineRecording", function () {
    $(this).closest(".toast").remove();

    sendMessage({
      type: "recordongPermissionResult",
      result: false,
      toSocketId: $(this).data("from"),
      message: languages.request_declined,
    });
  });

  //start the recording or notify the user about the rejection
  function handleRecordingPermissionResult(data) {
    $("#recording").attr("disabled", false);

    if (data.result) {
      startRecording();
    } else {
      showInfo(languages.record_request_declined);
    }
  }

  //listen for timer update event and display during the meeting
  timer.addEventListener("secondsUpdated", function () {
    currentMeetingTime =
      timer.getTimeValues().minutes * 60 + timer.getTimeValues().seconds;
    $("#timer").html(getCurrentTime());
  });

  //start the timer for last one minute and end the meeting after that
  timer.addEventListener("targetAchieved", function () {
    $("#timer").css("color", "red");
    timer.stop();
    timer.start({
      precision: "seconds",
      startValues: {
        seconds: currentMeetingTime,
      },
    });
    setTimeout(function () {
      showInfo(languages.meeting_ended);

      reload(1);
    }, 60 * 1000);
  });

  //handle file message
  function handleFileMessage(data) {
    if ($(".chat-panel").is(":hidden")) {
      $("#openChat").addClass("notify").attr("data-content", ++messageCount);
      showOptions();
      notificationTone.play();
    }
    appendFile(data.file, data.extension, data.username, false);
  }

  //append file to the chat panel
  function appendFile(file, extension, username, self) {
    if ($(".empty-chat-body")) {
      $(".empty-chat-body").remove();
    }

    let remoteUsername = username
      ? "<div class='remote-chat-name'>" + username + " </div>"
      : "";

    let className = self ? "local-chat" : "remote-chat",
      fileDiv =
        remoteUsername +
          "<div class='" +
          className +
          "'>" +
          "<div class='fileMessage' title='" +
          languages.view_file +
          "' data-file='" +
          file +
          "' data-extension='" +
          extension +
          "'>" +
          `<img width="250" height="150"
           src="` + (extension == ".png" || extension == ".PNG" || extension == ".JPEG" || extension == ".jpeg" || extension == ".GIF" || extension == ".gif" || extension == ".JPG" || extension == ".jpg" || extension == ".TIFF" || extension == ".tiff" ? `https://develop.testat-app.com/api/uploads/meetings/${userInfo.meetingId}/${file}${extension}` : `https://link.testat-app.com/images/file.png`) + `" /> <br/>` +
      //   "<i class='fa fa-file'></i> " +
      // file +
      // extension +
      "</div>";

    $(".chat-body").append(fileDiv);
    $(".chat-body").animate(
      {
        scrollTop: $(".chat-body").prop("scrollHeight"),
      },
      1000
    );
  }

  //get current meeting time in readable format
  function getCurrentTime() {
    return timer.getTimeValues().toString(["hours", "minutes", "seconds"]);
  }

  //handle message and append it
  function handlemeetingMessage(data) {
    if ($(".chat-panel").is(":hidden")) {
      $("#openChat").addClass("notify").attr("data-content", ++messageCount);
      showOptions();
      notificationTone.play();
    }
    appendMessage(data.message, data.username, false);
  }

  //toggle chat panel
  $(document).on("click", "#openChat", function () {
    $(".chat-panel").animate({
      width: "toggle",
    });

    if ($(this).hasClass("notify")) {
      $(this).removeClass("notify");
      messageCount = 0;
    }
  });

  //close chat panel
  $(document).on("click", ".close-panel", function () {
    $(".chat-panel").animate({
      width: "toggle",
    });
  });

  //copy/share the meeting invitation
  $(document).on("click", "#add", function () {
    let link = location.protocol + "//" + location.host + location.pathname;

    if (navigator.share) {
      try {
        navigator.share({
          title: htmlEscape(settings.appName),
          url: link,
          text: languages.inviteMessage,
        });
      } catch (e) {
        showError(e);
      }
    } else {
      let inp = document.createElement("textarea");
      inp.style.display = "hidden";
      document.body.appendChild(inp);
      inp.value = languages.inviteMessage + link;
      inp.select();
      document.execCommand("copy", false);
      inp.remove();
      showSuccess(languages.link_copied);
    }
  });

  //listen for message form submit event and send message
  $(document).on("submit", "#chatForm", function (e) {
    e.preventDefault();

    if (!featureAvailable("text_chat")) return;

    let message = htmlEscape($("#messageInput").val().trim());

    if (message) {
      $("#messageInput").val("");
      appendMessage(message, null, true);

      sendMessage({
        type: "meetingMessage",
        message: message,
        username: userInfo.username,
      });
    }
  });

  //append message to chat body
  function appendMessage(message, username, self) {
    if ($(".empty-chat-body")) {
      $(".empty-chat-body").remove();
    }

    let className = self ? "local-chat" : "remote-chat",
      messageDiv =
        (username
          ? '<div class="remote-chat-name">' + username + " </div>"
          : "") +
        '<div class="' +
        className +
        '">' +
        "<div>" +
        linkify(message) +
        "</div>" +
        "</div>";

    $(".chat-body").append(messageDiv);
    $(".chat-body").animate(
      {
        scrollTop: $(".chat-body").prop("scrollHeight"),
      },
      1000
    );
  }

  //listen on file input change
  $("#file").on("change", function () {
    let inputFile = this.files;
    let maxFilesize = $(this).data("max");

    if (inputFile && inputFile[0]) {
      if (inputFile[0].size > maxFilesize * 1024 * 1024) {
        showError(languages.max_file_size + maxFilesize);

        return;
      }

      $("#previewImage").attr("src", "https://develop.testat-app.com/api/uploads/meetings/loader.gif");
      $("#previewFilename").text(inputFile[0].name);
      $("#previewModal").modal("show");

      if (inputFile[0].type.includes("image")) {
        let reader = new FileReader();
        reader.onload = function (e) {
          $("#previewImage").attr("src", e.target.result);
        };
        reader.readAsDataURL(inputFile[0]);
      } else {
        $("#previewImage").attr("src", "https://link.testat-app.com/images/file.png");
      }
    } else {
      showError();
    }
  });

  //empty file value on modal close
  $("#previewModal").on("hidden.bs.modal", function () {
    $("#file").val("");
  });

  //hide modal on file send button click
  $(document).on("click", "#sendFile", function () {
    $("#previewModal").modal("hide");
  });

  //dispay file on button click
  $(document).on("click", ".fileMessage", function () {
    let filename = $(this).data("file");
    let extension = $(this).data("extension");

    $("#displayImage").attr("src", "https://develop.testat-app.com/api/uploads/meetings/loader.gif");
    $("#displayFilename").text(filename + extension);
    $("#displayModal").modal("show");

    fetch(
      "https://develop.testat-app.com/api/uploads/meetings/" + userInfo.meetingId + "/" + filename + extension
    )
      .then((res) => res.blob())
      .then((blob) => {
        displayFileUrl = window.URL.createObjectURL(blob);
        console.log([".png", ".jpg", ".jpeg", ".gif"].includes(extension));
        if ([".png", ".jpg", ".jpeg", ".gif"].includes(extension)) {
          $("#displayImage").attr("src", displayFileUrl);
        } else {
          $("#displayImage").attr("src", "https://link.testat-app.com/images/file.png");
        }
      })
      .catch(() => showError());
  });

  //download file on button click
  $(document).on("click", "#downloadFile", function () {
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = displayFileUrl;
    link.download = $("#displayFilename").text();
    document.body.appendChild(link);
    link.click();
    $("#displayModal").modal("hide");
    window.URL.revokeObjectURL(displayFileUrl);
  });

  //open file exploler
  $(document).on("click", "#selectFile", function () {
    if (!featureAvailable("file_share")) return;

    $("#file").trigger("click");
  });

  //notify participants about hand raise
  $(document).on("click", "#raiseHand", function () {
    if (!featureAvailable("hand_raise")) return;
    showInfo(languages.hand_raised_self);

    sendMessage({
      type: "raiseHand",
      username: userInfo.username,
    });
  });
  // Get Microphone activity level
  function getMicActLev() {
    // if (audioMuted === false) {
    var max_level_L = 0;
    var old_level_L = 0;
    var constraints = { audio: true, video: false };
    navigator.mediaDevices.getUserMedia(constraints).then(
      function (stream) {
        var audioContext = new AudioContext();
        var microphone = audioContext.createMediaStreamSource(stream);
        var javascriptNode = audioContext.createScriptProcessor(1024, 1, 1);
        microphone.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
        javascriptNode.onaudioprocess = function (event) {
          if (audioMuted === false) {
            var inpt_L = event.inputBuffer.getChannelData(0);
            var instant_L = 0.0;
            var sum_L = 0.0;
            for (var i = 0; i < inpt_L.length; ++i) {
              sum_L += inpt_L[i] * inpt_L[i];
            }
            instant_L = Math.sqrt(sum_L / inpt_L.length);
            max_level_L = Math.max(max_level_L, instant_L);
            instant_L = Math.max(instant_L, old_level_L - 0.008);
            old_level_L = instant_L;
            let max = Math.round((max_level_L / max_level_L) * 100);
            let old = Math.round((old_level_L / max_level_L) * 100);
            let ini = Math.round((instant_L / max_level_L) * 100);
            socket.emit(
              "message",
              {
                type: "chMicLevel",
                level: ini,
                username: userInfo.username,
              });
          }
        };
      }).catch(function (err) {
        console.log(err);
      });
    // }
  };
  function ClientChMicLevelHandel(data) {
    // cccccccccccccccccccc
    $(
      '#participantListBody button[data-username="' +
      data.username +
      '"][data-action="usernames_mic"]'
    ).addClass('openedMicNow').html(`
        <i class="fa fa-microphone animate" style="transform: scale(${(data.lvl / 100) + 1});"></i>
    `);
  }
  //mute/unmute local audio
  $(document).on("click", "#toggleMic", async function () {
    $(this).attr("disabled", true);

    console.log("inAdmin");
    console.log("toggle mic on or off muted ?!");
    if (audioMuted) {
      if (isModerator) {
        console.log("mic is now unmuted ");
        let stream = await getUserMedia(true, false);
        audioParams.track = stream.getTracks()[0];
        producerTransport.produce(audioParams);
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(producerTransport._handler._sendStream);
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        // localAudio.srcObject = new MediaStream([audioParams.track]);
        $(this).html('<i class="fa fa-microphone"></i>');
        audioMuted = false;
        showSuccess(languages.mic_unmute);
        getMicActLev();
        if (isRecording)
          mixer.appendStreams(new MediaStream([audioParams.track]));
      } else {
        sendMessage({
          type: "openMicPermissionRequest",
          username: userInfo.username,
          meetingId: userInfo.meetingId,
        });

        showInfo(languages.please_wait);
      }
    } else {
      console.log("mic is now muted ");
      audioParams.track.stop();
      sendMessage({ type: "producerClose", id: audioParams.id });
      localAudio.srcObject = null;

      $(this).removeClass('openedMicNow').html('<i class="fa fa-microphone-slash"></i>');
      audioMuted = true;
      showSuccess(languages.mic_mute);
      if (isRecording) mixer.resetVideoStreams(getMediaStreams());
    }

    $(this).attr("disabled", false);
  });

  //mute/unmute local video
  $(document).on("click", "#toggleVideo", async function () {
    $(this).attr("disabled", true);
    // if (isModerator) {
    console.log("clicked on toggle cam btn ?!");
    if (videoMuted) {
      let stream = await getUserMedia(false, true);
      videoParams.track = stream.getTracks()[0];
      producerTransport.produce(videoParams);
      localVideo.srcObject = new MediaStream([videoParams.track]);

      $(this).html('<i class="fa fa-video"></i>');
      videoMuted = false;
      showSuccess(languages.camera_on);
      if (isRecording)
        mixer.appendStreams(new MediaStream([videoParams.track]));
    } else {
      videoParams.track.stop();
      sendMessage({ type: "producerClose", id: videoParams.id });
      localVideo.srcObject = null;

      $(this).html('<i class="fa fa-video-slash"></i>');
      videoMuted = true;
      showSuccess(languages.camera_off);
      if (isRecording) mixer.resetVideoStreams(getMediaStreams());
    }

    $(this).attr("disabled", false);
  });

  //toggle screen share
  $(document).on("click", "#screenShare", function () {
    if (!featureAvailable("screen_share")) return;

    if (screenShared) {
      stopScreenSharing();
    } else {
      startScreenSharing();
    }
  });

  //start screen sharing
  function startScreenSharing() {
    navigator.mediaDevices
      .getDisplayMedia({
        video: { cursor: "always" },
        audio: true,
      })
      .then((stream) => {
        let audioTrack = stream.getAudioTracks()[0];
        let videoTrack = stream.getVideoTracks()[0];

        if (audioTrack) {
          screenAudioParams.track = audioTrack;
          producerTransport.produce(screenAudioParams);
          localScreenAudio.srcObject = new MediaStream([audioTrack]);
          if (isRecording) mixer.appendStreams(new MediaStream([audioTrack]));
        }

        screenVideoParams.track = videoTrack;
        producerTransport.produce(screenVideoParams);
        localScreenVideo.srcObject = new MediaStream([videoTrack]);
        videoTrack.addEventListener("ended", () => {
          stopScreenSharing();
        });

        screenShared = true;
        screenContainer.style.display = "block";
        layout();

        if (isRecording) mixer.appendStreams(new MediaStream([videoTrack]));
      })
      .catch((e) => {
        showError(languages.cant_share_screen + " " + e);
      });
  }

  //stop screen sharing
  function stopScreenSharing() {
    if (screenAudioParams.track) {
      localScreenAudio.srcObject = null;
      screenAudioParams.track.stop();
      sendMessage({ type: "producerClose", id: screenAudioParams.id });
    }
    localScreenVideo.srcObject = null;
    screenVideoParams.track.stop();
    sendMessage({ type: "producerClose", id: screenVideoParams.id });
    screenShared = false;
    screenContainer.style.display = "none";
    layout();
    if (isRecording) mixer.resetVideoStreams(getMediaStreams());
  }

  //get user media and return stream
  async function getUserMedia(audio, video) {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        audio: audio ? getAudioConstraints() : false,
        video: video ? getVideoConstraints() : false,
      });
      return stream;
    } catch (e) {
      if (e.name === "OverconstrainedError")
        $("#videoQualitySelect").val("VGA").trigger("change");
      // console.log('CurrentLang',CurrentLang);
      // showErrorWithKey('no_device');
      showError(languages.no_device);

      throw new Error("Could not get user media");
    }
  }

  //create mediasoup device and load it
  async function createDevice() {
    try {
      device = new mediasoupClient.Device();
      await device.load({ routerRtpCapabilities });
      createSendTransport();
    } catch (e) {
      showError();
    }
  }

  //create and send transport
  function createSendTransport() {
    socket.emit(
      "message",
      {
        type: "createWebRtcTransport",
        consumer: false,
      },
      ({ params }) => {
        if (params.error) return;

        producerTransport = device.createSendTransport(params);

        producerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              await socket.emit("message", {
                type: "transportConnect",
                dtlsParameters,
              });

              callback();
            } catch (e) {
              errback(e);
            }
          }
        );

        producerTransport.on(
          "produce",
          async (parameters, callback, errback) => {
            try {
              await socket.emit(
                "message",
                {
                  type: "transportProduce",
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                  actionType: parameters.appData.type,
                },
                ({ id }) => {
                  callback({ id });

                  if (parameters.appData.type === "mic") {
                    audioParams.id = id;
                  } else if (parameters.appData.type === "webcam") {
                    videoParams.id = id;
                  } else if (parameters.appData.type === "screenAudio") {
                    screenAudioParams.id = id;
                  } else {
                    screenVideoParams.id = id;
                  }
                }
              );
            } catch (e) {
              errback(e);
            }
          }
        );

        if (!audioMuted) producerTransport.produce(audioParams);
        if (!videoMuted) producerTransport.produce(videoParams);
        //get producers if producersExist
        if (params.producersExist) getProducers();
      }
    );
  }

  //get producers and signal new consumer transport
  function getProducers() {
    socket.emit(
      "message",
      {
        type: "getProducers",
      },
      (producerIds) => {
        producerIds.forEach(signalNewConsumerTransport);
      }
    );
  }

  //signal new consumer transport
  async function signalNewConsumerTransport(remoteProducerId) {
    //check if we are already consuming the remoteProducerId
    if (consumingTransports.includes(remoteProducerId)) return;
    consumingTransports.push(remoteProducerId);

    socket.emit(
      "message",
      {
        type: "createWebRtcTransport",
        consumer: true,
      },
      ({ params }) => {
        if (params.error) return;

        let consumerTransport;
        try {
          consumerTransport = device.createRecvTransport(params);
        } catch (e) {
          return;
        }

        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              await socket.emit("message", {
                type: "transportRecvConnect",
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });

              callback();
            } catch (e) {
              errback(e);
            }
          }
        );

        connectRecvTransport(consumerTransport, remoteProducerId, params.id);
      }
    );
  }

  //connect receive transport
  async function connectRecvTransport(
    consumerTransport,
    remoteProducerId,
    serverConsumerTransportId
  ) {
    await socket.emit(
      "message",
      {
        type: "consume",
        remoteProducerId,
        serverConsumerTransportId,
        rtpCapabilities: device.rtpCapabilities,
      },
      async ({ params }) => {
        if (params.error) return;

        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        consumerTransports = [
          ...consumerTransports,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];

        let remoteElement;
        let stream = new MediaStream([consumer.track]);

        if (params.kind == "audio") {
          remoteElement = document.createElement("audio");
          remoteElement.id = remoteProducerId;
          remoteElement.setAttribute("autoplay", "");
          remoteElement.srcObject = stream;
        } else {
          remoteElement = document.createElement("video");
          remoteElement.id = remoteProducerId;
          remoteElement.setAttribute("autoplay", "");
          remoteElement.setAttribute("playsinline", "");
          remoteElement.srcObject = stream;
        }

        if (isRecording) mixer.appendStreams(stream);

        sendMessage({
          type: "consumerResume",
          serverConsumerId: params.serverConsumerId,
        });

        if (
          params.appData.type == "screenVideo" ||
          params.appData.type == "screenAudio"
        ) {
          let screenDiv;
          let screenSelector = document.getElementById(
            "screen-" + params.producerSocketId
          );
          if (screenSelector) {
            screenDiv = screenSelector;
            screenDiv.appendChild(remoteElement);
          } else {
            screenDiv = document.createElement("div");
            screenDiv.id = "screen-" + params.producerSocketId;
            screenDiv.className = "videoContainer";
            screenDiv.appendChild(remoteElement);
            videos.appendChild(screenDiv);

            let screenText = document.createElement("span");
            screenText.className = "remote-user-name";
            screenText.innerText = languages.screen + params.appData.username;
            screenDiv.appendChild(screenText);

            layout();
          }
        }

        if (params.appData.type == "webcam" || params.appData.type == "mic") {
          let containerDiv;
          let containerSelector = document.getElementById(
            "container-" + params.producerSocketId
          );

          if (containerSelector) {
            containerDiv = containerSelector;
            containerDiv.appendChild(remoteElement);
          } else {
            containerDiv = document.createElement("div");
            containerDiv.id = "container-" + params.producerSocketId;
            containerDiv.className = "videoContainer";
            containerDiv.appendChild(remoteElement);
            videos.appendChild(containerDiv);

            let containerText = document.createElement("span");
            containerText.className = "remote-user-name";
            containerText.innerText = params.appData.username;
            containerDiv.appendChild(containerText);

            let containerInitial = document.createElement("p");
            containerInitial.className = "user-initial";
            containerInitial.innerText = params.appData.username[0];
            containerInitial.style.background = getRandomColor();
            containerDiv.appendChild(containerInitial);

            if (isModerator && settings.moderatorRights == "enabled") {
              let kickButton = document.createElement("button");
              kickButton.className = "btn meeting-option kick";
              kickButton.innerHTML = '<i class="fa fa-ban"></i>';
              kickButton.setAttribute("data-id", params.producerSocketId);
              kickButton.setAttribute("title", languages.kick_user);

              containerDiv.appendChild(kickButton);
            }

            layout();
          }
        }
      }
    );
  }

  //kick the participant out of the meeting
  $(document).on("click", ".kick", function () {
    if (confirm(languages.confirmation_kick)) {
      $(this).attr("disabled", true);
      sendMessage({
        type: "kick",
        toSocketId: $(this).data("id"),
      });
    }
  });

  //handle producer closed, remove the media element and update the layout
  function handleProducerClosed(remoteProducerId, producerSocketId, trackType) {
    const producerToClose = consumerTransports.find(
      (transportData) => transportData.producerId === remoteProducerId
    );
    producerToClose.consumerTransport.close();
    producerToClose.consumer.close();

    consumerTransports = consumerTransports.filter(
      (transportData) => transportData.producerId !== remoteProducerId
    );

    if (trackType.type === "screenAudio" || trackType.type === "screenVideo") {
      if (document.getElementById("screen-" + producerSocketId))
        document.getElementById("screen-" + producerSocketId).remove();
      layout();
    } else {
      if (document.getElementById(remoteProducerId))
        document.getElementById(remoteProducerId).remove();
    }

    if (isRecording) mixer.resetVideoStreams(getMediaStreams());
  }

  //handle leave, update the layout and reset streams for recording
  function handleLeave(socketId, isModerator, username) {
    if (isModerator) reload(1);

    let container = document.getElementById("container-" + socketId);
    let screenContainer = document.getElementById("screen-" + socketId);
    if (container) container.remove();
    if (screenContainer) screenContainer.remove();
    if (container || screenContainer) layout();
    if (isRecording) mixer.resetVideoStreams(getMediaStreams());

    $('[class="list-' + username.slice(0, username.indexOf("%image%")) + '"')[0].remove();
    $("#showParticipantList")
      .addClass("number")
      .attr("data-content", --usersCount);
  }

  //open device settings modal
  $(".openSettings").on("click", async function () {
    $("#settings").modal("show");
    let devices = await navigator.mediaDevices.enumerateDevices();
    gotDevices(devices);
  });

  //get audio constraints
  function getAudioConstraints() {
    const audioSource = audioInputSelect.value;

    return {
      deviceId: audioSource ? { exact: audioSource } : undefined,
    };
  }

  //get video constraints
  function getVideoConstraints() {
    return {
      deviceId: videoInputSelect.value,
      width: { exact: $("#" + videoQualitySelect.value).data("width") },
      height: { exact: $("#" + videoQualitySelect.value).data("height") },
    };
  }

  //set devices in select input
  function gotDevices(deviceInfos) {
    const values = selectors.map((select) => select.value);
    selectors.forEach((select) => {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement("option");
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === "audioinput") {
        option.text =
          deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
        audioInputSelect.appendChild(option);
      } else if (deviceInfo.kind === "videoinput") {
        option.text =
          deviceInfo.label || `camera ${videoInputSelect.length + 1}`;
        videoInputSelect.appendChild(option);
      }
    }
    selectors.forEach((select, selectorIndex) => {
      if (
        Array.prototype.slice
          .call(select.childNodes)
          .some((n) => n.value === values[selectorIndex])
      ) {
        select.value = values[selectorIndex];
      }
    });
  }

  //video input change handler
  if (videoQualitySelect.value) {
    videoQualitySelect.value = videoQualitySelect.value
      ? videoQualitySelect.value
      : "VGA";
    videoQualitySelect.onchange = videoInputSelect.onchange =
      async function () {
        if (!videoParams.track) return;

        try {
          videoParams.track.stop();
          sendMessage({ type: "producerClose", id: videoParams.id });
          localVideo.srcObject = null;

          let stream = await getUserMedia(false, true);
          videoParams.track = stream.getTracks()[0];
          producerTransport.produce(videoParams);
          localVideo.srcObject = new MediaStream([videoParams.track]);

          videoSource.value = videoParams.track.getSettings().deviceId;
          localStorage.setItem("videoQuality", videoQualitySelect.value);
        } catch (e) { }
      };
  } else {
    videoQualitySelect.value = "VGA";
  }
  //checks and audio input change handler
  audioSource.onchange = async function () {
    if (!audioParams.track) return;

    try {
      audioParams.track.stop();
      sendMessage({ type: "producerClose", id: audioParams.id });
      localAudio.srcObject = null;

      let stream = await getUserMedia(true, false);
      audioParams.track = stream.getTracks()[0];
      producerTransport.produce(audioParams);
      localAudio.srcObject = new MediaStream([audioParams.track]);
    } catch (e) { }
  };

  //leave the meeting
  $(document).on("click", "#leave", function () {
    showError(languages.meeting_ended);

    reload(0);
  });

  //reload after a specific seconds
  function reload(seconds) {
    setTimeout(function () {
      if (settings.endURL == "null") {
        window.location.reload();
      } else {
        window.location.href = settings.endURL;
      }
    }, seconds * 1000);
  }

  //change the video size on window resize
  window.onresize = function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      layout();
    }, 20);
  };

  //enter into fullscreen mode with double click on video
  $(document).on("dblclick", "video", function () {
    if (this.id == "previewVideo") return;

    let parentElement = $(this).parent();
    if (parentElement.hasClass("OT_big")) {
      parentElement.removeClass("OT_big");
    } else {
      parentElement.addClass("OT_big");
    }

    layout();
  });

  //toggle picture-in-picture mode with click on video
  //preventing pip mode for mobile devices because, it is not fully supported yet
  $(document).on("click", "video", function () {
    if (isMobile || this.id == "previewVideo") return;

    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      if (this.readyState === 4 && this.srcObject.getTracks().length) {
        try {
          this.requestPictureInPicture();
        } catch (e) {
          showError(languages.no_pip);
        }
      } else {
        showError(languages.no_video);
      }
    }
  });

  //toggle recording
  $(document).on("click", "#recording", function () {
    if (!featureAvailable("recording")) return;

    if (isOnIOS) {
      showError(languages.feature_not_supported);

      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      if (
        isModerator ||
        settings.authMode == "disabled" ||
        settings.moderatorRights == "disabled"
      ) {
        startRecording();
      } else {
        $(this).attr("disabled", true);

        //ask moderator for permission
        sendMessage({
          type: "recordingPermission",
          username: userInfo.username,
          meetingId: userInfo.meetingId,
        });

        showInfo(languages.please_wait);
      }
    }
  });

  //start the recording
  function startRecording() {
    mixer = new MultiStreamsMixer(getMediaStreams());
    mixer.frameInterval = 1;
    mixer.height = $("#" + videoQualitySelect.value).data("height");
    mixer.width = $("#" + videoQualitySelect.value).data("width");
    mixer.startDrawingFrames();

    recorder = new MediaRecorder(mixer.getMixedStream());
    recorder.start(1000);
    recorder.ondataavailable = function (e) {
      if (e.data && e.data.size > 0) {
        recordingData.push(e.data);
      }
    };
    isRecording = true;
    $("#recording").css("color", "red");
    sendMessage({
      type: "recordingStarted",
      username: userInfo.username,
      meetingId: userInfo.meetingId,
    });
  }

  //stop recording and download
  function stopRecording() {
    mixer.releaseStreams();
    recorder.stop();
    recorder = recorder.ondataavailable = null;
    let link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob(recordingData, { type: "video/webm" })
    );
    link.download = meetingTitle;
    link.click();
    isRecording = false;
    recordingData = [];
    $("#recording").css("color", "white");
  }
  //get all the audio and video streams
  function getMediaStreams() {
    let mediaStreams = [];
    let hasVideoTrack = false;

    $("audio").each((key, value) => {
      if (value.srcObject) mediaStreams.push(value.srcObject);
    });

    $("video").each((key, value) => {
      if (value.srcObject) {
        if (value.srcObject.getTracks().length) hasVideoTrack = true;
        mediaStreams.push(value.srcObject);
      }
    });

    if (
      recordingPreference.value == "with" &&
      parseInt(features["whiteboard"])
    ) {
      hasVideoTrack = true;
      if (whiteboardAdded) {
        mediaStreams.push(
          $("iframe").contents().find("#main-canvas")[0].captureStream()
        );
      } else {
        showWhiteboard();
        setTimeout(function () {
          mixer.appendStreams(
            $("iframe").contents().find("#main-canvas")[0].captureStream()
          );
        }, 3000);
      }
    }

    //add a fake video stream from the canvas if no video track is available
    if (!hasVideoTrack) mediaStreams.push(audioOnly.captureStream());

    return mediaStreams;
  }

  //store recordingPreference in localStorage
  recordingPreference.onchange = function () {
    localStorage.setItem("recordingPreference", this.value);
  };

  //update recordingPreference value from localStorage
  recordingPreference.value =
    localStorage.getItem("recordingPreference") || "without";

  //add listner to whiteboard
  designer.addSyncListener(function (data) {
    sendMessage({
      type: "whiteboard",
      data: JSON.stringify(data),
    });
  });

  //set whiteboard tools
  designer.setTools({
    line: true,
    arrow: true,
    pencil: true,
    marker: true,
    dragSingle: true,
    dragMultiple: true,
    eraser: true,
    rectangle: true,
    arc: true,
    bezier: true,
    quadratic: true,
    text: true,
    image: true,
    pdf: true,
    zoom: true,
    lineWidth: true,
    colorsPicker: true,
    extraOptions: true,
    code: true,
    undo: true,
    snap: true,
    clear: true,
    close: true,
  });

  designer.icons = {
    pencil: "/assets/img/images/pencil.png",
    marker: "/assets/img/images/marker.png",
    eraser: "/assets/img/images/eraser.png",
    text: "/assets/img/images/text.png",
    image: "/assets/img/images/image.png",
    pdf: "/assets/img/images/pdf.png",
    line: "/assets/img/images/line.png",
    arrow: "/assets/img/images/arrow.png",
    rectangle: "/assets/img/images/rectangle.png",
    quadratic: "/assets/img/images/curve.png",
    undo: "/assets/img/images/undo.png",
    colorsPicker: "/assets/img/images/color.png",
    snap: "/assets/img/images/camera.png",
    clear: "/assets/img/images/clear.png",
    close: "/assets/img/images/close.png",
    dragSingle: "/assets/img/images/cursor.png",
    lineWidth: "/assets/img/images/lineWidth.png",
    arc: "/assets/img/images/circle.png",
    extraOptions: "/assets/img/images/paint-brush.png",
  };

  //toggle whiteboard
  $(document).on("click", "#whiteboard", function () {
    if (!featureAvailable("whiteboard")) return;
    if (whiteboardVisible) {
      hideWhiteboard();
    } else {
      showWhiteboard();
    }
  });

  //hide whiteboard
  function hideWhiteboard() {
    $("#videos").removeClass("set-videos");
    $("#whiteboardSection").removeClass("set-whiteboard");
    whiteboardVisible = false;
    layout();
  }

  //show whiteboard
  function showWhiteboard() {
    $("#videos").addClass("set-videos");
    $("#whiteboardSection").addClass("set-whiteboard");
    whiteboardVisible = true;
    layout();
    appendWhiteboard();
  }
  //append whiteboard
  function appendWhiteboard() {
    if (whiteboardAdded) return;
    designer.appendTo(whiteboardSection);
    whiteboardAdded = true;

    //set onload event on iframe
    $("iframe").on("load", function () {
      $("iframe")
        .contents()
        .on("click", "#clear", function () {
          sendMessage({
            type: "clearWhiteboard",
          });
        });

      $("iframe")
        .contents()
        .on("click", "#close", function () {
          hideWhiteboard();
        });
    });
  }

  //handle new event on whiteboard
  function handleWhiteboard(data) {
    data = JSON.parse(data);

    if (whiteboardAdded) {
      designer.syncData(data);
    } else {
      showWhiteboard();

      setTimeout(function () {
        designer.syncData(data);
      }, 3000);
    }
  }

  //send data to the server
  function sendMessage(data) {
    socket.emit("message", data);
  }

  //detect and replace text with url
  function linkify(text) {
    var urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });
  }

  //warn the user if he tries to leave the page during the meeting
  window.addEventListener(eventName, function () {
    socket.close();

    $("video").each((key, value) => {
      if (value.srcObject) {
        value.pause();
        value.srcObject = null;
        value.load();
        value.parentNode.removeChild(value);
      }
    });

    if (isRecording) stopRecording();
  });

  //initiate keyboard shortcuts
  function initKeyShortcuts() {
    $(document).on("keydown", function (e) {
      if ($("#messageInput").is(":focus")) return;

      switch (e.key) {
        case "C":
        case "c":
          $(".chat-panel").animate({
            width: "toggle",
          });

          if ($("#openChat").hasClass("notify")) {
            $("#openChat").removeClass("notify");
            messageCount = 0;
          }
          break;
        case "F":
        case "f":
          if ($(".chat-panel").is(":hidden")) {
            $(".chat-panel").animate({
              width: "toggle",
            });
          }
          $("#selectFile").trigger("click");
          break;
        case "A":
        case "a":
          $("#toggleMic").trigger("click");
          break;
        case "L":
        case "l":
          $("#leave").trigger("click");
          break;
        case "V":
        case "v":
          $("#toggleVideo").trigger("click");
          break;
        case "S":
        case "s":
          $("#screenShare").trigger("click");
          break;
      }
    });
  }

  //get random color
  function getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  //check if the feature is available in the current meeting plan
  function featureAvailable(feature) {
    let result = parseInt(features[feature]);
    if (!result) {
      showError(languages.feature_not_available);
    }
    //  showError(languages.feature_not_available);

    return result;
  }
})();
