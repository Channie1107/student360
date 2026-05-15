export interface DBSubject {
  name: string;
  grade: string;
  score: number;
}

export interface DBBehaviorLog {
  id?: string;
  date: string;
  type: string;
  note: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface DBAchievement {
  id?: string;
  title: string;
  date: string;
  icon: string;
  category?: string;
  tier?: string;
  evidenceLabel?: string;
  hasEvidence?: boolean;
}

export interface DBStudent {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  studentId: string;
  gender: 'Male' | 'Female';
  dob: string;
  nationality: string;
  email: string;
  phone: string;
  busRoute: string;
  medicalNotes: string;
  attendance: number;
  excusedAbsences: number;
  unexcusedAbsences: number;
  
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  gpa: number;
  gpaHistory: { term: string; gpa: number }[];
  attendanceHistory: { month: string; rate: number }[];
  subjects: DBSubject[];
  behaviorLogs: DBBehaviorLog[];
  achievements: DBAchievement[];
  status: 'On Track' | 'Monitor' | 'At Risk' | 'Critical';
  
  // Relational IDs
  gradeId: string;
  classId: string;
  academicYear: string;
}

const FIRST_NAMES_M = ['James', 'Oliver', 'Marcus', 'Aiden', 'Noah', 'Lucas', 'Ethan', 'Benjamin', 'Samuel', 'David', 'Carlos', 'Ryo'];
const FIRST_NAMES_F = ['Evelyn', 'Sophia', 'Leila', 'Amara', 'Zara', 'Priya', 'Isabella', 'Fatima', 'Chloe', 'Mei', 'Anya', 'Nadia'];
const LAST_NAMES = ['Harper', 'Pemberton', 'Chen', 'Okafor', 'Rostami', 'Fitzgerald', 'Diallo', 'Marchetti', 'Al-Mansouri', 'Thornton', 'Sharma', 'Williams', 'Torres', 'Tanaka', 'Scott', 'Dubois', 'Adeyemi', 'Zhang', 'Mendoza', 'Petrov', 'Kim', 'Hassan', 'Andersen'];
const NATIONALITIES = ['British', 'Australian', 'Singaporean', 'Japanese', 'Nigerian', 'Iranian', 'Irish', 'Senegalese', 'Italian', 'Emirati', 'Indian', 'American', 'Spanish', 'Moroccan', 'Canadian', 'French', 'Chinese', 'Mexican', 'Russian', 'Korean', 'Egyptian', 'Danish'];
const COLORS = ['#7c3aed', '#0891b2', '#0f766e', '#be185d', '#15803d', '#b45309', '#1d4ed8', '#9d174d', '#c2410c', '#6d28d9', '#0369a1'];

function createSeededRng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return function seededRandom() {
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    h += h << 5;
    return ((h >>> 0) % 1000000) / 1000000;
  };
}

