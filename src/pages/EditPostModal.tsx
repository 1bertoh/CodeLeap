import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from '@heroui/button';

interface Post {
  id: number;
  username: string;
  title: string;
  content: string;
  author_ip?: string;
  created_datetime: Date;
}

interface EditPostModalProps {
  isOpen: boolean;
  putPostIsLoading: boolean;
  onOpenChange: (isOpen: boolean) => void;
  post: Post | null;
  onSave: (id: number, title: string, content: string) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onOpenChange,
  post,
  onSave,
  putPostIsLoading
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  useEffect(() => {
    setIsValid(title.trim() !== '' && content.trim() !== '');
  }, [title, content]);

  const handleSubmit = () => {
    if (isValid && post) {
      onSave(post.id, title, content);
      onOpenChange(false);
    }
  };

  return (
    <Modal isOpen={isOpen} className='max-w-[660px]' onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex title flex-col gap-1">Edit item</ModalHeader>
            <ModalBody>
              <div className="mb-4">
                <label className="block mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Hello world"
                  className="w-full  rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-8"
                  style={{ border: '1px rgba(119, 119, 119, 1) solid' }}
                />
              </div>
              
              <div>
                <label className="block  mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Content here"
                  className="w-full rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 h-[74px]"
                  style={{ border: '1px rgba(119, 119, 119, 1) solid' }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="light" 
                color="default" 
                onPress={onClose}
                className='w-[120px] h-8 rounded-lg font-bold cursor-pointer'
                style={{ border: '1px rgba(153, 153, 153, 1) solid' }}
              >
                Cancel
              </Button>
              <Button 
                className='text-white cursor-pointer font-bold w-[120px] h-8 rounded-lg disabled:bg-gray-500 disabled:cursor-default'
                style={{backgroundColor: "rgba(71, 185, 96, 1)"}}
                isDisabled={!isValid || putPostIsLoading}
                isLoading={putPostIsLoading}
                onPress={handleSubmit}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditPostModal;