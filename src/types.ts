export type RelationshipStatusValue = 'Single' | 'In a relationship' | 'Married' | 'Complicated' | 'It\'s complicated';

export interface FormData {
  institutionName: string;
  associationName: string;
  chapter: string;
  year: string;
  surname: string;
  firstName: string;
  middleName: string;
  nickname: string;
  stateOfOrigin: string;
  relationshipStatus: RelationshipStatusValue;
  dateOfBirth: string;
  socialMediaHandle: string;

  // Template A specific
  skillsAndHobbies?: string;
  favoriteCourse?: string;
  bestLevel?: string;
  favoriteLecturer?: string;
  mostChallengingLevel?: string;
  bestMemorableMoment?: string;
  adviceForFreshers?: string;
  favoriteQuote?: string;
  className?: string;
  finalYearInOneWord?: string;
  mostChallengingCourse?: string;
  alternativeCareer?: string;
  bestClassBuddy?: string;
  footerOrgName?: string;
  specialization?: 'SWD' | 'NCC' | '';

  // Template B specific
  difficultLevel?: string;
  bestCourse?: string;
  worseCourse?: string;
  favouriteLecturerB?: string;
  postHeld?: string;
  favouriteWord?: string;
  hobby?: string;
  classCrush?: string;
  bestExperienceOnCampus?: string;
  whatNextAfterSchool?: string;
  businessSkill?: string;
  socialDirectorName?: string;
  ledByName?: string;
}

export type TemplateId = 'A' | 'B';

export interface TemplateProps {
  data: FormData;
  photoUrl: string | null;
  photoZoom: number;
  photoPosition: { x: number; y: number };
}
