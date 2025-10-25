// Pakistani Education Boards Data
// Source: Wikipedia - List of education boards in Pakistan

export interface EducationBoard {
  id: string;
  name: string;
  type: 'matric' | 'o_level' | 'both';
  province: 'Islamabad' | 'Punjab' | 'Sindh' | 'KPK' | 'Balochistan' | 'AJK';
  established: number;
  jurisdiction: string[];
  website?: string;
}

export const PAKISTANI_EDUCATION_BOARDS: EducationBoard[] = [
  // ISLAMABAD
  {
    id: 'fbise',
    name: 'Federal Board of Intermediate and Secondary Education',
    type: 'both',
    province: 'Islamabad',
    established: 1975,
    jurisdiction: ['Islamabad Capital Territory', 'Cantonments and Garrisons', 'Gilgit-Baltistan', 'Pakistan International School (abroad)'],
    website: 'https://www.fbise.edu.pk'
  },

  // PUNJAB
  {
    id: 'bise-bahawalpur',
    name: 'Board of Intermediate and Secondary Education, Bahawalpur',
    type: 'matric',
    province: 'Punjab',
    established: 1998,
    jurisdiction: ['Bahawalpur District', 'Bahawalnagar District', 'Rahim Yar Khan District'],
    website: 'https://www.bisebwp.edu.pk'
  },
  {
    id: 'bise-dgk',
    name: 'Board of Intermediate and Secondary Education, Dera Ghazi Khan',
    type: 'matric',
    province: 'Punjab',
    established: 1989,
    jurisdiction: ['Dera Ghazi Khan District', 'Muzaffargarh District', 'Layyah District', 'Rajanpur District'],
    website: 'https://www.bisedgk.edu.pk'
  },
  {
    id: 'bise-faisalabad',
    name: 'Board of Intermediate and Secondary Education, Faisalabad',
    type: 'matric',
    province: 'Punjab',
    established: 1988,
    jurisdiction: ['Faisalabad District', 'Chiniot District', 'Jhang District', 'Toba Tek Singh District'],
    website: 'https://www.bisefsd.edu.pk'
  },
  {
    id: 'bise-gujranwala',
    name: 'Board of Intermediate and Secondary Education, Gujranwala',
    type: 'matric',
    province: 'Punjab',
    established: 1976,
    jurisdiction: ['Gujranwala District', 'Gujrat District', 'Mandi Bahauddin District', 'Hafizabad District', 'Narowal District', 'Sialkot District'],
    website: 'https://www.bisegrw.com'
  },
  {
    id: 'bise-lahore',
    name: 'Board of Intermediate and Secondary Education, Lahore',
    type: 'matric',
    province: 'Punjab',
    established: 1954,
    jurisdiction: ['Lahore District', 'Sheikhupura District', 'Nankana Sahib District', 'Kasur District'],
    website: 'https://www.biselahore.com'
  },
  {
    id: 'bise-multan',
    name: 'Board of Intermediate and Secondary Education, Multan',
    type: 'matric',
    province: 'Punjab',
    established: 1968,
    jurisdiction: ['Multan District', 'Khanewal District', 'Vehari District', 'Lodhran District'],
    website: 'https://www.bisemultan.edu.pk'
  },
  {
    id: 'bise-rawalpindi',
    name: 'Board of Intermediate and Secondary Education, Rawalpindi',
    type: 'matric',
    province: 'Punjab',
    established: 1977,
    jurisdiction: ['Rawalpindi District', 'Jhelum District', 'Attock District', 'Chakwal District'],
    website: 'https://www.biserwp.edu.pk'
  },
  {
    id: 'bise-sahiwal',
    name: 'Board of Intermediate and Secondary Education, Sahiwal',
    type: 'matric',
    province: 'Punjab',
    established: 2012,
    jurisdiction: ['Sahiwal District', 'Okara District', 'Pakpattan District'],
    website: 'https://www.bisesahiwal.edu.pk'
  },
  {
    id: 'bise-sargodha',
    name: 'Board of Intermediate and Secondary Education, Sargodha',
    type: 'matric',
    province: 'Punjab',
    established: 1968,
    jurisdiction: ['Sargodha District', 'Khushab District', 'Mianwali District', 'Bhakkar District'],
    website: 'https://www.bisesargodha.edu.pk'
  },

  // SINDH
  {
    id: 'bise-hyderabad',
    name: 'Board of Intermediate and Secondary Education, Hyderabad',
    type: 'matric',
    province: 'Sindh',
    established: 1961,
    jurisdiction: ['Hyderabad District', 'Matiari District', 'Jamshoro District', 'Tando Allahyar District', 'Tando Muhammad Khan District', 'Thatta', 'Badin District', 'Sujawal District'],
    website: 'https://www.bisehyd.edu.pk'
  },
  {
    id: 'bise-karachi-intermediate',
    name: 'Board of Intermediate Education, Karachi',
    type: 'matric',
    province: 'Sindh',
    established: 1974,
    jurisdiction: ['Karachi Division'],
    website: 'https://www.biek.edu.pk'
  },
  {
    id: 'bise-karachi-secondary',
    name: 'Board of Secondary Education, Karachi',
    type: 'matric',
    province: 'Sindh',
    established: 1950,
    jurisdiction: ['Karachi Division'],
    website: 'https://www.bsek.edu.pk'
  },
  {
    id: 'bise-larkana',
    name: 'Board of Intermediate and Secondary Education, Larkana',
    type: 'matric',
    province: 'Sindh',
    established: 1995,
    jurisdiction: ['Larkana Division'],
    website: 'https://www.biselarkana.edu.pk'
  },
  {
    id: 'bise-mirpur-khas',
    name: 'Board of Intermediate and Secondary Education, Mirpur Khas',
    type: 'matric',
    province: 'Sindh',
    established: 1973,
    jurisdiction: ['Mirpur Khas Division', 'Sanghar District'],
    website: 'https://www.bisemirpurkhas.edu.pk'
  },
  {
    id: 'bise-sukkur',
    name: 'Board of Intermediate and Secondary Education, Sukkur',
    type: 'matric',
    province: 'Sindh',
    established: 1979,
    jurisdiction: ['Sukkur District', 'Khairpur', 'District Ghotki'],
    website: 'https://www.bisesukkur.edu.pk'
  },
  {
    id: 'bise-shaheed-benazirabad',
    name: 'Board of Intermediate and Secondary Education, Shaheed Benazirabad',
    type: 'matric',
    province: 'Sindh',
    established: 2015,
    jurisdiction: ['Shaheed Benazirabad District', 'Sanghar District', 'Dadu District', 'Naushahro Feroze District']
  },

  // KHYBER PAKHTUNKHWA
  {
    id: 'bise-abbottabad',
    name: 'Board of Intermediate and Secondary Education, Abbottabad',
    type: 'matric',
    province: 'KPK',
    established: 1990,
    jurisdiction: ['Abbottabad District', 'Mansehra District', 'Haripur District', 'Upper Kohistan District', 'Lower Kohistan District', 'Torghar District', 'Battagram District'],
    website: 'https://www.biseabbottabad.edu.pk'
  },
  {
    id: 'bise-bannu',
    name: 'Board of Intermediate and Secondary Education, Bannu',
    type: 'matric',
    province: 'KPK',
    established: 1990,
    jurisdiction: ['Bannu Division'],
    website: 'https://www.bisebannu.edu.pk'
  },
  {
    id: 'bise-dik',
    name: 'Board of Intermediate and Secondary Education, Dera Ismail Khan',
    type: 'matric',
    province: 'KPK',
    established: 2006,
    jurisdiction: ['Dera Ismail Khan Division'],
    website: 'https://www.bisedik.edu.pk'
  },
  {
    id: 'bise-kohat',
    name: 'Board of Intermediate and Secondary Education, Kohat',
    type: 'matric',
    province: 'KPK',
    established: 2002,
    jurisdiction: ['Kohat Division'],
    website: 'https://www.bisekohat.edu.pk'
  },
  {
    id: 'bise-malakand',
    name: 'Board of Intermediate and Secondary Education, Malakand',
    type: 'matric',
    province: 'KPK',
    established: 1961,
    jurisdiction: ['Swat District', 'Malakand District', 'Upper Dir District', 'Lower Dir District', 'Bajaur District'],
    website: 'https://www.bisemalakand.edu.pk'
  },
  {
    id: 'bise-mardan',
    name: 'Board of Intermediate and Secondary Education, Mardan',
    type: 'matric',
    province: 'KPK',
    established: 1975,
    jurisdiction: ['Mardan District', 'Swabi District', 'Nowshera District'],
    website: 'https://www.bisemardan.edu.pk'
  },
  {
    id: 'bise-peshawar',
    name: 'Board of Intermediate and Secondary Education, Peshawar',
    type: 'matric',
    province: 'KPK',
    established: 1961,
    jurisdiction: ['Peshawar District', 'Charsadda District', 'Upper Chitral District', 'Lower Chitral District', 'Khyber District'],
    website: 'https://www.bisep.edu.pk'
  },
  {
    id: 'bise-swat',
    name: 'Board of Intermediate and Secondary Education, Swat',
    type: 'matric',
    province: 'KPK',
    established: 1992,
    jurisdiction: ['Swat District', 'Shangla District', 'Buner District'],
    website: 'https://www.biseswat.edu.pk'
  },

  // BALOCHISTAN
  {
    id: 'bise-quetta',
    name: 'Board of Intermediate and Secondary Education, Quetta',
    type: 'matric',
    province: 'Balochistan',
    established: 1976,
    jurisdiction: ['Quetta Division', 'Zhob Division', 'Sibi Division', 'Loralai Division', 'Nasirabad Division'],
    website: 'https://www.bisebalochistan.edu.pk'
  },
  {
    id: 'bise-khuzdar',
    name: 'Board of Intermediate and Secondary Education, Khuzdar',
    type: 'matric',
    province: 'Balochistan',
    established: 2020,
    jurisdiction: ['Kalat Division']
  },
  {
    id: 'bise-turbat',
    name: 'Board of Intermediate and Secondary Education, Turbat',
    type: 'matric',
    province: 'Balochistan',
    established: 2020,
    jurisdiction: ['Makran Division', 'Rakhshan Division']
  },

  // AZAD JAMMU AND KASHMIR
  {
    id: 'bise-mirpur-ajk',
    name: 'Board of Intermediate and Secondary Education, Mirpur (AJK)',
    type: 'matric',
    province: 'AJK',
    established: 1973,
    jurisdiction: ['Azad Jammu and Kashmir'],
    website: 'https://www.bisemirpur.edu.pk'
  },

  // O-LEVELS BOARDS
  {
    id: 'cambridge-o-levels',
    name: 'Cambridge International Examinations (O Levels)',
    type: 'o_level',
    province: 'Islamabad', // Available nationwide
    established: 1858,
    jurisdiction: ['Pakistan (National)'],
    website: 'https://www.cambridgeinternational.org'
  },
  {
    id: 'edexcel-o-levels',
    name: 'Edexcel International (O Levels)',
    type: 'o_level',
    province: 'Islamabad', // Available nationwide
    established: 1996,
    jurisdiction: ['Pakistan (National)'],
    website: 'https://qualifications.pearson.com'
  },
  {
    id: 'akueb',
    name: 'Aga Khan University Examination Board',
    type: 'both',
    province: 'Sindh',
    established: 2003,
    jurisdiction: ['Pakistan (National)'],
    website: 'https://www.akueb.edu.pk'
  }
];

