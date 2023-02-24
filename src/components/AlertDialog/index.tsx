import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useDialog } from "../../contexts/DialogContext";

type AlertProps = {
  subtitle?: string;
  title?: string;
  type?: "error" | "success";
  loading?: boolean;
  buttonTitle?: string;
  onSubmit: () => void;
};

export default function Dialog({
  title,
  onSubmit,
  subtitle,
  buttonTitle,
  loading = false,
  type = "success",
}: AlertProps) {
  const { isOpen, onClose } = useDialog();
  const cancelRef = useRef() as React.MutableRefObject<HTMLDialogElement>;
  const onContinue = () => {
    onSubmit();
    onClose();
  };

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      {/* <AlertDialogOverlay > */}
      <AlertDialogContent mx="12px">
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          {title}
        </AlertDialogHeader>

        <AlertDialogBody>{subtitle}</AlertDialogBody>

        <AlertDialogFooter>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            colorScheme={type === "error" ? "red" : "teal"}
            isLoading={loading}
            onClick={onContinue}
            ml={3}
          >
            {buttonTitle || "Continuar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
      {/* </AlertDialogOverlay> */}
    </AlertDialog>
  );
}
