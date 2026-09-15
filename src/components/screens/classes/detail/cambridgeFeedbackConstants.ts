export const CAMBRIDGE_HOMEWORK_OPTIONS = [
  { value: 'Done', label: 'Done', type: 'done' },
  { value: 'Partly Done', label: 'Partly Done', type: 'partly' },
  { value: 'Not Yet', label: 'Not Yet', type: 'not_yet' },
  { value: 'No Homework', label: 'No Homework', type: 'none' },
]

export const CAMBRIDGE_EVALUATION_OPTIONS = [
  { value: 1, label: '1 - Poor' },
  { value: 2, label: '2 - Needs Improvement' },
  { value: 3, label: '3 - Below Expectations' },
  { value: 4, label: '4 - Meets Expectations' },
  { value: 5, label: '5 - Exceeds Expectations' },
]

export const CAMBRIDGE_REMINDERS = [
  "Attend class on time (automatically updated)",
  "Pay more attention and don't do your own work in class",
  "Be confident in interacting with the teacher and classmates in class",
  "Do not turn off the camera frequently",
  "Need a better internet connection",
  "Need to fix camera",
  "Need to fix micro",
  "Avoid studying in noisy and crowded places.",
  "Be polite to teachers",
  "Adjust the camera properly",
  "Sit upright with proper posture",
]

export const CAMBRIDGE_HIGHLIGHT_TAGS = [
  'Active in class',
  'Confident speaking',
  'Quick comprehension',
  'Good focus & attitude',
  'Clear pronunciation',
]

export const CAMBRIDGE_POINTS_TO_NOTE_TAGS = [
  'Needs to speak louder',
  'Review vocabulary',
  'Practice full sentences',
  'Pay more attention',
  'Complete homework on time',
]

export const CAMBRIDGE_SUGGESTIONS: Record<
  'vocabulary' | 'grammar' | 'speaking' | 'pronunciation',
  Record<number, { good: string[]; improve: string[] }>
> = {
  vocabulary: {
    1: {
      good: ['tries to repeat after teacher', 'shows effort in speaking', 'listens and imitates sounds'],
      improve: ['needs strong support to remember words', 'struggles to recall past words', 'forgets quickly after lessons', 'needs more listening and repetition practice', 'limited vocabulary for simple topics']
    },
    2: {
      good: ['recognizes some learned words', 'tries to name pictures with help', 'remembers a few familiar words'],
      improve: ['forgets or mixes up words', 'needs help to pronounce clearly', 'needs more word practice', 'rarely uses learned words', 'depends on teacher\'s support to recall']
    },
    3: {
      good: ['remembers basic words from lessons', 'understands meanings through pictures', 'uses simple familiar words'],
      improve: ['confuses old and new words', 'forgets words without review', 'needs support to use words in context', 'needs regular vocabulary revision', 'slow to recall new vocabulary']
    },
    4: {
      good: ['uses familiar words correctly', 'recalls vocabulary from past lessons', 'uses words in short sentences', 'understands teacher\'s prompts easily'],
      improve: ['needs reminders to use full sentences', 'sometimes slow to recall new words', 'can expand vocabulary further']
    },
    5: {
      good: ['uses a wide range of familiar words', 'remembers new words quickly', 'uses vocabulary fluently and accurately', 'recalls past words easily', 'speaks confidently with varied words'],
      improve: ['encourage use in longer or more complex sentences', 'challenge with advanced vocabulary', 'continue expanding word range']
    }
  },
  grammar: {
    1: {
      good: ['tries to repeat short phrases', 'understands simple commands', 'shows effort to speak'],
      improve: ['unable to form short phrases', 'needs more listening and repetition', 'needs help using simple sentences', 'limited sentence awareness']
    },
    2: {
      good: ['follows sentence patterns with help', 'uses short phrases correctly with guidance', 'tries to respond using short patterns'],
      improve: ['needs help forming longer sentences', 'still makes grammar mistakes', 'needs regular review and correction', 'forgets structure easily']
    },
    3: {
      good: ['uses short, correct phrases with help', 'tries to follow sentence patterns', 'applies simple grammar rules'],
      improve: ['still mixes up word order', 'needs consistent review and correction', 'responses lack completeness']
    },
    4: {
      good: ['forms simple sentences clearly', 'applies patterns in different contexts'],
      improve: ['needs to add more complete responses', 'still needs correction on minor errors']
    },
    5: {
      good: ['speaks short sentences naturally', 'adjusts sentence forms correctly', 'applies patterns in different contexts', 'maintains good accuracy'],
      improve: ['maintain accuracy while speaking faster']
    }
  },
  speaking: {
    1: {
      good: ['tries to answer when asked', 'responds with single words', 'shows effort to speak'],
      improve: ['often quiet or shy', 'needs more confidence', 'needs frequent prompting', 'short or unclear answers']
    },
    2: {
      good: ['speaks when prompted', 'answers short questions with help', 'can recall some learned words'],
      improve: ['pauses or stops mid-sentence', 'speaks softly or unclearly', 'needs practice in full answers', 'needs more speaking turns']
    },
    3: {
      good: ['says short learned phrases', 'tries to speak independently', 'uses vocabulary from lessons'],
      improve: ['limited sentence length', 'needs more spontaneous speech', 'may rely on teacher\'s help', 'pronunciation sometimes unclear']
    },
    4: {
      good: ['speaks clearly with correct structure', 'expresses ideas simply', 'joins class speaking confidently'],
      improve: ['needs longer sentences', 'should add more details', 'may hesitate occasionally']
    },
    5: {
      good: ['speaks clearly and naturally', 'uses vocabulary fluently', 'expresses ideas flexibly', 'joins class speaking confidently'],
      improve: ['needs exposure to more speaking tasks']
    }
  },
  pronunciation: {
    1: {
      good: ["tries to copy teacher's sounds", "listens carefully to pronunciation models"],
      improve: ['sounds unclear or incomplete', 'needs slow and repeated drills', 'skips ending sounds', 'confuses similar sounds', 'tone not natural', 'limited awareness of word stress']
    },
    2: {
      good: ['produces some common sounds correctly', 'tries to correct self when guided'],
      improve: ['still confuses several sounds', 'often drops ending sounds', 'tone not natural yet', 'limited awareness of word stress']
    },
    3: {
      good: ['pronounces most learned words clearly', "copies teacher's sounds accurately", 'includes ending sounds with guidance'],
      improve: ['sometimes drops endings', 'needs to improve stress and tone']
    },
    4: {
      good: ['pronounces words clearly and evenly', 'keeps stress and tone', 'includes ending sounds when speaking', 'natural mouth movement'],
      improve: ['needs focus on tricky sounds', 'refine intonation naturally']
    },
    5: {
      good: ['speaks with clear, natural sounds', 'keeps stress and tone well', 'includes all ending sounds', 'shows strong sound awareness'],
      improve: ['refine intonation for expressiveness', 'maintain fluency at higher speed']
    }
  }
}
