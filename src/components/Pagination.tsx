import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, HStack } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

interface PaginationProps {
  totalPages: number;
  perPage?: number;
  currentPage: number;
  onPageChange(currentPage: number): void;
}

const SIBLINGS_COUNT = 1;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => from + index + 1)
    .filter((page) => page > 0);
}

export default function Pagination({
  totalPages,
  currentPage,
  perPage = 5,
  onPageChange,
}: PaginationProps) {
  const { office } = useAuth();

  const lastPage = Math.ceil(totalPages / perPage);
  const isFirst = currentPage === 1;
  const isLast = currentPage === lastPage;

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - SIBLINGS_COUNT, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + SIBLINGS_COUNT, lastPage)
        )
      : [];

  return (
    <HStack spacing={4} mt={4}>
      <Button
        bg={office.secondary_color}
        textColor={office.primary_color}
        _hover={{
          opacity: '90%',
        }}
        _disabled={{
          opacity: '80%',
        }}
        isDisabled={isFirst}
        onClick={() => onPageChange(1)}
      >
        <ChevronLeftIcon />
      </Button>

      {currentPage > 1 + SIBLINGS_COUNT && (
        <>
          <Button
            bg={office.secondary_color}
            textColor={office.primary_color}
            _hover={{
              opacity: '90%',
            }}
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {currentPage > 2 + SIBLINGS_COUNT && (
            <Button
              bg={office.secondary_color}
              textColor="#808080"
              _disabled={{
                bg: 'transparent',
              }}
              _hover={{
                opacity: '100%',
              }}
              cursor="default"
              isDisabled
            >
              ...
            </Button>
          )}
        </>
      )}

      {previousPages.map((page) => (
        <Button
          key={page}
          bg={office.secondary_color}
          textColor={office.primary_color}
          _hover={{
            opacity: '90%',
          }}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        bg={office.primary_color}
        _hover={{
          opacity: '90%',
        }}
        textColor={office.secondary_color}
        variant="solid"
      >
        {currentPage}
      </Button>

      {nextPages.map((page) => (
        <Button
          key={page}
          bg={office.secondary_color}
          _hover={{
            opacity: '90%',
          }}
          textColor={office.primary_color}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {currentPage + SIBLINGS_COUNT < lastPage && (
        <>
          {currentPage + 1 + SIBLINGS_COUNT < lastPage && (
            <Button
              bg={office.secondary_color}
              textColor="#808080"
              _disabled={{
                bg: 'transparent',
              }}
              _hover={{
                opacity: '100%',
              }}
              cursor="default"
              isDisabled
            >
              ...
            </Button>
          )}
          <Button
            bg={office.secondary_color}
            _hover={{
              opacity: '90%',
            }}
            textColor={office.primary_color}
            onClick={() => onPageChange(lastPage)}
          >
            {lastPage}
          </Button>
        </>
      )}

      <Button
        bg={office.secondary_color}
        textColor={office.primary_color}
        _hover={{
          opacity: '90%',
        }}
        _disabled={{
          opacity: '80%',
        }}
        isDisabled={isLast}
        onClick={() => onPageChange(lastPage)}
      >
        <ChevronRightIcon />
      </Button>
    </HStack>
  );
}
