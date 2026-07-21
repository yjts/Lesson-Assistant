export const grades = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export const standardsCatalogMeta = Object.freeze({
  framework: "California History-Social Science Content Standards",
  jurisdiction: "California",
  contentStandardsSourceUrl: "https://www.cde.ca.gov/ci/hs/cf/documents/hssappendixc.pdf",
  frameworkSourceUrl: "https://www.cde.ca.gov/ci/hs/cf/hssframework.asp",
  contentStandardsAdopted: "October 1998",
  frameworkAdopted: "July 14, 2016",
  sourcePageLastReviewed: "November 6, 2025",
  sourceCheckedAt: "2026-07-21",
  descriptionPolicy: "Locally shortened summaries; consult the official source for complete standard text.",
  catalogVersion: "source-checked-2026-07-21",
  lastReviewed: null,
  educatorVerified: false
});

export const subjects = ["U.S. History", "World History", "American Government", "Economics", "World Geography"];

export const subjectsByGrade = Object.freeze({
  "Grade 6": ["World History"],
  "Grade 7": ["World History"],
  "Grade 8": ["U.S. History"],
  "Grade 9": ["World Geography"],
  "Grade 10": ["World History"],
  "Grade 11": ["U.S. History"],
  "Grade 12": ["American Government", "Economics"]
});

export function getSubjects(grade) {
  return [...(subjectsByGrade[grade] || [])];
}

export const powerSkills = [
  "Chronological Thinking", "Cause and Effect", "Change Over Time", "Historical Perspective",
  "Source Analysis", "Evidence-Based Claims", "Citizenship", "Civic Participation",
  "Rights and Responsibilities", "Discussion and Debate", "Argumentation"
];

const practiceStandards = {
  middle: [
    ["CA HSS 6-8 CST", "Chronological and spatial thinking"],
    ["CA HSS 6-8 REPV", "Research, evidence, and point of view"],
    ["CA HSS 6-8 HI", "Historical interpretation"]
  ],
  high: [
    ["CA HSS 9-12 CST", "Chronological and spatial thinking"],
    ["CA HSS 9-12 REPV", "Historical research, evidence, and point of view"],
    ["CA HSS 9-12 HI", "Historical interpretation"]
  ]
};

const gradeStandards = {
  "Grade 6": [["CA HSS 6.1", "Early humankind and development of societies"], ["CA HSS 6.2", "Mesopotamia, Egypt, and Kush"], ["CA HSS 6.3", "Ancient Hebrews"], ["CA HSS 6.4", "Ancient Greece"], ["CA HSS 6.5", "Ancient India"], ["CA HSS 6.6", "Ancient China"], ["CA HSS 6.7", "Ancient Rome"]],
  "Grade 7": [["CA HSS 7.1", "Fall of Rome"], ["CA HSS 7.2", "Islamic civilizations"], ["CA HSS 7.3", "China in the Middle Ages"], ["CA HSS 7.4", "Sub-Saharan Africa"], ["CA HSS 7.5", "Medieval Japan"], ["CA HSS 7.6", "Medieval Europe"], ["CA HSS 7.7", "Mesoamerican and Andean civilizations"], ["CA HSS 7.8", "Renaissance"], ["CA HSS 7.9", "Reformation"], ["CA HSS 7.10", "Scientific Revolution"], ["CA HSS 7.11", "Political and economic change"]],
  "Grade 8": [["CA HSS 8.1", "Founding principles and the American Revolution"], ["CA HSS 8.2", "Political principles of the Constitution"], ["CA HSS 8.3", "Early Republic"], ["CA HSS 8.4", "Aspirations and ideals of the new nation"], ["CA HSS 8.5", "U.S. foreign policy in the early Republic"], ["CA HSS 8.6", "Divergent paths of the American people"], ["CA HSS 8.7", "Westward expansion"], ["CA HSS 8.8", "Sectionalism"], ["CA HSS 8.9", "Civil War"], ["CA HSS 8.10", "Reconstruction"], ["CA HSS 8.11", "Industrialization and immigration"], ["CA HSS 8.12", "Political, economic, and social transformation"]],
  "Grade 9": [],
  "Grade 10": [["CA HSS 10.1", "Development of Western political ideas"], ["CA HSS 10.2", "Democratic revolutions"], ["CA HSS 10.3", "Industrial Revolution"], ["CA HSS 10.4", "Imperialism and colonialism"], ["CA HSS 10.5", "First World War"], ["CA HSS 10.6", "Totalitarianism"], ["CA HSS 10.7", "Second World War"], ["CA HSS 10.8", "International developments after World War II"], ["CA HSS 10.9", "Nation-building in the contemporary world"], ["CA HSS 10.10", "Cold War"], ["CA HSS 10.11", "Global integration and challenges"]],
  "Grade 11": [["CA HSS 11.1", "Founding ideals and constitutional principles"], ["CA HSS 11.2", "Industrialization, immigration, and urbanization"], ["CA HSS 11.3", "Religion and social reform"], ["CA HSS 11.4", "United States as a world power"], ["CA HSS 11.5", "The 1920s"], ["CA HSS 11.6", "Great Depression and New Deal"], ["CA HSS 11.7", "World War II"], ["CA HSS 11.8", "Postwar economic and social change"], ["CA HSS 11.9", "Foreign policy after World War II"], ["CA HSS 11.10", "Civil rights and voting rights"], ["CA HSS 11.11", "Contemporary domestic issues"]]
};

const grade12 = {
  government: Array.from({ length: 10 }, (_, index) => [`CA HSS 12.${index + 1}`, ["Foundations of American democracy", "Natural rights and constitutional government", "Constitution and governmental institutions", "Federal, state, and local government", "Political parties, campaigns, and elections", "Civil society and participation", "Federal powers and responsibilities", "Media and political communication", "Comparative political systems", "Tensions in constitutional democracy"][index]]),
  economics: Array.from({ length: 6 }, (_, index) => [`CA HSS 12.${index + 1}`, ["Common economic terms and concepts", "Market economy", "Role of government in the economy", "Labor market", "National economy", "International economy"][index]])
};

export function getStandards(grade, subject) {
  if (!getSubjects(grade).includes(subject)) return [];
  if (grade === "Grade 12") {
    const content = subject === "Economics" ? grade12.economics : grade12.government;
    return [...content, ...practiceStandards.high];
  }
  const practices = ["Grade 6", "Grade 7", "Grade 8"].includes(grade) ? practiceStandards.middle : practiceStandards.high;
  return [...(gradeStandards[grade] || []), ...practices];
}

export function hasStandard(grade, subject, code) {
  return getStandards(grade, subject).some(([standardCode]) => standardCode === code);
}
