var cookieConsent = "enabled";
let userImagesUrl = "https://develop.testat-app.com/api/uploads/users/";
var googleAnalyticsTrackingId = "null";
var socialInvitation =
  "Hey, check out this amazing website, where you can host video meetings!";
  const languages = {
    error_occurred: "An error occurred, please try again.",
    data_updated: "Data updated successfully.",
    no_meeting: "The meeting does not exist",
    meeting_created: "The meeting has been created",
    confirmation: "Are you sure?",
    meeting_deleted: "The meeting has been deleted",
    link_copied: "Meeting link has been copied to the clipboard",
    meeting_updated: "The meeting has been updated",
    sending_invite: "Sending the invitation...",
    invite_sent: "Invitation has been sent",
    inviteMessage: "Hey there! Join me for a meeting at this link: ",
    no_session: "Could not get the session details.",
    kicked: "You have been kicked out of the meeting!",
    uploading: "Uploading the file...",
    meeting_ended: "Meeting ended!",
    cant_connect: "Could not connect to the server, please try again later.",
    invalid_password: "The password is invalid",
    no_device: "Could not get the devices, please check the permissions and try again. Error: ",
    approve: "Approve",
    decline: "Decline",
    request_join_meeting: "Request to join the meeting: ",
    request_declined: "Your request has been declined by the moderator.",
    double_click: "Double click on the video to make it fullscreen!",
    single_click: "Single click on the video to turn picture-in-picture mode on.",
    error_message: "An error occurred: ",
    kick_user: "Kick this user",
    participant_joined: "A participant has joined the meeting: ",
    confirmation_kick: "Are you sure you want to kick this user?",
    participant_left: "A participant has left the meeting: ",
    camera_on: "Camera has been turned on.",
    camera_off: "Camera has been turned off.",
    mic_unmute: "Mic has been unmute.",
    mic_mute: "Mic has been muted.",
    no_video: "The video is not playing or has no video track.",
    no_pip: "Picture-in-picture mode is not supported in this browser.",
    link_copied: "The meeting invitation link has been copied to the clipboard!",
    cant_share_screen: "Could not share the screen, please check the permissions and try again.",
    max_file_size: "Maximum file size allowed (MB): ",
    view_file: "View File",
    hand_raised: "Hand raised",
    hand_raised_self: "You raised hand",
    your_screen: "Your screen",
    not_started: "The meeting has not been started yet",
    meeting_full: "The meeting is full",
    please_wait: "Please wait while the moderator check your request",
    request_record_meeting: "Request to record the meeting: ",
    record_request_declined: "You recording request was not approved",
    feature_not_supported: "This feature is not yet supported in your browser",
    feature_not_available: "This feature is not available in the current meeting plan.",
    password: "Password: ",
    calendar_check: "Please set a date and time.",
    recording_started: "The recording has been started",
    token_copied: "API Token has been copied to the clipboard",
    screen: "Screen-"
}
/**************************************************************** */
const localUser = {"id":"3","country_id":"1","stage_id":null,"specialize_id":null,"grade_id":null,"selected_semester":"second","email":"teacher@teacher.com","full_name":"مدرس احمد كلساني","user_type":"teacher","status":"1","mobile":"1288935272","mobile_is_valid":"1","country_code":"20","img":"pxfuel(aac2e73412).jpg","notes":"","date_added":"2022-05-20 17:29:16","country_name":"مصر","currency_name":"جنيه","stage_name":null,"grade_name":null,"specialize_name":null,"separate_subject":null};
const username = "it plus";
const meetingId = "xzjiwxapurx7mb3p5k85ag";
const userInfo = {
  username: username,
  meetingId: meetingId,
  userimg: localUser.img
};
const passwordRequired = "";
const isModerator = window["isModerator"] ? "1" : "1";
const meetingTitle = "testat test meeting details";
/**************************************************************** */
var timeLimit = "480";
var features = JSON.parse(
  '{"text_chat":"1","file_share":"1","screen_share":"1","whiteboard":"1","hand_raise":"1","meeting_no":"10000","time_limit":"480","recording":"1"}'
);
Object.freeze(features);