function randomChoiceSeeded<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randomIntSeeded(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function buildClass11ASubjectScores(index: number) {
  const baseSets = [
    [73, 71, 72, 74, 72],
    [78, 76, 77, 75, 76],
    [68, 66, 69, 67, 68],
    [75, 73, 74, 72, 73],
    [80, 78, 79, 77, 78],
    [92, 90, 93, 91, 92],
    [96, 94, 97, 95, 96],
    [91, 89, 92, 90, 91],
    [94, 92, 95, 93, 94],
    [97, 95, 98, 96, 97],
    [93, 91, 94, 92, 93],
    [95, 93, 96, 94, 95],
    [92, 90, 93, 91, 92],
    [96, 94, 97, 95, 96],
    [90, 88, 91, 89, 90],
    [97, 95, 98, 96, 97],
    [93, 91, 94, 92, 93],
    [89, 87, 90, 88, 89],
    [94, 92, 95, 93, 94],
    [96, 94, 97, 95, 96],
    [91, 89, 92, 90, 91],
    [93, 91, 94, 92, 93],
    [95, 93, 96, 94, 95],
  ];

  return baseSets[index] ?? [94, 92, 95, 93, 94];
}

function getClass11ARiskProfile(index: number) {
  const riskProfiles: Record<number, { attendance: number; gpaOverride: number; status: DBStudent['status'] }> = {
    0: { attendance: 78, gpaOverride: 2.86, status: 'At Risk' },
    1: { attendance: 84, gpaOverride: 3.02, status: 'Monitor' },
    2: { attendance: 76, gpaOverride: 2.74, status: 'Critical' },
    3: { attendance: 88, gpaOverride: 2.96, status: 'At Risk' },
    4: { attendance: 81, gpaOverride: 3.08, status: 'Monitor' },
  };

  return riskProfiles[index] ?? null;
}

function generateStudents(): DBStudent[] {
  const students: DBStudent[] = [];
  let stuCounter = 10000;
  const rng = createSeededRng('student360-mockdb-v1');

  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const classLetters = ['A', 'B', 'C'];
  
  grades.forEach((grade) => {
    classLetters.forEach((letter) => {
      const className = `${grade}${letter}`;
      // 20-25 students per class, with Class 11A pinned to the requested roster size.
      const numStudents = className === '11A' ? 23 : randomIntSeeded(rng, 20, 25);
      
      for (let i = 0; i < numStudents; i++) {
          const isMale = rng() > 0.5;
          const firstName = isMale ? randomChoiceSeeded(FIRST_NAMES_M, rng) : randomChoiceSeeded(FIRST_NAMES_F, rng);
          const lastName = randomChoiceSeeded(LAST_NAMES, rng);
          const name = `${firstName} ${lastName}`;
          const initials = `${firstName[0]}${lastName[0]}`;
          
          const parentName = `${randomChoiceSeeded(isMale ? FIRST_NAMES_F : FIRST_NAMES_M, rng)} ${lastName}`;
          const parentPhone = `+84 ${randomIntSeeded(rng, 100000000, 999999999)}`;
          const parentEmail = `${parentName.toLowerCase().replace(' ', '.')}@example.com`;
          
          const isClass11A = className === '11A';
          const subjectScores = isClass11A
            ? buildClass11ASubjectScores(i)
            : [
                Math.max(68, Math.min(98, 82 + Math.floor(rng() * 12))),
                Math.max(68, Math.min(98, 80 + Math.floor(rng() * 14))),
                Math.max(68, Math.min(98, 81 + Math.floor(rng() * 12))),
                Math.max(68, Math.min(98, 79 + Math.floor(rng() * 15))),
                Math.max(68, Math.min(98, 80 + Math.floor(rng() * 13))),
              ];

          const averageScore = subjectScores.reduce((sum, score) => sum + score, 0) / subjectScores.length;
          const class11ARiskProfile = isClass11A ? getClass11ARiskProfile(i) : null;
          const gpa = Number((class11ARiskProfile?.gpaOverride ?? (averageScore / 25)).toFixed(2));
          
          let status: DBStudent['status'] = 'On Track';
          if (gpa < 2.8) status = 'Critical';
          else if (gpa < 3.0) status = 'At Risk';
          else if (gpa < 3.3) status = 'Monitor';
          if (class11ARiskProfile) {
            status = class11ARiskProfile.status;
          }

          const attendance = isClass11A
            ? (class11ARiskProfile?.attendance ?? Math.min(100, 95 + (i % 4)))
            : Math.min(100, Math.max(78, Math.round(88 + (gpa - 3.0) * 6 + Math.floor(rng() * 5 - 2))));
          
          const totalDays = 180;
          const missingDays = Math.round(totalDays * (100 - attendance) / 100);
          const unexcusedAbsences = Math.floor(missingDays * rng() * 0.4); // max 40% of absences are unexcused
          const excusedAbsences = missingDays - unexcusedAbsences;
          
          students.push({
            id: `stu-${stuCounter}`,
            name,
            initials,
            avatarBg: randomChoiceSeeded(COLORS, rng),
            studentId: `PRE${stuCounter}`,
            gender: isMale ? 'Male' : 'Female',
            dob: `${randomIntSeeded(rng, 1, 28)}/${randomIntSeeded(rng, 1, 12)}/200${18 - parseInt(grade)}`,
            nationality: randomChoiceSeeded(NATIONALITIES, rng),
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@olympiaschools.edu`,
            phone: `+971 5${randomIntSeeded(rng, 0, 9)} ${randomIntSeeded(rng, 100, 999)} ${randomIntSeeded(rng, 1000, 9999)}`,
            busRoute: `Route ${randomIntSeeded(rng, 1, 15)}`,
            medicalNotes: rng() > 0.8 ? 'Needs attention' : 'No known conditions',
            attendance,
            excusedAbsences,
            unexcusedAbsences,
            gpa,
            gpaHistory: [
              { term: `Term 1`, gpa: Number(Math.max(2.0, Math.min(4.0, gpa + (rng() * 0.2 - 0.1))).toFixed(2)) },
              { term: `Term 2`, gpa },
            ],
            attendanceHistory: [
              { month: 'Aug', rate: Math.min(100, attendance + 2) },
              { month: 'Sep', rate: Math.min(100, attendance) },
              { month: 'Oct', rate: Math.min(100, attendance - 1) },
              { month: 'Nov', rate: Math.min(100, attendance + 1) },
              { month: 'Dec', rate: Math.min(100, attendance) },
            ],
            subjects: [
              { name: 'Mathematics HL', grade: subjectScores[0] >= 90 ? 'A' : subjectScores[0] >= 80 ? 'B' : 'C', score: subjectScores[0] },
              { name: 'English A HL', grade: subjectScores[1] >= 90 ? 'A' : subjectScores[1] >= 80 ? 'B' : 'C', score: subjectScores[1] },
              { name: 'Physics SL', grade: subjectScores[2] >= 90 ? 'A' : subjectScores[2] >= 80 ? 'B' : 'C', score: subjectScores[2] },
              { name: 'Chemistry SL', grade: subjectScores[3] >= 90 ? 'A' : subjectScores[3] >= 80 ? 'B' : 'C', score: subjectScores[3] },
              { name: 'History HL', grade: subjectScores[4] >= 90 ? 'A' : subjectScores[4] >= 80 ? 'B' : 'C', score: subjectScores[4] },
            ],
            behaviorLogs:
              isClass11A && i < 4
                ? [
                    {
                      id: `beh-${stuCounter}-${i}`,
                      date: '12/05/2026',
                      type: i === 0 ? 'Late Arrival' : i === 1 ? 'Uniform Check' : i === 2 ? 'Late Submission' : 'Class Conduct',
                      note:
                        i === 0
                          ? 'Arrived 15 minutes late to homeroom.'
                          : i === 1
                            ? 'Uniform correction logged at morning gate.'
                            : i === 2
                              ? 'Submitted classwork after deadline.'
                              : 'Disruptive talking during independent study.',
                      severity: i === 0 ? 'warning' : i === 1 ? 'info' : 'warning',
                    },
                  ]
                : [],
            achievements:
              className === '11A' && i < 3
                ? [
                    {
                      id: `ach-${stuCounter}-${i}`,
                      title:
                        i === 0
                          ? '1st Place - National Physics Olympiad'
                          : i === 1
                            ? 'Gold Medal - Interclass Football Cup'
                            : 'Community Service Commendation',
                      date:
                        i === 0
                          ? 'May 2026'
                          : i === 1
                            ? 'Apr 2026'
                            : 'Mar 2026',
                      icon: 'TrophyIcon',
                      category: i === 1 ? 'Sports' : i === 2 ? 'Community' : 'Academic',
                      tier: i === 0 ? 'National' : i === 1 ? 'Class' : 'School',
                      evidenceLabel: 'View Evidence (PDF)',
                      hasEvidence: true,
                    },
                  ]
                : [],
            status,
            parentName,
            parentPhone,
            parentEmail,
            gradeId: grade,
            classId: className,
            academicYear: '25-26',
          });
          
          stuCounter++;
        }
      });
    });
  
  return students;
}

export const MockDB = {
  students: generateStudents(),
  grades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  classes: ['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C', '5A', '5B', '5C', '6A', '6B', '6C', '7A', '7B', '7C', '8A', '8B', '8C', '9A', '9B', '9C', '10A', '10B', '10C', '11A', '11B', '11C', '12A', '12B', '12C'],
  academicYears: ['24-25', '25-26'],
};
