import { Flex, Grid, Icon, IconButton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { MdHowToReg, MdOutlineChecklist } from 'react-icons/md';
import { RiSuitcaseLine, RiTeamLine } from 'react-icons/ri';
import { SiMicrosoftteams } from 'react-icons/si';
import { Link } from 'react-router-dom';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { PermissionByIdDTO, VoterDTO } from '../dtos';
import api from '../services/api';

interface IResumeOffice {
  role: number;
  task: number;
  user: number;
  voter: number;
}

export default function Home() {
  const { office, updateUser, user } = useAuth();
  const [resumeOffice, setResumeOffice] = useState({} as IResumeOffice);
  const [permissionBirthDates, setPermissionBirthDates] = useState(
    [] as PermissionByIdDTO[]
  );
  const [voterBirthDates, setVoterBirthDates] = useState([] as VoterDTO[]);

  console.log('vote', voterBirthDates);

  async function getResumeOffice() {
    try {
      const response = await api.get(`/dashboard/resume-office/${office?.id}`);
      setResumeOffice(response.data);
    } catch (error) {}
  }

  async function getBirthDates() {
    try {
      const [permissions, voters] = await Promise.all([
        api.get(`/permission/by-birthdate/${office?.id}`),
        api.get(`/voter/by-birthdate/${office?.id}`),
      ]);
      setPermissionBirthDates(permissions.data);
      setVoterBirthDates(voters.data);
    } catch (error) {}
  }

  useEffect(() => {
    if (office?.id) {
      getResumeOffice();
      getBirthDates();
    }
  }, [office?.id]);

  return (
    <HeaderSideBar>
      <Flex
        background="transparent"
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
      >
        <Grid
          background="transparent"
          height={{ base: '100%', md: '270px' }}
          width="100%"
          gap="10px"
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          display="grid"
          padding="4px"
        >
          <Flex
            position="relative"
            background="white"
            height={{ base: '160px', md: '200px' }}
            width="100%"
            borderRadius="8px"
            boxShadow="1px 2px 17px rgba(0, 0, 0, 0.2), 14px 1px 250px rgba(0, 0, 0, 0.06)"
          >
            <Flex
              position="absolute"
              top="20px"
              right={{ base: '10px', md: '16px' }}
              rounded="50%"
              bgColor={office?.primary_color}
              height={{ base: '40px', md: '40px' }}
              width={{ base: '40px', md: '40px' }}
              justifyContent="center"
              alignItems="center"
            >
              <Icon color="white" fontSize="30px" as={RiSuitcaseLine} />
            </Flex>
            <Text
              fontSize={{ base: '12px', md: '18px' }}
              color="#718096"
              fontWeight="700"
              position="absolute"
              top="20px"
              left={{ base: '10px', md: '16px' }}
            >
              Cargos
            </Text>
            <Text
              color="#48BB78"
              fontWeight="700"
              fontSize="48px"
              position="absolute"
              bottom="10px"
              left={{ base: '10px', md: '16px' }}
            >
              {resumeOffice.role}
            </Text>
          </Flex>
          <Flex
            position="relative"
            background="white"
            height={{ base: '160px', md: '200px' }}
            width="100%"
            borderRadius="8px"
            boxShadow="1px 2px 17px rgba(0, 0, 0, 0.2), 14px 1px 250px rgba(0, 0, 0, 0.06)"
          >
            <Flex
              position="absolute"
              top="20px"
              right={{ base: '10px', md: '16px' }}
              rounded="50%"
              bgColor={office?.primary_color}
              height={{ base: '40px', md: '40px' }}
              width={{ base: '40px', md: '40px' }}
              justifyContent="center"
              alignItems="center"
            >
              <Icon color="white" fontSize="30px" as={AiOutlineUsergroupAdd} />
            </Flex>
            <Text
              fontSize={{ base: '12px', md: '18px' }}
              color="#718096"
              fontWeight="700"
              position="absolute"
              top="20px"
              left={{ base: '10px', md: '16px' }}
            >
              Equipe
            </Text>
            <Text
              color="#48BB78"
              fontWeight="700"
              fontSize="48px"
              position="absolute"
              bottom="10px"
              left={{ base: '10px', md: '16px' }}
            >
              {resumeOffice.user}
            </Text>
          </Flex>
          <Flex
            position="relative"
            background="white"
            height={{ base: '160px', md: '200px' }}
            width="100%"
            borderRadius="8px"
            boxShadow="1px 2px 17px rgba(0, 0, 0, 0.2), 14px 1px 250px rgba(0, 0, 0, 0.06)"
          >
            <Flex
              position="absolute"
              top="20px"
              right={{ base: '10px', md: '16px' }}
              rounded="50%"
              bgColor={office?.primary_color}
              height={{ base: '40px', md: '40px' }}
              width={{ base: '40px', md: '40px' }}
              justifyContent="center"
              alignItems="center"
            >
              <Icon color="white" fontSize="30px" as={MdHowToReg} />
            </Flex>
            <Text
              fontSize={{ base: '12px', md: '18px' }}
              color="#718096"
              fontWeight="700"
              position="absolute"
              top="20px"
              left={{ base: '10px', md: '16px' }}
            >
              Eleitores
            </Text>
            <Text
              color="#48BB78"
              fontWeight="700"
              fontSize="48px"
              position="absolute"
              bottom="10px"
              left={{ base: '10px', md: '16px' }}
            >
              {resumeOffice.voter}
            </Text>
          </Flex>
          <Flex
            position="relative"
            background="white"
            height={{ base: '160px', md: '200px' }}
            width="100%"
            borderRadius="8px"
            boxShadow="1px 2px 17px rgba(0, 0, 0, 0.2), 14px 1px 250px rgba(0, 0, 0, 0.06)"
          >
            <Flex
              position="absolute"
              top="20px"
              right={{ base: '10px', md: '16px' }}
              rounded="50%"
              bgColor={office?.primary_color}
              height={{ base: '40px', md: '40px' }}
              width={{ base: '40px', md: '40px' }}
              justifyContent="center"
              alignItems="center"
            >
              <Icon color="white" fontSize="30px" as={MdOutlineChecklist} />
            </Flex>
            <Text
              fontSize={{ base: '12px', md: '18px' }}
              color="#718096"
              fontWeight="700"
              position="absolute"
              top="20px"
              left={{ base: '10px', md: '16px' }}
            >
              Demandas
            </Text>
            <Text
              color="#48BB78"
              fontWeight="700"
              fontSize="48px"
              position="absolute"
              bottom="10px"
              left={{ base: '10px', md: '16px' }}
            >
              {resumeOffice.task}
            </Text>
          </Flex>
        </Grid>

        <Flex
          marginTop="10px"
          background="white"
          height="100%"
          width="100%"
          gap="10px"
          direction={{ base: 'column', md: 'row' }}
        >
          <Flex
            background="white"
            height="100%"
            width={{ base: '100%', md: 'calc(50% - 5px)' }}
            display="flex"
            flexDirection="column"
            gap="10px"
          >
            <Flex
              borderRadius="8px"
              boxShadow="1px 2px 17px rgba(0, 0, 0, 0.2), 14px 1px 250px rgba(0, 0, 0, 0.06)"
              background="white"
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
            >
              <Flex
                margin="20px 0px"
                height="20px"
                width="100%"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontWeight="600" fontSize="20px" color="#718096">
                  Aniversariantes
                </Text>
              </Flex>
              {!!permissionBirthDates && !!voterBirthDates && (
                <Flex
                  margin="20px 0px"
                  height="40px"
                  width="100%"
                  alignItems="center"
                  justifyContent="start"
                  paddingLeft={{ base: '16px', md: '24px' }}
                >
                  <Text
                    textAlign="center"
                    fontWeight="500"
                    fontSize="16px"
                    color="#718096"
                  >
                    Nenhum aniversariante hoje.
                  </Text>
                </Flex>
              )}
              {permissionBirthDates &&
                permissionBirthDates.map((permission) => (
                  <Flex
                    key={permission.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    padding={{ base: '0 16px', md: '0 24px' }}
                    width="100%"
                  >
                    <Icon color="#718096" fontSize="24" as={RiTeamLine} />

                    <Text
                      textAlign="center"
                      lineHeight="20px"
                      fontWeight="400"
                      fontSize="16px"
                      color="#718096"
                    >
                      {permission?.user?.name}{' '}
                    </Text>
                    <Link
                      target="_blank"
                      to={`https://wa.me/55${permission?.user?.cellphone}`}
                      rel="noopener noreferrer"
                    >
                      <IconButton
                        aria-label="Open alert"
                        variant="unstyled"
                        icon={
                          <Icon
                            cursor="pointer"
                            fontSize="24px"
                            as={IoLogoWhatsapp}
                            color="#718096"
                          />
                        }
                      />
                    </Link>
                  </Flex>
                ))}{' '}
              {voterBirthDates &&
                voterBirthDates.map((voter) => (
                  <Flex
                    key={voter.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    padding={{ base: '0 16px', md: '0 24px' }}
                    width="100%"
                  >
                    <Icon color="#718096" fontSize="24" as={SiMicrosoftteams} />

                    <Text
                      textAlign="center"
                      lineHeight="20px"
                      fontWeight="400"
                      fontSize="16px"
                      color="#718096"
                    >
                      {voter?.name}{' '}
                    </Text>
                    <Link
                      target="_blank"
                      to={`https://wa.me/55${voter?.cellphone}/?text=Olá, ${voter?.name}! Aqui é do Gabinete do Vereador ${office?.name}. Gostaria de desejar um feliz aniversário!`}
                      rel="noopener noreferrer"
                    >
                      <IconButton
                        aria-label="Open alert"
                        variant="unstyled"
                        icon={
                          <Icon
                            cursor="pointer"
                            fontSize="24px"
                            as={IoLogoWhatsapp}
                            color="#718096"
                          />
                        }
                      />
                    </Link>
                  </Flex>
                ))}
            </Flex>
            {/* <Flex
              borderRadius="8px"
              boxShadow="1px 2px 17px rgba(0, 0, 0, 0.2), 14px 1px 250px rgba(0, 0, 0, 0.06)"
              background="white"
              height="100%"
              width="100%"
            ></Flex> */}
          </Flex>
          {/* <Flex
            borderRadius="8px"
            boxShadow="1px 2px 17px rgba(0, 0, 0, 0.2), 14px 1px 250px rgba(0, 0, 0, 0.06)"
            background="white"
            height="100%"
            width={{ base: '100%', md: 'calc(66% - 10px)' }}
          ></Flex> */}
        </Flex>
      </Flex>
    </HeaderSideBar>
  );
}
