import { Flex, Grid, Icon, Text } from '@chakra-ui/react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { MdHowToReg, MdOutlineChecklist } from 'react-icons/md';
import { RiSuitcaseLine } from 'react-icons/ri';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useEffect, useState } from 'react';

interface IResumeOffice {
  role: number;
  task: number;
  user: number;
  voter: number;
}

export default function Home() {
  const { office, updateUser, user } = useAuth();
  const [resumeOffice, setResumeOffice] = useState({} as IResumeOffice);

  async function getResumeOffice() {
    try {
      const response = await api.get(`/dashboard/resume-office/${office?.id}`);
      setResumeOffice(response.data);
    } catch (error) {}
  }

  useEffect(() => {
    if (office?.id) {
      getResumeOffice();
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
          height="270px"
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
              fontSize={{ base: '16px', md: '22px' }}
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
              fontSize={{ base: '16px', md: '22px' }}
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
              fontSize={{ base: '16px', md: '22px' }}
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
              fontSize={{ base: '16px', md: '22px' }}
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

        {/* <Flex
          background="green"
          height="100%"
          width="100%"
          gap="10px"
          direction={{ base: 'column', md: 'row' }}
        >
          <Flex
            background="blue"
            height="100%"
            width={{ base: '100%', md: 'calc(33.333% - 10px)' }}
          ></Flex>
          <Flex
            background="gray"
            height="100%"
            width={{ base: '100%', md: 'calc(33.333% - 10px)' }}
          ></Flex>
          <Flex
            background="yellow"
            height="100%"
            width={{ base: '100%', md: 'calc(33.333% - 10px)' }}
            display="flex"
            flexDirection="column"
            gap="10px"
          >
            <Flex background="purple" height="100%" width="100%"></Flex>
            <Flex background="purple" height="100%" width="100%"></Flex>
          </Flex>

        </Flex> */}
      </Flex>
    </HeaderSideBar>
  );
}
