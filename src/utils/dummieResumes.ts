interface Education {
  institution: string;
  course: string;
  start: string;
  end: string;
  degree: string;
}

interface Experience {
  company: string;
  area: string;
  role: string;
  isCurrentJob: boolean;
  description?: string;
  start: string;
  end: string;
}

export interface Resume {
  education: Education[];
  experiences: Experience[];
  name: string;
  phone: string;
  age: number;
  totalExperience?: number;
}

export const dummieResumes: Resume[] = [
  {
    name: 'John Doe',
    phone: '123456789a',
    age: 25,
    totalExperience: 3,
    education: [
      {
        institution: 'University of California',
        course: 'Computer Science',
        start: '2015',
        end: '2019',
        degree: 'Ensino Médio',
      },
    ],
    experiences: [
      {
        company: 'Google',
        area: 'Software Engineering',
        role: 'Software Engineer',
        isCurrentJob: true,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl vitae aliquam ultricies, nunc nunc aliquet nunc, vitae aliquam nunc nunc vitae nunc. Donec euismod, nisl vitae aliquam ultricies, nunc nunc aliquet nunc, vitae aliquam nunc nunc vitae nunc.',
        start: '2019',
        end: 'Present',
      },
    ],
  },
  {
    name: 'Jared Dunn',
    phone: '123456789',
    age: 25,
    totalExperience: 6,
    education: [
      {
        institution: 'USP',
        course: 'letras',
        start: '2018',
        end: '2020',
        degree: 'Mestrado',
      },
    ],
    experiences: [
      {
        company: 'Meta',
        area: 'Almoxarifado',
        role: 'Zelador',
        isCurrentJob: false,
        description: 'algum text descritivo.',
        start: '2019',
        end: 'Present',
      },
    ],
  },
];
