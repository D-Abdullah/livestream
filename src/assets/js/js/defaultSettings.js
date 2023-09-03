var cookieConsent = "enabled";
let userImagesUrl = "https://develop.testat-app.com/api/uploads/users/";
var googleAnalyticsTrackingId = "null";
var socialInvitation =
  "Hey, check out this amazing website, where you can host video meetings!";
const CurrentLang = localStorage.getItem("CurrentLang");
var languages = {
  yes: "yes",
  no: "no",
  error_occurred: "An error occurred, please try again",
  data_updated: "Data updated successfully",
  no_meeting: "The meeting does not exist",
  meeting_created: "The meeting has been created",
  confirmation: "Are you sure",
  meeting_deleted: "The meeting has been deleted",
  //   link_copied: "{{ __('Meeting link has been copied to the clipboard",
  meeting_updated: "The meeting has been updated",
  sending_invite: "Sending the invitation",
  invite_sent: "Invitation has been sent",
  inviteMessage: "Hey there! Join me for a meeting at this link",
  no_session: "Could not get the session details",
  kicked: "You have been kicked out of the meeting",
  uploading: "Uploading the file",
  meeting_ended: "Meeting ended",
  cant_connect: "Could not connect to the server, please try again later",
  invalid_password: "The password is invalid",
  no_device:
    "Could not get the devices, please check the permissions and try again. Error",
  approve: "Approve",
  decline: "Decline",
  request_join_meeting: "Request to join the meeting  ",
  request_declined: "Your request has been declined by the moderator",
  double_click: "Double click on the video to make it fullscreen",
  single_click: "Single click on the video to turn picture-in-picture mode on",
  error_message: "An error occurred",
  kick_user: "Kick this user",
  participant_joined: "A participant has joined the meeting",
  confirmation_kick: "Are you sure you want to kick this user",
  participant_left: "A participant has left the meeting",
  camera_on: "Camera has been turned on",
  camera_off: "Camera has been turned off",
  mic_unmute: "Mic has been unmute",
  mic_mute: "Mic has been muted",
  no_video: "The video is not playing or has no video track",
  no_pip: "Picture-in-picture mode is not supported in this browser",
  link_copied: "The meeting invitation link has been copied to the clipboard",
  cant_share_screen:
    "Could not share the screen, please check the permissions and try again",
  max_file_size: "Maximum file size allowed (MB)",
  view_file: "View File",
  hand_raised: "Hand raised ",
  hand_raised_self: "You raised hand ",
  your_screen: "Your screen",
  not_started: "The meeting has not been started yet",
  meeting_full: "The meeting is full",
  please_wait: "Please wait while the moderator check your request",
  request_record_meeting: "Request to record the meeting",
  record_request_declined: "You recording request was not approved",
  feature_not_supported: "This feature is not yet supported in your browser",
  feature_not_available:
    "This feature is not available in the current meeting plan",
  password: "Password: ",
  calendar_check: "Please set a date and time",
  recording_started: "The recording has been started",
  token_copied: "API Token has been copied to the clipboard",
  screen: "Screen",
};
var languagesAR = {
  yes: "موافق",
  no: "رفض",
  error_occurred: "حدث خطأ ، يرجى المحاولة مرة أخرى",
  data_updated: "تم تحديث البيانات بنجاح",
  no_meeting: "الاجتماع غير موجود",
  meeting_created: "تم إنشاء الاجتماع",
  confirmation: "هل أنت متأكد",
  meeting_deleted: "تم حذف الاجتماع",
  //   link_copied: "{{ __('Meeting link has been copied to the clipboard') }}",
  meeting_updated: "تم تحديث الاجتماع",
  sending_invite: "ارسال الدعوة",
  invite_sent: "تم إرسال الدعوة",
  inviteMessage: "مرحبًا يا من هناك! انضم إلي للاجتماع على هذا الرابط",
  no_session: "تعذر الحصول على تفاصيل الجلسة",
  kicked: "لقد تم طردك من الاجتماع",
  uploading: "تحميل الملف",
  meeting_ended: "انتهى الاجتماع",
  cant_connect: "تعذر الاتصال بالخادم ، يرجى المحاولة مرة أخرى لاحقًا",
  invalid_password: "كلمة المرور غير صحيحة",
  no_device:
    "تعذر الحصول على الأجهزة ، يرجى التحقق من الأذونات والمحاولة مرة أخرى. خطأ",
  approve: "موافق",
  decline: "رفض",
  request_join_meeting: "   طلب الانضمام إلى الاجتماع",
  request_declined: "تم رفض طلبك ",
  double_click: "انقر نقرًا مزدوجًا على الفيديو لجعله في وضع ملء الشاشة",
  single_click: "نقرة واحدة على الفيديو لتشغيل وضع الصورة في الصورة",
  error_message: "حدث خطأ ما",
  kick_user: "اطرد الطالب",
  participant_joined: "انضم أحد المشاركين إلى الاجتماع",
  confirmation_kick: "هل أنت متأكد أنك تريد طرد هذا المستخدم",
  participant_left: "أحد المشاركين قد غادر الاجتماع",
  camera_on: "تم تشغيل الكاميرا",
  camera_off: "تم إيقاف تشغيل الكاميرا",
  mic_unmute: "تم إلغاء كتم صوت الميكروفون",
  mic_mute: "تم كتم صوت الميكروفون",
  no_video: "الفيديو لا يعمل أو لا يحتوي على مسار فيديو",
  no_pip: "وضع الصورة في الصورة غير مدعوم في هذا المستعرض",
  link_copied: "تم نسخ ارتباط دعوة الاجتماع إلى الحافظة",
  cant_share_screen:
    "تعذرت مشاركة الشاشة ، يرجى التحقق من الأذونات والمحاولة مرة أخرى",
  max_file_size: "أقصى حجم مسموح به للملف (ميغا بايت)",
  view_file: "استعراض الملف",
  hand_raised: "رفع اليد  ",
  hand_raised_self: "لقد رفعت يدك ",
  your_screen: "شاشتك",
  not_started: "الاجتماع لم يبدأ بعد",
  meeting_full: "الاجتماع ممتلئ",
  please_wait: "يرجى الانتظار ريثما يتحقق الوسيط من طلبك",
  request_record_meeting: "طلب تسجيل الاجتماع",
  record_request_declined: "لم تتم الموافقة على طلب التسجيل الخاص بك",
  feature_not_supported: "هذه الميزة ليست مدعومة في متصفحك حتى الآن",
  feature_not_available: "هذه الميزة غير متوفرة في خطة الاجتماع الحالية",
  password: "كلمة المرور: ",
  calendar_check: "يرجى تحديد التاريخ والوقت",
  recording_started: "بدأ التسجيل",
  token_copied: "تم نسخ API Token إلى الحافظة",
  screen: "شاشة",
};
/**************************************************************** */
const localUser = JSON.parse(localStorage.getItem("currentUserFront"));

const username = localUser.full_name;
const meetingId = window["meetingId"];
const userInfo = {
  username: username,
  meetingId: meetingId,
};
const passwordRequired = "";
const isModerator = window["isModerator"] ? "1" : "1";
const meetingTitle = "title of the meetings";
/**************************************************************** */
var timeLimit = "480";
var features = JSON.parse(
  '{"text_chat":"1","file_share":"1","screen_share":"1","whiteboard":"1","hand_raise":"1","meeting_no":"10000","time_limit":"480","recording":"1"}'
);
Object.freeze(features);