// Subject Groups for different education types
export interface SubjectGroup {
  id: string;
  name: string;
  educationType: 'matric' | 'o_level';
  boardType: string[];
  subjects: string[];
  isCompulsory: boolean;
}

export const MATRIC_SUBJECT_GROUPS: SubjectGroup[] = [
  {
    id: 'matric-science',
    name: 'Science Group',
    educationType: 'matric',
    boardType: ['matric', 'both'],
    subjects: [
      'Urdu', 'English', 'Islamiyat', 'Pakistan Studies',
      'Mathematics', 'Physics', 'Chemistry', 'Biology'
    ],
    isCompulsory: false
  },
  {
    id: 'matric-arts',
    name: 'Arts Group',
    educationType: 'matric',
    boardType: ['matric', 'both'],
    subjects: [
      'Urdu', 'English', 'Islamiyat', 'Pakistan Studies',
      'History', 'Geography', 'Economics', 'Civics'
    ],
    isCompulsory: false
  },
  {
    id: 'matric-computer-science',
    name: 'Computer Science Group',
    educationType: 'matric',
    boardType: ['matric', 'both'],
    subjects: [
      'Urdu', 'English', 'Islamiyat', 'Pakistan Studies',
      'Mathematics', 'Physics', 'Chemistry', 'Computer Science'
    ],
    isCompulsory: false
  }
];

