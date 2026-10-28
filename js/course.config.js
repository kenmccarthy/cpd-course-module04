/* ==========================================================================
   Course config — single source of truth for per-course/per-institution
   identity. Edit this file (or run `python3 scripts/init_course.py`) when
   reusing this repo as a template for a new course.

   Consumed by:
     - js/core.js         (storeKey, finalQuiz, masteryScore, activities)
     - imsmanifest.xml     (kept in sync by scripts/init_course.py, not read
                            at runtime — SCORM manifests are static XML)
     - scripts/build_scorm.py (courseSlug -> dist/<slug>-scorm12.zip)

   Must load BEFORE js/core.js in index.html.
   ========================================================================== */
window.CourseConfig = {
  courseTitle: "Assessment that Works",
  courseSlug: "assessment-that-works",
  institution: "South East Technological University (SETU)",

  // localStorage key for learner progress/state. Change this if you reuse
  // this repo for a new course served from the same origin/path as an old
  // one, so learners don't inherit stale progress.
  storeKey: "assessment-works-v1",

  // Lifelong Learning at SETU annual colour year. Drives the accent trio,
  // gradients and hero panels. One of: "2026/27", "2027/28", "2028/29".
  programmeYear: "2026/27",

  // Shown under the course title on the overview page.
  courseSubtitle: "Designing authentic, fair and meaningful assessment",

  // Shown on the overview and in the opening section. Free text.
  pitchLevel: "NFQ Level 8",

  // Lifelong Learning at SETU campaign tagline. Set showTagline: false to hide.
  tagline: "LEARN MORE. GO FURTHER.",
  showTagline: true,

  // Final-quiz question ids, in order. These are the data-kc values of the
  // knowledge checks that make up the graded quiz.
  //
  // LEAVE THIS EMPTY for a reflection-led course with no graded quiz (as this
  // one is). With no final quiz the course reports SCORM "completed" rather
  // than "passed"/"failed", no score is sent, and <adlcp:masteryscore> should
  // be omitted from imsmanifest.xml.
  //
  // To add a graded quiz: list the ids here (e.g. ["f1","f2","f3","f4"]), mark
  // each of those knowledge checks with data-final in index.html, and restore
  // <adlcp:masteryscore> in the manifest.
  finalQuiz: [],

  // Final-quiz pass mark, as a percentage (0-100). Only used when finalQuiz is
  // non-empty. Mirrors <adlcp:masteryscore> in imsmanifest.xml — keep in sync.
  masteryScore: 75,

  // Interactive activities the results dashboard counts as "explored", by the
  // id each widget emits on interaction.complete. Keep in step with the widgets
  // present in index.html — a course that drops or adds one edits this list,
  // and nothing else needs to change.
  activities: [
    "levels-tabs",     // assessment at Levels 7/8/9 (Section 2)
    "outcome-match",   // match outcomes to the assessment that evidences them (Section 2)
    "credits-flip",    // credits to hours cards (Section 2)
    "matrix-flip",     // purpose and stakes matrix (Section 3)
    "authentic-flip",  // four questions about any task (Section 4)
    "spectrum-match"   // sort tasks onto the authenticity spectrum (Section 4)
  ]
};
