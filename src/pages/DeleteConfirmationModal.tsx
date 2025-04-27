import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/modal';
import React from 'react';


interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirmDelete: () => void;
  itemName?: string;
  itemTitle?: string;
}

export default function DeleteConfirmationModal({ 
  isOpen, 
  onOpenChange, 
  onConfirmDelete, 
  itemName,
  itemTitle
}: DeleteConfirmationModalProps): React.ReactElement {
  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "rounded-lg",
        body: "bg-white p-0 rounded-lg shadow-lg max-w-md"
      }}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: "easeOut" }
          },
          exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2, ease: "easeIn" }
          }
        }
      }}
    >
      <ModalContent>
        {(onClose: () => void) => (
          <>
            <ModalBody className="p-6">
              <p className="text-lg font-medium">
                Are you sure you want to delete "{itemTitle}" by "{itemName}"?
              </p>
            </ModalBody>
            <ModalFooter className="flex justify-end space-x-2 p-4">
              <Button 
                color="default" 
                variant="bordered" 
                onPress={onClose} 
                className="px-6 bg-white w-[120px] rounded-lg h-8 font-bold cursor-pointer"
                style={{ border: '1px rgba(153, 153, 153, 1) solid' }}
              >
                Cancel
              </Button>
              <Button 
                color="danger" 
                onPress={() => {
                  onConfirmDelete();
                  onClose();
                }}
                className="px-6 text-white w-[120px] h-8 rounded-lg cursor-pointer disabled:bg-gray-500 disabled:cursor-default"
                style={{backgroundColor: "rgba(255, 81, 81, 1)"}}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}