export const O_LEVEL_SUBJECT_GROUPS: SubjectGroup[] = [
  {
    id: 'o-level-core',
    name: 'Core Subjects',
    educationType: 'o_level',
    boardType: ['o_level', 'both'],
    subjects: [
      'English Language', 'Mathematics', 'Urdu', 'Islamiyat', 'Pakistan Studies'
    ],
    isCompulsory: true
  },
  {
    id: 'o-level-sciences',
    name: 'Science Subjects',
    educationType: 'o_level',
    boardType: ['o_level', 'both'],
    subjects: [
      'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Environmental Management'
    ],
    isCompulsory: false
  },
  {
    id: 'o-level-humanities',
    name: 'Humanities & Social Sciences',
    educationType: 'o_level',
    boardType: ['o_level', 'both'],
    subjects: [
      'History', 'Geography', 'Economics', 'Business Studies', 'Sociology'
    ],
    isCompulsory: false
  },
  {
    id: 'o-level-languages',
    name: 'Languages',
    educationType: 'o_level',
    boardType: ['o_level', 'both'],
    subjects: [
      'French', 'Arabic', 'German', 'Chinese', 'Spanish'
    ],
    isCompulsory: false
  },
  {
    id: 'o-level-arts',
    name: 'Arts & Creative',
    educationType: 'o_level',
    boardType: ['o_level', 'both'],
    subjects: [
      'Art & Design', 'Music', 'Drama', 'Media Studies'
    ],
    isCompulsory: false
  }
];

// Grade levels for different education types
export const GRADE_LEVELS = {
  matric: [
    { id: 'grade-6', name: 'Grade 6', level: 6 },
    { id: 'grade-7', name: 'Grade 7', level: 7 },
    { id: 'grade-8', name: 'Grade 8', level: 8 },
    { id: 'grade-9', name: 'Grade 9', level: 9 },
    { id: 'grade-10', name: 'Grade 10 (Matric)', level: 10 }
  ],
  o_level: [
    { id: 'o1', name: 'O Level Year 1', level: 9 },
    { id: 'o2', name: 'O Level Year 2', level: 10 },
    { id: 'o3', name: 'O Level Year 3', level: 11 }
  ]
};
