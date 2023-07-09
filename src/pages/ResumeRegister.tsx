import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { StateProps } from '../dtos';
import api from '../services/api';
import { arrayOfProfessions } from '../utils/arrayOfProfessions';

interface Education {
  institution: string;
  course: string;
  start: string;
  end: string;
  degree: string;
  [key: string]: string;
}

interface Experience {
  company: string;
  area: string;
  role: string;
  isCurrentJob: boolean;
  description?: string;
  start: string;
  end: string;
  [key: string]: string | boolean | undefined;
}

interface FormValues {
  education: Education[];
  experiences: Experience[];
}

export default function ResumeRegister() {
  const [values, setValues] = useState({} as StateProps);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [verify, setVerify] = useState(true);
  const { office } = useAuth();
  const navigate = useNavigate();
  const [cepLoading, setCepLoading] = useState(false);
  const { id } = useParams();
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isRoleCustom, setIsRoleCustom] = useState(false);
  const [roleCustom, setRoleCustom] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const [curriculum, setCurriculum] = useState<FormValues>({
    education: [
      {
        institution: '',
        course: '',
        start: '',
        end: '',
        degree: '',
      },
    ],
    experiences: [
      {
        area: '',
        company: '',
        role: '',
        isCurrentJob: false,
        description: '',
        start: '',
        end: '',
      },
    ],
  });
  const uniqueAreas = Array.from(
    new Set(arrayOfProfessions.map((profession) => profession.Área))
  );
  const getProfessionsByArea = (area: string | undefined) => {
    return arrayOfProfessions
      .filter((profession) => profession.Área === area)
      .map((profession) => profession.Profissão);
  };

  const rolesForSelectedArea = selectedArea
    ? arrayOfProfessions
        .filter((profession) => profession.Área === selectedArea)
        .map((profession) => profession.Profissão)
    : [];

  const academicDegrees = {
    Fundamental: 'Fundamental',
    Medio: 'Médio',
    Tecnico: 'Técnico',
    Graduacao: 'Graduação',
    PosGraduacao: 'Pós-Graduação',
    Mestrado: 'Mestrado',
    Doutorado: 'Doutorado',
    PosDoutorado: 'Pós-Doutorado',
  };

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setUploadedFile(file);
    setUploadedFileName(file?.name || '');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const verifyVoter = async () => {
    setErrors({});

    setLoading(true);

    try {
      const verifySchema = Yup.object().shape({
        ddd: Yup.string()
          .required('DDD')
          .min(2, 'Dois números.')
          .max(2, 'Dois números.'),
        cellphone: Yup.string()
          .required('Contato')
          .min(8, 'Mínimo de oito números.')
          .max(9, 'Máximo de nove números.'),
      });

      await verifySchema.validate(values, {
        abortEarly: false,
      });

      const response = await api.get(
        `/voter/check/office/${office.id}/cellphone/${values.ddd}${values.cellphone}`
      );

      if (response.data.isVoterExist === false) {
        setVerify(true);
        navigate(`/eleitor/registrar-eleitor/${values.ddd}${values.cellphone}`);
      }
    } catch (err: any) {
      setVerify(false);
    } finally {
      setLoading(false);
    }
  };
  const verifyVoterParam = async () => {
    setErrors({});

    setLoading(true);

    try {
      const response = await api.get(
        `/voter/check/office/${office.id}/cellphone/${values.ddd}${values.cellphone}`
      );
      if (response.data.isVoterExist === false) {
        setVerify(true);
      }
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  function handleAddEducation() {
    setCurriculum({
      ...curriculum,
      education: [
        ...curriculum.education,
        {
          institution: '',
          course: '',
          start: '',
          degree: '',
          end: '',
        },
      ],
    });
  }

  function handleAddExperience() {
    setCurriculum({
      ...curriculum,
      experiences: [
        ...curriculum.experiences,
        {
          area: '',
          company: '',
          role: '',
          description: '',
          start: '',
          isCurrentJob: false,
          end: '',
        },
      ],
    });
  }

  function handleChangeEducation(
    i: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const valuesCopy = { ...curriculum };
    valuesCopy.education[i][event.target.name] = event.target.value;
    setCurriculum(valuesCopy);
  }

  function handleChangeExperience(
    i: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const valuesCopy = { ...curriculum };
    valuesCopy.experiences[i][event.target.name] = event.target.value;

    if (event.target.name === 'role' && isRoleCustom) {
      setRoleCustom(event.target.value);
    }

    setCurriculum(valuesCopy);
  }

  useEffect(() => {
    if (id) {
      setValues({
        ...values,
        ddd: id.substring(0, 2),
        dddMask: id.substring(0, 2),
        cellphone: id.substring(2, id.length),
        cellphoneMask: id.substring(2, id.length),
      });
    }
  }, [id]);

  useEffect(() => {
    if (id && values.ddd && values.cellphone) {
      verifyVoterParam();
    }
  }, [values.ddd, values.cellphone]);

  return (
    <HeaderSideBar backRoute={true}>
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Cadastrar Currículo
      </Text>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 8]} mt={['24px', '40px']} w="852px">
          {verify ? (
            <Flex flexDir={'column'}>
              <Text color={'gray.500'} fontWeight="400" margin="0">
                Telefone*:
              </Text>
              <Flex flexDir={['column', 'row']}>
                <Flex>
                  <PatternFormat
                    customInput={Input}
                    name="ddd"
                    type="text"
                    error={errors?.ddd}
                    value={values?.dddMask}
                    onValueChange={(value) => {
                      setValues({
                        ...values,
                        ddd: value?.value,
                        dddMask: value?.formattedValue,
                      });
                    }}
                    placeholder="DDD"
                    w="72px"
                    mr="8px"
                    borderColor="gray.500"
                    format="##"
                    mask="_"
                  />
                  <PatternFormat
                    customInput={Input}
                    format="#####-####"
                    mask="_"
                    name="cellphone"
                    type="tel"
                    error={errors?.cellphone}
                    value={values?.cellphoneMask}
                    onValueChange={(value) => {
                      setValues({
                        ...values,
                        cellphone: value?.value,
                        cellphoneMask: value?.formattedValue,
                      });
                    }}
                    placeholder="00000-0000"
                    w={['100%', '180px']}
                    borderColor="gray.500"
                  />
                </Flex>
                <Button
                  onClick={verifyVoter}
                  w={['100%', '220px']}
                  ml={['0', '45px']}
                  mt={['12px', '0']}
                >
                  {loading ? <Spinner color="white" /> : 'Verificar'}
                </Button>
              </Flex>
            </Flex>
          ) : (
            <form>
              <Stack spacing={5}>
                <Text
                  fontFamily="Inter"
                  color="#718096"
                  fontWeight="600"
                  fontSize="16px"
                  mb="-8px"
                >
                  Formação Acadêmica
                </Text>
                {curriculum.education.map((education, i) => (
                  <Box key={i}>
                    <Stack spacing={3}>
                      <FormControl id="degree">
                        <FormLabel
                          fontFamily="Inter"
                          color="#718096"
                          fontWeight="400"
                          fontSize="16px"
                        >
                          Grau de formação*
                        </FormLabel>
                        <Select
                          placeholder="Selecionar"
                          value={education.degree}
                          bgColor="gray.50"
                          color="gray.700"
                          borderColor="gray.500"
                          _placeholder={{ color: 'gray.500' }}
                          onChange={(event) => {
                            const valuesCopy = { ...curriculum };
                            valuesCopy.education[i].degree = event.target.value;
                            setCurriculum(valuesCopy);
                          }}
                        >
                          {Object.entries(academicDegrees).map(
                            ([value, label]) => (
                              <option value={value} key={value}>
                                {label}
                              </option>
                            )
                          )}
                        </Select>
                      </FormControl>

                      <Input
                        labelColor={'gray.500'}
                        label="Instituição*"
                        placeholder="Nome da instituição:"
                        name="institution"
                        type="text"
                        value={education.institution}
                        onChange={(event) => handleChangeEducation(i, event)}
                        borderColor="gray.500"
                      />

                      <Flex alignItems="flex-end" flexDir="row" gap={3}>
                        <Input
                          labelColor={'gray.500'}
                          label="Curso*"
                          placeholder="Nome do curso:"
                          name="course"
                          type="text"
                          value={education.course}
                          onChange={(event) => handleChangeEducation(i, event)}
                          borderColor="gray.500"
                        />
                        <Flex gap={3}>
                          <Input
                            label="Data de início*:"
                            labelColor={'gray.500'}
                            placeholder="Start Date"
                            name="start"
                            type="date"
                            value={education.start}
                            onChange={(event) =>
                              handleChangeEducation(i, event)
                            }
                            borderColor="gray.500"
                          />
                          <Input
                            label="Data de conclusão:"
                            labelColor={'gray.500'}
                            placeholder="End Date"
                            name="end"
                            type="date"
                            value={education.end}
                            onChange={(event) =>
                              handleChangeEducation(i, event)
                            }
                            borderColor="gray.500"
                          />
                        </Flex>
                      </Flex>
                    </Stack>
                  </Box>
                ))}
                <Button w={['100%', '220px']} onClick={handleAddEducation}>
                  Adicionar Educação
                </Button>
                {curriculum.experiences.map((experience, i) => (
                  <Box key={i}>
                    <Stack spacing={3}>
                      <Text
                        fontFamily="Inter"
                        color="#718096"
                        fontWeight="600"
                        fontSize="16px"
                        mb="-6px"
                      >
                        Experiência Profissional
                      </Text>
                      <Input
                        label="Empresa*:"
                        labelColor={'gray.500'}
                        placeholder="Nome da empresa"
                        name="company"
                        type="text"
                        value={experience.company}
                        onChange={(event) => handleChangeExperience(i, event)}
                        borderColor="gray.500"
                      />
                      <Flex gap="4px" alignItems="flex-end" flexDir="column">
                        <Flex w="100%" alignItems="flex-end" gap={3}>
                          <Select
                            placeholder="Selecionar área"
                            value={experience.area}
                            bgColor="gray.50"
                            color="gray.700"
                            borderColor="gray.500"
                            _placeholder={{ color: 'gray.500' }}
                            onChange={(event) => {
                              const valuesCopy = { ...curriculum };
                              valuesCopy.experiences[i].area =
                                event.target.value;
                              setCurriculum(valuesCopy);
                            }}
                          >
                            {uniqueAreas.map((area, index) => (
                              <option value={area} key={index}>
                                {area}
                              </option>
                            ))}
                          </Select>

                          {isRoleCustom ? (
                            <Input
                              labelColor={'gray.500'}
                              label="Cargo*:"
                              placeholder="Nome do cargo"
                              name="role"
                              type="text"
                              value={roleCustom}
                              onChange={(event) =>
                                handleChangeExperience(i, event)
                              }
                              borderColor="gray.500"
                            />
                          ) : (
                            <Select
                              placeholder="Selecionar"
                              value={experience.role}
                              bgColor="gray.50"
                              color="gray.700"
                              borderColor="gray.500"
                              _placeholder={{ color: 'gray.500' }}
                              onChange={(event) => {
                                const valuesCopy = { ...curriculum };
                                valuesCopy.experiences[i].role =
                                  event.target.value;
                                setCurriculum(valuesCopy);
                              }}
                            >
                              {getProfessionsByArea(experience.area).map(
                                (profession, index) => (
                                  <option value={index} key={index}>
                                    {profession}
                                  </option>
                                )
                              )}
                            </Select>
                          )}
                        </Flex>
                        <Checkbox
                          isChecked={isRoleCustom}
                          onChange={(e) => setIsRoleCustom(e.target.checked)}
                        >
                          Escrever Profissão
                        </Checkbox>
                      </Flex>
                      <Flex gap="4px" alignItems="flex-end" flexDir="column">
                        <Flex w="100%" gap={3}>
                          <Input
                            label="Início*:"
                            labelColor={'gray.500'}
                            placeholder="Start Date"
                            name="start"
                            type="date"
                            value={experience.start}
                            onChange={(event) =>
                              handleChangeExperience(i, event)
                            }
                            borderColor="gray.500"
                          />
                          {!experience.isCurrentJob && (
                            <Input
                              label="Fim*:"
                              labelColor={'gray.500'}
                              placeholder="End Date"
                              name="end"
                              type="date"
                              value={experience.end}
                              onChange={(event) =>
                                handleChangeExperience(i, event)
                              }
                              borderColor="gray.500"
                            />
                          )}
                        </Flex>
                        <Checkbox
                          isChecked={experience.isCurrentJob}
                          onChange={(event) => {
                            const valuesCopy = { ...curriculum };
                            valuesCopy.experiences[i].isCurrentJob =
                              event.target.checked;
                            setCurriculum(valuesCopy);
                          }}
                        >
                          Emprego atual
                        </Checkbox>
                      </Flex>

                      <Textarea
                        placeholder="Descrição"
                        name="description"
                        value={experience.description || ''}
                        onChange={(event) => handleChangeExperience(i, event)}
                        borderColor="gray.500"
                        height="100px"
                      />
                    </Stack>
                  </Box>
                ))}

                <Button w={['100%', '220px']} onClick={handleAddExperience}>
                  Adicionar Experiência
                </Button>
                <FormControl>
                  <FormLabel
                    fontFamily="Inter"
                    color="#718096"
                    fontWeight="400"
                    fontSize="16px"
                  >
                    Adicionar Arquivo
                  </FormLabel>
                  <InputGroup>
                    <Input
                      placeholder="Nenhum Arquivo Selecionado"
                      isReadOnly
                      value={uploadedFileName || ''}
                      borderColor="gray.500"
                      focusBorderColor="blue.500"
                      onClick={handleClick}
                      name="file-display"
                      onChange={() => {}}
                    />
                    <InputRightElement w="100px"></InputRightElement>
                    <Button ml="40px" w="200px" onClick={handleClick}>
                      Escolher Arquivo
                    </Button>
                  </InputGroup>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </FormControl>
              </Stack>
            </form>
          )}
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
