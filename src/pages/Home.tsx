import { Flex, Grid, Icon, IconButton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { MdHowToReg, MdOutlineChecklist } from 'react-icons/md';
import { RiSuitcaseLine, RiTeamLine } from 'react-icons/ri';
import { SiMicrosoftteams } from 'react-icons/si';
import { Link } from 'react-router-dom';
import {
  LabelList,
  LabelProps,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from 'recharts';
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
interface IChartData {
  date: string;
  primaryValue: number;
  secondaryValue: number;
}

export default function Home() {
  const { office, updateUser, user } = useAuth();
  const [resumeOffice, setResumeOffice] = useState({} as IResumeOffice);
  const [chartData, setChartData] = useState<IChartData[]>([]);

  const [hoverData, setHoverData] = useState<IChartData | null>(null);

  const [permissionBirthDates, setPermissionBirthDates] = useState(
    [] as PermissionByIdDTO[]
  );
  const [voterBirthDates, setVoterBirthDates] = useState([] as VoterDTO[]);

  async function getResumeOffice() {
    try {
      const response = await api.get(`/dashboard/resume-office/${office?.id}`);
      setResumeOffice(response.data);
    } catch (error) {}
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const handleMouseHover = (data: any) => {
    if (data && data.activePayload) {
      setHoverData(data.activePayload[0].payload);
    }
  };
  const CustomizedLabel: React.FC<LabelProps> = ({ x, y, value }) => {
    if (typeof x !== 'number' || typeof y !== 'number' || value === undefined) {
      return null;
    }
    return (
      <g>
        <text x={x} y={y - 10} fill="#000" textAnchor="middle">
          {value}
        </text>
      </g>
    );
  };

  const renderCustomizedLabel: (props: LabelProps) => JSX.Element | null = (
    props
  ) => {
    const { x, y, value } = props;

    if (typeof x !== 'number' || typeof y !== 'number' || value === undefined) {
      return null;
    }

    return (
      <text x={x} y={y - 10} fill="#BEBEBE" textAnchor="middle">
        {value}
      </text>
    );
  };

  async function getChartData() {
    try {
      const response = await api.get(`/dashboard/graph/${office?.id}`);
      setChartData(response.data);

      setHoverData(response.data[response.data.length - 1]);
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
      getChartData();
    }
  }, [office?.id]);
  useEffect(() => {}, []);

  console.log('chartData', chartData);

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
              {permissionBirthDates.length === 0 &&
                voterBirthDates.length === 0 && (
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
                      to={`https://wa.me/55${voter?.cellphone}/?text=Olá, ${voter?.name}! Aqui é do Gabinete do ${office.owner_position} ${office?.name}. Gostaria de desejar um feliz aniversário!`}
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
          </Flex>
          <Flex
            borderRadius="8px"
            boxShadow="1px 2px 17px rgba(0, 0, 0, 0.2), 14px 1px 250px rgba(0, 0, 0, 0.06)"
            background="white"
            height="100%"
            width="100%"
            display="flex"
            flexDirection="column"
            bg="pink"
          >
            <Flex
              margin="20px 0px"
              height="20px"
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontWeight="600" fontSize="20px" color="#718096">
                Evolução do Gabinete
              </Text>
            </Flex>
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px={10}
              pb={2}
            >
              <Flex alignItems="center">
                {hoverData && (
                  <>
                    <Text
                      fontFamily="Inter"
                      fontSize="20px"
                      lineHeight="30px"
                      color="#525B72"
                      mr="10px"
                    >
                      {new Date(hoverData.date).toLocaleString('pt-BR', {
                        month: 'short',
                      })}{' '}
                      {new Date(hoverData.date).getFullYear()}
                    </Text>
                    <Text
                      fontFamily="Inter"
                      fontWeight="500"
                      fontSize="20px"
                      lineHeight="30px"
                      color="#2D3648"
                    >
                      - {hoverData.primaryValue} eleitores
                    </Text>
                    <Text
                      fontFamily="Inter"
                      fontWeight="500"
                      fontSize="20px"
                      lineHeight="30px"
                      color="#2D3648"
                      ml="10px"
                    >
                      - {hoverData.secondaryValue} tarefas
                    </Text>
                  </>
                )}
              </Flex>
            </Flex>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 80,
                  right: 30,
                  left: 30,
                  bottom: 0,
                }}
                onMouseMove={handleMouseHover}
              >
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: '12px',
                    fontFamily: 'Inter',
                    fill: '#2D3648',
                  }}
                  padding={{ left: 10, right: 0 }}
                  tickLine={false}
                  interval={0}
                  tickFormatter={(date: string) => {
                    const [year, month, day] = date.split('-');
                    const dateObj = new Date(
                      parseInt(year),
                      parseInt(month) - 1,
                      parseInt(day)
                    );
                    return `${dateObj.toLocaleString('pt-BR', {
                      month: 'short',
                    })}/${dateObj.getFullYear()}`;
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="primaryValue"
                  stroke="#BEBEBE"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#BEBEBE', strokeWidth: 0 }}
                  activeDot={{ r: 8, fill: '#BEBEBE' }}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="primaryValue"
                    position="top"
                    fill="#BEBEBE"
                    style={{ fontSize: '12px', fontWeight: 'bold' }}
                    content={<CustomizedLabel />}
                  />
                </Line>

                <Line
                  type="monotone"
                  dataKey="secondaryValue"
                  stroke="#00A39C"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#00A39C', strokeWidth: 0 }}
                  activeDot={{ r: 8, fill: '#00A39C' }}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="secondaryValue"
                    position="top"
                    fill="#00A39C"
                    style={{ fontSize: '12px', fontWeight: 'bold' }}
                    content={<CustomizedLabel />}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </Flex>
        </Flex>
      </Flex>
    </HeaderSideBar>
  );
}
