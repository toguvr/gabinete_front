import { Flex } from '@chakra-ui/react';
import HeaderSideBar from '../components/HeaderSideBar';
import Kanban from '../components/Kanban';

export default function Tarefa() {
  return (
    <HeaderSideBar>
      <Kanban />
    </HeaderSideBar>
  );
}
