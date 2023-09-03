
export interface CompleteItSubItemI {
  title_show: string,
  title: string,
  degree: any,
  test_questions_complete_it_words: CompleteITWordI[],
  note: any,
  note_attachments: attachmentsI[],
  cash_note_attachment?: fileUploadI,
  error: any
}

export interface CompleteITWordI {
  title: string,
}


export interface sendCodeI {
  mobile: any,
  country_code: any,
  type: any,
  country_id?: any,
}

export interface MatchItI {
  title1: string,
  title2: string,
  image1: string,
  image2: string,
  righte_index1: any,
  upload_image1: fileUploadI,

  upload_image2: fileUploadI,

  error: any

}

export interface sortWordsI {
  title: string,
  word_index: any,
  error: any
}



export interface SolveTestI {
  student_tests_answers_id: string, // not req
  questions: SolveTestQustuionI[],
}

export interface SolveTestQustuionI {
  question_id: string,
  answer_degree: any
}


export interface QuestionAnswerI {
  article_answer: any,
  student_option: any,
  student_tests_answers_id: any,
  question_id: any,
  answer_attachments: attachmentsI[],
  questions_sort_words: number[],
  questions_complete_it: questioCompleteItem[],
  questions_complete_it_writing_auto_correct: questioCompleteItem[],
  questions_complete_it_writing_manual_correct: questioCompleteItem[],
  questions_match_items: questionMatchItem[],
  answerd?: boolean
}
export interface questionMatchItem {
  id: any,
  student_answer_item: any,

}
export interface questioCompleteItem {
  sub_question_id: any,
  answer: any,

}


export interface svgMatchLineI {
  startId: any,
  endId: any
  startPointx: any,
  startPointy: any,
  endPointx: any,
  endPointy: any,
}



export interface editProfileI {
  full_name: any,
  email: any,
  country_id: any,
  stage_id: any,
  grade_id: any,
  specialize_id: any;
  teacher_subjects: SubjectI[],
  students_for_parent: any,
  img: any,
}

export interface signUpI {
  full_name: any,
  country_code: any,
  email: any,
  mobile: any,
  password: any,
  confirm_password: any,
  user_type: any,
  country_id: any,
  stage_id: any,
  grade_id: any,
  specialize_id: any,
  teacher_subjects: SubjectI[],
  students_for_parent: any,
  acceptCondition: boolean
}

export interface loginI {
  country_code: any,
  mobile: any,
  password: any,
}


export interface resetPasswordI {
  country_code: any,
  mobile: any,
  code: any,
  new_password: any,
  confirm_password: any,
}
export interface editMobileI {
  mobile: any,
  country_code: any,
  code: any,
  type: any,
  country_id: any
}


export interface SubjectI {
  subject_id: any,
  grade_id: any,
  stage_id: any,
  specialize_id: any,
  hide?: any,
}


export interface TestAddingI {
  my_test_id: any;
  name: any,
  description: any,
  questions: any,
  subject_id: any,
  unit_id: any,
  lesson_id: any,
  type: any,
  deleted_questions_ids?: string
}

export interface TestCustomAddingI {
  my_test_id: any;
  name: any,
  description: any,
  subject_id: any,
  unit_id: any,
  lesson_id: any,
  type: any,
  question?: questionAddingI
}

export interface addQuestionI {
  my_test_id: any,
  question: questionAddingI,
}


export interface qustionByCodeI {
  id: any,
  error: any
}

export interface questionAddingI {
  removeLoader?: boolean,
  id?: any,
  title: any,
  type: any,
  source: any,
  degree: any,
  test_question_options?: questionOptionsAddingI[],
  test_questions_paragraphs?: questionAddingI[],
  question_attachments: attachmentsI[],
  question_subject_event_attachments?: any,
  cash_question_attachment?: fileUploadI,
  error: any
}

export interface questionOptionsAddingI {
  title: any,
  status: any,
  note: any,
  option_attachments: attachmentsI[],
  option_note_attachments: attachmentsI[],
  option_subject_event_attachments?: any,
  option_note_subject_event_attachments?: any,
  cash_option_attachment?: fileUploadI,
  cash_option_note_attachment?: fileUploadI,
  error: any

}

export interface attachmentsI {
  attachment_type: any,
  file: any,
}

export interface groupI {
  group_id: any,
  name: any,
  description: any,
  image: any,
}



export interface addPostI {
  post_id: any,
  group_id: any,
  content: any,
  attachments: attachmentsI[],
}
export interface fileUploadI {
  FileN?: string
  name: string,
  url: any,
  attachment_type?: string,
  progress: number,
  loader: boolean,
  error_upload: any,
  fileTransfer?: any,

  is_recording?: any,
  mediaFile?: any,
  recording_timer?: any,
  recording_interval?: any,
}




export interface ShareTestI {
  message: string, // not req
  test_id: any,
  students: any[],// at lest one
  groups: any[],// at lest one
  target: string // students || groups
  test_duration: any
  scheduled_date: any,
  scheduled_test: boolean,
  is_duration: boolean,
  show_result_to_student: boolean,
}
export interface SolveTestI {
  student_tests_answers_id: string, // not req
  questions: SolveTestQustuionI[],
}

export interface SolveTestQustuionI {
  question_id: string,
  answer_degree: any
}
export interface renewSubscriptionI {
  payment_type: string,
  subscription_id: any,
  semester: string
}

export interface StartShareTestI {
  message: string,
  test_id: any,
}

export interface SetStudentAnswersI {
  test_id: string
  share_id: string
  student_id: string
  retunren_from_api_student_options: any
}


export enum USERTYPES {
  teacher = 'teacher',
  student = 'student',
  parent = 'parent',
}
