var cookieConsent = "enabled";
let userImagesUrl = "https://develop.testat-app.com/api/uploads/users/";
var googleAnalyticsTrackingId = "null";
var socialInvitation =
  "Hey, check out this amazing website, where you can host video meetings!";
  const languages = {
    error_occurred: "حدث خطأ ما , حاول مرة أخري",
    data_updated: "تم تحديث التاريخ بنجاح",
    no_meeting: "الإجتماع غير موجود",
    meeting_created: "تم إنشاء الإجتماع",
    confirmation: "هل أنت متأكد؟",
    meeting_deleted: "تم حذف الإجتماع",
    link_copied: "تم نسخ رابط الإجتماع",
    meeting_updated: "تم تحديث الإجتماع",
    sending_invite: "جاري ارسال الدعوة ...",
    invite_sent: "تم ارسال الدعوة",
    inviteMessage: "اهلا بك ! التحق بي في هذا الرابط",
    no_session: "لا يوجد تفاصيل للجلسة",
    kicked: "تم طردك من الإجتماع",
    uploading: "جاري تحميل ملفات...",
    meeting_ended: "انتهى الإجتماع!",
    cant_connect: "لا يستطيع الوصول للسيرفر , حاول لاحقاً",
    invalid_password: "كلمة المرور غير صحيحة",
    no_device: "Could not get the devices, please check the permissions and try again. Error: ",
    approve: "موافقة",
    decline: "رفض",
    request_join_meeting: "طلب الإنضمام للإجتماع:",
    request_declined: "تم رفض كلبك من قبل المدير .",
    double_click: "الضغط مرتين على الفيديو لملئ الشاشة",
    single_click: "الضغط مرة واحدة على الفيديو للتحويل الي picture-in-picture mode.",
    error_message: "حدث خطأ ما!",
    kick_user: "طرد المستخدم",
    participant_joined: "تم دخول عضو إلى الاجتماع",
    confirmation_kick: "هل انت متأكد انك تود طرد هذا العضو ؟",
    participant_left: "تم مغادرة عضو للإجتماع",
    camera_on: "تم فتح الكاميرا.",
    camera_off: "تم غلق الكاميرا.",
    mic_unmute: "تم فتح المايك",
    mic_mute: "تم غلق المايك",
    no_video: "الفيديو لا يعمل",
    no_pip: "Picture-in-picture mode غير مدعومة على هذا المتصفح",
    link_copied: "تم نسخ دعوة الإجتماع",
    cant_share_screen: "لا يمكن مشاركة الشاشة , برجاء فحص الصلاحيات",
    max_file_size: "اقصى حجم مسموح للملف (MB): ",
    view_file: "عرص الملف",
    hand_raised: "إرفع يدك",
    hand_raised_self: "لقد قمت برفع يدك",
    your_screen: "شاشتك",
    not_started: "الإجتماع لم يبدأ حتى الأن",
    meeting_full: "الإجتماع ممتلئ",
    please_wait: "من فضلك انتظر حتى يفحص المدير طلبك",
    request_record_meeting: "طلب لتسجيل الإجتماع",
    record_request_declined: "تم رفض طلب التسجيل",
    feature_not_supported: "هذه الخاصية غير مدعومة على هذا المتصفح",
    feature_not_available: "الخاصية غير متاحة الأن",
    password: "كلمة المرور: ",
    calendar_check: "من فضلك حدد الوقت والتاريخ",
    recording_started: "بدأ التسجيل",
    token_copied: "API Token has been copied to the clipboard",
    screen: "شاشة-"
}
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
const meetingTitle = "اجتماع عن طريق تيستات";
/**************************************************************** */
var timeLimit = "480";
var features = JSON.parse(
  '{"text_chat":"1","file_share":"1","screen_share":"1","whiteboard":"1","hand_raise":"1","meeting_no":"10000","time_limit":"480","recording":"1"}'
);
Object.freeze(features);
